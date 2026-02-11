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
  WorkspacePremium,
  MilitaryTech,
  Paid,
  ShoppingCart,
  AccessTime,
  TrendingUp,
} from "@mui/icons-material";
import type { VideoDTO, ProductDTO } from "@/lib/types/kalodata";
import { formatCurrency, formatNumber } from "@/lib/kalodata/parser";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { isVideoSaved, toggleVideoSaved } from "@/lib/storage/saved";

// Design tokens
const UI = {
  card: {
    bg: "linear-gradient(165deg, #0D1422 0%, #0A0F18 100%)",
    border: "rgba(255,255,255,0.06)",
    borderHover: "rgba(45,212,255,0.22)",
    radius: 4.5,
    shadow: "0 2px 8px rgba(0,0,0,0.12)",
    shadowHover: "0 8px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(45,212,255,0.15)",
  },
  text: {
    primary: "rgba(255,255,255,0.92)",
    secondary: "rgba(255,255,255,0.68)",
    muted: "rgba(255,255,255,0.42)",
  },
  accent: "#2DD4FF",
  accentSecondary: "#B388FF",
};

const RANK_STYLES: Record<
  number,
  { color: string; border: string; icon: typeof WorkspacePremium }
> = {
  1: { color: "#F5C84C", border: "rgba(245,200,76,0.3)", icon: WorkspacePremium },
  2: { color: "#D1D5DB", border: "rgba(209,213,219,0.25)", icon: WorkspacePremium },
  3: { color: "#CD9777", border: "rgba(205,151,119,0.25)", icon: MilitaryTech },
};

interface VideoCardProProps {
  video?: VideoDTO;
  product?: ProductDTO | null;
  rank?: number;
  onInsightClick?: (video: VideoDTO) => void;
  onShareClick?: (video: VideoDTO) => void;
  onProductSave?: (product: ProductDTO) => void;
  isLoading?: boolean;
}

