"use client";

import { useState, useEffect } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { Inventory2 } from "@mui/icons-material";
import { ProductCard } from "@/app/components/cards/ProductCard";
import { getSavedProducts } from "@/lib/storage/saved";
import type { ProductDTO } from "@/lib/types/kalodata";

export default function ProdutosSalvosPage() {
  const [savedProducts, setSavedProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved products from localStorage
    const loadSavedProducts = () => {
      const saved = getSavedProducts();
      setSavedProducts(saved.map((item) => item.product));
      setLoading(false);
    };

    loadSavedProducts();

    // Listen to storage events (for cross-tab sync)
    const handleStorageChange = () => {
      loadSavedProducts();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isEmpty = !loading && savedProducts.length === 0;

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
          Produtos salvos
        </Typography>
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {!isEmpty
            ? `${savedProducts.length} ${savedProducts.length === 1 ? "produto salvo" : "produtos salvos"}`
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
            <Inventory2
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
                Você ainda não salvou nenhum produto.
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

      {/* Products Grid */}
      {!isEmpty && (
        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {savedProducts.map((product) => (
            <Grid item xs={6} sm={6} md={4} lg={2.4} key={product.id}>
              <ProductCard
                product={product}
                onViewDetails={(p) => {
                  if (p.kalodataUrl) {
                    window.open(p.kalodataUrl, "_blank", "noopener,noreferrer");
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
