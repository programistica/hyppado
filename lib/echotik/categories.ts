/**
 * EchoTik Categories Service
 *
 * Serviço para buscar categorias do TikTok Shop.
 * Tenta buscar via API EchoTik primeiro, fallback para mock se não disponível.
 *
 * TODO: Quando o endpoint real do EchoTik estiver disponível, substituir
 * mockCategories pela chamada real da API.
 */

import type { ShopCategory, CategoriesResponse } from "@/lib/types/echotik";

/**
 * Mock de categorias do TikTok Shop
 *
 * Estrutura hierárquica com categorias comuns encontradas nos dados de produtos.
 * Quando o endpoint real do EchoTik estiver disponível, substituir esta lista.
 */
export const mockCategories: ShopCategory[] = [
  // ===== BELEZA E CUIDADOS PESSOAIS =====
  {
    id: "beleza",
    name: "Beleza e Cuidados Pessoais",
    parentId: null,
    path: "Beleza e Cuidados Pessoais",
    level: 0,
    slug: "beleza",
  },
  {
    id: "beleza-maquiagem",
    name: "Maquiagem",
    parentId: "beleza",
    path: "Beleza > Maquiagem",
    level: 1,
    slug: "beleza-maquiagem",
  },
  {
    id: "beleza-maquiagem-base",
    name: "Base e Corretivo",
    parentId: "beleza-maquiagem",
    path: "Beleza > Maquiagem > Base",
    level: 2,
    slug: "beleza-maquiagem-base",
  },
  {
    id: "beleza-maquiagem-olhos",
    name: "Olhos",
    parentId: "beleza-maquiagem",
    path: "Beleza > Maquiagem > Olhos",
    level: 2,
    slug: "beleza-maquiagem-olhos",
  },
  {
    id: "beleza-maquiagem-labios",
    name: "Lábios",
    parentId: "beleza-maquiagem",
    path: "Beleza > Maquiagem > Lábios",
    level: 2,
    slug: "beleza-maquiagem-labios",
  },
  {
    id: "beleza-skincare",
    name: "Skincare",
    parentId: "beleza",
    path: "Beleza > Skincare",
    level: 1,
    slug: "beleza-skincare",
  },
  {
    id: "beleza-cabelo",
    name: "Cabelo",
    parentId: "beleza",
    path: "Beleza > Cabelo",
    level: 1,
    slug: "beleza-cabelo",
  },
  {
    id: "beleza-cabelo-secador",
    name: "Secadores e Modeladores",
    parentId: "beleza-cabelo",
    path: "Beleza > Cabelo > Secadores",
    level: 2,
    slug: "beleza-cabelo-secador",
  },
  {
    id: "beleza-cabelo-escova",
    name: "Escovas e Pentes",
    parentId: "beleza-cabelo",
    path: "Beleza > Cabelo > Escovas",
    level: 2,
    slug: "beleza-cabelo-escova",
  },
  {
    id: "beleza-perfumes",
    name: "Perfumes",
    parentId: "beleza",
    path: "Beleza > Perfumes",
    level: 1,
    slug: "beleza-perfumes",
  },

  // ===== MODA FEMININA =====
  {
    id: "moda-feminina",
    name: "Roupas Femininas",
    parentId: null,
    path: "Roupas Femininas",
    level: 0,
    slug: "moda-feminina",
  },
  {
    id: "moda-feminina-vestidos",
    name: "Vestidos",
    parentId: "moda-feminina",
    path: "Roupas Femininas > Vestidos",
    level: 1,
    slug: "moda-feminina-vestidos",
  },
  {
    id: "moda-feminina-blusas",
    name: "Blusas e Camisetas",
    parentId: "moda-feminina",
    path: "Roupas Femininas > Blusas",
    level: 1,
    slug: "moda-feminina-blusas",
  },
  {
    id: "moda-feminina-calcas",
    name: "Calças e Shorts",
    parentId: "moda-feminina",
    path: "Roupas Femininas > Calças",
    level: 1,
    slug: "moda-feminina-calcas",
  },
  {
    id: "moda-feminina-lingerie",
    name: "Lingerie",
    parentId: "moda-feminina",
    path: "Roupas Femininas > Lingerie",
    level: 1,
    slug: "moda-feminina-lingerie",
  },

  // ===== MODA MASCULINA =====
  {
    id: "moda-masculina",
    name: "Roupas Masculinas",
    parentId: null,
    path: "Roupas Masculinas",
    level: 0,
    slug: "moda-masculina",
  },
  {
    id: "moda-masculina-camisetas",
    name: "Camisetas",
    parentId: "moda-masculina",
    path: "Roupas Masculinas > Camisetas",
    level: 1,
    slug: "moda-masculina-camisetas",
  },
  {
    id: "moda-masculina-calcas",
    name: "Calças",
    parentId: "moda-masculina",
    path: "Roupas Masculinas > Calças",
    level: 1,
    slug: "moda-masculina-calcas",
  },

  // ===== CASA E DECORAÇÃO =====
  {
    id: "casa",
    name: "Casa e Decoração",
    parentId: null,
    path: "Casa e Decoração",
    level: 0,
    slug: "casa",
  },
  {
    id: "casa-iluminacao",
    name: "Iluminação",
    parentId: "casa",
    path: "Casa > Iluminação",
    level: 1,
    slug: "casa-iluminacao",
  },
  {
    id: "casa-organizacao",
    name: "Organização",
    parentId: "casa",
    path: "Casa > Organização",
    level: 1,
    slug: "casa-organizacao",
  },
  {
    id: "casa-cozinha",
    name: "Cozinha",
    parentId: "casa",
    path: "Casa > Cozinha",
    level: 1,
    slug: "casa-cozinha",
  },
  {
    id: "casa-banheiro",
    name: "Banheiro",
    parentId: "casa",
    path: "Casa > Banheiro",
    level: 1,
    slug: "casa-banheiro",
  },

  // ===== ELETRÔNICOS =====
  {
    id: "eletronicos",
    name: "Eletrônicos",
    parentId: null,
    path: "Eletrônicos",
    level: 0,
    slug: "eletronicos",
  },
  {
    id: "eletronicos-fones",
    name: "Fones de Ouvido",
    parentId: "eletronicos",
    path: "Eletrônicos > Fones",
    level: 1,
    slug: "eletronicos-fones",
  },
  {
    id: "eletronicos-acessorios",
    name: "Acessórios para Celular",
    parentId: "eletronicos",
    path: "Eletrônicos > Acessórios Celular",
    level: 1,
    slug: "eletronicos-acessorios",
  },
  {
    id: "eletronicos-smartwatch",
    name: "Smartwatches",
    parentId: "eletronicos",
    path: "Eletrônicos > Smartwatches",
    level: 1,
    slug: "eletronicos-smartwatch",
  },

  // ===== FERRAMENTAS E CONSTRUÇÃO =====
  {
    id: "ferramentas",
    name: "Ferramentas e Construção",
    parentId: null,
    path: "Ferramentas e Construção",
    level: 0,
    slug: "ferramentas",
  },
  {
    id: "ferramentas-manual",
    name: "Ferramentas Manuais",
    parentId: "ferramentas",
    path: "Ferramentas > Manuais",
    level: 1,
    slug: "ferramentas-manual",
  },
  {
    id: "ferramentas-eletricas",
    name: "Ferramentas Elétricas",
    parentId: "ferramentas",
    path: "Ferramentas > Elétricas",
    level: 1,
    slug: "ferramentas-eletricas",
  },

  // ===== FITNESS E ESPORTES =====
  {
    id: "fitness",
    name: "Fitness e Esportes",
    parentId: null,
    path: "Fitness e Esportes",
    level: 0,
    slug: "fitness",
  },
  {
    id: "fitness-equipamentos",
    name: "Equipamentos",
    parentId: "fitness",
    path: "Fitness > Equipamentos",
    level: 1,
    slug: "fitness-equipamentos",
  },
  {
    id: "fitness-roupas",
    name: "Roupas Esportivas",
    parentId: "fitness",
    path: "Fitness > Roupas",
    level: 1,
    slug: "fitness-roupas",
  },
  {
    id: "fitness-acessorios",
    name: "Acessórios",
    parentId: "fitness",
    path: "Fitness > Acessórios",
    level: 1,
    slug: "fitness-acessorios",
  },

  // ===== BEBÊ E CRIANÇA =====
  {
    id: "bebe",
    name: "Bebê e Criança",
    parentId: null,
    path: "Bebê e Criança",
    level: 0,
    slug: "bebe",
  },
  {
    id: "bebe-roupas",
    name: "Roupas Infantis",
    parentId: "bebe",
    path: "Bebê > Roupas",
    level: 1,
    slug: "bebe-roupas",
  },
  {
    id: "bebe-brinquedos",
    name: "Brinquedos",
    parentId: "bebe",
    path: "Bebê > Brinquedos",
    level: 1,
    slug: "bebe-brinquedos",
  },

  // ===== PET =====
  {
    id: "pet",
    name: "Pet Shop",
    parentId: null,
    path: "Pet Shop",
    level: 0,
    slug: "pet",
  },
  {
    id: "pet-acessorios",
    name: "Acessórios Pet",
    parentId: "pet",
    path: "Pet > Acessórios",
    level: 1,
    slug: "pet-acessorios",
  },
  {
    id: "pet-brinquedos",
    name: "Brinquedos Pet",
    parentId: "pet",
    path: "Pet > Brinquedos",
    level: 1,
    slug: "pet-brinquedos",
  },

  // ===== ACESSÓRIOS =====
  {
    id: "acessorios",
    name: "Acessórios",
    parentId: null,
    path: "Acessórios",
    level: 0,
    slug: "acessorios",
  },
  {
    id: "acessorios-bolsas",
    name: "Bolsas",
    parentId: "acessorios",
    path: "Acessórios > Bolsas",
    level: 1,
    slug: "acessorios-bolsas",
  },
  {
    id: "acessorios-joias",
    name: "Joias e Bijuterias",
    parentId: "acessorios",
    path: "Acessórios > Joias",
    level: 1,
    slug: "acessorios-joias",
  },
  {
    id: "acessorios-relogios",
    name: "Relógios",
    parentId: "acessorios",
    path: "Acessórios > Relógios",
    level: 1,
    slug: "acessorios-relogios",
  },
];

