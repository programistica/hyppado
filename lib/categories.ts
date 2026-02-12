/**
 * Centralized Categories Module
 *
 * Módulo centralizado para buscar e gerenciar categorias do TikTok Shop.
 * - Busca via API interna (que consulta EchoTik ou retorna mock)
 * - Cache em memória no client
 * - Fallback para lista hardcoded se API falhar
 * - Utilitário pickCategoryByHash para atribuição determinística
 */

// ====================
// TYPES
// ====================

export type Category = {
  id: string;
  name: string;
  parentId?: string | null;
  level?: number;
  slug?: string;
  path?: string;
};

export const ALL_CATEGORY_ID = "all";

// ====================
// CLIENT-SIDE CACHE
// ====================

let cachedCategories: Category[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora

// ====================
// FALLBACK CATEGORIES (TikTok Shop - Brasil)
// ====================

export const FALLBACK_TIKTOKSHOP_CATEGORIES: Category[] = [
  // TODAS (primeira opção)
  { id: ALL_CATEGORY_ID, name: "Todas as Categorias", level: 0, slug: "all" },

  // ===== BELEZA E CUIDADOS PESSOAIS =====
  {
    id: "beleza",
    name: "Beleza e Cuidados Pessoais",
    level: 0,
    slug: "beleza",
  },
  {
    id: "beleza-skincare",
    name: "Skincare",
    parentId: "beleza",
    level: 1,
    slug: "beleza-skincare",
  },
  {
    id: "beleza-maquiagem",
    name: "Maquiagem",
    parentId: "beleza",
    level: 1,
    slug: "beleza-maquiagem",
  },
  {
    id: "beleza-maquiagem-base",
    name: "Base e Corretivo",
    parentId: "beleza-maquiagem",
    level: 2,
    slug: "beleza-maquiagem-base",
  },
  {
    id: "beleza-maquiagem-olhos",
    name: "Olhos",
    parentId: "beleza-maquiagem",
    level: 2,
    slug: "beleza-maquiagem-olhos",
  },
  {
    id: "beleza-maquiagem-labios",
    name: "Lábios",
    parentId: "beleza-maquiagem",
    level: 2,
    slug: "beleza-maquiagem-labios",
  },
  {
    id: "beleza-cabelo",
    name: "Cabelo",
    parentId: "beleza",
    level: 1,
    slug: "beleza-cabelo",
  },
  {
    id: "beleza-cabelo-secador",
    name: "Secadores e Modeladores",
    parentId: "beleza-cabelo",
    level: 2,
    slug: "beleza-cabelo-secador",
  },
  {
    id: "beleza-cabelo-escova",
    name: "Escovas e Pentes",
    parentId: "beleza-cabelo",
    level: 2,
    slug: "beleza-cabelo-escova",
  },
  {
    id: "beleza-perfumes",
    name: "Perfumes",
    parentId: "beleza",
    level: 1,
    slug: "beleza-perfumes",
  },
  {
    id: "beleza-corpo",
    name: "Corpo e Banho",
    parentId: "beleza",
    level: 1,
    slug: "beleza-corpo",
  },
  {
    id: "beleza-unhas",
    name: "Unhas",
    parentId: "beleza",
    level: 1,
    slug: "beleza-unhas",
  },

  // ===== MODA FEMININA =====
  {
    id: "moda-feminina",
    name: "Roupas Femininas",
    level: 0,
    slug: "moda-feminina",
  },
  {
    id: "moda-feminina-vestidos",
    name: "Vestidos",
    parentId: "moda-feminina",
    level: 1,
    slug: "moda-feminina-vestidos",
  },
  {
    id: "moda-feminina-blusas",
    name: "Blusas e Camisetas",
    parentId: "moda-feminina",
    level: 1,
    slug: "moda-feminina-blusas",
  },
  {
    id: "moda-feminina-calcas",
    name: "Calças e Shorts",
    parentId: "moda-feminina",
    level: 1,
    slug: "moda-feminina-calcas",
  },
  {
    id: "moda-feminina-lingerie",
    name: "Lingerie",
    parentId: "moda-feminina",
    level: 1,
    slug: "moda-feminina-lingerie",
  },
  {
    id: "moda-feminina-conjuntos",
    name: "Conjuntos",
    parentId: "moda-feminina",
    level: 1,
    slug: "moda-feminina-conjuntos",
  },
  {
    id: "moda-feminina-saias",
    name: "Saias",
    parentId: "moda-feminina",
    level: 1,
    slug: "moda-feminina-saias",
  },
  {
    id: "moda-feminina-moletom",
    name: "Moletons e Casacos",
    parentId: "moda-feminina",
    level: 1,
    slug: "moda-feminina-moletom",
  },

  // ===== MODA MASCULINA =====
  {
    id: "moda-masculina",
    name: "Roupas Masculinas",
    level: 0,
    slug: "moda-masculina",
  },
  {
    id: "moda-masculina-camisetas",
    name: "Camisetas",
    parentId: "moda-masculina",
    level: 1,
    slug: "moda-masculina-camisetas",
  },
  {
    id: "moda-masculina-calcas",
    name: "Calças",
    parentId: "moda-masculina",
    level: 1,
    slug: "moda-masculina-calcas",
  },
  {
    id: "moda-masculina-camisas",
    name: "Camisas",
    parentId: "moda-masculina",
    level: 1,
    slug: "moda-masculina-camisas",
  },
  {
    id: "moda-masculina-moletom",
    name: "Moletons e Casacos",
    parentId: "moda-masculina",
    level: 1,
    slug: "moda-masculina-moletom",
  },
  {
    id: "moda-masculina-cuecas",
    name: "Cuecas e Meias",
    parentId: "moda-masculina",
    level: 1,
    slug: "moda-masculina-cuecas",
  },

  // ===== CALÇADOS =====
  { id: "calcados", name: "Calçados", level: 0, slug: "calcados" },
  {
    id: "calcados-tenis",
    name: "Tênis",
    parentId: "calcados",
    level: 1,
    slug: "calcados-tenis",
  },
  {
    id: "calcados-sandalia",
    name: "Sandálias",
    parentId: "calcados",
    level: 1,
    slug: "calcados-sandalia",
  },
  {
    id: "calcados-chinelo",
    name: "Chinelos",
    parentId: "calcados",
    level: 1,
    slug: "calcados-chinelo",
  },
  {
    id: "calcados-sapato",
    name: "Sapatos",
    parentId: "calcados",
    level: 1,
    slug: "calcados-sapato",
  },
  {
    id: "calcados-bota",
    name: "Botas",
    parentId: "calcados",
    level: 1,
    slug: "calcados-bota",
  },

  // ===== BOLSAS E BAGAGENS =====
  { id: "bolsas", name: "Bolsas e Bagagens", level: 0, slug: "bolsas" },
  {
    id: "bolsas-femininas",
    name: "Bolsas Femininas",
    parentId: "bolsas",
    level: 1,
    slug: "bolsas-femininas",
  },
  {
    id: "bolsas-mochilas",
    name: "Mochilas",
    parentId: "bolsas",
    level: 1,
    slug: "bolsas-mochilas",
  },
  {
    id: "bolsas-carteiras",
    name: "Carteiras",
    parentId: "bolsas",
    level: 1,
    slug: "bolsas-carteiras",
  },
  {
    id: "bolsas-malas",
    name: "Malas de Viagem",
    parentId: "bolsas",
    level: 1,
    slug: "bolsas-malas",
  },

  // ===== ACESSÓRIOS DE MODA =====
  {
    id: "acessorios-moda",
    name: "Acessórios de Moda",
    level: 0,
    slug: "acessorios-moda",
  },
  {
    id: "acessorios-moda-oculos",
    name: "Óculos",
    parentId: "acessorios-moda",
    level: 1,
    slug: "acessorios-moda-oculos",
  },
  {
    id: "acessorios-moda-relogios",
    name: "Relógios",
    parentId: "acessorios-moda",
    level: 1,
    slug: "acessorios-moda-relogios",
  },
  {
    id: "acessorios-moda-cintos",
    name: "Cintos",
    parentId: "acessorios-moda",
    level: 1,
    slug: "acessorios-moda-cintos",
  },
  {
    id: "acessorios-moda-bones",
    name: "Bonés e Chapéus",
    parentId: "acessorios-moda",
    level: 1,
    slug: "acessorios-moda-bones",
  },
  {
    id: "acessorios-moda-lencos",
    name: "Lenços e Cachecóis",
    parentId: "acessorios-moda",
    level: 1,
    slug: "acessorios-moda-lencos",
  },

  // ===== JOIAS E BIJUTERIAS =====
  { id: "joias", name: "Joias e Bijuterias", level: 0, slug: "joias" },
  {
    id: "joias-brincos",
    name: "Brincos",
    parentId: "joias",
    level: 1,
    slug: "joias-brincos",
  },
  {
    id: "joias-colares",
    name: "Colares",
    parentId: "joias",
    level: 1,
    slug: "joias-colares",
  },
  {
    id: "joias-pulseiras",
    name: "Pulseiras",
    parentId: "joias",
    level: 1,
    slug: "joias-pulseiras",
  },
  {
    id: "joias-aneis",
    name: "Anéis",
    parentId: "joias",
    level: 1,
    slug: "joias-aneis",
  },
  {
    id: "joias-piercings",
    name: "Piercings",
    parentId: "joias",
    level: 1,
    slug: "joias-piercings",
  },

  // ===== CASA E DECORAÇÃO =====
  { id: "casa", name: "Casa e Decoração", level: 0, slug: "casa" },
  {
    id: "casa-cozinha",
    name: "Cozinha",
    parentId: "casa",
    level: 1,
    slug: "casa-cozinha",
  },
  {
    id: "casa-banheiro",
    name: "Banheiro",
    parentId: "casa",
    level: 1,
    slug: "casa-banheiro",
  },
  {
    id: "casa-quarto",
    name: "Quarto",
    parentId: "casa",
    level: 1,
    slug: "casa-quarto",
  },
  {
    id: "casa-iluminacao",
    name: "Iluminação",
    parentId: "casa",
    level: 1,
    slug: "casa-iluminacao",
  },
  {
    id: "casa-organizacao",
    name: "Organização",
    parentId: "casa",
    level: 1,
    slug: "casa-organizacao",
  },
  {
    id: "casa-decoracao",
    name: "Decoração",
    parentId: "casa",
    level: 1,
    slug: "casa-decoracao",
  },
  {
    id: "casa-jardim",
    name: "Jardim e Varanda",
    parentId: "casa",
    level: 1,
    slug: "casa-jardim",
  },

  // ===== ORGANIZAÇÃO E LIMPEZA =====
  { id: "limpeza", name: "Limpeza e Organização", level: 0, slug: "limpeza" },
  {
    id: "limpeza-utensilios",
    name: "Utensílios de Limpeza",
    parentId: "limpeza",
    level: 1,
    slug: "limpeza-utensilios",
  },
  {
    id: "limpeza-organizadores",
    name: "Organizadores",
    parentId: "limpeza",
    level: 1,
    slug: "limpeza-organizadores",
  },
  {
    id: "limpeza-lavanderia",
    name: "Lavanderia",
    parentId: "limpeza",
    level: 1,
    slug: "limpeza-lavanderia",
  },

  // ===== ELETRODOMÉSTICOS =====
  {
    id: "eletrodomesticos",
    name: "Eletrodomésticos",
    level: 0,
    slug: "eletrodomesticos",
  },
  {
    id: "eletrodomesticos-pequenos",
    name: "Pequenos Eletrodomésticos",
    parentId: "eletrodomesticos",
    level: 1,
    slug: "eletrodomesticos-pequenos",
  },
  {
    id: "eletrodomesticos-cozinha",
    name: "Eletrodomésticos de Cozinha",
    parentId: "eletrodomesticos",
    level: 1,
    slug: "eletrodomesticos-cozinha",
  },
  {
    id: "eletrodomesticos-clima",
    name: "Climatização",
    parentId: "eletrodomesticos",
    level: 1,
    slug: "eletrodomesticos-clima",
  },

  // ===== CELULARES E ELETRÔNICOS =====
  {
    id: "eletronicos",
    name: "Celulares e Eletrônicos",
    level: 0,
    slug: "eletronicos",
  },
  {
    id: "eletronicos-acessorios",
    name: "Acessórios para Celular",
    parentId: "eletronicos",
    level: 1,
    slug: "eletronicos-acessorios",
  },
  {
    id: "eletronicos-capas",
    name: "Capas e Películas",
    parentId: "eletronicos",
    level: 1,
    slug: "eletronicos-capas",
  },
  {
    id: "eletronicos-audio",
    name: "Áudio e Fones",
    parentId: "eletronicos",
    level: 1,
    slug: "eletronicos-audio",
  },
  {
    id: "eletronicos-smartwatch",
    name: "Smartwatches",
    parentId: "eletronicos",
    level: 1,
    slug: "eletronicos-smartwatch",
  },
  {
    id: "eletronicos-carregadores",
    name: "Carregadores",
    parentId: "eletronicos",
    level: 1,
    slug: "eletronicos-carregadores",
  },

  // ===== COMPUTADORES E ESCRITÓRIO =====
  {
    id: "computadores",
    name: "Computadores e Escritório",
    level: 0,
    slug: "computadores",
  },
  {
    id: "computadores-acessorios",
    name: "Acessórios para PC",
    parentId: "computadores",
    level: 1,
    slug: "computadores-acessorios",
  },
  {
    id: "computadores-perifericos",
    name: "Periféricos",
    parentId: "computadores",
    level: 1,
    slug: "computadores-perifericos",
  },
  {
    id: "computadores-papelaria",
    name: "Papelaria e Escritório",
    parentId: "computadores",
    level: 1,
    slug: "computadores-papelaria",
  },

  // ===== FERRAMENTAS E CONSTRUÇÃO =====
  {
    id: "ferramentas",
    name: "Ferramentas e Construção",
    level: 0,
    slug: "ferramentas",
  },
  {
    id: "ferramentas-manuais",
    name: "Ferramentas Manuais",
    parentId: "ferramentas",
    level: 1,
    slug: "ferramentas-manuais",
  },
  {
    id: "ferramentas-eletricas",
    name: "Ferramentas Elétricas",
    parentId: "ferramentas",
    level: 1,
    slug: "ferramentas-eletricas",
  },
  {
    id: "ferramentas-medicao",
    name: "Medição e Instrumentos",
    parentId: "ferramentas",
    level: 1,
    slug: "ferramentas-medicao",
  },

  // ===== ESPORTE E LAZER =====
  { id: "esporte", name: "Esporte e Lazer", level: 0, slug: "esporte" },
  {
    id: "esporte-fitness",
    name: "Fitness e Academia",
    parentId: "esporte",
    level: 1,
    slug: "esporte-fitness",
  },
  {
    id: "esporte-ciclismo",
    name: "Ciclismo",
    parentId: "esporte",
    level: 1,
    slug: "esporte-ciclismo",
  },
  {
    id: "esporte-roupas",
    name: "Roupas Esportivas",
    parentId: "esporte",
    level: 1,
    slug: "esporte-roupas",
  },
  {
    id: "esporte-camping",
    name: "Camping e Aventura",
    parentId: "esporte",
    level: 1,
    slug: "esporte-camping",
  },
  {
    id: "esporte-pesca",
    name: "Pesca",
    parentId: "esporte",
    level: 1,
    slug: "esporte-pesca",
  },

  // ===== BRINQUEDOS E HOBBIES =====
  {
    id: "brinquedos",
    name: "Brinquedos e Hobbies",
    level: 0,
    slug: "brinquedos",
  },
  {
    id: "brinquedos-educativos",
    name: "Brinquedos Educativos",
    parentId: "brinquedos",
    level: 1,
    slug: "brinquedos-educativos",
  },
  {
    id: "brinquedos-bonecas",
    name: "Bonecas e Bonecos",
    parentId: "brinquedos",
    level: 1,
    slug: "brinquedos-bonecas",
  },
  {
    id: "brinquedos-jogos",
    name: "Jogos e Puzzles",
    parentId: "brinquedos",
    level: 1,
    slug: "brinquedos-jogos",
  },
  {
    id: "brinquedos-controle",
    name: "Controle Remoto",
    parentId: "brinquedos",
    level: 1,
    slug: "brinquedos-controle",
  },

  // ===== BEBÊS E MATERNIDADE =====
  { id: "bebes", name: "Bebês e Maternidade", level: 0, slug: "bebes" },
  {
    id: "bebes-roupas",
    name: "Roupas de Bebê",
    parentId: "bebes",
    level: 1,
    slug: "bebes-roupas",
  },
  {
    id: "bebes-fraldas",
    name: "Fraldas e Higiene",
    parentId: "bebes",
    level: 1,
    slug: "bebes-fraldas",
  },
  {
    id: "bebes-alimentacao",
    name: "Alimentação",
    parentId: "bebes",
    level: 1,
    slug: "bebes-alimentacao",
  },
  {
    id: "bebes-carrinho",
    name: "Carrinhos e Passeio",
    parentId: "bebes",
    level: 1,
    slug: "bebes-carrinho",
  },
  {
    id: "bebes-gestante",
    name: "Gestante",
    parentId: "bebes",
    level: 1,
    slug: "bebes-gestante",
  },

  // ===== PETS =====
  { id: "pets", name: "Pet Shop", level: 0, slug: "pets" },
  {
    id: "pets-cachorros",
    name: "Cachorros",
    parentId: "pets",
    level: 1,
    slug: "pets-cachorros",
  },
  {
    id: "pets-gatos",
    name: "Gatos",
    parentId: "pets",
    level: 1,
    slug: "pets-gatos",
  },
  {
    id: "pets-acessorios",
    name: "Acessórios Pet",
    parentId: "pets",
    level: 1,
    slug: "pets-acessorios",
  },
  {
    id: "pets-brinquedos",
    name: "Brinquedos Pet",
    parentId: "pets",
    level: 1,
    slug: "pets-brinquedos",
  },
  {
    id: "pets-racao",
    name: "Ração e Petiscos",
    parentId: "pets",
    level: 1,
    slug: "pets-racao",
  },

  // ===== AUTOMOTIVO =====
  { id: "automotivo", name: "Automotivo e Moto", level: 0, slug: "automotivo" },
  {
    id: "automotivo-acessorios",
    name: "Acessórios Automotivos",
    parentId: "automotivo",
    level: 1,
    slug: "automotivo-acessorios",
  },
  {
    id: "automotivo-eletronicos",
    name: "Eletrônicos Automotivos",
    parentId: "automotivo",
    level: 1,
    slug: "automotivo-eletronicos",
  },
  {
    id: "automotivo-manutencao",
    name: "Manutenção",
    parentId: "automotivo",
    level: 1,
    slug: "automotivo-manutencao",
  },
  {
    id: "automotivo-moto",
    name: "Motos",
    parentId: "automotivo",
    level: 1,
    slug: "automotivo-moto",
  },

  // ===== SAÚDE =====
  { id: "saude", name: "Saúde e Bem-estar", level: 0, slug: "saude" },
  {
    id: "saude-massagem",
    name: "Massagem e Relaxamento",
    parentId: "saude",
    level: 1,
    slug: "saude-massagem",
  },
  {
    id: "saude-ortopedico",
    name: "Ortopédicos",
    parentId: "saude",
    level: 1,
    slug: "saude-ortopedico",
  },
  {
    id: "saude-suplementos",
    name: "Suplementos",
    parentId: "saude",
    level: 1,
    slug: "saude-suplementos",
  },
  {
    id: "saude-sexual",
    name: "Saúde Sexual",
    parentId: "saude",
    level: 1,
    slug: "saude-sexual",
  },

  // ===== ALIMENTOS E BEBIDAS =====
  { id: "alimentos", name: "Alimentos e Bebidas", level: 0, slug: "alimentos" },
  {
    id: "alimentos-snacks",
    name: "Snacks e Doces",
    parentId: "alimentos",
    level: 1,
    slug: "alimentos-snacks",
  },
  {
    id: "alimentos-bebidas",
    name: "Bebidas",
    parentId: "alimentos",
    level: 1,
    slug: "alimentos-bebidas",
  },
  {
    id: "alimentos-saudaveis",
    name: "Alimentos Saudáveis",
    parentId: "alimentos",
    level: 1,
    slug: "alimentos-saudaveis",
  },

  // ===== PAPELARIA E LIVROS =====
  { id: "papelaria", name: "Papelaria e Livros", level: 0, slug: "papelaria" },
  {
    id: "papelaria-escolar",
    name: "Material Escolar",
    parentId: "papelaria",
    level: 1,
    slug: "papelaria-escolar",
  },
  {
    id: "papelaria-escritorio",
    name: "Material de Escritório",
    parentId: "papelaria",
    level: 1,
    slug: "papelaria-escritorio",
  },
  {
    id: "papelaria-artesanato",
    name: "Artesanato",
    parentId: "papelaria",
    level: 1,
    slug: "papelaria-artesanato",
  },

  // ===== MÚSICA E INSTRUMENTOS =====
  { id: "musica", name: "Música e Instrumentos", level: 0, slug: "musica" },
  {
    id: "musica-instrumentos",
    name: "Instrumentos Musicais",
    parentId: "musica",
    level: 1,
    slug: "musica-instrumentos",
  },
  {
    id: "musica-acessorios",
    name: "Acessórios de Música",
    parentId: "musica",
    level: 1,
    slug: "musica-acessorios",
  },

  // ===== OUTROS =====
  { id: "outros", name: "Outros", level: 0, slug: "outros" },
];

// ====================
// FETCH CATEGORIES
// ====================

/**
 * Busca categorias do TikTok Shop via API interna.
 * Usa cache em memória e fallback para lista hardcoded se API falhar.
 *
 * @returns Lista flat de categorias, sempre começando com "Todas"
 */
export async function fetchCategories(): Promise<Category[]> {
  // Verificar cache válido
  const now = Date.now();
  if (cachedCategories && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedCategories;
  }

  try {
    const res = await fetch("/api/echotik/categories", {
      cache: "force-cache",
    });

    if (!res.ok) {
      console.warn("[categories] API retornou erro, usando fallback");
      cachedCategories = FALLBACK_TIKTOKSHOP_CATEGORIES;
      cacheTimestamp = now;
      return FALLBACK_TIKTOKSHOP_CATEGORIES;
    }

    const data = await res.json();
    const categories: Category[] = data.categories || [];

    // Validar resposta - se muito pequena, usar fallback
    if (categories.length < 10) {
      console.warn("[categories] API retornou poucos itens, usando fallback");
      cachedCategories = FALLBACK_TIKTOKSHOP_CATEGORIES;
      cacheTimestamp = now;
      return FALLBACK_TIKTOKSHOP_CATEGORIES;
    }

    // Garantir que "Todas" está no início
    const hasAll = categories.some((c) => c.id === ALL_CATEGORY_ID);
    if (!hasAll) {
      categories.unshift({
        id: ALL_CATEGORY_ID,
        name: "Todas as Categorias",
        level: 0,
        slug: "all",
      });
    }

    cachedCategories = categories;
    cacheTimestamp = now;
    return categories;
  } catch (error) {
    console.warn("[categories] Erro no fetch, usando fallback:", error);
    cachedCategories = FALLBACK_TIKTOKSHOP_CATEGORIES;
    cacheTimestamp = now;
    return FALLBACK_TIKTOKSHOP_CATEGORIES;
  }
}

// ====================
// UTILITIES
// ====================

/**
 * Atribui uma categoria de forma determinística baseado no ID do item.
 * Usa hash simples para garantir que o mesmo ID sempre retorna a mesma categoria.
 *
 * @param id - ID do item (video, product, etc)
 * @param categories - Lista de categorias disponíveis
 * @returns ID da categoria atribuída (exclui "all")
 */
export function pickCategoryByHash(id: string, categories: Category[]): string {
  // Filtrar categorias reais (excluir "all" e preferir level > 0)
  const validCategories = categories.filter(
    (c) => c.id !== ALL_CATEGORY_ID && (c.level === undefined || c.level >= 1),
  );

  // Se não houver categorias válidas, usar todas exceto "all"
  const pool =
    validCategories.length > 0
      ? validCategories
      : categories.filter((c) => c.id !== ALL_CATEGORY_ID);

  if (pool.length === 0) return "outros";

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  const index = Math.abs(hash) % pool.length;
  return pool[index].id;
}

/**
 * Encontra categoria por ID ou slug
 */
export function getCategoryById(
  id: string,
  categories: Category[],
): Category | undefined {
  return categories.find((c) => c.id === id || c.slug === id);
}

/**
 * Retorna categorias raiz (level 0)
 */
export function getRootCategories(categories: Category[]): Category[] {
  return categories.filter((c) => c.level === 0 || !c.parentId);
}

/**
 * Retorna subcategorias de um parent
 */
export function getSubcategories(
  parentId: string,
  categories: Category[],
): Category[] {
  return categories.filter((c) => c.parentId === parentId);
}

/**
 * Verifica se item pertence a uma categoria (incluindo subcategorias)
 */
export function matchesCategory(
  itemCategoryId: string | undefined,
  filterCategoryId: string,
  categories: Category[],
): boolean {
  if (!filterCategoryId || filterCategoryId === ALL_CATEGORY_ID) return true;
  if (!itemCategoryId) return false;

  // Match direto
  if (itemCategoryId === filterCategoryId) return true;

  // Verificar se é subcategoria
  const itemCategory = getCategoryById(itemCategoryId, categories);
  if (itemCategory?.parentId === filterCategoryId) return true;

  // Verificar ancestrais
  let current = itemCategory;
  while (current?.parentId) {
    if (current.parentId === filterCategoryId) return true;
    current = getCategoryById(current.parentId, categories);
  }

  return false;
}

/**
 * Limpa o cache de categorias (útil para testes ou refresh forçado)
 */
export function clearCategoriesCache(): void {
  cachedCategories = null;
  cacheTimestamp = 0;
}
