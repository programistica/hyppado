"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Stack,
  Chip,
  LinearProgress,
  Button,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  PauseCircle,
  HourglassEmpty,
  Person,
  Email,
  Phone,
  CreditCard,
  TrendingUp,
  Link as LinkIcon,
  CloudDone,
  ReceiptLong,
} from "@mui/icons-material";
import Link from "next/link";
import { useQuotaUsage } from "@/lib/admin/useQuotaUsage";
import {
  mockSubscription,
  mockMember,
  mockBillingHistory,
  mockHotmartIntegration,
  type SubscriptionStatus,
  type BillingType,
  type BillingStatus,
} from "../../lib/mocks/subscriptionMock";

// ============================================
// Design Tokens
// ============================================

const UI = {
  card: {
    bg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.06)",
    borderHover: "rgba(45,212,255,0.15)",
    radius: 3,
  },
  text: {
    primary: "rgba(255,255,255,0.92)",
    secondary: "rgba(255,255,255,0.70)",
    muted: "rgba(255,255,255,0.45)",
  },
  accent: "#2DD4FF",
  purple: "#AE87FF",
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FF9800",
};

// ============================================
// Helper Functions
// ============================================

function getStatusIcon(status: SubscriptionStatus) {
  switch (status) {
    case "Ativa":
      return <CheckCircle sx={{ fontSize: 20, color: UI.success }} />;
    case "Cancelada":
      return <Cancel sx={{ fontSize: 20, color: UI.error }} />;
    case "Em atraso":
      return <PauseCircle sx={{ fontSize: 20, color: UI.warning }} />;
    case "Em análise":
      return <HourglassEmpty sx={{ fontSize: 20, color: UI.warning }} />;
  }
}

function getStatusColor(status: SubscriptionStatus): string {
  switch (status) {
    case "Ativa":
      return UI.success;
    case "Cancelada":
      return UI.error;
    case "Em atraso":
    case "Em análise":
      return UI.warning;
    default:
      return UI.text.muted;
  }
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function getTimeAgo(dateString: string): string {
  try {
    const now = Date.now();
    const then = new Date(dateString).getTime();
    const diffMs = now - then;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "há alguns minutos";
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays === 1) return "há 1 dia";
    return `há ${diffDays} dias`;
  } catch {
    return "—";
  }
}

// ============================================
// Main Component
// ============================================