/**
 * Busca categorias via API interna (que consulta EchoTik ou retorna mock)
 */
export async function getCategories(): Promise<ShopCategory[]> {
  try {
    const res = await fetch("/api/echotik/categories", {
      next: { revalidate: 3600 }, // Cache por 1 hora
    });

    if (!res.ok) {
      console.warn("Failed to fetch categories from API, using mock");
      return mockCategories;
    }

    const data: CategoriesResponse = await res.json();
    return data.categories;
  } catch (error) {
    console.warn("Error fetching categories, using mock:", error);
    return mockCategories;
  }
}

/**
 * Busca uma categoria por slug
 */
export function getCategoryBySlug(slug: string): ShopCategory | undefined {
  return mockCategories.find((c) => c.slug === slug);
}

/**
 * Busca categorias raiz (level 0)
 */
export function getRootCategories(): ShopCategory[] {
  return mockCategories.filter((c) => c.level === 0);
}

/**
 * Busca subcategorias de uma categoria pai
 */
export function getSubcategories(parentId: string): ShopCategory[] {
  return mockCategories.filter((c) => c.parentId === parentId);
}

/**
 * Converte nome de categoria para slug
 */
export function categoryToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]+/g, "-") // Substitui caracteres especiais por -
    .replace(/^-|-$/g, ""); // Remove - do início/fim
}

/**
 * Encontra categoria por nome (match parcial case-insensitive)
 */
export function findCategoryByName(name: string): ShopCategory | undefined {
  const normalized = name.toLowerCase().trim();
  return mockCategories.find(
    (c) =>
      c.name.toLowerCase() === normalized ||
      (c.path && c.path.toLowerCase().includes(normalized)),
  );
}
