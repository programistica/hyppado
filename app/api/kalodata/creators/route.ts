import { NextRequest, NextResponse } from "next/server";
import { parseTopCreators7d } from "@/lib/kalodata/xlsx-parser";
import type { TimeRange } from "@/lib/types/kalodata";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") as TimeRange) || "7d";
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const search = searchParams.get("search") || undefined;

    // Parse from XLSX (returns empty array if file missing)
    let creators = await parseTopCreators7d();

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      creators = creators.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.handle.toLowerCase().includes(searchLower),
      );
    }

    // Sort by revenue and limit results
    const sortedCreators = [...creators].sort(
      (a, b) => b.revenueBRL - a.revenueBRL,
    );
    const limitedCreators = sortedCreators.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        items: limitedCreators,
        total: creators.length,
        range,
      },
    });
  } catch (error) {
    console.error("Error fetching creators:", error);
    // Return empty array with success to avoid breaking layout
    return NextResponse.json({
      success: true,
      data: {
        items: [],
        total: 0,
        range: "7d",
        error: "Failed to load creators",
      },
    });
  }
}
