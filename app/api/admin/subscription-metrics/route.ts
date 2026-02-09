import { NextResponse } from "next/server";
import type { SubscriptionMetrics } from "@/lib/types/admin";

/**
 * GET /api/admin/subscription-metrics
 * Returns subscription metrics. If NEXT_PUBLIC_ADMIN_MOCKS is true, returns mock data.
 */
export async function GET() {
  const isMockMode = process.env.NEXT_PUBLIC_ADMIN_MOCKS === "true";

  if (!isMockMode) {
    // No mock mode - return empty metrics
    const emptyMetrics: SubscriptionMetrics = {
      activeMonthlySubscribers: null,
      canceledSubscribers: null,
      periodLabel: null,
      lastSyncAt: null,
    };
    return NextResponse.json(emptyMetrics);
  }

  // Mock metrics data
  const mockMetrics: SubscriptionMetrics = {
    activeMonthlySubscribers: 9,
    canceledSubscribers: 3,
    periodLabel: "Fevereiro 2026",
    lastSyncAt: new Date().toISOString(),
  };

  return NextResponse.json(mockMetrics);
}
