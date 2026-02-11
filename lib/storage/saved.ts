/**
 * Client-side storage for saved videos and products
 * Uses localStorage with versioning for schema migrations
 */

import type { VideoDTO, ProductDTO } from "@/lib/types/kalodata";

const STORAGE_VERSION = "v1";
const SAVED_VIDEOS_KEY = `hyppado:savedVideos:${STORAGE_VERSION}`;
const SAVED_PRODUCTS_KEY = `hyppado:savedProducts:${STORAGE_VERSION}`;

// Helper to check if we're in browser
const isBrowser = () => typeof window !== "undefined";

// ============================================
// Videos
// ============================================

export interface SavedVideo {
  video: VideoDTO;
  savedAt: string;
}

export function getSavedVideos(): SavedVideo[] {
  if (!isBrowser()) return [];

  try {
    const raw = localStorage.getItem(SAVED_VIDEOS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading saved videos:", error);
    return [];
  }
}

export function saveVideo(video: VideoDTO): void {
  if (!isBrowser()) return;

  try {
    const current = getSavedVideos();

    // Check if already saved
    if (current.some((item) => item.video.id === video.id)) {
      return;
    }

    const newItem: SavedVideo = {
      video,
      savedAt: new Date().toISOString(),
    };

    const updated = [newItem, ...current];
    localStorage.setItem(SAVED_VIDEOS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving video:", error);
  }
}

export function removeSavedVideo(videoId: string): void {
  if (!isBrowser()) return;

  try {
    const current = getSavedVideos();
    const filtered = current.filter((item) => item.video.id !== videoId);
    localStorage.setItem(SAVED_VIDEOS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing saved video:", error);
  }
}

export function isVideoSaved(videoId: string): boolean {
  if (!isBrowser()) return false;

  const saved = getSavedVideos();
  return saved.some((item) => item.video.id === videoId);
}

export function toggleVideoSaved(video: VideoDTO): boolean {
  if (isVideoSaved(video.id)) {
    removeSavedVideo(video.id);
    return false;
  } else {
    saveVideo(video);
    return true;
  }
}

// ============================================
// Products
// ============================================

export interface SavedProduct {
  product: ProductDTO;
  savedAt: string;
}

export function getSavedProducts(): SavedProduct[] {
  if (!isBrowser()) return [];

  try {
    const raw = localStorage.getItem(SAVED_PRODUCTS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading saved products:", error);
    return [];
  }
}

export function saveProduct(product: ProductDTO): void {
  if (!isBrowser()) return;

  try {
    const current = getSavedProducts();

    // Check if already saved
    if (current.some((item) => item.product.id === product.id)) {
      return;
    }

    const newItem: SavedProduct = {
      product,
      savedAt: new Date().toISOString(),
    };

    const updated = [newItem, ...current];
    localStorage.setItem(SAVED_PRODUCTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving product:", error);
  }
}

export function removeSavedProduct(productId: string): void {
  if (!isBrowser()) return;

  try {
    const current = getSavedProducts();
    const filtered = current.filter((item) => item.product.id !== productId);
    localStorage.setItem(SAVED_PRODUCTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing saved product:", error);
  }
}

export function isProductSaved(productId: string): boolean {
  if (!isBrowser()) return false;

  const saved = getSavedProducts();
  return saved.some((item) => item.product.id === productId);
}

export function toggleProductSaved(product: ProductDTO): boolean {
  if (isProductSaved(product.id)) {
    removeSavedProduct(product.id);
    return false;
  } else {
    saveProduct(product);
    return true;
  }
}

// ============================================
// Utils
// ============================================

export function getSavedVideosCount(): number {
  return getSavedVideos().length;
}

export function getSavedProductsCount(): number {
  return getSavedProducts().length;
}

export function clearAllSaved(): void {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(SAVED_VIDEOS_KEY);
    localStorage.removeItem(SAVED_PRODUCTS_KEY);
  } catch (error) {
    console.error("Error clearing saved items:", error);
  }
}
