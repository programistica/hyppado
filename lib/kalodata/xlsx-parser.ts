/**
 * XLSX Parser for Kalodata exports
 *
 * Reads Excel files from /app/data/kalodata/ and normalizes to DTOs.
 * Returns empty arrays when XLSX files are missing — no mock data.
 */

import * as XLSX from "xlsx";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type {
  VideoDTO,
  ProductDTO,
  CreatorDTO,
  DateRangeParams,
} from "@/lib/types/kalodata";

// ============================================
// Configuration
// ============================================
const DATA_DIR = path.join(process.cwd(), "app", "data", "kalodata");

// Primary filenames (with date suffix) and fallbacks (without date suffix)
const FILES = {
  videos: ["top-10-videos-09-10.xlsx", "top-10-videos.xlsx"],
  products: ["top-10-produtos-09-10.xlsx", "top-10-produtos.xlsx"],
  newProducts: ["top-5-novos-produtos-09-10.xlsx", "top-5-novos-produtos.xlsx"],
  creators: ["top-5-criadores-09-10.xlsx", "top-5-criadores.xlsx"],
};

// Simple in-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: {
  videos?: CacheEntry<VideoDTO[]>;
  products?: CacheEntry<ProductDTO[]>;
  newProducts?: CacheEntry<ProductDTO[]>;
  creators?: CacheEntry<CreatorDTO[]>;
} = {};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ============================================
// Helpers
// ============================================
function parseNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    // Remove R$, spaces, and handle BR number format
    const cleaned = value
      .replace(/R\$\s*/g, "")
      .replace(/\./g, "") // Remove thousand separators
      .replace(",", ".") // Convert decimal separator
      .trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

function parsePercentage(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace("%", "").replace(",", ".").trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num / 100;
  }
  return 0;
}

function parseDate(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "number") {
    // Excel date serial number
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return new Date(date.y, date.m - 1, date.d).toISOString();
    }
  }
  if (typeof value === "string") {
    try {
      return new Date(value).toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  return new Date().toISOString();
}

function sanitizeString(value: unknown, fallback = "—"): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return fallback;
}

function generateId(prefix: string, index: number, name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .slice(0, 20);
  return `${prefix}-${index}-${slug}`;
}

function isCacheValid<T>(entry?: CacheEntry<T>): entry is CacheEntry<T> {
  return !!entry && Date.now() - entry.timestamp < CACHE_TTL_MS;
}

// ============================================
// XLSX Reader
// ============================================
async function readXlsxFile(
  filenames: string[],
): Promise<XLSX.WorkSheet | null> {
  // Try each filename in order until one exists
  for (const filename of filenames) {
    const filePath = path.join(DATA_DIR, filename);

    if (!existsSync(filePath)) {
      console.log(`[XLSX] File not found: ${filePath}`);
      continue;
    }

    try {
      const buffer = await readFile(filePath);
      const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
      const sheetName = workbook.SheetNames[0];
      console.log(`[XLSX] Successfully loaded: ${filename}`);
      return workbook.Sheets[sheetName] || null;
    } catch (error) {
      console.error(`[XLSX] Error reading ${filename}:`, error);
      continue;
    }
  }

  console.log(`[XLSX] No valid file found in: ${filenames.join(", ")}`);
  return null;
}

