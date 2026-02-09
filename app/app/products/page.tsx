"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Container, Typography } from "@mui/material";
import { ProductTable } from "@/app/components/dashboard/DataTable";
import { DashboardHeader } from "@/app/components/dashboard/DashboardHeader";
import type { TimeRange, ProductDTO } from "@/lib/types/kalodata";

export default function ProductsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductDTO[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ range: timeRange, limit: "10" });
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/kalodata/products?${params}`);
      const json = await res.json();

      const items: ProductDTO[] = json?.data?.items ?? [];
      setProducts(items);

      if (json?.data?.error) {
        console.warn("Products API returned error:", json.data.error);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Erro ao carregar produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [timeRange, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "1.5rem", md: "1.75rem" },
              fontWeight: 700,
              color: "#fff",
              mb: 0.5,
            }}
          >
            Produtos
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Produtos em alta no TikTok Shop — dados dos últimos 7 dias
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

      {/* Error State */}
      {error && (
        <Box
          role="alert"
          aria-live="assertive"
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 2,
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            color: "#ef4444",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </Box>
      )}

      {/* Product Table - Top Products Only */}
      <ProductTable
        products={products}
        loading={loading}
        title="Top 10 Produtos"
      />
    </Container>
  );
}
