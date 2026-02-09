"use client";

import { useState, useCallback, useMemo } from "react";
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
  PlayArrow,
  MoreVert,
  FolderOpen,
  TrendingUp,
  Visibility,
  ShoppingCart,
  BrokenImage,
} from "@mui/icons-material";
import type { VideoDTO } from "@/lib/types/kalodata";
import { formatCurrency, formatNumber } from "@/lib/kalodata/parser";
import {
  extractTikTokVideoId,
  buildTikTokEmbedUrl,
} from "@/lib/kalodata/tiktok";
import { ThumbnailSkeleton, Skeleton } from "@/app/components/ui/Skeleton";

interface VideoCardProps {
  video?: VideoDTO;
  onSave?: (video: VideoDTO) => void;
  onAddToCollection?: (video: VideoDTO) => void;
  onClick?: (video: VideoDTO) => void;
  isSaved?: boolean;
  isLoading?: boolean;
}

/**
 * VideoCard component that displays a video thumbnail with metadata.
 * Supports loading state with skeleton placeholders and graceful image error handling.
 */
export function VideoCard({
  video,
  onSave,
  onAddToCollection,
  onClick,
  isSaved = false,
  isLoading = false,
}: VideoCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [saved, setSaved] = useState(isSaved);
  const [embedError, setEmbedError] = useState(false);
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const menuOpen = Boolean(anchorEl);

  // Extract TikTok video ID from URL (memoized)
  const videoId = useMemo(() => {
    return video?.tiktokUrl ? extractTikTokVideoId(video.tiktokUrl) : null;
  }, [video?.tiktokUrl]);

  // Build embed URL if we have a valid video ID
  const embedUrl = useMemo(() => {
    return videoId ? buildTikTokEmbedUrl(videoId) : null;
  }, [videoId]);

  // Show fallback placeholder when: loading, no video, no embed URL, or embed errored
  const showFallback = isLoading || !video || !embedUrl || embedError;

  const handleEmbedLoad = useCallback(() => {
    setEmbedLoaded(true);
  }, []);

  const handleEmbedError = useCallback(() => {
    setEmbedError(true);
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSave = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!video) return;
    setSaved(!saved);
    onSave?.(video);
  };

  const handleAddToCollection = () => {
    handleMenuClose();
    if (!video) return;
    onAddToCollection?.(video);
  };

  const handleOpenTikTok = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!video) return;
    window.open(video.tiktokUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenKalodata = () => {
    handleMenuClose();
    if (!video) return;
    window.open(video.kalodataUrl, "_blank", "noopener,noreferrer");
  };

  // Loading or no video: show full skeleton card
  if (isLoading || !video) {
    return (
      <Box
        aria-busy="true"
        aria-label="Carregando vídeo"
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(45, 212, 255, 0.08)",
        }}
      >
        <ThumbnailSkeleton />
        <Box sx={{ p: 2 }}>
          <Skeleton width="90%" height={20} sx={{ mb: 0.5 }} />
          <Skeleton width="65%" height={20} sx={{ mb: 1 }} />
          <Skeleton width="40%" height={16} sx={{ mb: 1.5 }} />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton width={70} height={16} />
            <Skeleton width={60} height={16} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      onClick={() => onClick?.(video)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(video);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes do vídeo: ${video.title}`}
      aria-busy={!embedLoaded && !showFallback}
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(45, 212, 255, 0.12)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "rgba(45, 212, 255, 0.3)",
          boxShadow: "0 0 24px rgba(45, 212, 255, 0.12)",
          transform: "translateY(-2px)",
        },
        "&:focus-visible": {
          outline: "2px solid #2DD4FF",
          outlineOffset: 2,
        },
      }}
    >
      {/* TikTok Embed or Fallback */}
      <Box
        sx={{
          position: "relative",
          aspectRatio: "9/16",
          maxHeight: 280,
          background: "#0a0f18",
          overflow: "hidden",
        }}
      >
        {/* Show embed iframe when we have a valid embed URL and no error */}
        {embedUrl && !embedError && (
          <Box
            component="iframe"
            src={embedUrl}
            onLoad={handleEmbedLoad}
            onError={handleEmbedError}
            allow="encrypted-media; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`TikTok video: ${video?.title || "Video"}`}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
              opacity: embedLoaded ? 1 : 0,
              transition: "opacity 0.3s ease",
              zIndex: 2,
            }}
          />
        )}

        {/* Loading skeleton while embed loads */}
        {embedUrl && !embedLoaded && !embedError && (
          <Box sx={{ position: "absolute", inset: 0, zIndex: 1 }}>
            <ThumbnailSkeleton />
          </Box>
        )}

        {/* Fallback when no embed URL or embed errored */}
        {showFallback && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              background: "linear-gradient(135deg, #0a0f18 0%, #151c2a 100%)",
              zIndex: 1,
            }}
          >
            {embedError ? (
              <BrokenImage
                sx={{ fontSize: 40, color: "rgba(255,255,255,0.3)" }}
              />
            ) : (
              <PlayArrow
                sx={{ fontSize: 48, color: "rgba(255,255,255,0.4)" }}
              />
            )}
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.4)",
                textAlign: "center",
                px: 2,
              }}
            >
              {embedError
                ? "Embed indisponível"
                : "Player TikTok não disponível"}
            </Typography>
            {video && (
              <Tooltip title="Abrir no TikTok">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      video.tiktokUrl,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  sx={{
                    color: "#2DD4FF",
                    border: "1px solid rgba(45, 212, 255, 0.3)",
                    "&:hover": {
                      background: "rgba(45, 212, 255, 0.1)",
                    },
                  }}
                >
                  <OpenInNew sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}

        {/* Duration chip */}
        {video?.duration && video.duration !== "0:00" && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              px: 1,
              py: 0.25,
              borderRadius: 1,
              background: "rgba(0,0,0,0.75)",
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "#fff",
              zIndex: 3,
            }}
          >
            {video.duration}
          </Box>
        )}

        {/* ROAS chip for high performers */}
        {video && video.roas >= 3 && (
          <Chip
            size="small"
            icon={<TrendingUp sx={{ fontSize: 14 }} />}
            label={`ROAS ${video.roas.toFixed(1)}x`}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              height: 24,
              fontSize: "0.7rem",
              fontWeight: 600,
              background: "rgba(45, 212, 255, 0.9)",
              color: "#06080F",
              zIndex: 3,
              "& .MuiChip-icon": { color: "#06080F" },
            }}
          />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Typography
          sx={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#fff",
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: 1,
            minHeight: "2.8em",
          }}
        >
          {video.title}
        </Typography>

        <Typography
          sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", mb: 1.5 }}
        >
          {video.creatorHandle}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ShoppingCart sx={{ fontSize: 14, color: "#2DD4FF" }} />
            <Typography
              sx={{ fontSize: "0.75rem", color: "#2DD4FF", fontWeight: 600 }}
            >
              {formatCurrency(video.revenueBRL)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Visibility sx={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }} />
            <Typography
              sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}
            >
              {formatNumber(video.views)}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title={saved ? "Remover dos salvos" : "Salvar"}>
              <IconButton
                size="small"
                onClick={handleSave}
                aria-label={saved ? "Remover dos salvos" : "Salvar vídeo"}
                sx={{
                  color: saved ? "#2DD4FF" : "rgba(255,255,255,0.5)",
                  "&:hover": { color: "#2DD4FF" },
                }}
              >
                {saved ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Abrir no TikTok">
              <IconButton
                size="small"
                onClick={handleOpenTikTok}
                aria-label="Abrir vídeo no TikTok"
                sx={{
                  color: "rgba(255,255,255,0.5)",
                  "&:hover": { color: "#2DD4FF" },
                }}
              >
                <OpenInNew sx={{ fontSize: 18 }} />
              </IconButton>
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
              color: "rgba(255,255,255,0.5)",
              "&:hover": { color: "#2DD4FF" },
            }}
          >
            <MoreVert sx={{ fontSize: 18 }} />
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
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.85)",
                  gap: 1.5,
                  "&:hover": { background: "rgba(45, 212, 255, 0.08)" },
                },
              },
            }}
          >
            <MenuItem onClick={handleAddToCollection}>
              <FolderOpen sx={{ fontSize: 18 }} />
              Adicionar à coleção
            </MenuItem>
            <MenuItem onClick={handleOpenKalodata}>
              <OpenInNew sx={{ fontSize: 18 }} />
              Abrir no Kalodata
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
}

export default VideoCard;
