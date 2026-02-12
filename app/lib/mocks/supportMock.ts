/**
 * Mocks for Support Page
 * Used only for demo purposes in /app/suporte
 */

export type TicketCategory =
  | "Conta"
  | "Assinatura"
  | "Dados"
  | "Bug"
  | "Sugestão";
export type TicketPriority = "Baixa" | "Média" | "Alta";
export type TicketStatus =
  | "Aberto"
  | "Em andamento"
  | "Aguardando você"
  | "Resolvido";
export type SystemStatusType = "success" | "warning" | "error";

export interface SupportContact {
  supportEmail: string;
  helpCenterUrl: string;
  whatsapp?: {
    number: string; // formato: 5511999999999
    label: string;
  };
  businessHours: string;
  avgFirstResponse: string;
  avgResolution: string;
  systemStatus: {
    label: string;
    color: SystemStatusType;
    details: string;
  };
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  lastMessageSnippet: string;
}

export interface SuggestedArticle {
  title: string;
  description: string;
  href: string;
}

// ============================================
// Mock Data
// ============================================

export const mockSupportContact: SupportContact = {
  supportEmail: "suporte@hyppado.com",
  helpCenterUrl: "#",
  whatsapp: {
    number: "5511999999999",
    label: "+55 (11) 99999-9999",
  },
  businessHours: "Seg–Sex • 9h–18h (BRT)",
  avgFirstResponse: "Até 6 horas úteis",
  avgResolution: "1–3 dias úteis",
  systemStatus: {
    label: "Operacional",
    color: "success",
    details: "Todos os sistemas funcionando normalmente",
  },
};

export const mockSupportTickets: SupportTicket[] = [
  {
    id: "HYP-2045",
    subject: "Limite de transcrições atingido antes do esperado",
    category: "Assinatura",
    priority: "Média",
    status: "Em andamento",
    createdAt: "2026-02-11T14:30:00Z",
    updatedAt: "2026-02-12T09:15:00Z",
    lastMessageSnippet:
      "Nossa equipe está investigando a contagem de uso. Retornaremos em breve.",
  },
  {
    id: "HYP-2041",
    subject: "Vídeo não abre no modal de detalhes",
    category: "Bug",
    priority: "Alta",
    status: "Aguardando você",
    createdAt: "2026-02-10T16:20:00Z",
    updatedAt: "2026-02-11T10:05:00Z",
    lastMessageSnippet:
      "Solicitamos mais informações sobre o navegador utilizado. Por favor, responda.",
  },
  {
    id: "HYP-2038",
    subject: "Como alterar e-mail da conta?",
    category: "Conta",
    priority: "Baixa",
    status: "Resolvido",
    createdAt: "2026-02-09T11:00:00Z",
    updatedAt: "2026-02-10T15:30:00Z",
    lastMessageSnippet:
      "Problema resolvido. Acesse Configurações > Perfil para alterar seu e-mail.",
  },
  {
    id: "HYP-2035",
    subject: "Sugestão: adicionar filtro por GMV nos produtos",
    category: "Sugestão",
    priority: "Baixa",
    status: "Aberto",
    createdAt: "2026-02-08T13:45:00Z",
    updatedAt: "2026-02-08T13:45:00Z",
    lastMessageSnippet:
      "Obrigado pela sugestão! Vamos avaliar e adicionar ao roadmap.",
  },
  {
    id: "HYP-2032",
    subject: "Dados de vendas desatualizados",
    category: "Dados",
    priority: "Alta",
    status: "Resolvido",
    createdAt: "2026-02-07T09:10:00Z",
    updatedAt: "2026-02-08T11:20:00Z",
    lastMessageSnippet:
      "Sincronização reestabelecida. Os dados agora estão atualizados.",
  },
  {
    id: "HYP-2029",
    subject: "Dúvida sobre downgrade de plano",
    category: "Assinatura",
    priority: "Média",
    status: "Resolvido",
    createdAt: "2026-02-06T14:00:00Z",
    updatedAt: "2026-02-07T10:30:00Z",
    lastMessageSnippet:
      "Downgrade pode ser feito a qualquer momento. Enviamos instruções por e-mail.",
  },
];

export const mockSuggestedArticles: SuggestedArticle[] = [
  {
    title: "Como funcionam os limites de transcrições",
    description:
      "Entenda como são contabilizadas as transcrições e roteiros no seu plano.",
    href: "#limites",
  },
  {
    title: "Integrando webhook da Hotmart",
    description:
      "Guia completo para configurar o webhook e sincronizar assinaturas automaticamente.",
    href: "#hotmart-webhook",
  },
  {
    title: "Salvando vídeos e produtos favoritos",
    description:
      "Aprenda a usar a biblioteca para organizar seus vídeos e produtos salvos.",
    href: "#salvos",
  },
  {
    title: "Interpretando métricas de engajamento",
    description:
      "Como analisar visualizações, likes, comentários e identificar tendências.",
    href: "#metricas",
  },
  {
    title: "FAQ: Perguntas frequentes",
    description:
      "Respostas rápidas para as dúvidas mais comuns sobre o Hyppado.",
    href: "#faq",
  },
];
