"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Button,
} from "@mui/material";
import {
  Bookmark,
  BookmarkBorder,
  AccessTime,
  TrendingUp,
  Subtitles,
  AutoAwesome,
  PlayArrowRounded,
} from "@mui/icons-material";
import type { VideoDTO, ProductDTO } from "@/lib/types/kalodata";
import { formatCurrency, formatNumber } from "@/lib/kalodata/parser";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { useSavedVideos, useSavedProducts } from "@/lib/storage/saved";
import { TranscriptDialog } from "@/app/components/videos/TranscriptDialog";
import { InsightDialog } from "@/app/components/videos/InsightDialog";

// Design tokens (paleta premium e sofisticada)
const UI = {
  card: {
    bg: "rgba(255,255,255,0.03)",
    bgHover: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.06)",
    borderHover: "rgba(45,212,255,0.15)",
    radius: 4,
    shadow: "0 1px 2px rgba(0,0,0,0.05)",
    shadowHover: "0 4px 16px rgba(0,0,0,0.15), 0 0 6px rgba(45,212,255,0.04)",
  },
  text: {
    primary: "rgba(255,255,255,0.92)",
    secondary: "rgba(255,255,255,0.60)",
    muted: "rgba(255,255,255,0.40)",
  },
  accent: "#2DD4FF",
  accentSecondary: "#AE87FF",
  purple: {
    bg: "rgba(174, 135, 255, 0.18)",
    bgHover: "rgba(174, 135, 255, 0.24)",
  },
  adChip: {
    bg: "rgba(255, 193, 7, 0.08)",
    border: "rgba(255, 193, 7, 0.15)",
    text: "rgba(255, 193, 7, 0.85)",
  },
};

interface VideoCardProProps {
  video?: VideoDTO;
  rank?: number;
  isLoading?: boolean;
}

