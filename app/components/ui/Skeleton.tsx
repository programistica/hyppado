"use client";

import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: "rectangular" | "circular" | "text";
  aspectRatio?: string;
  borderRadius?: string | number;
  className?: string;
  sx?: SxProps<Theme>;
}

/**
 * Skeleton component with animated shimmer effect for dark mode.
 * Uses CSS keyframes for a smooth, performant animation.
 */
export function Skeleton({
  width = "100%",
  height,
  variant = "rectangular",
  aspectRatio,
  borderRadius,
  className,
  sx = {},
}: SkeletonProps) {
  const getBorderRadius = () => {
    if (variant === "circular") return "50%";
    if (variant === "text") return 4;
    return borderRadius ?? 12;
  };

  const computedHeight = variant === "text" ? height || "1em" : height;

  return (
    <Box
      aria-hidden="true"
      className={className}
      sx={[
        {
          position: "relative",
          width,
          height: computedHeight || (aspectRatio ? undefined : "100%"),
          aspectRatio,
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.04)",
          borderRadius: getBorderRadius(),
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(45, 212, 255, 0.06) 20%,
              rgba(45, 212, 255, 0.12) 50%,
              rgba(45, 212, 255, 0.06) 80%,
              transparent 100%
            )`,
            animation: "shimmer 2s infinite ease-in-out",
            transform: "translateX(-100%)",
          },
          "@keyframes shimmer": {
            "0%": { transform: "translateX(-100%)" },
            "100%": { transform: "translateX(100%)" },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}

/**
 * Thumbnail skeleton specifically designed for video cards.
 * Maintains 16:9 aspect ratio with rounded corners matching the card design.
 */
export function ThumbnailSkeleton({ className }: { className?: string }) {
  return (
    <Box
      aria-hidden="true"
      className={className}
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "9 / 16",
        overflow: "hidden",
        borderRadius: "12px 12px 0 0",
        background: "#0a0f18",
        border: "1px solid rgba(45, 212, 255, 0.08)",
        borderBottom: "none",
        // Shimmer effect
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            90deg,
            transparent 0%,
            rgba(45, 212, 255, 0.05) 20%,
            rgba(45, 212, 255, 0.1) 50%,
            rgba(45, 212, 255, 0.05) 80%,
            transparent 100%
          )`,
          animation: "shimmer 2s infinite ease-in-out",
          transform: "translateX(-100%)",
        },
        "@keyframes shimmer": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      }}
    >
      {/* Play icon placeholder */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 0,
            height: 0,
            borderLeft: "12px solid rgba(255, 255, 255, 0.15)",
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            marginLeft: "4px",
          }}
        />
      </Box>
    </Box>
  );
}

export default Skeleton;
