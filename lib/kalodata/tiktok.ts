/**
 * TikTok utility functions for extracting video IDs and building embed URLs.
 */

/**
 * Extracts the video ID from a TikTok URL.
 *
 * Supports common URL formats:
 * - https://www.tiktok.com/@username/video/1234567890
 * - https://tiktok.com/@username/video/1234567890
 * - https://vm.tiktok.com/abcd1234/ (short links - ID not extractable)
 * - https://www.tiktok.com/t/abcd1234/ (short links - ID not extractable)
 *
 * @param tiktokUrl - The TikTok video URL from the XLSX
 * @returns The video ID as a string, or null if not extractable
 */
export function extractTikTokVideoId(
  tiktokUrl: string | undefined,
): string | null {
  if (!tiktokUrl || typeof tiktokUrl !== "string") {
    return null;
  }

  const trimmed = tiktokUrl.trim();
  if (!trimmed) {
    return null;
  }

  // Pattern 1: Standard video URL - /video/{VIDEO_ID}
  // Example: https://www.tiktok.com/@alesilva0520/video/7601153212032355602
  const videoPattern = /\/video\/(\d+)/;
  const videoMatch = trimmed.match(videoPattern);
  if (videoMatch && videoMatch[1]) {
    return videoMatch[1];
  }

  // Pattern 2: Short video URL - /v/{VIDEO_ID}
  // Example: https://www.tiktok.com/@user/v/1234567890
  const shortPattern = /\/v\/(\d+)/;
  const shortMatch = trimmed.match(shortPattern);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // Cannot extract ID from short links like vm.tiktok.com or /t/ URLs
  // These require a server-side redirect follow which we don't do
  return null;
}

/**
 * Builds the TikTok embed URL for a given video ID.
 *
 * @param videoId - The TikTok video ID
 * @returns The embed URL for use in an iframe
 */
export function buildTikTokEmbedUrl(videoId: string): string {
  return `https://www.tiktok.com/embed/v2/${videoId}`;
}

/**
 * Checks if a TikTok URL is valid (not empty/placeholder).
 *
 * @param tiktokUrl - The URL to validate
 * @returns true if the URL appears to be a real TikTok URL
 */
export function isValidTikTokUrl(tiktokUrl: string | undefined): boolean {
  if (!tiktokUrl || typeof tiktokUrl !== "string") {
    return false;
  }

  const trimmed = tiktokUrl.trim().toLowerCase();
  if (!trimmed) {
    return false;
  }

  // Must contain tiktok.com
  return trimmed.includes("tiktok.com");
}
