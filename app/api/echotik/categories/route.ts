import { NextResponse } from "next/server";
import type { CategoriesResponse } from "@/lib/types/echotik";
import {
  FALLBACK_TIKTOKSHOP_CATEGORIES,
  type Category,
} from "@/lib/categories";

/**
 * API Route: GET /api/echotik/categories
 *
 * Retorna lista de categorias do TikTok Shop.
 * Por enquanto retorna mock, preparado para integração EchoTik.
 *
 * TODO: Quando credenciais EchoTik estiverem disponíveis,
 * implementar fetchEchotikCategories() com chamada real.
 */

// Configuração EchoTik (placeholder para futuro)
const ECHOTIK_BASE_URL = process.env.ECHOTIK_BASE_URL || "";
const ECHOTIK_API_KEY = process.env.ECHOTIK_API_KEY || "";

/**
 * Busca categorias da API EchoTik
 * TODO: Implementar quando endpoint real estiver disponível
 */
async function fetchEchotikCategories(): Promise<Category[] | null> {
  // Se não houver configuração, retornar null para usar fallback
  if (!ECHOTIK_BASE_URL || !ECHOTIK_API_KEY) {
    console.log("[categories] EchoTik não configurado, usando mock");
    return null;
  }

  try {
    const res = await fetch(`${ECHOTIK_BASE_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${ECHOTIK_API_KEY}`,
        "Content-Type": "application/json",
      },
      // Cache por 1 hora
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn("[categories] EchoTik retornou erro:", res.status);
      return null;
    }

    const data = await res.json();

    // TODO: Mapear resposta EchoTik para Category[]
    // A estrutura exata depende da documentação da API
    // Exemplo placeholder:
    // return data.categories.map((c: any) => ({
    //   id: String(c.id),
    //   name: c.name,
    //   parentId: c.parent_id ? String(c.parent_id) : null,
    //   path: c.path || c.name,
    //   level: c.level || 0,
    //   slug: categoryToSlug(c.name),
    // }));

    return data.categories || null;
  } catch (error) {
    console.error("[categories] Erro ao buscar EchoTik:", error);
    return null;
  }
}

/**
 * Retorna categorias mockadas como fallback
 */
function fallbackMockCategories(): Category[] {
  return FALLBACK_TIKTOKSHOP_CATEGORIES;
}

export async function GET() {
  try {
    // Tentar buscar do EchoTik primeiro
    const echotikCategories = await fetchEchotikCategories();

    // Se EchoTik retornou dados, usar eles
    if (echotikCategories && echotikCategories.length > 0) {
      const response: CategoriesResponse = {
        categories: echotikCategories,
        source: "echotik",
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(response);
    }

    // Fallback para mock
    const response: CategoriesResponse = {
      categories: fallbackMockCategories(),
      source: "mock",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[categories] Erro na rota:", error);

    // Em caso de erro, retornar mock
    const response: CategoriesResponse = {
      categories: fallbackMockCategories(),
      source: "mock",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  }
}
