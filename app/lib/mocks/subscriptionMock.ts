/**
 * Mocks for Subscription Page
 * Used only for demo purposes in /app/assinatura
 */

export type SubscriptionStatus =
  | "Ativa"
  | "Cancelada"
  | "Em atraso"
  | "Em análise";
export type BillingType =
  | "Cobrança"
  | "Renovação"
  | "Cancelamento"
  | "Reembolso";
export type BillingStatus = "Aprovado" | "Pendente" | "Recusado" | "Estornado";

export interface SubscriptionPlan {
  planName: string;
  billingCycle: string;
  status: SubscriptionStatus;
  startedAt: string; // ISO date
  nextRenewalAt: string; // ISO date
  productName: string;
  paymentMethod: string;
}

export interface MemberInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface BillingEvent {
  id: string;
  createdAt: string; // ISO date
  type: BillingType;
  status: BillingStatus;
  reference: string;
  amount: string;
}

export interface HotmartIntegrationState {
  connected: boolean;
  webhookConfigured: boolean;
  lastSyncAt: string; // ISO date
}

// ============================================
// Mock Data
// ============================================

export const mockSubscription: SubscriptionPlan = {
  planName: "Hyppado Pro",
  billingCycle: "Mensal",
  status: "Ativa",
  startedAt: "2026-01-18T10:00:00Z",
  nextRenewalAt: "2026-03-18T10:00:00Z",
  productName: "Hyppado — Dashboard TikTok Shop",
  paymentMethod: "Cartão de crédito",
};

export const mockMember: MemberInfo = {
  name: "Eveline Nogueira",
  email: "eve@exemplo.com",
  // phone is optional - omitted for now
};

export const mockBillingHistory: BillingEvent[] = [
  {
    id: "1",
    createdAt: "2026-02-18T10:00:00Z",
    type: "Renovação",
    status: "Aprovado",
    reference: "HP-202602-8F3A",
    amount: "R$ 49,90",
  },
  {
    id: "2",
    createdAt: "2026-01-18T10:00:00Z",
    type: "Renovação",
    status: "Aprovado",
    reference: "HP-202601-7E2B",
    amount: "R$ 49,90",
  },
  {
    id: "3",
    createdAt: "2025-12-18T10:00:00Z",
    type: "Renovação",
    status: "Aprovado",
    reference: "HP-202512-6D1C",
    amount: "R$ 49,90",
  },
  {
    id: "4",
    createdAt: "2025-11-18T10:00:00Z",
    type: "Renovação",
    status: "Aprovado",
    reference: "HP-202511-5C9D",
    amount: "R$ 49,90",
  },
  {
    id: "5",
    createdAt: "2025-10-18T10:00:00Z",
    type: "Renovação",
    status: "Aprovado",
    reference: "HP-202510-4B8E",
    amount: "R$ 49,90",
  },
  {
    id: "6",
    createdAt: "2025-09-18T10:00:00Z",
    type: "Cobrança",
    status: "Aprovado",
    reference: "HP-202509-3A7F",
    amount: "R$ 49,90",
  },
];

export const mockHotmartIntegration: HotmartIntegrationState = {
  connected: true,
  webhookConfigured: true,
  lastSyncAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
};
