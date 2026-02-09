// Kalodata XLSX parser utilities
// Reads xlsx files from ./data/kalodata/ and normalizes to DTOs

import type {
  VideoDTO,
  ProductDTO,
  CreatorDTO,
  DateRangeParams,
} from "@/lib/types/kalodata";

// ============================================
// Date helpers
// ============================================
function getDateRange(params: DateRangeParams): { start: Date; end: Date } {
  const now = new Date();
  const end = params.end ? new Date(params.end) : now;

  let start: Date;
  if (params.start) {
    start = new Date(params.start);
  } else {
    const days = params.range === "30d" ? 30 : params.range === "90d" ? 90 : 7;
    start = new Date(now);
    start.setDate(start.getDate() - days);
  }

  return { start, end };
}

function isWithinRange(dateStr: string, start: Date, end: Date): boolean {
  if (!dateStr) return true; // Include if no date
  try {
    const date = new Date(dateStr);
    return date >= start && date <= end;
  } catch {
    return true;
  }
}

function parseNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[R$\s,.]/g, (match) =>
      match === "," ? "." : "",
    );
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

function generateId(prefix: string, index: number, title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .slice(0, 20);
  return `${prefix}-${index}-${slug}`;
}

// ============================================
// Mock data generators (fallback when no xlsx)
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
    "Produto viral do TikTok funciona?",
    "Gastei R$500 testando isso",
    "O segredo dos criadores de sucesso",
    "Não compre antes de ver isso",
    "Tutorial completo para iniciantes",
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

function generateMockProducts(): ProductDTO[] {
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
    { name: "Gel Redutor Noturno", category: "Beleza" },
    { name: "Mini Projetor 4K", category: "Eletrônicos" },
    { name: "Colágeno Bebível", category: "Saúde" },
  ];

  return products.map((p, i) => ({
    id: generateId("prod", i, p.name),
    name: p.name,
    imageUrl: `https://picsum.photos/seed/prod${i}/200/200`,
    category: p.category,
    priceBRL: Math.floor(Math.random() * 300) + 29,
    launchDate: new Date(
      Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
    ).toISOString(),
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
    { name: "Maria Bela", handle: "@mariabela", niche: "Beleza" },
    { name: "João Tech", handle: "@joaotech", niche: "Tech" },
    { name: "Ana Fit", handle: "@anafit", niche: "Fitness" },
    { name: "Pedro Saúde", handle: "@pedrosaude", niche: "Saúde" },
    { name: "Carla Vlog", handle: "@carlavlog", niche: "Lifestyle" },
    { name: "Lucas Morning", handle: "@lucasmorning", niche: "Lifestyle" },
    { name: "Tech Review BR", handle: "@techreview", niche: "Tech" },
    { name: "Julia Real", handle: "@juliareal", niche: "Beleza" },
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
// Main parser functions
// ============================================
export async function parseVideos(
  params: DateRangeParams = {},
): Promise<VideoDTO[]> {
  // In production, this would read from xlsx file
  // For now, return mock data
  const { start, end } = getDateRange(params);
  const videos = generateMockVideos();

  return videos
    .filter((v) => isWithinRange(v.publishedAt, start, end))
    .sort((a, b) => b.revenueBRL - a.revenueBRL);
}

export async function parseProducts(
  params: DateRangeParams = {},
): Promise<ProductDTO[]> {
  const { start, end } = getDateRange(params);
  const products = generateMockProducts();

  return products
    .filter((p) => isWithinRange(p.launchDate, start, end))
    .sort((a, b) => b.sales - a.sales);
}

export async function parseCreators(
  params: DateRangeParams = {},
): Promise<CreatorDTO[]> {
  const creators = generateMockCreators();
  return creators.sort((a, b) => b.revenueBRL - a.revenueBRL);
}

export async function getNewProducts(
  params: DateRangeParams = {},
): Promise<ProductDTO[]> {
  const { start, end } = getDateRange(params);
  const products = generateMockProducts();

  // Filter products launched within the date range
  return products
    .filter((p) => {
      const launchDate = new Date(p.launchDate);
      return launchDate >= start && launchDate <= end;
    })
    .sort(
      (a, b) =>
        new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime(),
    )
    .slice(0, 5);
}

// ============================================
// Formatting helpers
// ============================================
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1).replace(".", ",") + "M";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(".", ",") + "K";
  }
  return value.toLocaleString("pt-BR");
}

export function formatPercentage(value: number): string {
  return (value * 100).toFixed(1).replace(".", ",") + "%";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
