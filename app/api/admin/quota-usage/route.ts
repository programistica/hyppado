import { NextResponse } from "next/server";
import type { QuotaUsage } from "@/lib/types/admin";

/**
 * GET /api/admin/quota-usage
 * Returns current quota usage. If NEXT_PUBLIC_ADMIN_MOCKS is true, returns mock data.
 */
export async function GET() {
  const isMockMode = process.env.NEXT_PUBLIC_ADMIN_MOCKS === "true";

  if (!isMockMode) {
    // No mock mode - return empty usage
    const emptyUsage: QuotaUsage = {
      transcriptsUsed: null,
      scriptsUsed: null,
      insightTokensUsed: null,
      scriptTokensUsed: null,
      periodStart: null,
      periodEnd: null,
      lastUpdatedAt: null,
    };
    return NextResponse.json(emptyUsage);
  }

  // Mock usage data - realistic numbers
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const mockUsage: QuotaUsage = {
    transcriptsUsed: 12,
    scriptsUsed: 27,
    insightTokensUsed: 8500,
    scriptTokensUsed: 4200,
    periodStart: startOfMonth.toISOString(),
    periodEnd: endOfMonth.toISOString(),
    lastUpdatedAt: now.toISOString(),
  };

  return NextResponse.json(mockUsage);
}
