/**
 * Plan configurations for Hyppado billing.
 * FRONT-END ONLY - these are default UI configurations.
 * Actual plan data should come from Hotmart API when connected.
 */

import type { Plan } from "@/lib/types/admin";

/**
 * Default plans for UI display.
 * NOTE: These are placeholder configurations for UI scaffolding only.
 * Real billing plans are managed in Hotmart and synced via webhooks.
 */
export const DEFAULT_PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "R$ 97/mês",
    billingCycle: "monthly",
    quotas: {
      insightTokensMonthlyMax: 50_000,
      scriptTokensMonthlyMax: 20_000,
      insightMaxOutputTokens: 700,
      scriptMaxOutputTokens: 1200,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 197/mês",
    billingCycle: "monthly",
    quotas: {
      insightTokensMonthlyMax: 200_000,
      scriptTokensMonthlyMax: 80_000,
      insightMaxOutputTokens: 900,
      scriptMaxOutputTokens: 1600,
    },
  },
  {
    id: "agency",
    name: "Agency",
    price: "R$ 497/mês",
    billingCycle: "monthly",
    quotas: {
      insightTokensMonthlyMax: 1_000_000,
      scriptTokensMonthlyMax: 400_000,
      insightMaxOutputTokens: 1200,
      scriptMaxOutputTokens: 2200,
    },
  },
];

/**
 * Get a plan by ID.
 * Falls back to Starter if not found.
 */
export function getPlanById(planId: string | undefined): Plan {
  return DEFAULT_PLANS.find((p) => p.id === planId) ?? DEFAULT_PLANS[0];
}

/**
 * Format token count for display.
 * e.g., 50000 -> "50k", 1000000 -> "1M"
 */
export function formatTokenCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(count % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(count % 1_000 === 0 ? 0 : 1)}k`;
  }
  return count.toString();
}
