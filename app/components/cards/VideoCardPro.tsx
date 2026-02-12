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
  OpenInNew,
  Share,
  Visibility,
  Paid,
  ShoppingCart,
  AccessTime,
  TrendingUp,
  Subtitles,
  AutoAwesome,
} from "@mui/icons-material";
import type { VideoDTO, ProductDTO } from "@/lib/types/kalodata";
import { formatCurrency, formatNumber } from "@/lib/kalodata/parser";
import { Skeleton } from "@/app/components/ui/Skeleton";
import {
  isVideoSaved,
  toggleVideoSaved,
  isProductSaved,
  toggleProductSaved,
} from "@/lib/storage/saved";
import { TranscriptDialog } from "@/app/components/videos/TranscriptDialog";
import { InsightDialog } from "@/app/components/videos/InsightDialog";

// Design tokens (paleta refinada e sofisticada)
const UI = {
  card: {
    bg: "linear-gradient(165deg, #0D1422 0%, #0A0F18 100%)",
    border: "rgba(255,255,255,0.06)",
    borderHover: "rgba(45,212,255,0.18)",
    radius: 4,
    shadow: "0 1px 3px rgba(0,0,0,0.08)",
    shadowHover: "0 6px 20px rgba(0,0,0,0.2), 0 0 8px rgba(45,212,255,0.06)",
  },
  text: {
    primary: "rgba(255,255,255,0.94)",
    secondary: "rgba(255,255,255,0.62)",
    muted: "rgba(255,255,255,0.38)",
  },
  accent: "#2DD4FF",
  accentSecondary: "#B388FF",
  adChip: {
    bg: "rgba(255, 193, 7, 0.1)",
    border: "rgba(255, 193, 7, 0.18)",
    text: "rgba(255, 193, 7, 0.92)",
  },
};

interface VideoCardProProps {
  video?: VideoDTO;
  product?: ProductDTO | null;
  rank?: number;
  onShareClick?: (video: VideoDTO) => void;
  isLoading?: boolean;
}

