"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography, Button, CircularProgress, Grid } from "@mui/material";
import { DashboardHeader } from "@/app/components/dashboard/DashboardHeader";
import { VideoCardPro } from "@/app/components/cards/VideoCardPro";
import type { VideoDTO } from "@/lib/types/kalodata";
import { normalizeRange, type TimeRange } from "@/lib/filters/timeRange";
import { ExpandMore } from "@mui/icons-material";

function VideosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoDTO[]>([]);
  const [allVideos, setAllVideos] = useState<VideoDTO[]>([]);
  const [page, setPage] = useState(1);

  // Read from URL
  const timeRange = normalizeRange(searchParams.get("range"));
  const searchQuery = searchParams.get("q") || "";
  const pageSize = 24; // Carregar 24 por vez

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPage(1);

    try {
      // Fetch sem limit hardcoded - backend retorna o que tiver
      const params = new URLSearchParams({ range: timeRange });
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/kalodata/videos?${params}`);
      const json = await res.json();

      const items: VideoDTO[] = json?.data?.items ?? [];
      setAllVideos(items);
      setVideos(items.slice(0, pageSize));

      if (json?.data?.error) {
        console.warn("Videos API returned error:", json.data.error);
      }
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      setError("Erro ao carregar vídeos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [timeRange, searchQuery, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const start = nextPage * pageSize;
    const end = start + pageSize;
    const moreVideos = allVideos.slice(start, end);

    setTimeout(() => {
      setVideos((prev) => [...prev, ...moreVideos]);
      setPage(nextPage);
      setLoadingMore(false);
    }, 300);
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    const params = new URLSearchParams();
    params.set("range", range);
    if (searchQuery) params.set("q", searchQuery);
    router.push(`/app/videos?${params.toString()}`);
  };

  const handleSearchChange = (query: string) => {
    const params = new URLSearchParams();
    params.set("range", timeRange);
    if (query) params.set("q", query);
    router.push(`/app/videos?${params.toString()}`);
  };

  const handleInsightClick = (video: VideoDTO) => {
    console.log("Insight clicked for", video.id);
    // TODO: Implementar modal de insight
  };

  const handleShareClick = (video: VideoDTO) => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Confira este vídeo: ${video.title}`,
        url: video.tiktokUrl || window.location.href,
      });
    } else {
      // Fallback: copiar URL
      const url = video.tiktokUrl || window.location.href;
      navigator.clipboard.writeText(url);
      console.log("Link copiado:", url);
    }
  };

  const hasMore = videos.length < allVideos.length;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Fixed Header */}
      <Box sx={{ flexShrink: 0 }}>
        <Box sx={{ mb: 1.5 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#fff",
              mb: 0.25,
              lineHeight: 1.3,
            }}
          >
            Vídeos em Alta
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.3,
            }}
          >
            {allVideos.length > 0
              ? `${allVideos.length} vídeos • Mostrando ${videos.length}`
              : "Explorando os vídeos mais performáticos"}
          </Typography>
        </Box>
        <DashboardHeader
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onRefresh={fetchData}
          loading={loading}
        />
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", mt: 2 }}>
        {/* Error State */}
        {error && (
          <Box
            role="alert"
            aria-live="assertive"
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#ef4444",
              fontSize: "0.8125rem",
            }}
          >
            {error}
          </Box>
        )}

        {/* Video Grid */}
        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {videos.map((video, idx) => (
            <Grid item xs={6} sm={6} md={4} lg={2.4} key={video.id}>
              <VideoCardPro
                video={video}
                rank={idx + 1}
                onShareClick={handleShareClick}
              />
            </Grid>
          ))}

          {/* Loading skeletons */}
          {loading &&
            Array.from({ length: 12 }).map((_, idx) => (
              <Grid item xs={6} sm={6} md={4} lg={2.4} key={`skeleton-${idx}`}>
                <VideoCardPro isLoading />
              </Grid>
            ))}
        </Grid>

        {/* Load More Button */}
        {!loading && hasMore && videos.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
              mb: 2,
            }}
          >
            <Button
              variant="outlined"
              size="large"
              endIcon={
                loadingMore ? <CircularProgress size={16} /> : <ExpandMore />
              }
              onClick={handleLoadMore}
              disabled={loadingMore}
              sx={{
                px: 4,
                py: 1.25,
                fontSize: "0.875rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 3,
                borderColor: "rgba(45,212,255,0.3)",
                color: "#2DD4FF",
                transition: "all 180ms ease",
                "&:hover": {
                  borderColor: "#2DD4FF",
                  background: "rgba(45,212,255,0.08)",
                },
              }}
            >
              {loadingMore ? "Carregando..." : "Carregar mais"}
            </Button>
          </Box>
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <Typography sx={{ fontSize: "0.95rem" }}>
              Nenhum vídeo encontrado
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function VideosPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Carregando...</Typography>
        </Box>
      }
    >
      <VideosContent />
    </Suspense>
  );
}
