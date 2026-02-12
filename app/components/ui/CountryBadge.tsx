"use client";

import { Box, Typography } from "@mui/material";

/**
 * CountryBadge - Badge visual fixo mostrando "BR" com ícone da bandeira
 * Somente visual, sem interação (sem dropdown/onClick)
 */
export function CountryBadge() {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1.25,
        py: 0.5,
        borderRadius: 2,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(45, 212, 255, 0.12)",
        userSelect: "none",
      }}
    >
      {/* Brazil Flag Emoji */}
      <Typography
        component="span"
        sx={{
          fontSize: "0.875rem",
          lineHeight: 1,
        }}
      >
        🇧🇷
      </Typography>
      <Typography
        sx={{
          fontSize: "0.7rem",
          fontWeight: 600,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.02em",
        }}
      >
        BR
      </Typography>
    </Box>
  );
}
