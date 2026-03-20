/**
 * lib/hotmart/webhook.ts
 * Parse e extração de campos do payload Hotmart.
 * Geração determinística de idempotencyKey.
 * Placeholder para validação de assinatura.
 */

import { createHash } from "crypto";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface HotmartWebhookFields {
  eventType: string;
  eventExternalId?: string;
  transactionId?: string;
  subscriptionExternalId?: string;
  subscriberCode?: string;
  buyerEmail?: string;
  productId?: string;
  planCode?: string;
  offerCode?: string;
  occurredAt?: Date;
}

// ---------------------------------------------------------------------------
// Validação de assinatura (placeholder)
// ---------------------------------------------------------------------------

/**
 * TODO: Implementar validação de assinatura Hotmart quando disponível.
 * A Hotmart envia um header "X-Hotmart-Hottok" com um token configurável.
 * Adicione HOTMART_WEBHOOK_SECRET no .env e valide aqui.
 *
 * Exemplo futuro:
 *   const secret = process.env.HOTMART_WEBHOOK_SECRET;
 *   const signature = headers.get("x-hotmart-hottok");
 *   if (signature !== secret) throw new Error("Assinatura inválida");
 */
export function verifySignature(_headers: Headers, _rawBody: Buffer): void {
  // PLACEHOLDER — não lança erro por enquanto (aceita todos os webhooks)
  // Quando implementar, lançar um Error se a assinatura for inválida:
  // throw new Error("[Hotmart Webhook] Assinatura inválida");
}

// ---------------------------------------------------------------------------
// Extração de campos — resiliente a variações de payload
// ---------------------------------------------------------------------------

/**
 * Extrai campos padronizados de um payload Hotmart arbitrário.
 * A Hotmart pode variar a estrutura entre versões e tipos de evento.
 * Salvamos sempre o payload bruto; os campos extraídos facilitam queries.
 */
export function extractWebhookFields(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>,
): HotmartWebhookFields {
  // --- event type ---
  // Hotmart envia em: event, data.event, hottok (não é o tipo), type
  const eventType: string =
    payload?.event ??
    payload?.data?.event ??
    payload?.type ??
    payload?.name ??
    "UNKNOWN";

  // --- event external id (ex: id único do evento se existir) ---
  const eventExternalId: string | undefined =
    payload?.id ?? payload?.event_id ?? payload?.data?.id ?? undefined;

  // --- transaction id ---
  // Hotmart: payload.data.purchase.transaction ou payload.purchase.transaction
  const transactionId: string | undefined =
    payload?.data?.purchase?.transaction ??
    payload?.purchase?.transaction ??
    payload?.transaction ??
    undefined;

  // --- subscription external id (id numérico da assinatura na Hotmart) ---
  const subscriptionExternalId: string | undefined =
    payload?.data?.subscription?.id ??
    payload?.subscription?.id ??
    payload?.subscriber?.code ??
    undefined;

  // --- subscriber_code (código único do assinante na Hotmart) ---
  const subscriberCode: string | undefined =
    payload?.data?.subscriber?.code ??
    payload?.subscriber?.code ??
    payload?.subscriber_code ??
    undefined;

  // --- buyer email ---
  const buyerEmail: string | undefined =
    payload?.data?.buyer?.email ??
    payload?.buyer?.email ??
    payload?.data?.purchase?.buyer?.email ??
    payload?.purchase?.buyer?.email ??
    undefined;

  // --- product id ---
  const productId: string | undefined =
    payload?.data?.product?.id?.toString() ??
    payload?.product?.id?.toString() ??
    payload?.data?.purchase?.product?.id?.toString() ??
    undefined;

  // --- plan / offer code ---
  // Hotmart usa plan_name ou offer_code dependendo da versão do webhook
  const planCode: string | undefined =
    payload?.data?.subscription?.plan?.name ??
    payload?.subscription?.plan?.name ??
    payload?.data?.plan?.name ??
    payload?.plan?.name ??
    payload?.plan_name ??
    undefined;

  const offerCode: string | undefined =
    payload?.data?.purchase?.offer?.code ??
    payload?.purchase?.offer?.code ??
    payload?.offer?.code ??
    payload?.offer_code ??
    undefined;

  // --- occurred at ---
  // Hotmart: creation_date (epoch ms) ou event_date ou occurred_at
  let occurredAt: Date | undefined;
  const rawDate =
    payload?.data?.creation_date ??
    payload?.creation_date ??
    payload?.event_date ??
    payload?.data?.event_date ??
    payload?.occurred_at;
  if (rawDate !== undefined) {
    // Se for epoch em milissegundos (número grande) ou string ISO
    const parsed =
      typeof rawDate === "number"
        ? new Date(rawDate)
        : new Date(rawDate as string);
    occurredAt = isNaN(parsed.getTime()) ? undefined : parsed;
  }

  return {
    eventType,
    eventExternalId,
    transactionId,
    subscriptionExternalId,
    subscriberCode,
    buyerEmail,
    productId,
    planCode,
    offerCode,
    occurredAt,
  };
}

// ---------------------------------------------------------------------------
// Idempotency key
// ---------------------------------------------------------------------------

/**
 * Gera uma chave determinística SHA-256 para garantir que o mesmo evento
 * não seja processado duas vezes, mesmo que o webhook chegue duplicado.
 *
 * Composição: eventType + (subscriptionExternalId|transactionId) + occurredAt + canonical payload
 */
export function buildIdempotencyKey(
  fields: HotmartWebhookFields,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>,
): string {
  const anchor =
    fields.subscriptionExternalId ??
    fields.transactionId ??
    fields.subscriberCode ??
    fields.eventExternalId ??
    "no-id";

  const canonical = [
    fields.eventType,
    anchor,
    fields.occurredAt?.toISOString() ?? "no-date",
    JSON.stringify(payload),
  ].join("|");

  return createHash("sha256").update(canonical).digest("hex");
}
