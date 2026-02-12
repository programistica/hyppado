"use client";

import { useState, useEffect } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { BookmarkBorder } from "@mui/icons-material";
import { VideoCardPro } from "@/app/components/cards/VideoCardPro";
import { getSavedVideos } from "@/lib/storage/saved";
import type { VideoDTO } from "@/lib/types/kalodata";

export default function VideosSalvosPage() {
  const [savedVideos, setSavedVideos] = useState<VideoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved videos from localStorage
    const loadSavedVideos = () => {
      const saved = getSavedVideos();
      setSavedVideos(saved.map((item) => item.video));
      setLoading(false);
    };

    loadSavedVideos();

    // Listen to storage events (for cross-tab sync)
    const handleStorageChange = () => {
      loadSavedVideos();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isEmpty = !loading && savedVideos.length === 0;

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 700,
            color: "#fff",
            mb: 0.5,
          }}
        >
          Vídeos salvos
        </Typography>
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {!isEmpty
            ? `${savedVideos.length} ${savedVideos.length === 1 ? "vídeo salvo" : "vídeos salvos"}`
            : "Itens que você marcou para revisar depois."}
        </Typography>
      </Box>

      {/* Empty State */}
      {isEmpty && (
        <Box
          sx={{
            borderRadius: 3,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(45, 212, 255, 0.08)",
            p: 6,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <BookmarkBorder
              sx={{
                fontSize: 64,
                color: "rgba(255,255,255,0.15)",
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                  mb: 1,
                }}
              >
                Você ainda não salvou nenhum vídeo.
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Quando você salvar, eles aparecerão aqui.
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Videos Grid */}
      {!isEmpty && (
        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {savedVideos.map((video) => (
            <Grid item xs={6} sm={6} md={4} lg={2.4} key={video.id}>
              <VideoCardPro
                video={video}
                onShareClick={(v) => {
                  if (navigator.share && v.tiktokUrl) {
                    navigator.share({
                      title: v.title,
                      url: v.tiktokUrl,
                    });
                  } else if (v.tiktokUrl) {
                    navigator.clipboard.writeText(v.tiktokUrl);
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
