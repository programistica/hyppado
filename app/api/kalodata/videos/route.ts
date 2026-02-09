import { NextRequest, NextResponse } from "next/server";
import { parseTopVideos7d } from "@/lib/kalodata/xlsx-parser";
import type { TimeRange } from "@/lib/types/kalodata";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") as TimeRange) || "7d";
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || undefined;

    // Parse from XLSX or fallback to mock
    let videos = await parseTopVideos7d();

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      videos = videos.filter(
        (v) =>
          v.title.toLowerCase().includes(searchLower) ||
          v.creatorHandle.toLowerCase().includes(searchLower),
      );
    }

    // Sort by revenue and limit results
    const sortedVideos = [...videos].sort(
      (a, b) => b.revenueBRL - a.revenueBRL,
    );
    const limitedVideos = sortedVideos.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        items: limitedVideos,
        total: videos.length,
        range,
      },
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    // Return empty array with success to avoid breaking layout
    return NextResponse.json({
      success: true,
      data: {
        items: [],
        total: 0,
        range: "7d",
        error: "Failed to load videos",
      },
    });
  }
}
