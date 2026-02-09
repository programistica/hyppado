/**
 * XLSX Parser for Kalodata exports
 *
 * Reads Excel files from /app/data/kalodata/exports/ and normalizes to DTOs.
 * Falls back to mock data if files don't exist or fail to parse.
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
      `https://kalodata.com/video/${index}`,
    ),
    tiktokUrl: sanitizeString(
      row["Link do TikTok"] || row["tiktokUrl"],
      `https://tiktok.com/@creator/video/${index}`,
    ),
    // thumbnailUrl: only use if exists in XLSX, otherwise undefined (shows skeleton)
    thumbnailUrl:
      row["thumbnailUrl"] || row["Thumbnail"]
        ? sanitizeString(row["thumbnailUrl"] || row["Thumbnail"], "")
        : undefined,
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
    category: sanitizeString(row["Categoria"] || row["category"], "Geral"),
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
      `https://kalodata.com/product/${index}`,
    ),
    tiktokUrl: sanitizeString(
      row["Link do TikTok"] || row["tiktokUrl"],
      `https://tiktok.com/shop/product/${index}`,
    ),
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
      `https://kalodata.com/creator/${index}`,
    ),
    tiktokUrl: sanitizeString(
      row["Link do TikTok"] || row["tiktokUrl"],
      `https://tiktok.com/${handle}`,
    ),
    dateRange: "Últimos 7 dias",
  };
}

// ============================================
// Mock Data Generators (fallback)
// ============================================
function generateMockVideos(): VideoDTO[] {
  const creators = [
    "@mariabela",
    "@joaotech",
    "@anafit",
    "@pedrosaude",
    "@carlavlog",
    "@lucasmorning",
    "@techreview",
    "@juliareal",
    "@fernandodicas",
    "@paulounbox",
  ];
  const titles = [
    "Como usar o produto X em 5 passos",
    "Review HONESTA do produto Y",
    "Testei por 30 dias e olha no que deu",
    "ANTES E DEPOIS impressionante",
    "O que ninguém te conta sobre Z",
    "Rotina matinal com os melhores",
    "Comparativo: produto A vs B",
    "Minha experiência real",
    "Dicas que mudaram minha vida",
    "Unboxing surpresa chegou!",
  ];

  return titles.map((title, i) => ({
    id: generateId("vid", i, title),
    title,
    duration: `${Math.floor(Math.random() * 3) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    creatorHandle: creators[i % creators.length],
    publishedAt: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    revenueBRL: Math.floor(Math.random() * 500000) + 10000,
    sales: Math.floor(Math.random() * 50000) + 500,
    views: Math.floor(Math.random() * 5000000) + 100000,
    gpmBRL: Math.floor(Math.random() * 50) + 5,
    cpaBRL: Math.floor(Math.random() * 30) + 2,
    adRatio: Math.random() * 0.5 + 0.1,
    adCostBRL: Math.floor(Math.random() * 10000) + 500,
    roas: Math.random() * 10 + 1,
    kalodataUrl: `https://kalodata.com/video/${i}`,
    tiktokUrl: `https://tiktok.com/@creator/video/${1000000 + i}`,
    thumbnailUrl: `https://picsum.photos/seed/${i}/320/180`,
    dateRange: "Últimos 7 dias",
  }));
}

function generateMockProducts(isNew = false): ProductDTO[] {
  const products = [
    { name: "Sérum Vitamina C 30ml", category: "Skincare" },
    { name: "Fone Bluetooth Pro Max", category: "Eletrônicos" },
    { name: "Suplemento Whey Isolado", category: "Fitness" },
    { name: "Luminária LED Inteligente", category: "Casa" },
    { name: "Creme Anti-idade Premium", category: "Skincare" },
    { name: "Smartwatch Fitness Tracker", category: "Eletrônicos" },
    { name: "Kit Organizador Minimalista", category: "Casa" },
    { name: "Proteína Vegana Cacau", category: "Fitness" },
    { name: "Massageador Facial", category: "Beleza" },
    { name: "Cadeira Ergonômica Home", category: "Home Office" },
  ];

  return products.map((p, i) => ({
    id: generateId("prod", i, p.name),
    name: p.name,
    imageUrl: `https://picsum.photos/seed/prod${i}/200/200`,
    category: p.category,
    priceBRL: Math.floor(Math.random() * 300) + 29,
    launchDate: new Date(
      Date.now() - Math.random() * (isNew ? 7 : 90) * 24 * 60 * 60 * 1000,
    ).toISOString(),
    isNew,
    rating: Math.random() * 2 + 3,
    sales: Math.floor(Math.random() * 50000) + 1000,
    avgPriceBRL: Math.floor(Math.random() * 200) + 30,
    commissionRate: Math.random() * 0.3 + 0.05,
    revenueBRL: Math.floor(Math.random() * 1000000) + 50000,
    liveRevenueBRL: Math.floor(Math.random() * 200000),
    videoRevenueBRL: Math.floor(Math.random() * 500000) + 30000,
    mallRevenueBRL: Math.floor(Math.random() * 100000),
    creatorCount: Math.floor(Math.random() * 500) + 10,
    creatorConversionRate: Math.random() * 0.15 + 0.01,
    kalodataUrl: `https://kalodata.com/product/${i}`,
    tiktokUrl: `https://tiktok.com/shop/product/${i}`,
    dateRange: "Últimos 7 dias",
  }));
}

function generateMockCreators(): CreatorDTO[] {
  const creators = [
    { name: "Maria Bela", handle: "@mariabela" },
    { name: "João Tech", handle: "@joaotech" },
    { name: "Ana Fit", handle: "@anafit" },
    { name: "Pedro Saúde", handle: "@pedrosaude" },
    { name: "Carla Vlog", handle: "@carlavlog" },
  ];

  return creators.map((c, i) => ({
    id: generateId("creator", i, c.handle),
    name: c.name,
    handle: c.handle,
    followers: Math.floor(Math.random() * 3000000) + 100000,
    revenueBRL: Math.floor(Math.random() * 500000) + 10000,
    productCount: Math.floor(Math.random() * 50) + 5,
    liveCount: Math.floor(Math.random() * 30) + 1,
    liveGmvBRL: Math.floor(Math.random() * 100000),
    videoCount: Math.floor(Math.random() * 200) + 20,
    videoGmvBRL: Math.floor(Math.random() * 300000) + 5000,
    views: Math.floor(Math.random() * 50000000) + 1000000,
    debutDate: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    kalodataUrl: `https://kalodata.com/creator/${c.handle.slice(1)}`,
    tiktokUrl: `https://tiktok.com/${c.handle}`,
    dateRange: "Últimos 7 dias",
  }));
}

// ============================================
// Public API
// ============================================

export async function parseTopVideos7d(): Promise<VideoDTO[]> {
  if (isCacheValid(cache.videos)) {
    return cache.videos.data;
  }

  const sheet = await readXlsxFile(FILES.videos);
  let videos: VideoDTO[];

  if (sheet) {
    const rows = sheetToRows(sheet);
    videos = rows.slice(0, 10).map((row, i) => parseVideoRow(row, i));
    console.log(`[XLSX] Loaded ${videos.length} videos`);
  } else {
    console.log("[XLSX] Using mock videos");
    videos = generateMockVideos();
  }

  cache.videos = { data: videos, timestamp: Date.now() };
  return videos;
}

export async function parseTopProducts7d(): Promise<ProductDTO[]> {
  if (isCacheValid(cache.products)) {
    return cache.products.data;
  }

  const sheet = await readXlsxFile(FILES.products);
  let products: ProductDTO[];

  if (sheet) {
    const rows = sheetToRows(sheet);
    products = rows.slice(0, 10).map((row, i) => parseProductRow(row, i));
    console.log(`[XLSX] Loaded ${products.length} products`);
  } else {
    console.log("[XLSX] Using mock products");
    products = generateMockProducts();
  }

  cache.products = { data: products, timestamp: Date.now() };
  return products;
}

export async function parseTopNewProducts7d(): Promise<ProductDTO[]> {
  if (isCacheValid(cache.newProducts)) {
    return cache.newProducts.data;
  }

  const sheet = await readXlsxFile(FILES.newProducts);
  let products: ProductDTO[];

  if (sheet) {
    const rows = sheetToRows(sheet);
    products = rows.slice(0, 5).map((row, i) => parseProductRow(row, i, true));
    console.log(`[XLSX] Loaded ${products.length} new products`);
  } else {
    console.log("[XLSX] Using mock new products");
    products = generateMockProducts(true).slice(0, 5);
  }

  cache.newProducts = { data: products, timestamp: Date.now() };
  return products;
}

export async function parseTopCreators7d(): Promise<CreatorDTO[]> {
  if (isCacheValid(cache.creators)) {
    return cache.creators.data;
  }

  const sheet = await readXlsxFile(FILES.creators);
  let creators: CreatorDTO[];

  if (sheet) {
    const rows = sheetToRows(sheet);
    creators = rows.slice(0, 5).map((row, i) => parseCreatorRow(row, i));
    console.log(`[XLSX] Loaded ${creators.length} creators`);
  } else {
    console.log("[XLSX] Using mock creators");
    creators = generateMockCreators();
  }

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
