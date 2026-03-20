/**
 * lib/hotmart/processor.ts
 * Processa um evento Hotmart já salvo (raw) e atualiza o estado interno:
 *   - resolve/cria HotmartIdentity (usuário interno)
 *   - resolve/determina Plan interno (PRO_MENSAL / PREMIUM_ANUAL)
 *   - cria/atualiza Subscription + HotmartSubscription
 *   - cria SubscriptionCharge se houver transação/pagamento
 *   - registra AuditLog
 */

import prisma from "../prisma";
import type { HotmartWebhookFields } from "./webhook";

// ---------------------------------------------------------------------------
// Mapeamento de tipos de evento Hotmart → ação interna
// Adicione/edite aqui quando conhecer os event types exatos do seu produto.
// Ref: https://developers.hotmart.com/docs/en/v2/webhooks/
// ---------------------------------------------------------------------------
const ACTIVATION_EVENTS = new Set([
  "PURCHASE_APPROVED",
  "PURCHASE_COMPLETE",
  "SUBSCRIPTION_ACTIVATION",
  "RECURRENCE_REBILLING_SUCCESS",
]);

const CANCELLATION_EVENTS = new Set([
  "PURCHASE_CANCELLED",
  "SUBSCRIPTION_CANCELLATION",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_REFUNDED",
]);

const EXPIRATION_EVENTS = new Set([
  "SUBSCRIPTION_INACTIVATED",
  "RECURRENCE_REBILLING_FAILED",
]);

// ---------------------------------------------------------------------------
// Resolve plano interno a partir dos campos Hotmart
// ---------------------------------------------------------------------------