function sheetToRows(sheet: XLSX.WorkSheet): Record<string, unknown>[] {
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

// ============================================
// Video Parser
// ============================================
function parseVideoRow(row: Record<string, unknown>, index: number): VideoDTO {
  const title = sanitizeString(
    row["Descrição do vídeo"] || row["title"] || row["Title"],
  );
  const creatorHandle = sanitizeString(
    row["Usuário do criador"] || row["creatorHandle"] || row["Creator"],
    "@unknown",
  );

  return {
    id: generateId("vid", index, title),
    title,
    duration: sanitizeString(row["Duração"] || row["duration"], "0:00"),
    creatorHandle: creatorHandle.startsWith("@")
      ? creatorHandle
      : `@${creatorHandle}`,
    publishedAt: parseDate(row["Data de publicação"] || row["publishedAt"]),
    revenueBRL: parseNumber(
      row["Receita (R$)"] || row["revenue"] || row["revenueBRL"],
    ),
    sales: parseNumber(row["Vendas"] || row["sales"]),
    views: parseNumber(row["Visualizações"] || row["views"]),
    gpmBRL: parseNumber(row["GPM (R$)"] || row["gpm"] || row["gpmBRL"]),
    cpaBRL: parseNumber(row["CPA (R$)"] || row["cpa"] || row["cpaBRL"]),
    adRatio: parsePercentage(
      row["Ratio de visualizaciones de Ads"] || row["adRatio"],
    ),
    adCostBRL: parseNumber(
      row["Custo de publicidade (R$)"] || row["adCost"] || row["adCostBRL"],
    ),
    roas: parseNumber(row["ROAS"] || row["roas"]),
    kalodataUrl: sanitizeString(
      row["Link de Kalodata"] || row["kalodataUrl"],
      "",
    ),
    tiktokUrl: sanitizeString(row["Link do TikTok"] || row["tiktokUrl"], ""),
    // thumbnailUrl: set by API route via oEmbed; parser always returns null
    thumbnailUrl: null,
    dateRange: "Últimos 7 dias",
  };
}

// ============================================
// Product Parser
// ============================================
function parseProductRow(
  row: Record<string, unknown>,
  index: number,
  isNew = false,
): ProductDTO {
  const name = sanitizeString(
    row["Nome do produto"] || row["name"] || row["Name"],
  );

  return {
    id: generateId("prod", index, name),
    name,
    // imageUrl: only use if exists in XLSX, otherwise empty (shows placeholder in UI)
    imageUrl:
      row["Link da imagem"] || row["imageUrl"]
        ? sanitizeString(row["Link da imagem"] || row["imageUrl"], "")
        : "",
    category: sanitizeString(row["Categoria"] || row["category"], "—"),
    priceBRL: parseNumber(row["Preço (R$)"] || row["price"] || row["priceBRL"]),
    launchDate: parseDate(row["Data de lançamento"] || row["launchDate"]),
    isNew,
    rating: parseNumber(row["Classificações do produto"] || row["rating"]),
    sales: parseNumber(row["Vendas"] || row["sales"]),
    avgPriceBRL: parseNumber(
      row["Preço médio por unidade (R$)"] ||
        row["avgPrice"] ||
        row["avgPriceBRL"],
    ),
    commissionRate: parsePercentage(
      row["Taxa de comissão"] || row["commissionRate"],
    ),
    revenueBRL: parseNumber(
      row["Receita(R$)"] || row["revenue"] || row["revenueBRL"],
    ),
    liveRevenueBRL: parseNumber(
      row["Receitas ao vivo (R$)"] ||
        row["liveRevenue"] ||
        row["liveRevenueBRL"],
    ),
    videoRevenueBRL: parseNumber(
      row["Receita de vídeo (R$)"] ||
        row["videoRevenue"] ||
        row["videoRevenueBRL"],
    ),
    mallRevenueBRL: parseNumber(
      row["Receita de shopping centers (R$)"] ||
        row["mallRevenue"] ||
        row["mallRevenueBRL"],
    ),
    creatorCount: parseNumber(
      row["Número de criadores"] || row["creatorCount"],
    ),
    creatorConversionRate: parsePercentage(
      row["Taxa de conversão de criadores"] || row["creatorConversionRate"],
    ),
    kalodataUrl: sanitizeString(
      row["Link de Kalodata"] || row["kalodataUrl"],
      "",
    ),
    tiktokUrl: sanitizeString(row["Link do TikTok"] || row["tiktokUrl"], ""),
    dateRange: "Últimos 7 dias",
  };
}

// ============================================
// Creator Parser
// ============================================
function parseCreatorRow(
  row: Record<string, unknown>,
  index: number,
): CreatorDTO {
  const name = sanitizeString(
    row["Nome do criador"] || row["name"] || row["Name"],
  );
  const handle = sanitizeString(
    row["Usuário do criador"] || row["handle"] || row["Handle"],
    "@unknown",
  );

  return {
    id: generateId("creator", index, handle),
    name,
    handle: handle.startsWith("@") ? handle : `@${handle}`,
    followers: parseNumber(row["Seguidores"] || row["followers"]),
    revenueBRL: parseNumber(
      row["Receita (R$)"] || row["revenue"] || row["revenueBRL"],
    ),
    productCount: parseNumber(
      row["Quantidade de produtos"] || row["productCount"],
    ),
    liveCount: parseNumber(
      row["Número de transmissões ao vivo"] || row["liveCount"],
    ),
    liveGmvBRL: parseNumber(
      row["GMV ao vivo (R$)"] || row["liveGmv"] || row["liveGmvBRL"],
    ),
    videoCount: parseNumber(row["Número de vídeos"] || row["videoCount"]),
    videoGmvBRL: parseNumber(
      row["GMV por vídeo (R$)"] || row["videoGmv"] || row["videoGmvBRL"],
    ),
    views: parseNumber(row["Visualizações"] || row["views"]),
    debutDate: parseDate(row["Data de estreia do criador"] || row["debutDate"]),
    kalodataUrl: sanitizeString(
      row["Link de Kalodata"] || row["kalodataUrl"],
      "",
    ),
    tiktokUrl: sanitizeString(row["Link do TikTok"] || row["tiktokUrl"], ""),
    dateRange: "Últimos 7 dias",
  };
}

// ============================================
// Public API
// ============================================

export async function parseTopVideos7d(): Promise<VideoDTO[]> {
  if (isCacheValid(cache.videos)) {
    return cache.videos.data;
  }

  const sheet = await readXlsxFile(FILES.videos);

  if (!sheet) {
    console.warn("[XLSX] No videos XLSX available — returning empty list");
    return [];
  }

  const rows = sheetToRows(sheet);
  const videos = rows.slice(0, 10).map((row, i) => parseVideoRow(row, i));
  console.log(`[XLSX] Loaded ${videos.length} videos`);

  cache.videos = { data: videos, timestamp: Date.now() };
  return videos;
}

export async function parseTopProducts7d(): Promise<ProductDTO[]> {
  if (isCacheValid(cache.products)) {
    return cache.products.data;
  }

  const sheet = await readXlsxFile(FILES.products);

  if (!sheet) {
    console.warn("[XLSX] No products XLSX available — returning empty list");
    return [];
  }

  const rows = sheetToRows(sheet);
  const products = rows.slice(0, 10).map((row, i) => parseProductRow(row, i));
  console.log(`[XLSX] Loaded ${products.length} products`);

  cache.products = { data: products, timestamp: Date.now() };
  return products;
}

export async function parseTopNewProducts7d(): Promise<ProductDTO[]> {
  if (isCacheValid(cache.newProducts)) {
    return cache.newProducts.data;
  }

  const sheet = await readXlsxFile(FILES.newProducts);

  if (!sheet) {
    console.warn(
      "[XLSX] No new products XLSX available — returning empty list",
    );
    return [];
  }

  const rows = sheetToRows(sheet);
  const products = rows
    .slice(0, 5)
    .map((row, i) => parseProductRow(row, i, true));
  console.log(`[XLSX] Loaded ${products.length} new products`);

  cache.newProducts = { data: products, timestamp: Date.now() };
  return products;
}

export async function parseTopCreators7d(): Promise<CreatorDTO[]> {
  if (isCacheValid(cache.creators)) {
    return cache.creators.data;
  }

  const sheet = await readXlsxFile(FILES.creators);

  if (!sheet) {
    console.warn("[XLSX] No creators XLSX available — returning empty list");
    return [];
  }

  const rows = sheetToRows(sheet);
  const creators = rows.slice(0, 5).map((row, i) => parseCreatorRow(row, i));
  console.log(`[XLSX] Loaded ${creators.length} creators`);

  cache.creators = { data: creators, timestamp: Date.now() };
  return creators;
}

// Clear cache (useful for testing)
export function clearCache(): void {
  cache.videos = undefined;
  cache.products = undefined;
  cache.newProducts = undefined;
  cache.creators = undefined;
}