export default function AssinaturaPage() {
  const quota = useQuotaUsage();

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 700,
            color: UI.text.primary,
            mb: 0.5,
          }}
        >
          Assinatura
        </Typography>
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: UI.text.secondary,
          }}
        >
          Gerencie seu plano, limites e configurações de cobrança.
        </Typography>
      </Box>

      {/* Two Column Layout */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Stack spacing={{ xs: 2, md: 3 }}>
            {/* Plano Atual */}
            <Card
              sx={{
                borderRadius: UI.card.radius,
                background: UI.card.bg,
                border: `1px solid ${UI.card.border}`,
                p: { xs: 2, md: 3 },
              }}
            >
              <Stack spacing={2.5}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CreditCard sx={{ fontSize: 24, color: UI.accent }} />
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      fontWeight: 600,
                      color: UI.text.primary,
                    }}
                  >
                    Plano Atual
                  </Typography>
                </Box>

                {/* Plan Name */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: UI.text.muted,
                      mb: 0.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Plano
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: UI.accent,
                    }}
                  >
                    {mockSubscription.planName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: UI.text.muted,
                      mt: 0.5,
                    }}
                  >
                    {mockSubscription.billingCycle}
                  </Typography>
                </Box>

                {/* Status */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.5,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${UI.card.border}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getStatusIcon(mockSubscription.status)}
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: UI.text.secondary,
                      }}
                    >
                      Status
                    </Typography>
                  </Box>
                  <Chip
                    label={mockSubscription.status}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: `${getStatusColor(mockSubscription.status)}15`,
                      color: getStatusColor(mockSubscription.status),
                      border: `1px solid ${getStatusColor(mockSubscription.status)}30`,
                    }}
                  />
                </Box>

                {/* Dates */}
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: UI.text.secondary,
                      }}
                    >
                      Próxima renovação
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: UI.text.primary,
                      }}
                    >
                      {formatDate(mockSubscription.nextRenewalAt)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: UI.text.secondary,
                      }}
                    >
                      Data de início
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: UI.text.primary,
                      }}
                    >
                      {formatDate(mockSubscription.startedAt)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: UI.text.secondary,
                      }}
                    >
                      Produto Hotmart
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: UI.text.primary,
                      }}
                    >
                      {mockSubscription.productName}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: UI.text.secondary,
                      }}
                    >
                      Forma de pagamento
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: UI.text.primary,
                      }}
                    >
                      {mockSubscription.paymentMethod}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Card>

            {/* Conta do Membro */}
            <Card
              sx={{
                borderRadius: UI.card.radius,
                background: UI.card.bg,
                border: `1px solid ${UI.card.border}`,
                p: { xs: 2, md: 3 },
              }}
            >
              <Stack spacing={2.5}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Person sx={{ fontSize: 24, color: UI.purple }} />
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      fontWeight: 600,
                      color: UI.text.primary,
                    }}
                  >
                    Conta do Membro
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  {/* Name */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${UI.card.border}`,
                    }}
                  >
                    <Person sx={{ fontSize: 18, color: UI.text.muted }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          color: UI.text.muted,
                          mb: 0.3,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Nome
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: UI.text.primary,
                        }}
                      >
                        {mockMember.name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Email */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${UI.card.border}`,
                    }}
                  >
                    <Email sx={{ fontSize: 18, color: UI.text.muted }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          color: UI.text.muted,
                          mb: 0.3,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        E-mail
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: UI.text.primary,
                          wordBreak: "break-all",
                        }}
                      >
                        {mockMember.email}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Phone (Optional) */}
                  {mockMember.phone && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.02)",
                        border: `1px solid ${UI.card.border}`,
                      }}
                    >
                      <Phone sx={{ fontSize: 18, color: UI.text.muted }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            color: UI.text.muted,
                            mb: 0.3,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Telefone
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: UI.text.primary,
                          }}
                        >
                          {mockMember.phone}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Stack spacing={{ xs: 2, md: 3 }}>
            {/* Limites do Período */}
            <Card
              sx={{
                borderRadius: UI.card.radius,
                background: UI.card.bg,
                border: `1px solid ${UI.card.border}`,
                p: { xs: 2, md: 3 },
              }}
            >
              <Stack spacing={2.5}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <TrendingUp sx={{ fontSize: 24, color: UI.accent }} />
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      fontWeight: 600,
                      color: UI.text.primary,
                    }}
                  >
                    Limites do Período
                  </Typography>
                </Box>

                {/* Transcrições */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: UI.text.primary,
                      }}
                    >
                      Transcrições
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: UI.accent,
                      }}
                    >
                      {quota.transcripts.used ?? "—"} / {quota.transcripts.max}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      quota.transcripts.used !== null
                        ? Math.min(
                            (quota.transcripts.used / quota.transcripts.max) *
                              100,
                            100,
                          )
                        : 0
                    }
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      background: "rgba(45,212,255,0.1)",
                      "& .MuiLinearProgress-bar": {
                        background: `linear-gradient(90deg, ${UI.accent} 0%, rgba(45,212,255,0.7) 100%)`,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                {/* Roteiros */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: UI.text.primary,
                      }}
                    >
                      Roteiros
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: UI.purple,
                      }}
                    >
                      {quota.scripts.used ?? "—"} / {quota.scripts.max}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      quota.scripts.used !== null
                        ? Math.min(
                            (quota.scripts.used / quota.scripts.max) * 100,
                            100,
                          )
                        : 0
                    }
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      background: "rgba(174,135,255,0.1)",
                      "& .MuiLinearProgress-bar": {
                        background: `linear-gradient(90deg, ${UI.purple} 0%, rgba(174,135,255,0.7) 100%)`,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                {/* Notice */}
                <Box
                  sx={{
                    mt: 1,
                    p: 1.5,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${UI.card.border}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: UI.text.muted,
                      fontStyle: "italic",
                    }}
                  >
                    Os limites são renovados mensalmente com base no seu plano.
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {/* Integração Hotmart */}
            <Card
              sx={{
                borderRadius: UI.card.radius,
                background: UI.card.bg,
                border: `1px solid ${UI.card.border}`,
                p: { xs: 2, md: 3 },
              }}
            >
              <Stack spacing={2.5}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CloudDone
                    sx={{
                      fontSize: 24,
                      color: mockHotmartIntegration.connected
                        ? UI.accent
                        : UI.text.muted,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      fontWeight: 600,
                      color: UI.text.primary,
                    }}
                  >
                    Integração Hotmart
                  </Typography>
                </Box>

                {/* Status */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.5,
                    borderRadius: 2,
                    background: mockHotmartIntegration.connected
                      ? "rgba(45,212,255,0.08)"
                      : "rgba(255,255,255,0.02)",
                    border: `1px solid ${
                      mockHotmartIntegration.connected
                        ? "rgba(45,212,255,0.25)"
                        : UI.card.border
                    }`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: UI.text.secondary,
                    }}
                  >
                    Status
                  </Typography>
                  <Chip
                    label={
                      mockHotmartIntegration.connected
                        ? "Conectado"
                        : "Não configurado"
                    }
                    size="small"
                    icon={
                      mockHotmartIntegration.connected ? (
                        <CheckCircle sx={{ fontSize: 16 }} />
                      ) : undefined
                    }
                    sx={{
                      height: 24,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: mockHotmartIntegration.connected
                        ? `${UI.accent}20`
                        : "rgba(255,255,255,0.05)",
                      color: mockHotmartIntegration.connected
                        ? UI.accent
                        : UI.text.muted,
                      border: `1px solid ${
                        mockHotmartIntegration.connected
                          ? `${UI.accent}40`
                          : "rgba(255,255,255,0.1)"
                      }`,
                      "& .MuiChip-icon": {
                        color: mockHotmartIntegration.connected
                          ? UI.accent
                          : UI.text.muted,
                      },
                    }}
                  />
                </Box>

                {/* Webhook */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.5,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${UI.card.border}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: UI.text.secondary,
                    }}
                  >
                    Webhook configurado
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: mockHotmartIntegration.webhookConfigured
                        ? UI.success
                        : UI.text.muted,
                    }}
                  >
                    {mockHotmartIntegration.webhookConfigured ? "Sim" : "Não"}
                  </Typography>
                </Box>

                {/* Last Sync */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.5,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${UI.card.border}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: UI.text.secondary,
                    }}
                  >
                    Última sincronização
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: UI.text.primary,
                    }}
                  >
                    {getTimeAgo(mockHotmartIntegration.lastSyncAt)}
                  </Typography>
                </Box>

                {/* Endpoint Info */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: "rgba(45,212,255,0.05)",
                    border: `1px solid rgba(45,212,255,0.15)`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      color: UI.text.muted,
                      mb: 0.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Endpoint configurado
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      fontFamily: "monospace",
                      color: UI.accent,
                      wordBreak: "break-all",
                    }}
                  >
                    /api/webhooks/hotmart
                  </Typography>
                </Box>

                {/* CTA */}
                <Button
                  component={Link}
                  href="/app/suporte"
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    borderColor: UI.card.border,
                    color: UI.text.primary,
                    py: 1,
                    "&:hover": {
                      borderColor: UI.accent,
                      background: "rgba(45,212,255,0.08)",
                    },
                  }}
                >
                  Ver instruções de configuração
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Grid>

        {/* Full Width - Histórico */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: UI.card.radius,
              background: UI.card.bg,
              border: `1px solid ${UI.card.border}`,
              p: { xs: 2, md: 3 },
            }}
          >
            <Stack spacing={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <ReceiptLong sx={{ fontSize: 24, color: UI.accent }} />
                <Typography
                  sx={{
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    fontWeight: 600,
                    color: UI.text.primary,
                  }}
                >
                  Histórico de Cobrança
                </Typography>
              </Box>

              {/* Billing Events List */}
              <Stack spacing={1.5}>
                {mockBillingHistory.map((event: any) => (
                  <Box
                    key={event.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: { xs: 1.5, md: 2 },
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${UI.card.border}`,
                      transition: "all 180ms ease",
                      "&:hover": {
                        background: "rgba(255,255,255,0.04)",
                        borderColor: UI.card.borderHover,
                      },
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.3,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: UI.text.primary,
                          }}
                        >
                          {event.type}
                        </Typography>
                        <Chip
                          label={event.status}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            background:
                              event.status === "Aprovado"
                                ? `${UI.success}15`
                                : "rgba(255,255,255,0.05)",
                            color:
                              event.status === "Aprovado"
                                ? UI.success
                                : UI.text.muted,
                            border: `1px solid ${
                              event.status === "Aprovado"
                                ? `${UI.success}30`
                                : UI.card.border
                            }`,
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: UI.text.muted,
                        }}
                      >
                        {formatDate(event.createdAt)} • {event.reference}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: UI.accent,
                        ml: 2,
                      }}
                    >
                      {event.amount}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
