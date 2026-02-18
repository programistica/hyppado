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
    id: "pro",
    name: "Pro",
    price: "R$ 59,90",
    period: "mês",
    description: "Todas funcionalidades",
    features: [
      "40 transcripts / mês",
      "70 insights / mês",
      "Descoberta de vídeos e produtos em alta",
      "Prompts avançados (gancho, roteiro e CTA)",
      "Organização por categorias",
    ],
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 647,00",
    period: "ano",
    description: "Todas funcionalidades do PRO",
    features: [
      "Tudo do Pro incluso",
      "Economia de 10% vs mensal",
      "Acesso prioritário a novidades",
      "Suporte prioritário",
    ],
    highlight: true,
    badge: "Mais escolhido",
  },
];
