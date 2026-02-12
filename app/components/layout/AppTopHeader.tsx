"use client";

import { Box } from "@mui/material";
import { CountryBadge } from "@/app/components/ui/CountryBadge";

/**
 * AppTopHeader - Header global discreto para páginas /app/*
 *
 * Características:
 * - Altura compacta (44-52px)
 * - Fundo glass/blur sutil
 * - CountryBadge BR fixo no canto direito
 * - Sticky no topo do container de conteúdo
 */
export function AppTopHeader() {
  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        height: { xs: 44, md: 48 },
        minHeight: { xs: 44, md: 48 },
        px: { xs: 2, md: 2.5 },
        background: "rgba(6, 8, 15, 0.75)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
      }}
    >
      {/* Left side - pode ser usado para breadcrumbs futuramente */}
      <Box sx={{ flex: 1 }} />

      {/* Right side - Country Badge */}
      <CountryBadge size="md" />
    </Box>
  );
}
