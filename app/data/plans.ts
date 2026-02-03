export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight: boolean;
  badge?: string;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "R$ 29",
    period: "mês",
    description: "Para começar a testar com clareza.",
    features: [
      "Descoberta de produtos e vídeos em alta",
      "Transcrição de vídeo",
      "Prompts básicos para modelagem do criativo",
      "Salvos por sessão",
    ],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 79",
    period: "mês",
    description: "Para quem posta com frequência e quer consistência.",
    features: [
      "Tudo do Starter",
      "Prompts avançados (gancho, roteiro e CTA)",
      "Variações de abordagem para o mesmo produto",
      "Organização por categorias",
    ],
    highlight: true,
    badge: "Mais escolhido",
  },
  {
    id: "business",
    name: "Business",
    price: "R$ 149",
    period: "mês",
    description: "Para equipes pequenas e operação mais intensa.",
    features: [
      "Tudo do Pro",
      "Perfis e permissões (básico)",
      "Biblioteca de criativos por time",
      "Suporte prioritário",
    ],
    highlight: false,
  },
];
