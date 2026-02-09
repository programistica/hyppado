"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  Bookmark,
  BookmarkBorder,
  OpenInNew,
  MoreVert,
  FolderOpen,
  Visibility,
  WorkspacePremium,
  MilitaryTech,
  Paid,
  ShoppingCart,
  AccessTime,
} from "@mui/icons-material";
import type { VideoDTO } from "@/lib/types/kalodata";
import { formatCurrency, formatNumber } from "@/lib/kalodata/parser";
import { Skeleton } from "@/app/components/ui/Skeleton";

// ============================================
// Rank + Top 3 helpers
// ============================================
const TOP_3_STYLES: Record<
  number,
  { color: string; glow: string; border: string; icon: typeof WorkspacePremium }
> = {
  1: {
    color: "#FFD700",
    glow: "0 0 18px rgba(255, 215, 0, 0.35)",
    border: "rgba(255, 215, 0, 0.5)",
    icon: WorkspacePremium,
  },
  2: {
    color: "#C0C0C0",
    glow: "0 0 14px rgba(192, 192, 192, 0.3)",
    border: "rgba(192, 192, 192, 0.45)",
    icon: WorkspacePremium,
  },
  3: {
    color: "#CD7F32",
    glow: "0 0 14px rgba(205, 127, 50, 0.3)",
    border: "rgba(205, 127, 50, 0.45)",
    icon: MilitaryTech,
  },
};

// ============================================
// Props
// ============================================
interface VideoCardProps {
  video?: VideoDTO;
  rank?: number;
  onSave?: (video: VideoDTO) => void;
  onAddToCollection?: (video: VideoDTO) => void;
  onClick?: (video: VideoDTO) => void;
  isSaved?: boolean;
  isLoading?: boolean;
}

/**
 * VideoCard — lightweight card with placeholder preview + click-to-open.
 * No TikTok embed/iframe. Click opens TikTok URL in new tab.
 */
