import { NextRequest, NextResponse } from "next/server";
import {
  parseTopProducts7d,
  parseTopNewProducts7d,
} from "@/lib/kalodata/xlsx-parser";
import type { TimeRange } from "@/lib/types/kalodata";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") as TimeRange) || "7d";
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const category = searchParams.get("category") || undefined;
    const filter = searchParams.get("filter") || undefined; // 'new' for new products
    const search = searchParams.get("search") || undefined;

    // Parse from XLSX (returns empty array if file missing)
    let products =
      filter === "new"
        ? await parseTopNewProducts7d()
        : await parseTopProducts7d();

    // Apply category filter if provided
    if (category) {
      products = products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      );
    }

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower),
      );
    }

    // Sort by sales and limit results
    const sortedProducts = [...products].sort((a, b) => b.sales - a.sales);
    const limitedProducts = sortedProducts.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        items: limitedProducts,
        total: products.length,
        range,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty array with success to avoid breaking layout
    return NextResponse.json({
      success: true,
      data: {
        items: [],
        total: 0,
        range: "7d",
        error: "Failed to load products",
      },
    });
  }
}
