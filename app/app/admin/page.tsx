"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Tabs,
  Tab,
  LinearProgress,
  Tooltip,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Check as CheckIcon,
  Restore as RestoreIcon,
  Save as SaveIcon,
  PersonOutlined,
  SubtitlesOutlined,
  TerminalOutlined,
  CodeOutlined,
  ConfirmationNumberOutlined,
  SupportAgentOutlined,
  PhoneIphoneOutlined,
  Email as EmailIcon,
  InfoOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import type {
  PromptConfig,
  Subscriber,
  SubscriptionMetrics,
  QuotaPolicy,
  QuotaUsage,
} from "@/lib/types/admin";
import {
  getSubscribers,
  getSubscriptionMetrics,
} from "@/lib/admin/admin-client";
import {
  getEffectiveQuotaPolicy,
  setQuotaPolicy,
  DEFAULT_QUOTA_POLICY,
} from "@/lib/admin/quota-storage";
import {
  PROMPT_VARIABLES,
  getDefaultPromptConfig,
  savePromptConfigLocally,
  loadPromptConfigLocally,
} from "@/lib/admin/prompt-config";

// Check if mock mode is enabled
const isMockMode = process.env.NEXT_PUBLIC_ADMIN_MOCKS === "true";

// Helper to display value or "—" if null/undefined
function displayValue(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString("pt-BR");
  return value;
}

// Helper to format usage with max
function formatUsage(
  used: number | null | undefined,
  max: number | null | undefined,
): string {
  const usedStr =
    used !== null && used !== undefined ? used.toLocaleString("pt-BR") : "—";
  const maxStr =
    max !== null && max !== undefined ? max.toLocaleString("pt-BR") : "—";
  return `${usedStr} / ${maxStr}`;
}

// Card style helper
const cardStyle = {
  background: "rgba(10, 15, 24, 0.8)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 3,
};