export function VideoCard({
  video,
  rank,
  onSave,
  onAddToCollection,
  onClick,
  isSaved = false,
  isLoading = false,
}: VideoCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [saved, setSaved] = useState(isSaved);
  const menuOpen = Boolean(anchorEl);

  const isTop3 = rank !== undefined && rank >= 1 && rank <= 3;
  const topStyle = isTop3 ? TOP_3_STYLES[rank] : null;
  const hasTikTokUrl = !!video?.tiktokUrl;
  const hasKalodataUrl = !!video?.kalodataUrl;
  const hasThumbnail = !!video?.thumbnailUrl;

  // ---- handlers ----
  const handleCardClick = () => {
    if (!video) return;
    if (hasTikTokUrl) {
      window.open(video.tiktokUrl, "_blank", "noopener,noreferrer");
    }
    onClick?.(video);
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video) return;
    setSaved(!saved);
    onSave?.(video);
  };

  const handleOpenTikTok = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video || !hasTikTokUrl) return;
    window.open(video.tiktokUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenKalodata = () => {
    handleMenuClose();
    if (!video || !hasKalodataUrl) return;
    window.open(video.kalodataUrl, "_blank", "noopener,noreferrer");
  };

  const handleAddToCollection = () => {
    handleMenuClose();
    if (!video) return;
    onAddToCollection?.(video);
  };

  // ---- Loading / skeleton state ----
  if (isLoading || !video) {
    return (
      <Box
        aria-busy="true"
        aria-label="Carregando vídeo"
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(45, 212, 255, 0.08)",
        }}
      >
        {/* Skeleton preview area — same 9:16 as real card */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "9 / 16",
            background: "#0a0f18",
            borderRadius: "12px 12px 0 0",
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
                  "linear-gradient(90deg, transparent 0%, rgba(45,212,255,0.04) 50%, transparent 100%)",
                animation: "shimmer 2s infinite ease-in-out",
                transform: "translateX(-100%)",
              },
              "@keyframes shimmer": {
                "0%": { transform: "translateX(-100%)" },
                "100%": { transform: "translateX(100%)" },
              },
            }}
          />
        </Box>
        <Box sx={{ p: 1.5 }}>
          <Skeleton width="90%" height={16} sx={{ mb: 0.5 }} />
          <Skeleton width="55%" height={14} sx={{ mb: 1 }} />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton width={60} height={14} />
            <Skeleton width={50} height={14} />
          </Box>
        </Box>
      </Box>
    );
  }

  // ---- Main card ----
  return (
    <Box
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={
        hasTikTokUrl
          ? `Abrir vídeo: ${video.title}`
          : `Vídeo: ${video.title} (link indisponível)`
      }
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${topStyle ? topStyle.border : "rgba(45, 212, 255, 0.12)"}`,
        cursor: hasTikTokUrl ? "pointer" : "default",
        transition: "all 0.2s ease",
        ...(topStyle && { boxShadow: topStyle.glow }),
        "&:hover": hasTikTokUrl
          ? {
              borderColor: topStyle
                ? topStyle.color
                : "rgba(45, 212, 255, 0.35)",
              boxShadow: topStyle
                ? `${topStyle.glow}, 0 4px 20px rgba(0,0,0,0.3)`
                : "0 0 24px rgba(45, 212, 255, 0.12)",
              transform: "translateY(-2px)",
            }
          : {},
        "&:focus-visible": {
          outline: `2px solid ${topStyle?.color ?? "#2DD4FF"}`,
          outlineOffset: 2,
        },
      }}
    >
      {/* ======== Preview Area (9:16 thumbnail or placeholder) ======== */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "9 / 16",
          overflow: "hidden",
          borderRadius: "12px 12px 0 0",
          background:
            "linear-gradient(160deg, #0d1420 0%, #151c2a 50%, #0f1724 100%)",
        }}
      >
        {/* Real thumbnail image (from oEmbed) */}
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
              zIndex: 1,
            }}
          />
        )}

        {/* Dot pattern placeholder (visible when no thumbnail) */}
        {!hasThumbnail && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.06,
              backgroundImage:
                "radial-gradient(circle at 25% 25%, #2DD4FF 1px, transparent 1px), radial-gradient(circle at 75% 75%, #2DD4FF 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        )}

        {/* Rank badge — top left */}
        {rank !== undefined && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.4,
              borderRadius: 1.5,
              fontWeight: 700,
              fontSize: "0.75rem",
              color: topStyle ? topStyle.color : "#fff",
              background: topStyle ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.55)",
              backdropFilter: "blur(6px)",
              border: topStyle
                ? `1px solid ${topStyle.border}`
                : "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {topStyle && (
              <topStyle.icon sx={{ fontSize: 16, color: topStyle.color }} />
            )}
            #{rank}
          </Box>
        )}

        {/* Duration chip — top right */}
        {video.duration && video.duration !== "0:00" && (
          <Chip
            size="small"
            icon={<AccessTime sx={{ fontSize: 12 }} />}
            label={video.duration}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 5,
              height: 22,
              fontSize: "0.65rem",
              fontWeight: 600,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(6px)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              "& .MuiChip-icon": { color: "rgba(255,255,255,0.7)" },
            }}
          />
        )}

        {/* Bottom gradient for legibility */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        {/* ROAS badge — bottom left inside preview */}
        {video.roas >= 3 && (
          <Chip
            size="small"
            label={`ROAS ${video.roas.toFixed(1)}x`}
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              zIndex: 5,
              height: 22,
              fontSize: "0.65rem",
              fontWeight: 700,
              background: "rgba(45, 212, 255, 0.85)",
              color: "#06080F",
            }}
          />
        )}
      </Box>

      {/* ======== Content area ======== */}
      <Box sx={{ p: 1.5 }}>
        {/* Title — 2 lines */}
        <Typography
          sx={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#fff",
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: 0.5,
            minHeight: "2.24em",
          }}
        >
          {video.title}
        </Typography>

        {/* Creator handle */}
        <Typography
          sx={{
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.55)",
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {video.creatorHandle}
        </Typography>

        {/* Metrics row */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
          {/* Revenue */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            <Paid sx={{ fontSize: 14, color: "#2DD4FF" }} />
            <Typography
              sx={{ fontSize: "0.7rem", color: "#2DD4FF", fontWeight: 600 }}
            >
              {formatCurrency(video.revenueBRL)}
            </Typography>
          </Box>
          {/* Views */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            <Visibility sx={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }} />
            <Typography
              sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}
            >
              {formatNumber(video.views)}
            </Typography>
          </Box>
          {/* Sales */}
          {video.sales > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
              <ShoppingCart
                sx={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}
              />
              <Typography
                sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)" }}
              >
                {formatNumber(video.sales)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Action buttons row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 0.25 }}>
            <Tooltip title={saved ? "Remover dos salvos" : "Salvar"}>
              <IconButton
                size="small"
                onClick={handleSave}
                aria-label={saved ? "Remover dos salvos" : "Salvar vídeo"}
                sx={{
                  color: saved ? "#2DD4FF" : "rgba(255,255,255,0.45)",
                  "&:hover": { color: "#2DD4FF" },
                }}
              >
                {saved ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Tooltip>

            <Tooltip
              title={hasTikTokUrl ? "Abrir no TikTok" : "Link indisponível"}
            >
              <span>
                <IconButton
                  size="small"
                  disabled={!hasTikTokUrl}
                  onClick={handleOpenTikTok}
                  aria-label="Abrir no TikTok"
                  sx={{
                    color: "rgba(255,255,255,0.45)",
                    "&:hover": { color: "#2DD4FF" },
                    "&.Mui-disabled": { color: "rgba(255,255,255,0.15)" },
                  }}
                >
                  <OpenInNew sx={{ fontSize: 16 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          <IconButton
            size="small"
            onClick={handleMenuClick}
            aria-label="Mais opções"
            aria-controls={menuOpen ? "video-card-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
            sx={{
              color: "rgba(255,255,255,0.45)",
              "&:hover": { color: "#2DD4FF" },
            }}
          >
            <MoreVert sx={{ fontSize: 16 }} />
          </IconButton>

          <Menu
            id="video-card-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            MenuListProps={{ "aria-labelledby": "more-options-button" }}
            PaperProps={{
              sx: {
                background: "#0A0F18",
                border: "1px solid rgba(45, 212, 255, 0.18)",
                "& .MuiMenuItem-root": {
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.85)",
                  gap: 1.5,
                  "&:hover": { background: "rgba(45, 212, 255, 0.08)" },
                },
              },
            }}
          >
            <MenuItem onClick={handleAddToCollection}>
              <FolderOpen sx={{ fontSize: 16 }} />
              Adicionar à coleção
            </MenuItem>
            <MenuItem onClick={handleOpenKalodata} disabled={!hasKalodataUrl}>
              <OpenInNew sx={{ fontSize: 16 }} />
              Abrir no Kalodata
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
}

export default VideoCard;
