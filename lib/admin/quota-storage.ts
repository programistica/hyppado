/**
 * Local storage helpers for quota policy and usage.
 * Used to persist admin-configured limits in the browser.
 */

import type { QuotaPolicy, QuotaUsage } from "@/lib/types/admin";

const QUOTA_POLICY_KEY = "hyppado_quota_policy";
const QUOTA_USAGE_KEY = "hyppado_quota_usage";

/** Default quota policy */
export const DEFAULT_QUOTA_POLICY: QuotaPolicy = {
  transcriptsPerMonth: 40,
  scriptsPerMonth: 70,
  insightTokensPerMonth: 50_000,
  scriptTokensPerMonth: 20_000,
  insightMaxOutputTokens: 800,
  scriptMaxOutputTokens: 1500,
};

/**
 * Get quota policy from localStorage.
 * Returns null if not set.
 */
export function getQuotaPolicy(): QuotaPolicy | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(QUOTA_POLICY_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as QuotaPolicy;
  } catch {
    return null;
  }
}

/**
 * Save quota policy to localStorage.
 */
export function setQuotaPolicy(policy: QuotaPolicy): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(QUOTA_POLICY_KEY, JSON.stringify(policy));
  }
}

/**
 * Get quota usage from localStorage.
 * Returns null if not set.
 */
export function getQuotaUsage(): QuotaUsage | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(QUOTA_USAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as QuotaUsage;
  } catch {
    return null;
  }
}

/**
 * Save quota usage to localStorage.
 */
export function setQuotaUsage(usage: QuotaUsage): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(QUOTA_USAGE_KEY, JSON.stringify(usage));
  }
}

/**
 * Get effective quota policy (localStorage override or default).
 */
export function getEffectiveQuotaPolicy(): QuotaPolicy {
  return getQuotaPolicy() ?? DEFAULT_QUOTA_POLICY;
}

/**
 * Clear all quota data from localStorage.
 */
export function clearQuotaStorage(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(QUOTA_POLICY_KEY);
    localStorage.removeItem(QUOTA_USAGE_KEY);
  }
}
