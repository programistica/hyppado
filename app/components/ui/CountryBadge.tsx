"use client";

import { Box, Typography } from "@mui/material";

interface CountryBadgeProps {
  /** Tamanho: 'sm' para mobile (28px), 'md' para desktop (32px) */
  size?: "sm" | "md";
}

/**
 * CountryBadge - Badge visual fixo mostrando "BR" com bandeira
 * Somente visual, sem interação (sem dropdown/onClick)
 *
 * Props:
 * - size: 'sm' (mobile) | 'md' (desktop, default)
 */
export function CountryBadge({ size = "md" }: CountryBadgeProps) {
  const isSm = size === "sm";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: isSm ? 0.4 : 0.5,
        px: isSm ? 0.9 : 1.1,
        py: isSm ? 0.35 : 0.45,
        height: isSm ? 28 : 32,
        borderRadius: 1.5,
        background: "rgba(10, 15, 24, 0.65)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(45, 212, 255, 0.15)",
        boxShadow: "0 0 8px rgba(45, 212, 255, 0.08)",
        userSelect: "none",
        cursor: "default",
        transition: "border-color 150ms ease",
        "&:hover": {
          borderColor: "rgba(45, 212, 255, 0.22)",
        },
      }}
    >
      {/* Brazil Flag Emoji */}
      <Typography
        component="span"
        sx={{
          fontSize: isSm ? "0.8rem" : "0.9rem",
          lineHeight: 1,
        }}
      >
        🇧🇷
      </Typography>
      <Typography
        sx={{
          fontSize: isSm ? "0.65rem" : "0.7rem",
          fontWeight: 700,
          color: "rgba(255,255,255,0.75)",
          letterSpacing: "0.03em",
        }}
      >
        BR
      </Typography>
    </Box>
  );
}
