"use client";

import { Box, Container, Typography, Card } from "@mui/material";
import { BookmarkBorder } from "@mui/icons-material";

export default function VideosSalvosPage() {
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
          Itens que você marcou para revisar depois.
        </Typography>
      </Box>

      {/* Empty State */}
      <Card
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
      </Card>
    </Container>
  );
}