// MAPEAMENTO: edite aqui para ligar seus product/plan codes da Hotmart
// aos planos internos (PRO_MENSAL / PREMIUM_ANUAL).
// Exemplo:
//   productId "123456" + planCode "MENSAL" → PRO_MENSAL
//   productId "123456" + planCode "ANUAL"  → PREMIUM_ANUAL
async function resolvePlan(fields: HotmartWebhookFields) {
  // Estratégia 1: busca por hotmartProductId + hotmartPlanCode (mais preciso)
  if (fields.productId) {
    const byProduct = await prisma.plan.findFirst({
      where: {
        hotmartProductId: fields.productId,
        ...(fields.planCode ? { hotmartPlanCode: fields.planCode } : {}),
        ...(fields.offerCode ? { hotmartOfferCode: fields.offerCode } : {}),
        isActive: true,
      },
    });
    if (byProduct) return byProduct;
  }

  // Estratégia 2: fallback pelo offerCode isolado
  if (fields.offerCode) {
    const byOffer = await prisma.plan.findFirst({
      where: { hotmartOfferCode: fields.offerCode, isActive: true },
    });
    if (byOffer) return byOffer;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Resolve/cria identidade Hotmart → User interno
// ---------------------------------------------------------------------------

async function resolveOrCreateIdentity(fields: HotmartWebhookFields) {
  const { buyerEmail, subscriberCode } = fields;
  if (!buyerEmail && !subscriberCode) return null;

  // Busca identidade existente por email ou subscriberCode
  const orConditions: { buyerEmail?: string; subscriberCode?: string }[] = [];
  if (buyerEmail) orConditions.push({ buyerEmail });
  if (subscriberCode) orConditions.push({ subscriberCode });

  const existing = await prisma.hotmartIdentity.findFirst({
    where: { OR: orConditions },
    include: { user: true },
  });
  if (existing) return existing;

  // Cria User + Identity se o email ainda não existe
  if (!buyerEmail) return null;

  const user = await prisma.user.upsert({
    where: { email: buyerEmail },
    update: {},
    create: {
      email: buyerEmail,
      name: buyerEmail.split("@")[0], // nome provisório
      role: "USER",
      status: "ACTIVE",
    },
  });

  const identity = await prisma.hotmartIdentity.create({
    data: {
      userId: user.id,
      buyerEmail,
      subscriberCode,
    },
    include: { user: true },
  });

  return identity;
}

// ---------------------------------------------------------------------------
// Processador principal
// ---------------------------------------------------------------------------

export async function processHotmartEvent(
  webhookEventId: string,
  fields: HotmartWebhookFields,
): Promise<void> {
  try {
    // 1. Resolve identidade do comprador
    const identity = await resolveOrCreateIdentity(fields);

    // 2. Resolve plano interno
    const plan = await resolvePlan(fields);

    const isActivation = ACTIVATION_EVENTS.has(fields.eventType);
    const isCancellation = CANCELLATION_EVENTS.has(fields.eventType);
    const isExpiration = EXPIRATION_EVENTS.has(fields.eventType);

    // 3. Upsert Subscription (se temos usuário e plano)
    if (identity && plan) {
      const subscriptionStatus = isActivation
        ? "ACTIVE"
        : isCancellation
          ? "CANCELLED"
          : isExpiration
            ? "EXPIRED"
            : "PENDING";

      // Busca assinatura existente pela HotmartSubscription
      const hotmartSub = fields.subscriptionExternalId
        ? await prisma.hotmartSubscription.findUnique({
            where: { hotmartSubscriptionId: fields.subscriptionExternalId },
            include: { subscription: true },
          })
        : null;

      let subscriptionId: string;

      if (hotmartSub) {
        // Atualiza assinatura existente
        subscriptionId = hotmartSub.subscriptionId;
        await prisma.subscription.update({
          where: { id: subscriptionId },
          data: {
            status: subscriptionStatus,
            ...(isActivation && {
              startedAt: fields.occurredAt ?? new Date(),
              renewedAt: new Date(),
            }),
            ...(isCancellation && {
              cancelledAt: fields.occurredAt ?? new Date(),
            }),
            ...(isExpiration && { endedAt: fields.occurredAt ?? new Date() }),
          },
        });

        // Atualiza HotmartSubscription
        await prisma.hotmartSubscription.update({
          where: { id: hotmartSub.id },
          data: {
            externalStatus: fields.eventType,
            subscriberCode: fields.subscriberCode ?? hotmartSub.subscriberCode,
          },
        });
      } else {
        // Cria nova Subscription + HotmartSubscription
        const newSub = await prisma.subscription.create({
          data: {
            userId: identity.userId,
            planId: plan.id,
            status: subscriptionStatus,
            startedAt: isActivation
              ? (fields.occurredAt ?? new Date())
              : undefined,
          },
        });
        subscriptionId = newSub.id;

        await prisma.hotmartSubscription.create({
          data: {
            subscriptionId: newSub.id,
            hotmartSubscriptionId:
              fields.subscriptionExternalId ?? `hotmart_${Date.now()}`,
            hotmartProductId: fields.productId,
            hotmartPlanCode: fields.planCode,
            hotmartOfferCode: fields.offerCode,
            buyerEmail: fields.buyerEmail,
            subscriberCode: fields.subscriberCode,
            externalStatus: fields.eventType,
          },
        });
      }

      // 4. Cria SubscriptionCharge se houver transação de pagamento
      if (isActivation && fields.transactionId) {
        await prisma.subscriptionCharge.upsert({
          where: { transactionId: fields.transactionId },
          update: { status: "PAID", paidAt: fields.occurredAt ?? new Date() },
          create: {
            subscriptionId,
            transactionId: fields.transactionId,
            status: "PAID",
            paidAt: fields.occurredAt ?? new Date(),
          },
        });
      }

      // 5. Audit log
      await prisma.auditLog.create({
        data: {
          userId: identity.userId,
          actorId: "system",
          action: `WEBHOOK_${fields.eventType}`,
          entityType: "Subscription",
          entityId: subscriptionId,
          after: {
            status: subscriptionStatus,
            eventType: fields.eventType,
            transactionId: fields.transactionId,
          },
        },
      });
    }

    // 6. Marca o webhook event como PROCESSED
    await prisma.hotmartWebhookEvent.update({
      where: { id: webhookEventId },
      data: {
        processingStatus: "PROCESSED",
        processedAt: new Date(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Hotmart Processor] Erro ao processar evento:", message);

    // Marca como FAILED com mensagem de erro
    await prisma.hotmartWebhookEvent
      .update({
        where: { id: webhookEventId },
        data: {
          processingStatus: "FAILED",
          processedAt: new Date(),
          errorMessage: message.slice(0, 1000), // trunca para caber no campo
        },
      })
      .catch(() => {
        // Ignora erro secundário no update de status
      });

    throw err; // repropaga para o route handler retornar 500
  }
}
