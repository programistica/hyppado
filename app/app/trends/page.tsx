"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { ProductTable } from "@/app/components/dashboard/DataTable";
import { DashboardHeader } from "@/app/components/dashboard/DashboardHeader";
import type { ProductDTO } from "@/lib/types/kalodata";
import { normalizeRange, type TimeRange } from "@/lib/filters/timeRange";

function TrendsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProducts, setNewProducts] = useState<ProductDTO[]>([]);

  // Read from URL
  const timeRange = normalizeRange(searchParams.get("range"));
  const searchQuery = searchParams.get("q") || "";

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        range: timeRange,
        limit: "5",
        filter: "new",
      });
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/kalodata/products?${params}`);
      const json = await res.json();

      const items: ProductDTO[] = json?.data?.items ?? [];
      setNewProducts(items);

      if (json?.data?.error) {
        console.warn("New Products API returned error:", json.data.error);
      }
    } catch (err) {
      console.error("Failed to fetch new products:", err);
      setError("Erro ao carregar novos produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [timeRange, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTimeRangeChange = (range: TimeRange) => {
    const params = new URLSearchParams();
    params.set("range", range);
    if (searchQuery) params.set("q", searchQuery);
    router.push(`/app/trends?${params.toString()}`);
  };

  const handleSearchChange = (query: string) => {
    const params = new URLSearchParams();
    params.set("range", timeRange);
    if (query) params.set("q", query);
    router.push(`/app/trends?${params.toString()}`);
  };

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
            Tendências
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.3,
            }}
          >
            Novos produtos detectados no TikTok Shop — dados dos últimos 7 dias
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

        {/* New Products Table */}
        <ProductTable
          products={newProducts}
          loading={loading}
          title="Novos Produtos Detectados"
          showNewBadge
        />
      </Box>
    </Box>
  );
}

export default function TrendsPage() {
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
      <TrendsContent />
    </Suspense>
  );
}
