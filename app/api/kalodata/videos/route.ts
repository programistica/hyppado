import { NextRequest, NextResponse } from "next/server";
import { parseTopVideos7d } from "@/lib/kalodata/xlsx-parser";
import type { TimeRange, VideoDTO, ProductDTO } from "@/lib/types/kalodata";
import {
  isShortTikTokUrl,
  resolveShortTikTokUrl,
  normalizeTikTokUrlToCanonical,
  fetchTikTokOEmbed,
  withConcurrency,
} from "@/lib/kalodata/tiktok";

// Force dynamic rendering so oEmbed fetches run server-side
export const dynamic = "force-dynamic";

/**
 * Mock product data to simulate EchoTik product association
 * In production, this would come from:
 * 1) /echotik/video/rank/list (video_products)
 * 2) /echotik/product/batch/detail (product details)
 * 3) /echotik/cover/batch/download (product images)
 */
const MOCK_PRODUCTS: ProductDTO[] = [
  {
    id: "prod-001",
    name: "Secador de Cabelo Profissional",
    imageUrl: "https://picsum.photos/seed/prod001/200/200",
    category: "Beleza",
    priceBRL: 189.9,
    launchDate: "2024-01-15",
    isNew: false,
    rating: 4.7,
    sales: 1250,
    avgPriceBRL: 189.9,
    commissionRate: 0.15,
    revenueBRL: 237375,
    liveRevenueBRL: 50000,
    videoRevenueBRL: 187375,
    mallRevenueBRL: 0,
    creatorCount: 45,
    creatorConversionRate: 0.082,
    kalodataUrl: "",
    tiktokUrl: "",
    dateRange: "7d",
  },
  {
    id: "prod-002",
    name: "Kit Maquiagem Completo",
    imageUrl: "https://picsum.photos/seed/prod002/200/200",
    category: "Beleza",
    priceBRL: 129.9,
    launchDate: "2024-02-01",
    isNew: true,
    rating: 4.8,
    sales: 890,
    avgPriceBRL: 129.9,
    commissionRate: 0.18,
    revenueBRL: 115611,
    liveRevenueBRL: 30000,
    videoRevenueBRL: 85611,
    mallRevenueBRL: 0,
    creatorCount: 32,
    creatorConversionRate: 0.095,
    kalodataUrl: "",
    tiktokUrl: "",
    dateRange: "7d",
  },
  {
    id: "prod-003",
    name: "Fone Bluetooth Premium",
    imageUrl: "https://picsum.photos/seed/prod003/200/200",
    category: "Eletrônicos",
    priceBRL: 249.9,
    launchDate: "2023-11-20",
    isNew: false,
    rating: 4.6,
    sales: 2100,
    avgPriceBRL: 249.9,
    commissionRate: 0.12,
    revenueBRL: 524790,
    liveRevenueBRL: 100000,
    videoRevenueBRL: 424790,
    mallRevenueBRL: 0,
    creatorCount: 68,
    creatorConversionRate: 0.075,
    kalodataUrl: "",
    tiktokUrl: "",
    dateRange: "7d",
  },
];

/**
 * Associates mock products with videos (simulates EchoTik integration)
 * In production: use video_products from EchoTik API
 */
function enrichWithProducts(videos: VideoDTO[]): VideoDTO[] {
  return videos.map((video, idx) => {
    // Simulate: ~60% of videos have associated products
    const hasProduct = idx % 5 !== 0; // Skip every 5th video
    if (!hasProduct) return video;

    // Rotate through mock products
    const productIdx = idx % MOCK_PRODUCTS.length;
    const product = MOCK_PRODUCTS[productIdx];

    return {
      ...video,
      product,
    };
  });
}

/**
 * Enriches a parsed VideoDTO with:
 * 1) Canonical TikTok URL (resolves short links)
 * 2) Real thumbnail from TikTok oEmbed
 */
async function enrichVideo(video: VideoDTO): Promise<VideoDTO> {
  const rawUrl = video.tiktokUrl;
  const creatorUsername = video.creatorHandle; // e.g. "@ba.heck"

  // Step 1: Resolve redirects for shortened links
  let resolvedUrl: string | null = null;
  if (rawUrl && isShortTikTokUrl(rawUrl)) {
    resolvedUrl = await resolveShortTikTokUrl(rawUrl, 8000);
  }

  // Step 2: Build canonical URL
  const canonical = normalizeTikTokUrlToCanonical({
    rawUrl,
    creatorUsername,
    resolvedUrl,
  });

  // Step 3: Fetch oEmbed thumbnail (with retry)
  const oEmbedUrl = canonical ?? resolvedUrl ?? rawUrl;
  let thumbnailUrl: string | null = null;

  if (oEmbedUrl) {
    // First attempt with 20s timeout
    let oembed = await fetchTikTokOEmbed(oEmbedUrl, 20000);

    // Retry once if failed (with 2s delay)
    if (!oembed?.thumbnail_url) {
      await new Promise((r) => setTimeout(r, 2000));
      oembed = await fetchTikTokOEmbed(oEmbedUrl, 20000);
    }

    thumbnailUrl = oembed?.thumbnail_url ?? null;
  }

  return {
    ...video,
    tiktokUrl: canonical ?? rawUrl,
    thumbnailUrl,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") as TimeRange) || "7d";
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || undefined;

    // Parse from XLSX
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

    // Enrich with canonical URLs + thumbnails (sequential to avoid TikTok rate limiting)
    const enrichedVideos = await withConcurrency(limitedVideos, 1, enrichVideo);

    // Enrich with mock product data (simulate EchoTik product association)
    const videosWithProducts = enrichWithProducts(enrichedVideos);

    return NextResponse.json({
      success: true,
      data: {
        items: videosWithProducts,
        total: videos.length,
        range,
      },
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
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
