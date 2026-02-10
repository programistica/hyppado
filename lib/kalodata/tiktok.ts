/**
 * TikTok utility functions for URL normalization, video ID extraction,
 * and canonical URL construction.
 */

// ============================================
// Video ID extraction
// ============================================

/**
 * Extracts the numeric video ID from a TikTok URL.
 * Returns null for shortened URLs (vm.tiktok.com / vt.tiktok.com).
 */
export function extractTikTokVideoId(
  tiktokUrl: string | undefined | null,
): string | null {
  if (!tiktokUrl || typeof tiktokUrl !== "string") return null;
  const trimmed = tiktokUrl.trim();
  if (!trimmed) return null;

  // /video/<digits> or /v/<digits>
  const match = trimmed.match(/\/(?:video|v)\/(\d+)/);
  return match?.[1] ?? null;
}

// ============================================
// Short URL detection
// ============================================

/**
 * Returns true when the URL is a shortened TikTok link
 * (vm.tiktok.com or vt.tiktok.com) where the video ID is not
 * present in the URL string itself.
 */
export function isShortTikTokUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.includes("vm.tiktok.com") || host.includes("vt.tiktok.com");
  } catch {
    return false;
  }
}

// ============================================
// Canonical URL builder
// ============================================

/**
 * Builds the canonical TikTok URL:
 *   https://www.tiktok.com/@<username>/video/<videoId>
 *
 * Falls back gracefully when parts are missing.
 */
export function normalizeTikTokUrlToCanonical(params: {
  rawUrl: string | null | undefined;
  creatorUsername: string | null | undefined;
  resolvedUrl?: string | null;
}): string | null {
  const { rawUrl, creatorUsername, resolvedUrl } = params;

  // Best candidate to parse
  const candidate = resolvedUrl ?? rawUrl ?? null;
  if (!candidate) return null;

  const videoId = extractTikTokVideoId(candidate);

  // Clean username: strip leading @ if present
  const cleanUser = creatorUsername
    ? creatorUsername.replace(/^@/, "").trim()
    : null;

  if (videoId && cleanUser) {
    return `https://www.tiktok.com/@${cleanUser}/video/${videoId}`;
  }

  if (videoId) {
    // We have an ID but no username — try to extract from the candidate URL itself
    const userMatch = candidate.match(/tiktok\.com\/@([^/]+)/);
    if (userMatch?.[1]) {
      return `https://www.tiktok.com/@${userMatch[1]}/video/${videoId}`;
    }
    // Return a valid video URL without username
    return `https://www.tiktok.com/video/${videoId}`;
  }

  // No video ID extractable — return original if it looks like a URL
  try {
    new URL(candidate);
    return candidate;
  } catch {
    return null;
  }
}

// ============================================
// oEmbed
// ============================================

/**
 * Fetches TikTok's oEmbed data for a video URL.
 * Returns { thumbnail_url, title } or null on failure.
 * Uses AbortController timeout and Next.js fetch caching.
 */
export async function fetchTikTokOEmbed(
  videoUrl: string,
  timeoutMs = 8000,
): Promise<{ thumbnail_url: string; title?: string } | null> {
  const oEmbedEndpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(oEmbedEndpoint, {
      signal: controller.signal,
      cache: "no-store", // Don't cache failed requests
    } as RequestInit);

    if (!res.ok) return null;

    const data = await res.json();
    if (data && typeof data.thumbnail_url === "string") {
      return {
        thumbnail_url: data.thumbnail_url,
        title: typeof data.title === "string" ? data.title : undefined,
      };
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ============================================
// Redirect resolver for short URLs
// ============================================

/**
 * Follows redirects on a shortened TikTok URL to get the final
 * canonical URL. Returns null on failure or timeout.
 */
export async function resolveShortTikTokUrl(
  shortUrl: string,
  timeoutMs = 8000,
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(shortUrl, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; HyppadoBot/1.0; +https://hyppado.com)",
      },
    });
    // response.url is the final URL after redirects
    const finalUrl = res.url;
    // Validate it looks like a tiktok URL with a video ID
    if (finalUrl && extractTikTokVideoId(finalUrl)) {
      return finalUrl;
    }
    return finalUrl || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ============================================
// Concurrency limiter
// ============================================

/**
 * Simple sequential-with-concurrency executor.
 * Runs async tasks with a max concurrency limit.
 */
export async function withConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i]);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () =>
    worker(),
  );
  await Promise.all(workers);
  return results;
}