export function VideoCardPro({
  video,
  rank,
  isLoading = false,
}: VideoCardProProps) {
  const savedVideos = useSavedVideos();
  const savedProducts = useSavedProducts();

  const [isPressed, setIsPressed] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [insightOpen, setInsightOpen] = useState(false);

  const hasTikTokUrl = !!video?.tiktokUrl;
  const hasThumbnail = !!video?.thumbnailUrl;

  const saved = video ? savedVideos.isSaved(video.id) : false;
  const productSaved = video?.product
    ? savedProducts.isSaved(video.product.id)
    : false;

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!video) return;
    savedVideos.toggle(video);
  };

  const handleProductSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!video?.product) return;
    savedProducts.toggle(video.product);
  };

  const handleOpenTikTok = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video || !hasTikTokUrl) return;
    window.open(video.tiktokUrl, "_blank", "noopener,noreferrer");
  };

  const handleInsight = () => {
    setInsightOpen(true);
  };

  const handleTranscribe = () => {
    setTranscriptOpen(true);
  };

  // Generate mock transcript (varies by video id)
  const getMockTranscript = (videoId: string): string => {
    const baseText = `Tá, deixa eu te contar por que esse vídeo performou.
Primeiro: ele abre com uma frase que dá curiosidade imediata.
Depois ele mostra o produto em 2 segundos, sem enrolar.
A pessoa explica o 'antes e depois' com um detalhe específico.
E fecha com uma chamada simples: 'se você quer isso, salva e testa'.
Observação: a edição usa cortes curtos e deixa a prova visual sempre aparecendo.`;

    // Vary slightly based on video id
    const lastChar = videoId.slice(-1);
    const isEven = parseInt(lastChar, 10) % 2 === 0;

    if (isEven) {
      return (
        baseText +
        "\n\nDetalhe extra: o timing da música combina com a revelação do produto."
      );
    }
    return (
      baseText +
      "\n\nExtra: o criador mantém contato visual direto, gera conexão."
    );
  };

  // Generate mock prompt for insight
  const getMockPrompt = (video: VideoDTO): string => {
    const metricsSummary =
      [
        video.views > 0 ? `Views: ${formatNumber(video.views)}` : null,
        video.sales > 0 ? `Vendas: ${formatNumber(video.sales)}` : null,
        video.revenueBRL > 0
          ? `GMV: ${formatCurrency(video.revenueBRL)}`
          : null,
      ]
        .filter(Boolean)
        .join(" | ") || "—";

    return `Você é um gerador de roteiro curto inspirado em um vídeo do TikTok Shop.

Regras:
- Português do Brasil, linguagem simples, sem emojis.
- Estrutura: Hook (1 frase) -> Contexto (2 frases) -> Prova/Detalhes (3 bullets) -> CTA (1 frase).
- Sem prometer milagre. Tom de curadoria: 'eu filtro pra você'.

Dados do vídeo:
- Título: ${video.title || "—"}
- Creator: ${video.creatorHandle || "—"}
- Resumo de métricas: ${metricsSummary}

Entregue:
1) Roteiro falado (até 20 segundos)
2) 3 variações de hook
3) 1 CTA curto para 'salvar'`;
  };

  // Loading skeleton
  if (isLoading || !video) {
    return (
      <Box
        sx={{
          borderRadius: UI.card.radius,
          overflow: "hidden",
          background: UI.card.bg,
          border: `1px solid ${UI.card.border}`,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: { xs: "4 / 5", sm: "4 / 5", md: "9 / 16" },
            background: "#0a0f18",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #0d1420 0%, #151c2a 100%)",
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(45,212,255,0.06) 50%, transparent 100%)",
                animation: "shimmer 2.5s infinite ease-in-out",
                transform: "translateX(-100%)",
              },
              "@keyframes shimmer": {
                "0%": { transform: "translateX(-100%)" },
                "100%": { transform: "translateX(100%)" },
              },
            }}
          />
        </Box>
        <Box sx={{ p: { xs: 1, md: 1.25 } }}>
          <Skeleton width="90%" height={13} sx={{ mb: 0.5 }} />
          <Skeleton width="55%" height={11} sx={{ mb: 0.75 }} />
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Skeleton width={50} height={11} />
            <Skeleton width={45} height={11} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      sx={{
        position: "relative",
        borderRadius: UI.card.radius,
        overflow: "hidden",
        background: UI.card.bg,
        border: `1px solid ${UI.card.border}`,
        transition: "all 160ms cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: UI.card.shadow,
        "&:hover": {
          background: UI.card.bgHover,
          borderColor: UI.card.borderHover,
          boxShadow: UI.card.shadowHover,
          transform: "translateY(-2px)",
        },
        ...(isPressed && {
          transform: "scale(0.98)",
        }),
      }}
    >
      {/* Thumbnail - Clicável para abrir vídeo */}
      <Box
        className="thumbLink"
        onClick={handleOpenTikTok}
        role="button"
        tabIndex={0}
        aria-label={`Abrir vídeo ${video.title || video.id} no TikTok`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpenTikTok(e as any);
          }
        }}
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: { xs: "4 / 5", sm: "4 / 5", md: "9 / 16" },
          overflow: "hidden",
          background:
            "linear-gradient(160deg, #0d1420 0%, #151c2a 50%, #0f1724 100%)",
          cursor: hasTikTokUrl ? "pointer" : "default",
          outline: "none",
          transition: "transform 180ms ease, filter 180ms ease",
          "&:hover": hasTikTokUrl
            ? {
                transform: "translateY(-1px)",
              }
            : {},
          "&:focus-visible": {
            boxShadow: "0 0 0 3px rgba(45, 212, 255, 0.35)",
          },
        }}
      >
        {hasThumbnail && (
          <Box
            component="img"
            src={video.thumbnailUrl!}
            alt={video.title}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        {/* Overlay gradiente sutil */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.18) 100%)",
            opacity: 0.9,
            pointerEvents: "none",
          }}
        />

        {/* Player icon sutil */}
        {hasTikTokUrl && (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "999px",
                background: "rgba(10, 15, 24, 0.35)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(8px)",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
                opacity: 0.55,
                transform: "scale(0.98)",
                transition:
                  "opacity 160ms ease, transform 160ms ease, border-color 160ms ease",
                ".thumbLink:hover &": {
                  opacity: 0.78,
                  transform: "scale(1.02)",
                  borderColor: "rgba(255,255,255,0.22)",
                },
              }}
            >
              <PlayArrowRounded
                sx={{ fontSize: 22, color: "rgba(255,255,255,0.85)" }}
              />
            </Box>
          </Box>
        )}

        {/* Rank badge (discreto) */}
        {rank !== undefined && (
          <Box
            sx={{
              position: "absolute",
              top: { xs: 6, md: 8 },
              left: { xs: 6, md: 8 },
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              gap: 0.3,
              px: { xs: 0.7, md: 0.85 },
              py: { xs: 0.3, md: 0.4 },
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: { xs: "0.65rem", md: "0.7rem" },
              color: "rgba(255,255,255,0.85)",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
          >
            #{rank}
          </Box>
        )}

        {/* Duration */}
        {video.duration && video.duration !== "0:00" && (
          <Chip
            size="small"
            icon={<AccessTime sx={{ fontSize: { xs: 10, md: 11 } }} />}
            label={video.duration}
            sx={{
              position: "absolute",
              top: { xs: 6, md: 8 },
              right: { xs: 6, md: 8 },
              zIndex: 5,
              height: { xs: 20, md: 22 },
              fontSize: { xs: "0.6rem", md: "0.65rem" },
              fontWeight: 600,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              color: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              "& .MuiChip-icon": { color: "rgba(255,255,255,0.65)", ml: 0.5 },
            }}
          />
        )}

        {/* ROAS badge */}
        {video.roas >= 3 && (
          <Chip
            size="small"
            label={`ROAS ${video.roas.toFixed(1)}x`}
            sx={{
              position: "absolute",
              bottom: { xs: 6, md: 8 },
              left: { xs: 6, md: 8 },
              zIndex: 5,
              height: { xs: 20, md: 22 },
              fontSize: { xs: "0.6rem", md: "0.65rem" },
              fontWeight: 700,
              background: `${UI.accent}E6`,
              color: "#06080F",
              boxShadow: "0 2px 10px rgba(45,212,255,0.35)",
            }}
          />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: { xs: 0.9, sm: 0.9, md: 1.5 } }}>
        {/* Product Section (ALWAYS visible - with fallback) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: { xs: 1, md: 1.2 },
            p: { xs: 0.8, md: 1 },
            borderRadius: 3,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Product thumbnail - always show (fallback to video cover if no product) */}
          <Box
            component="img"
            src={video.product?.imageUrl || video.thumbnailUrl || ""}
            alt={video.product?.name || "Produto relacionado"}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0.3";
            }}
            sx={{
              width: { xs: 48, md: 52 },
              height: { xs: 48, md: 52 },
              borderRadius: 3,
              objectFit: "cover",
              flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />

          {/* Product info - with fallback text */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: "0.8rem", md: "0.84rem" },
                fontWeight: video.product ? 600 : 500,
                color: video.product ? UI.text.primary : UI.text.secondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mb: 0.15,
              }}
            >
              {video.product?.name || "Produto relacionado"}
            </Typography>
            {video.product?.priceBRL && video.product.priceBRL > 0 ? (
              <Typography
                sx={{
                  fontSize: { xs: "0.73rem", md: "0.77rem" },
                  color: UI.accent,
                  fontWeight: 600,
                }}
              >
                {formatCurrency(video.product.priceBRL)}
              </Typography>
            ) : (
              <Typography
                sx={{
                  fontSize: { xs: "0.68rem", md: "0.72rem" },
                  color: UI.text.muted,
                  fontStyle: "italic",
                }}
              >
                Sem dados do produto
              </Typography>
            )}
          </Box>

          {/* Save product button - only show if product exists */}
          {video.product && (
            <Tooltip
              title={productSaved ? "Remover dos salvos" : "Salvar produto"}
            >
              <IconButton
                size="small"
                onClick={handleProductSave}
                sx={{
                  width: { xs: 28, md: 30 },
                  height: { xs: 28, md: 30 },
                  color: productSaved ? UI.accent : "rgba(255,255,255,0.5)",
                  border: `1px solid ${productSaved ? UI.accent : "rgba(255,255,255,0.1)"}`,
                  transition: "all 160ms ease",
                  "&:hover": {
                    background: "rgba(255,255,255,0.05)",
                    color: UI.accent,
                    borderColor: UI.accent,
                  },
                }}
              >
                {productSaved ? (
                  <Bookmark sx={{ fontSize: { xs: 14, md: 16 } }} />
                ) : (
                  <BookmarkBorder sx={{ fontSize: { xs: 14, md: 16 } }} />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Metrics - Centralized with labels */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
            mb: { xs: 1.1, md: 1.3 },
            px: { xs: 0.5, md: 0.75 },
          }}
        >
          {/* Revenue */}
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: { xs: "0.92rem", md: "0.98rem" },
                fontWeight: 700,
                color: UI.accent,
                mb: 0.2,
                lineHeight: 1.2,
              }}
            >
              {video.revenueBRL > 0 ? formatCurrency(video.revenueBRL) : "-"}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "0.68rem", md: "0.72rem" },
                color: UI.text.muted,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Receita
            </Typography>
          </Box>

          {/* Views */}
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: { xs: "0.92rem", md: "0.98rem" },
                fontWeight: 700,
                color: UI.text.primary,
                mb: 0.2,
                lineHeight: 1.2,
              }}
            >
              {video.views > 0 ? formatNumber(video.views) : "-"}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "0.68rem", md: "0.72rem" },
                color: UI.text.muted,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Views
            </Typography>
          </Box>

          {/* Sales */}
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: { xs: "0.92rem", md: "0.98rem" },
                fontWeight: 700,
                color: UI.text.primary,
                mb: 0.2,
                lineHeight: 1.2,
              }}
            >
              {video.sales > 0 ? formatNumber(video.sales) : "-"}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "0.68rem", md: "0.72rem" },
                color: UI.text.muted,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Vendas
            </Typography>
          </Box>
        </Box>

        {/* CTA Buttons - Empilhados verticalmente */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 0.6, md: 0.75 },
          }}
        >
          {/* Salvar Vídeo */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={
              saved ? (
                <Bookmark sx={{ fontSize: { xs: 15, md: 16 } }} />
              ) : (
                <BookmarkBorder sx={{ fontSize: { xs: 15, md: 16 } }} />
              )
            }
            onClick={handleSave}
            sx={{
              py: { xs: 0.65, md: 0.75 },
              fontSize: { xs: "0.74rem", md: "0.78rem" },
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 3,
              color: saved ? UI.accent : UI.text.secondary,
              borderColor: saved ? UI.accent : "rgba(255,255,255,0.12)",
              transition: "all 160ms ease",
              "&:hover": {
                borderColor: saved ? UI.accent : "rgba(255,255,255,0.22)",
                background: saved
                  ? "rgba(45,212,255,0.08)"
                  : "rgba(255,255,255,0.04)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            {saved ? "Vídeo Salvo" : "Salvar Vídeo"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Subtitles sx={{ fontSize: { xs: 15, md: 16 } }} />}
            onClick={handleTranscribe}
            sx={{
              py: { xs: 0.65, md: 0.75 },
              fontSize: { xs: "0.74rem", md: "0.78rem" },
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 3,
              color: UI.text.secondary,
              borderColor: "rgba(255,255,255,0.12)",
              transition: "all 160ms ease",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.22)",
                background: "rgba(255,255,255,0.04)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            Transcrição
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={<AutoAwesome sx={{ fontSize: { xs: 15, md: 16 } }} />}
            onClick={handleInsight}
            sx={{
              background: UI.purple.bg,
              color: "#fff",
              fontWeight: 600,
              fontSize: { xs: "0.74rem", md: "0.78rem" },
              textTransform: "none",
              borderRadius: 3,
              py: { xs: 0.65, md: 0.75 },
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              "&:hover": {
                background: UI.purple.bgHover,
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
              transition: "all 160ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Insight Hyppado
          </Button>
        </Box>
      </Box>

      {/* Dialogs */}
      {video && (
        <>
          <TranscriptDialog
            open={transcriptOpen}
            onClose={() => setTranscriptOpen(false)}
            transcriptText={getMockTranscript(video.id)}
            videoTitle={video.title}
          />
          <InsightDialog
            open={insightOpen}
            onClose={() => setInsightOpen(false)}
            promptText={getMockPrompt(video)}
            videoTitle={video.title}
          />
        </>
      )}
    </Box>
  );
}

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 30) return `há ${Math.floor(diffDay / 30)}m`;
    if (diffDay > 0) return `há ${diffDay}d`;
    if (diffHour > 0) return `há ${diffHour}h`;
    if (diffMin > 0) return `há ${diffMin}min`;
    return "agora";
  } catch {
    return "";
  }
}