export default function AdminPage() {
  // Data state
  const [activeSubscribers, setActiveSubscribers] = useState<Subscriber[]>([]);
  const [canceledSubscribers, setCanceledSubscribers] = useState<Subscriber[]>(
    [],
  );
  const [metrics, setMetrics] = useState<SubscriptionMetrics>({});
  const [quotaPolicy, setQuotaPolicyState] =
    useState<QuotaPolicy>(DEFAULT_QUOTA_POLICY);
  const [quotaUsage, setQuotaUsage] = useState<QuotaUsage>({});
  const [loading, setLoading] = useState(true);

  // UI state
  const [subscriberTab, setSubscriberTab] = useState(0);
  const [promptTab, setPromptTab] = useState(0);
  const [promptConfig, setPromptConfig] = useState<PromptConfig>(
    getDefaultPromptConfig(),
  );
  const [savedLocally, setSavedLocally] = useState(false);
  const [limitsSaved, setLimitsSaved] = useState(false);

  // Editable limits
  const [transcriptsLimit, setTranscriptsLimit] = useState("40");
  const [scriptsLimit, setScriptsLimit] = useState("70");

  // Support config
  const supportEmail = "contato@hyppado.com";

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Load from localStorage first
        const storedPolicy = getEffectiveQuotaPolicy();
        setQuotaPolicyState(storedPolicy);
        setTranscriptsLimit(storedPolicy.transcriptsPerMonth.toString());
        setScriptsLimit(storedPolicy.scriptsPerMonth.toString());

        // Fetch from API
        const [active, canceled, metricsData, usageData] = await Promise.all([
          getSubscribers("active"),
          getSubscribers("canceled"),
          getSubscriptionMetrics(),
          fetch("/api/admin/quota-usage")
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        ]);

        setActiveSubscribers(active);
        setCanceledSubscribers(canceled);
        setMetrics(metricsData);
        if (usageData) {
          setQuotaUsage(usageData);
        }
      } catch (error) {
        console.error("Failed to load admin data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Load prompt config from localStorage on mount
  useEffect(() => {
    setPromptConfig(loadPromptConfigLocally());
  }, []);

  // Save limits to localStorage
  const saveLimits = useCallback(() => {
    const newPolicy: QuotaPolicy = {
      ...quotaPolicy,
      transcriptsPerMonth: parseInt(transcriptsLimit) || 40,
      scriptsPerMonth: parseInt(scriptsLimit) || 70,
    };
    setQuotaPolicy(newPolicy);
    setQuotaPolicyState(newPolicy);
    setLimitsSaved(true);
    setTimeout(() => setLimitsSaved(false), 2000);
    // Trigger page refresh to update header
    window.dispatchEvent(new Event("quota-policy-changed"));
  }, [quotaPolicy, transcriptsLimit, scriptsLimit]);

  // Update prompt template
  const updatePromptTemplate = useCallback(
    (type: "insight" | "script", template: string) => {
      setPromptConfig((prev) => ({
        ...prev,
        [type]: { ...prev[type], template },
      }));
      setSavedLocally(false);
    },
    [],
  );

  // Restore defaults
  const restoreDefaults = useCallback((type: "insight" | "script") => {
    const defaults = getDefaultPromptConfig();
    setPromptConfig((prev) => ({
      ...prev,
      [type]: defaults[type],
    }));
    setSavedLocally(false);
  }, []);

  // Save prompts locally
  const saveLocally = useCallback(() => {
    savePromptConfigLocally(promptConfig);
    setSavedLocally(true);
    setTimeout(() => setSavedLocally(false), 2000);
  }, [promptConfig]);

  const currentSubscribers =
    subscriberTab === 0 ? activeSubscribers : canceledSubscribers;

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#fff", mb: 1 }}>
          Admin
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>
          Gerenciamento de assinantes, quotas e configurações
        </Typography>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      <Grid container spacing={3}>
        {/* ==================== SECTION A: Subscription Metrics ==================== */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={cardStyle}>
            <CardHeader
              avatar={<PersonOutlined sx={{ color: "#2DD4FF" }} />}
              title="Métricas de Assinatura"
              subheader={metrics.periodLabel ?? "Período atual"}
              titleTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
              subheaderTypographyProps={{ fontSize: "0.8rem" }}
            />
            <CardContent>
              <Stack spacing={2.5}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.5)", mb: 0.5 }}
                  >
                    Assinantes Ativos
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#81C784", fontWeight: 700 }}
                  >
                    {displayValue(metrics.activeMonthlySubscribers)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.5)", mb: 0.5 }}
                  >
                    Cancelamentos
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#FFB74D", fontWeight: 700 }}
                  >
                    {displayValue(metrics.canceledSubscribers)}
                  </Typography>
                </Box>

                {metrics.lastSyncAt && (
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    Última sincronização:{" "}
                    {new Date(metrics.lastSyncAt).toLocaleString("pt-BR")}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ==================== SECTION B: Limits & Credits (Editable) ==================== */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={cardStyle}>
            <CardHeader
              avatar={<SettingsOutlined sx={{ color: "#2DD4FF" }} />}
              title="Limites & Créditos"
              subheader="Configuração de quotas mensais"
              titleTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
              subheaderTypographyProps={{ fontSize: "0.8rem" }}
              action={
                <Button
                  variant="contained"
                  size="small"
                  startIcon={limitsSaved ? <CheckIcon /> : <SaveIcon />}
                  onClick={saveLimits}
                  sx={{
                    background: limitsSaved
                      ? "rgba(76, 175, 80, 0.2)"
                      : "linear-gradient(135deg, #2DD4FF, #7B61FF)",
                    color: limitsSaved ? "#81C784" : "#fff",
                    fontWeight: 600,
                    minWidth: 80,
                  }}
                >
                  {limitsSaved ? "Salvo!" : "Salvar"}
                </Button>
              }
            />
            <CardContent>
              <Stack spacing={2.5}>
                {/* Transcripts limit */}
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 1 }}
                  >
                    <SubtitlesOutlined
                      sx={{ fontSize: 18, color: "#2DD4FF" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      Transcrições / mês
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <TextField
                      value={transcriptsLimit}
                      onChange={(e) => setTranscriptsLimit(e.target.value)}
                      size="small"
                      type="number"
                      sx={{
                        width: 100,
                        "& .MuiOutlinedInput-root": {
                          background: "rgba(0,0,0,0.2)",
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      Uso:{" "}
                      {formatUsage(
                        quotaUsage.transcriptsUsed,
                        parseInt(transcriptsLimit) ||
                          quotaPolicy.transcriptsPerMonth,
                      )}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={
                      quotaUsage.transcriptsUsed !== null &&
                      quotaUsage.transcriptsUsed !== undefined
                        ? Math.min(
                            (quotaUsage.transcriptsUsed /
                              (parseInt(transcriptsLimit) || 40)) *
                              100,
                            100,
                          )
                        : 0
                    }
                    sx={{
                      mt: 1,
                      height: 6,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.1)",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #2DD4FF, #7B61FF)",
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

                {/* Scripts limit */}
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 1 }}
                  >
                    <TerminalOutlined sx={{ fontSize: 18, color: "#CE93D8" }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      Roteiros (Scripts) / mês
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <TextField
                      value={scriptsLimit}
                      onChange={(e) => setScriptsLimit(e.target.value)}
                      size="small"
                      type="number"
                      sx={{
                        width: 100,
                        "& .MuiOutlinedInput-root": {
                          background: "rgba(0,0,0,0.2)",
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      Uso:{" "}
                      {formatUsage(
                        quotaUsage.scriptsUsed,
                        parseInt(scriptsLimit) || quotaPolicy.scriptsPerMonth,
                      )}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={
                      quotaUsage.scriptsUsed !== null &&
                      quotaUsage.scriptsUsed !== undefined
                        ? Math.min(
                            (quotaUsage.scriptsUsed /
                              (parseInt(scriptsLimit) || 70)) *
                              100,
                            100,
                          )
                        : 0
                    }
                    sx={{
                      mt: 1,
                      height: 6,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.1)",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #7B61FF, #F472B6)",
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ==================== SECTION C: Coupons (Coming Soon) ==================== */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={cardStyle}>
            <CardHeader
              avatar={<ConfirmationNumberOutlined sx={{ color: "#2DD4FF" }} />}
              title="Cupons"
              subheader="Gerenciamento de cupons"
              titleTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
              subheaderTypographyProps={{ fontSize: "0.8rem" }}
            />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="Código do Cupom"
                  placeholder="Ex: DESCONTO20"
                  disabled
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "rgba(0,0,0,0.2)",
                    },
                  }}
                />

                <TextField
                  label="Desconto (%)"
                  placeholder="Ex: 20"
                  disabled
                  fullWidth
                  size="small"
                  type="number"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "rgba(0,0,0,0.2)",
                    },
                  }}
                />

                <Button
                  variant="contained"
                  disabled
                  sx={{
                    background: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  Em breve
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ==================== SECTION D: Subscribers Table ==================== */}
        <Grid item xs={12}>
          <Card sx={cardStyle}>
            <CardHeader
              avatar={<PersonOutlined sx={{ color: "#2DD4FF" }} />}
              title="Assinantes"
              subheader="Lista de assinantes"
              titleTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
              subheaderTypographyProps={{ fontSize: "0.8rem" }}
            />
            <CardContent>
              <Tabs
                value={subscriberTab}
                onChange={(_, v) => setSubscriberTab(v)}
                sx={{
                  mb: 2,
                  "& .MuiTab-root": {
                    color: "rgba(255,255,255,0.5)",
                    "&.Mui-selected": { color: "#2DD4FF" },
                  },
                  "& .MuiTabs-indicator": { background: "#2DD4FF" },
                }}
              >
                <Tab label={`Ativos (${activeSubscribers.length || "—"})`} />
                <Tab
                  label={`Cancelados (${canceledSubscribers.length || "—"})`}
                />
              </Tabs>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "rgba(255,255,255,0.5)",
                          borderColor: "rgba(255,255,255,0.06)",
                          fontWeight: 600,
                        }}
                      >
                        Nome
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "rgba(255,255,255,0.5)",
                          borderColor: "rgba(255,255,255,0.06)",
                          fontWeight: 600,
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "rgba(255,255,255,0.5)",
                          borderColor: "rgba(255,255,255,0.06)",
                          fontWeight: 600,
                        }}
                      >
                        WhatsApp
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "rgba(255,255,255,0.5)",
                          borderColor: "rgba(255,255,255,0.06)",
                          fontWeight: 600,
                        }}
                      >
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentSubscribers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          sx={{
                            color: "rgba(255,255,255,0.4)",
                            borderColor: "rgba(255,255,255,0.06)",
                            textAlign: "center",
                            py: 4,
                          }}
                        >
                          Nenhum assinante disponível
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentSubscribers.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell
                            sx={{
                              color: "rgba(255,255,255,0.8)",
                              borderColor: "rgba(255,255,255,0.06)",
                            }}
                          >
                            {sub.name ?? "—"}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "rgba(255,255,255,0.6)",
                              borderColor: "rgba(255,255,255,0.06)",
                            }}
                          >
                            {sub.email ?? "—"}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderColor: "rgba(255,255,255,0.06)",
                            }}
                          >
                            {sub.phone ? (
                              <Tooltip
                                title={`Enviar mensagem para ${sub.phone}`}
                              >
                                <IconButton
                                  size="small"
                                  href={`https://wa.me/${sub.phone.replace(/\D/g, "")}`}
                                  target="_blank"
                                  sx={{ color: "#25D366" }}
                                >
                                  <PhoneIphoneOutlined fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Telefone não disponível para este assinante">
                                <Typography
                                  variant="body2"
                                  sx={{ color: "rgba(255,255,255,0.3)" }}
                                >
                                  —
                                </Typography>
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderColor: "rgba(255,255,255,0.06)",
                            }}
                          >
                            <Chip
                              label={
                                sub.status === "ACTIVE"
                                  ? "Ativo"
                                  : sub.status === "CANCELED"
                                    ? "Cancelado"
                                    : sub.status
                              }
                              size="small"
                              sx={{
                                background:
                                  sub.status === "ACTIVE"
                                    ? "rgba(76, 175, 80, 0.15)"
                                    : "rgba(244, 67, 54, 0.15)",
                                color:
                                  sub.status === "ACTIVE"
                                    ? "#81C784"
                                    : "#EF5350",
                                fontSize: "0.75rem",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ==================== SECTION E: Support ==================== */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardHeader
              avatar={<SupportAgentOutlined sx={{ color: "#2DD4FF" }} />}
              title="Suporte"
              subheader="Canais de atendimento"
              titleTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
              subheaderTypographyProps={{ fontSize: "0.8rem" }}
            />
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: 2,
                  }}
                >
                  <EmailIcon sx={{ color: "#2DD4FF" }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.5)", mb: 0.5 }}
                    >
                      Email de Suporte
                    </Typography>
                    <Typography sx={{ color: "#fff", fontWeight: 500 }}>
                      {supportEmail}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    href={`mailto:${supportEmail}`}
                    sx={{
                      borderColor: "#2DD4FF",
                      color: "#2DD4FF",
                      "&:hover": {
                        borderColor: "#2DD4FF",
                        background: "rgba(45, 212, 255, 0.1)",
                      },
                    }}
                  >
                    Enviar Email
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ==================== SECTION F: Prompt Configuration ==================== */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardHeader
              avatar={<CodeOutlined sx={{ color: "#2DD4FF" }} />}
              title="Configuração de Prompts"
              subheader="Templates para geração de conteúdo"
              titleTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
              subheaderTypographyProps={{ fontSize: "0.8rem" }}
              action={
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Restaurar padrões">
                    <IconButton
                      onClick={() =>
                        restoreDefaults(promptTab === 0 ? "insight" : "script")
                      }
                      size="small"
                      sx={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      <RestoreIcon />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={savedLocally ? <CheckIcon /> : <SaveIcon />}
                    onClick={saveLocally}
                    sx={{
                      background: savedLocally
                        ? "rgba(76, 175, 80, 0.2)"
                        : "linear-gradient(135deg, #2DD4FF, #7B61FF)",
                      color: savedLocally ? "#81C784" : "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {savedLocally ? "Salvo!" : "Salvar"}
                  </Button>
                </Stack>
              }
            />
            <CardContent>
              <Tabs
                value={promptTab}
                onChange={(_, v) => setPromptTab(v)}
                sx={{
                  mb: 2,
                  "& .MuiTab-root": {
                    color: "rgba(255,255,255,0.5)",
                    "&.Mui-selected": { color: "#2DD4FF" },
                  },
                  "& .MuiTabs-indicator": { background: "#2DD4FF" },
                }}
              >
                <Tab label="Insight" />
                <Tab label="Script" />
              </Tabs>

              {/* Variables Reference */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Variáveis:{" "}
                  {PROMPT_VARIABLES.map((v) => v.variable).join(", ")}
                </Typography>
              </Box>

              {/* Template Editor */}
              <TextField
                multiline
                rows={6}
                fullWidth
                value={
                  promptTab === 0
                    ? promptConfig.insight.template
                    : promptConfig.script.template
                }
                onChange={(e) =>
                  updatePromptTemplate(
                    promptTab === 0 ? "insight" : "script",
                    e.target.value,
                  )
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    background: "rgba(0,0,0,0.3)",
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.2)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2DD4FF",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "rgba(255,255,255,0.85)",
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mock Mode Indicator */}
      {isMockMode && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <InfoOutlined sx={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }} />
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)" }}>
            Dados de demonstração (modo mock)
          </Typography>
        </Box>
      )}
    </Box>
  );
}
