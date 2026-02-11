"use client";

import { Box, Container, Typography, Card, Stack } from "@mui/material";
import { SubtitlesOutlined, TerminalOutlined } from "@mui/icons-material";

export default function AssinaturaPage() {
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
          Assinatura
        </Typography>
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Status do seu plano e limites do período.
        </Typography>
      </Box>

      {/* Quota Display */}
      <Card
        sx={{
          borderRadius: 3,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(45, 212, 255, 0.08)",
          p: 4,
        }}
      >
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#fff",
            mb: 3,
          }}
        >
          Uso Atual
        </Typography>

        <Stack spacing={3}>
          {/* Transcripts */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2.5,
              borderRadius: 2,
              background: "rgba(45, 212, 255, 0.05)",
              border: "1px solid rgba(45, 212, 255, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: "rgba(45, 212, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SubtitlesOutlined sx={{ color: "#2DD4FF", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  Transcrições
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Limite mensal
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#2DD4FF",
              }}
            >
              — / 40
            </Typography>
          </Box>

          {/* Scripts */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2.5,
              borderRadius: 2,
              background: "rgba(156, 39, 176, 0.05)",
              border: "1px solid rgba(156, 39, 176, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: "rgba(156, 39, 176, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TerminalOutlined sx={{ color: "#CE93D8", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  Roteiros
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Limite mensal
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#CE93D8",
              }}
            >
              — / 70
            </Typography>
          </Box>
        </Stack>

        {/* Note */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.4)",
              fontStyle: "italic",
            }}
          >
            Os limites exibidos dependem da integração com o provedor de
            pagamento.
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}
