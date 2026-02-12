"use client";

import { useState } from "react";
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
  // Top 3 ranking colors (gold, silver, bronze)
  rank: {
    1: {
      color: "#D4AF37", // Rich gold
      bg: "rgba(212, 175, 55, 0.15)",
      border: "rgba(212, 175, 55, 0.4)",
      glow: "0 0 12px rgba(212, 175, 55, 0.35)",
    },
    2: {
      color: "#C0C0C0", // Silver
      bg: "rgba(192, 192, 192, 0.12)",
      border: "rgba(192, 192, 192, 0.35)",
      glow: "0 0 10px rgba(192, 192, 192, 0.25)",
    },
    3: {
      color: "#CD7F32", // Bronze
      bg: "rgba(205, 127, 50, 0.12)",
      border: "rgba(205, 127, 50, 0.35)",
      glow: "0 0 10px rgba(205, 127, 50, 0.25)",
    },
  },
};

// Mock products for fallback when video has no product
const FALLBACK_PRODUCTS = [
  { name: "Secador de Cabelo Profissional", priceBRL: 189.90, category: "Beleza", imageUrl: "https://picsum.photos/seed/prod001/200/200" },
  { name: "Kit Maquiagem Completo", priceBRL: 129.90, category: "Beleza", imageUrl: "https://picsum.photos/seed/prod002/200/200" },
  { name: "Fone Bluetooth Premium", priceBRL: 249.90, category: "Eletrônicos", imageUrl: "https://picsum.photos/seed/prod003/200/200" },
  { name: "Escova Alisadora 2-em-1", priceBRL: 159.90, category: "Beleza", imageUrl: "https://picsum.photos/seed/prod004/200/200" },
  { name: "Luminária LED Inteligente", priceBRL: 89.90, category: "Casa", imageUrl: "https://picsum.photos/seed/prod005/200/200" },
];

/**
 * Get a mock product for a video based on index (deterministic)
 */
function getMockProductForVideo(videoId: string, index: number) {
  const idx = index % FALLBACK_PRODUCTS.length;
  return FALLBACK_PRODUCTS[idx];
}

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

  // Always have a product to display (real or fallback mock)
  const displayProduct = video?.product || (video ? {
    ...getMockProductForVideo(video.id, rank ?? 0),
    id: `fallback-${video.id}`,
  } : null);
  const hasRealProduct = !!video?.product;

  const saved = video ? savedVideos.isSaved(video.id) : false;
  const productSaved = displayProduct && hasRealProduct
    ? savedProducts.isSaved(video!.product!.id)
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

        {/* Rank badge - Top 1/2/3 com destaque sofisticado, demais discreto */}
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
              px: { xs: 0.8, md: 1 },
              py: { xs: 0.35, md: 0.45 },
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: { xs: "0.7rem", md: "0.75rem" },
              ...(rank >= 1 && rank <= 3
                ? {
                    color: UI.rank[rank as 1 | 2 | 3].color,
                    background: UI.rank[rank as 1 | 2 | 3].bg,
                    backdropFilter: "blur(10px)",
                    border: `1.5px solid ${UI.rank[rank as 1 | 2 | 3].border}`,
                    boxShadow: UI.rank[rank as 1 | 2 | 3].glow,
                  }
                : {
                    color: "rgba(255,255,255,0.6)",
                    background: "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }),
            }}
          >
            #{rank}
          </Box>
        )}

        {/* Duration - REMOVIDO conforme requisito */}

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
        {/* Product Section (ALWAYS visible - uses displayProduct fallback) */}
        {displayProduct && (
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
            {/* Product thumbnail */}
            <Box
              component="img"
              src={displayProduct.imageUrl || video.thumbnailUrl || ""}
              alt={displayProduct.name}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = "0.3";
              }}
              sx={{
                width: { xs: 44, md: 48 },
                height: { xs: 44, md: 48 },
                borderRadius: 2.5,
                objectFit: "cover",
                flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />

            {/* Product info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: "0.78rem", md: "0.82rem" },
                  fontWeight: 600,
                  color: UI.text.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  mb: 0.2,
                }}
              >
                {displayProduct.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.72rem", md: "0.76rem" },
                  color: UI.accent,
                  fontWeight: 600,
                }}
              >
                {formatCurrency(displayProduct.priceBRL)}
              </Typography>
            </Box>

            {/* Save product button - only show if real product exists */}
            {hasRealProduct && (
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
        )}

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

        {/* CTA Buttons - Apenas 2 empilhados + Salvar como ação secundária */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 0.6, md: 0.75 },
          }}
        >
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

          {/* Salvar Vídeo - Ação secundária */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { xs: 0.3, md: 0.4 },
            }}
          >
            <Button
              size="small"
              startIcon={
                saved ? (
                  <Bookmark sx={{ fontSize: 14 }} />
                ) : (
                  <BookmarkBorder sx={{ fontSize: 14 }} />
                )
              }
              onClick={handleSave}
              sx={{
                py: 0.5,
                px: 1.5,
                fontSize: "0.7rem",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: 2,
                color: saved ? UI.accent : UI.text.muted,
                transition: "all 160ms ease",
                "&:hover": {
                  background: "rgba(255,255,255,0.04)",
                  color: UI.accent,
                },
              }}
            >
              {saved ? "Salvo" : "Salvar"}
            </Button>
          </Box>
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
