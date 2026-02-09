/**
 * Admin API client for Hotmart integration and quota management.
 * 
 * This client calls internal API endpoints (not Hotmart directly).
 * If endpoints don't exist yet, returns empty/not-connected states.
 * NO fake data - all unknown values return null.
 */

import type {
  HotmartConnection,
  Subscriber,
  SubscriptionMetrics,
  QuotaPolicy,
  QuotaUsage,
} from "@/lib/types/admin";

// ==================== DEFAULT VALUES ====================

/** Default quota policy (our internal limits) */
export const DEFAULT_QUOTA_POLICY: QuotaPolicy = {
  transcriptsPerMonth: 40,
  scriptsPerMonth: 70,
  insightTokensPerMonth: 50_000,
  scriptTokensPerMonth: 20_000,
  insightMaxOutputTokens: 800,
  scriptMaxOutputTokens: 1500,
};

/** Empty/not-connected Hotmart connection state */
export const NOT_CONNECTED: HotmartConnection = {
  connected: false,
  status: "not_configured",
  message: "Hotmart backend not configured",
};

// ==================== API FUNCTIONS ====================

/**
 * Check Hotmart connection status.
 * Returns not_configured if endpoint doesn't exist.
 */
export async function getHotmartConnection(): Promise<HotmartConnection> {
  try {
    const res = await fetch("/api/admin/hotmart/connection");
    if (!res.ok) return NOT_CONNECTED;
    return await res.json();
  } catch {
    return NOT_CONNECTED;
  }
}

/**
 * Get subscribers list filtered by status.
 * Returns empty array if not connected or endpoint doesn't exist.
 */
export async function getSubscribers(
  status?: "active" | "canceled"
): Promise<Subscriber[]> {
  try {
    const url = status
      ? `/api/admin/subscribers?status=${status}`
      : "/api/admin/subscribers";
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.subscribers ?? [];
  } catch {
    return [];
  }
}

/**
 * Get subscription metrics (aggregated counts).
 * Returns null values if not connected.
 */
export async function getSubscriptionMetrics(): Promise<SubscriptionMetrics> {
  try {
    const res = await fetch("/api/admin/subscription-metrics");
    if (!res.ok) {
      return {
        activeMonthlySubscribers: null,
        canceledSubscribers: null,
        periodLabel: null,
        lastSyncAt: null,
      };
    }
    return await res.json();
  } catch {
    return {
      activeMonthlySubscribers: null,
      canceledSubscribers: null,
      periodLabel: null,
      lastSyncAt: null,
    };
  }
}

/**
 * Get quota policy (our internal limits).
 * Falls back to defaults if not configured.
 */
export async function getQuotaPolicy(): Promise<QuotaPolicy> {
  try {
    const res = await fetch("/api/admin/quota-policy");
    if (!res.ok) return DEFAULT_QUOTA_POLICY;
    return await res.json();
  } catch {
    return DEFAULT_QUOTA_POLICY;
  }
}

/**
 * Get current quota usage for the period.
 * Returns null values if not connected/tracking.
 */
export async function getQuotaUsage(): Promise<QuotaUsage> {
  try {
    const res = await fetch("/api/admin/quota-usage");
    if (!res.ok) {
      return {
        transcriptsUsed: null,
        scriptsUsed: null,
        insightTokensUsed: null,
        scriptTokensUsed: null,
        periodStart: null,
        periodEnd: null,
        lastUpdatedAt: null,
      };
    }
    return await res.json();
  } catch {
    return {
      transcriptsUsed: null,
      scriptsUsed: null,
      insightTokensUsed: null,
      scriptTokensUsed: null,
      periodStart: null,
      periodEnd: null,
      lastUpdatedAt: null,
    };
  }
}

// ==================== HOTMART COUPON (UI-only) ====================

export interface CouponCreateRequest {
  productId: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  startDate?: string;
  endDate?: string;
  maxUses?: number;
}

/**
 * Create a Hotmart coupon.
 * This will only work when backend is connected.
 * Returns { success: false, message } if not connected.
 */
export async function createHotmartCoupon(
  coupon: CouponCreateRequest
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch("/api/admin/hotmart/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coupon),
    });
    if (!res.ok) {
      return {
        success: false,
        message: "Backend not connected or request failed",
      };
    }
    return await res.json();
  } catch {
    return { success: false, message: "Backend not available" };
  }
}

// ==================== LOCAL STORAGE HELPERS ====================

const QUOTA_POLICY_KEY = "hyppado_quota_policy";
const SUPPORT_CONFIG_KEY = "hyppado_support_config";

export interface SupportConfig {
  email?: string;
}

/** Save quota policy to localStorage */
export function saveQuotaPolicyLocally(policy: QuotaPolicy): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(QUOTA_POLICY_KEY, JSON.stringify(policy));
  }
}

/** Load quota policy from localStorage */
export function loadQuotaPolicyLocally(): QuotaPolicy | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(QUOTA_POLICY_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as QuotaPolicy;
  } catch {
    return null;
  }
}

/** Save support config locally */
export function saveSupportConfigLocally(config: SupportConfig): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SUPPORT_CONFIG_KEY, JSON.stringify(config));
  }
}

/** Load support config from localStorage */
export function loadSupportConfigLocally(): SupportConfig {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(SUPPORT_CONFIG_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored) as SupportConfig;
  } catch {
    return {};
  }
}

// ==================== ADMIN MODE CHECK ====================

/**
 * Check if admin mode is enabled.
 * Uses NEXT_PUBLIC_ADMIN_MODE env var.
 */
export function isAdminMode(): boolean {
  return process.env.NEXT_PUBLIC_ADMIN_MODE === "true";
}