export function VideoCardPro({
  video,
  product,
  rank,
  onShareClick,
  isLoading = false,
}: VideoCardProProps) {
  const [saved, setSaved] = useState(video ? isVideoSaved(video.id) : false);
  const [productSaved, setProductSaved] = useState(
    product ? isProductSaved(product.id) : false,
  );
  const [isPressed, setIsPressed] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [insightOpen, setInsightOpen] = useState(false);

  const hasTikTokUrl = !!video?.tiktokUrl;
  const hasThumbnail = !!video?.thumbnailUrl;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video) return;
    const newState = toggleVideoSaved(video);
    setSaved(newState);
  };

  const handleProductSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;
    const newState = toggleProductSaved(product);
    setProductSaved(newState);
  };

  const handleOpenTikTok = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video || !hasTikTokUrl) return;
    window.open(video.tiktokUrl, "_blank", "noopener,noreferrer");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video) return;
    onShareClick?.(video);
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
        transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: UI.card.shadow,
        "&:hover": {
          borderColor: UI.card.borderHover,
          boxShadow: UI.card.shadowHover,
          transform: "translateY(-2px)",
        },
        ...(isPressed && {
          transform: "scale(0.98)",
        }),
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: { xs: "4 / 5", sm: "4 / 5", md: "9 / 16" },
          overflow: "hidden",
          background:
            "linear-gradient(160deg, #0d1420 0%, #151c2a 50%, #0f1724 100%)",
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

        {/* Action buttons overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 6, md: 8 },
            right: { xs: 6, md: 8 },
            zIndex: 5,
            display: "flex",
            gap: 0.5,
          }}
        >
          <Tooltip title={saved ? "Remover dos salvos" : "Salvar vídeo"}>
            <IconButton
              size="small"
              onClick={handleSave}
              sx={{
                width: { xs: 30, md: 32 },
                height: { xs: 30, md: 32 },
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
                color: saved ? UI.accent : "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.12)",
                transition: "all 180ms ease",
                "&:hover": {
                  background: "rgba(0,0,0,0.7)",
                  color: UI.accent,
                  borderColor: UI.accent,
                },
              }}
            >
              {saved ? (
                <Bookmark sx={{ fontSize: { xs: 16, md: 18 } }} />
              ) : (
                <BookmarkBorder sx={{ fontSize: { xs: 16, md: 18 } }} />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Compartilhar">
            <IconButton
              size="small"
              onClick={handleShare}
              sx={{
                width: { xs: 30, md: 32 },
                height: { xs: 30, md: 32 },
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.12)",
                transition: "all 180ms ease",
                "&:hover": {
                  background: "rgba(0,0,0,0.7)",
                  color: UI.accent,
                  borderColor: UI.accent,
                },
              }}
            >
              <Share sx={{ fontSize: { xs: 16, md: 18 } }} />
            </IconButton>
          </Tooltip>

          {hasTikTokUrl && (
            <Tooltip title="Abrir no TikTok">
              <IconButton
                size="small"
                onClick={handleOpenTikTok}
                sx={{
                  width: { xs: 30, md: 32 },
                  height: { xs: 30, md: 32 },
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(8px)",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  transition: "all 180ms ease",
                  "&:hover": {
                    background: "rgba(0,0,0,0.7)",
                    color: UI.accent,
                    borderColor: UI.accent,
                  },
                }}
              >
                <OpenInNew sx={{ fontSize: { xs: 16, md: 18 } }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: { xs: 0.9, sm: 0.9, md: 1.5 } }}>
        {/* Title (2 lines clamp) */}
        <Typography
          sx={{
            fontSize: { xs: "0.85rem", md: "0.925rem" },
            fontWeight: 640,
            color: UI.text.primary,
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: { xs: 0.4, md: 0.5 },
            minHeight: "2.6em",
          }}
        >
          {video.title}
        </Typography>

        {/* Creator handle + time ago */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            mb: { xs: 0.8, md: 0.95 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "0.75rem", md: "0.8rem" },
              color: UI.text.secondary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {video.creatorHandle}
          </Typography>
          {video.publishedAt && (
            <Typography
              sx={{
                fontSize: { xs: "0.7rem", md: "0.75rem" },
                color: UI.text.muted,
                whiteSpace: "nowrap",
              }}
            >
              {formatTimeAgo(video.publishedAt)}
            </Typography>
          )}
        </Box>

        {/* Metrics - 2 lines mobile, 1 line desktop */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 0.65, md: 0.8 },
            mb: { xs: 1, md: 1.15 },
          }}
        >
          {video.revenueBRL > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.35 }}>
              <Paid
                sx={{ fontSize: { xs: 14, md: 15 }, color: `${UI.accent}E6` }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "0.7rem", md: "0.75rem" },
                  color: UI.accent,
                  fontWeight: 600,
                }}
              >
                {formatCurrency(video.revenueBRL)}
              </Typography>
            </Box>
          )}

          {video.views > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.35 }}>
              <Visibility
                sx={{ fontSize: { xs: 14, md: 15 }, color: UI.text.muted }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "0.7rem", md: "0.75rem" },
                  color: UI.text.secondary,
                }}
              >
                {formatNumber(video.views)}
              </Typography>
            </Box>
          )}

          {video.sales > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.35 }}>
              <ShoppingCart
                sx={{ fontSize: { xs: 14, md: 15 }, color: UI.text.muted }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "0.7rem", md: "0.75rem" },
                  color: UI.text.secondary,
                }}
              >
                {formatNumber(video.sales)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* CTA Buttons - Empilhados verticalmente */}
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
              py: { xs: 0.6, md: 0.75 },
              fontSize: { xs: "0.72rem", md: "0.78rem" },
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              color: UI.text.secondary,
              borderColor: "rgba(255,255,255,0.15)",
              transition: "all 180ms ease",
              "&:hover": {
                borderColor: UI.accent,
                color: UI.accent,
                background: "rgba(45,212,255,0.08)",
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
              background: `linear-gradient(135deg, ${UI.accentSecondary} 0%, ${UI.accentSecondary}DD 100%)`,
              color: "#fff",
              fontWeight: 600,
              fontSize: { xs: "0.72rem", md: "0.78rem" },
              textTransform: "none",
              borderRadius: 2,
              py: { xs: 0.6, md: 0.75 },
              boxShadow: `0 4px 12px ${UI.accentSecondary}40`,
              "&:hover": {
                background: `linear-gradient(135deg, ${UI.accentSecondary}EE 0%, ${UI.accentSecondary}CC 100%)`,
                boxShadow: `0 6px 16px ${UI.accentSecondary}60`,
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
              transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Insight Hyppado
          </Button>
        </Box>
      </Box>

      {/* Product section BELOW card (se existir) */}
      {product && (
        <Box
          sx={{
            borderTop: `1px solid ${UI.card.border}`,
            p: { xs: 1, md: 1.25 },
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.65rem",
              fontWeight: 600,
              color: UI.text.muted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              mb: 0.7,
            }}
          >
            Produto
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* Product thumbnail */}
            {product.imageUrl && (
              <Box
                component="img"
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                sx={{
                  width: { xs: 56, md: 64 },
                  height: { xs: 56, md: 64 },
                  borderRadius: 2,
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            )}

            {/* Product info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: "0.8rem", md: "0.85rem" },
                  fontWeight: 600,
                  color: UI.text.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  mb: 0.2,
                }}
              >
                {product.name}
              </Typography>
              {product.priceBRL > 0 && (
                <Typography
                  sx={{
                    fontSize: { xs: "0.75rem", md: "0.8rem" },
                    color: UI.accent,
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(product.priceBRL)}
                </Typography>
              )}
            </Box>

            {/* Save product button */}
            <Tooltip
              title={productSaved ? "Remover dos salvos" : "Salvar produto"}
            >
              <IconButton
                size="small"
                onClick={handleProductSave}
                sx={{
                  width: { xs: 30, md: 32 },
                  height: { xs: 30, md: 32 },
                  color: productSaved ? UI.accent : "rgba(255,255,255,0.6)",
                  border: `1px solid ${productSaved ? UI.accent : "rgba(255,255,255,0.12)"}`,
                  transition: "all 180ms ease",
                  "&:hover": {
                    background: "rgba(255,255,255,0.05)",
                    color: UI.accent,
                    borderColor: UI.accent,
                  },
                }}
              >
                {productSaved ? (
                  <Bookmark sx={{ fontSize: { xs: 16, md: 18 } }} />
                ) : (
                  <BookmarkBorder sx={{ fontSize: { xs: 16, md: 18 } }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

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
