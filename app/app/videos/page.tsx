"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Container, Typography } from "@mui/material";
import { VideoGrid } from "@/app/components/dashboard/VideoGrid";
import { DashboardHeader } from "@/app/components/dashboard/DashboardHeader";
import type { TimeRange, VideoDTO } from "@/lib/types/kalodata";

export default function VideosPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoDTO[]>([]);
  const [savedVideoIds, setSavedVideoIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ range: timeRange, limit: "10" });
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/kalodata/videos?${params}`);
      const json = await res.json();

      const items: VideoDTO[] = json?.data?.items ?? [];
      setVideos(items);

      if (json?.data?.error) {
        console.warn("Videos API returned error:", json.data.error);
      }
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      setError("Erro ao carregar vídeos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [timeRange, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            Top 10 Vídeos
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.3,
            }}
          >
            Vídeos em alta no TikTok Shop — dados dos últimos 7 dias
          </Typography>
        </Box>
        <DashboardHeader
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
        <VideoGrid
          videos={videos}
          loading={loading}
          error={error}
          savedVideoIds={savedVideoIds}
          onVideoSave={(video) => {
            setSavedVideoIds((prev) => {
              const newSet = new Set(prev);
              if (newSet.has(video.id)) {
                newSet.delete(video.id);
              } else {
                newSet.add(video.id);
              }
              return newSet;
            });
          }}
        />
      </Box>
    </Box>
  );
}