export function VideoCardPro({
  video,
  product,
  rank,
  onInsightClick,
  onShareClick,
  onProductSave,
  isLoading = false,
}: VideoCardProProps) {
  const [saved, setSaved] = useState(video ? isVideoSaved(video.id) : false);
  const [isPressed, setIsPressed] = useState(false);

  const isTop3 = rank !== undefined && rank >= 1 && rank <= 3;
  const rankStyle = isTop3 ? RANK_STYLES[rank] : null;
  const hasTikTokUrl = !!video?.tiktokUrl;
  const hasThumbnail = !!video?.thumbnailUrl;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video) return;
    const newState = toggleVideoSaved(video);
    setSaved(newState);
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
    if (!video) return;
    onInsightClick?.(video);
  };

  const handleProductSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;
    onProductSave?.(product);
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
            aspectRatio: { xs: "1 / 1", md: "4 / 5" },
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
        <Box sx={{ p: { xs: 1.25, md: 1.5 } }}>
          <Skeleton width="90%" height={14} sx={{ mb: 0.5 }} />
          <Skeleton width="55%" height={12} sx={{ mb: 0.75 }} />
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Skeleton width={50} height={12} />
            <Skeleton width={45} height={12} />
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
        border: `1px solid ${rankStyle ? rankStyle.border : UI.card.border}`,
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
          aspectRatio: { xs: "1 / 1", md: "4 / 5" },
          overflow: "hidden",
          background: "linear-gradient(160deg, #0d1420 0%, #151c2a 50%, #0f1724 100%)",
        }}
      >
        {hasThumbnail && (
          <Box
            component="img"
            src={video.thumbnailUrl!}
            alt={video.title}
            loading="lazy"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        {/* Rank badge */}
        {rank !== undefined && (
          <Box
            sx={{
              position: "absolute",
              top: { xs: 8, md: 10 },
              left: { xs: 8, md: 10 },
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: { xs: 0.8, md: 1 },
              py: { xs: 0.35, md: 0.45 },
              borderRadius: 3,
              fontWeight: 700,
              fontSize: { xs: "0.7rem", md: "0.75rem" },
              color: rankStyle ? rankStyle.color : "rgba(255,255,255,0.9)",
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${rankStyle ? rankStyle.border : "rgba(255,255,255,0.10)"}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {rankStyle && <rankStyle.icon sx={{ fontSize: { xs: 14, md: 15 } }} />}
            #{rank}
          </Box>
        )}

        {/* Duration */}
        {video.duration && video.duration !== "0:00" && (
          <Chip
            size="small"
            icon={<AccessTime sx={{ fontSize: { xs: 11, md: 12 } }} />}
            label={video.duration}
            sx={{
              position: "absolute",
              top: { xs: 8, md: 10 },
              right: { xs: 8, md: 10 },
              zIndex: 5,
              height: { xs: 22, md: 24 },
              fontSize: { xs: "0.65rem", md: "0.7rem" },
              fontWeight: 600,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
              color: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              "& .MuiChip-icon": { color: UI.text.secondary },
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
              bottom: { xs: 8, md: 10 },
              left: { xs: 8, md: 10 },
              zIndex: 5,
              height: { xs: 22, md: 24 },
              fontSize: { xs: "0.65rem", md: "0.7rem" },
              fontWeight: 700,
              background: `${UI.accent}E6`,
              color: "#06080F",
              boxShadow: "0 2px 8px rgba(45,212,255,0.3)",
            }}
          />
        )}

        {/* Action buttons overlay - top right */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 8, md: 10 },
            right: { xs: 8, md: 10 },
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
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(8px)",
                color: saved ? UI.accent : "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
                "&:hover": {
                  background: "rgba(0,0,0,0.65)",
                  color: UI.accent,
                },
              }}
            >
              {saved ? <Bookmark sx={{ fontSize: 16 }} /> : <BookmarkBorder sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Compartilhar">
            <IconButton
              size="small"
              onClick={handleShare}
              sx={{
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(8px)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
                "&:hover": {
                  background: "rgba(0,0,0,0.65)",
                  color: UI.accent,
                },
              }}
            >
              <Share sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          {hasTikTokUrl && (
            <Tooltip title="Abrir no TikTok">
              <IconButton
                size="small"
                onClick={handleOpenTikTok}
                sx={{
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(8px)",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  "&:hover": {
                    background: "rgba(0,0,0,0.65)",
                    color: UI.accent,
                  },
                }}
              >
                <OpenInNew sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: { xs: 1.25, md: 1.5 } }}>
        {/* Title */}
        <Typography
          sx={{
            fontSize: { xs: "0.95rem", md: "1rem" },
            fontWeight: 650,
            color: UI.text.primary,
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: { xs: 0.4, md: 0.5 },
            minHeight: "2.4em",
          }}
        >
          {video.title}
        </Typography>

        {/* Creator handle */}
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: UI.text.secondary,
            mb: { xs: 0.75, md: 1 },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {video.creatorHandle}
        </Typography>

        {/* Metrics - compact grid on mobile */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 0.75, md: 1 },
            mb: { xs: 1, md: 1.25 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            <Paid sx={{ fontSize: { xs: 15, md: 16 }, color: `${UI.accent}E6` }} />
            <Typography
              sx={{
                fontSize: { xs: "0.775rem", md: "0.8125rem" },
                color: UI.accent,
                fontWeight: 600,
              }}
            >
              {formatCurrency(video.revenueBRL)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            <Visibility sx={{ fontSize: { xs: 15, md: 16 }, color: UI.text.muted }} />
            <Typography
              sx={{
                fontSize: { xs: "0.775rem", md: "0.8125rem" },
                color: UI.text.secondary,
              }}
            >
              {formatNumber(video.views)}
            </Typography>
          </Box>

          {video.sales > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
              <ShoppingCart sx={{ fontSize: { xs: 15, md: 16 }, color: UI.text.muted }} />
              <Typography
                sx={{
                  fontSize: { xs: "0.775rem", md: "0.8125rem" },
                  color: UI.text.secondary,
                }}
              >
                {formatNumber(video.sales)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* CTA Button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<TrendingUp />}
          onClick={handleInsight}
          sx={{
            background: `linear-gradient(135deg, ${UI.accentSecondary} 0%, ${UI.accentSecondary}DD 100%)`,
            color: "#fff",
            fontWeight: 600,
            fontSize: { xs: "0.8rem", md: "0.85rem" },
            textTransform: "none",
            borderRadius: 2,
            py: { xs: 0.75, md: 1 },
            boxShadow: `0 4px 12px ${UI.accentSecondary}40`,
            "&:hover": {
              background: `linear-gradient(135deg, ${UI.accentSecondary}EE 0%, ${UI.accentSecondary}CC 100%)`,
              boxShadow: `0 6px 16px ${UI.accentSecondary}60`,
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "scale(0.98)",
            },
            transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Insight Hyppado
        </Button>
      </Box>

      {/* Product section (if exists) */}
      {product && (
        <Box
          sx={{
            borderTop: `1px solid ${UI.card.border}`,
            p: { xs: 1.25, md: 1.5 },
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: UI.text.muted,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              mb: 0.75,
            }}
          >
            Produto
          </Typography>
          <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
            {/* Product thumbnail */}
            <Box
              component="img"
              src={product.imageUrl}
              alt={product.name}
              sx={{
                width: { xs: 56, md: 64 },
                height: { xs: 56, md: 64 },
                borderRadius: 2,
                objectFit: "cover",
                flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />

            {/* Product info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: "0.8125rem", md: "0.875rem" },
                  fontWeight: 600,
                  color: UI.text.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  mb: 0.25,
                }}
              >
                {product.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                  color: UI.accent,
                  fontWeight: 600,
                }}
              >
                {formatCurrency(product.priceBRL)}
              </Typography>
            </Box>

            {/* Save product button */}
            <Tooltip title="Salvar produto">
              <IconButton
                size="small"
                onClick={handleProductSave}
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  "&:hover": {
                    background: "rgba(255,255,255,0.05)",
                    color: UI.accent,
                    borderColor: UI.accent,
                  },
                }}
              >
                <BookmarkBorder sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
    </Box>
  );
}
