"use client";

import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  Tooltip,
} from "@mui/material";
import { EmailOutlined, HelpOutline } from "@mui/icons-material";

export default function SuportePage() {
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
          Suporte
        </Typography>
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Abra um chamado ou entre em contato.
        </Typography>
      </Box>

      {/* Support Card */}
      <Card
        sx={{
          borderRadius: 3,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(45, 212, 255, 0.08)",
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              background: "rgba(45, 212, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HelpOutline sx={{ fontSize: 32, color: "#2DD4FF" }} />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#fff",
                mb: 1,
              }}
            >
              Precisa de ajuda?
            </Typography>
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.6)",
                maxWidth: 500,
              }}
            >
              Entre em contato com nossa equipe de suporte para resolver
              dúvidas, reportar problemas ou solicitar recursos.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Email button - disabled with tooltip since no email configured */}
            <Tooltip title="E-mail não configurado" arrow placement="top">
              <span>
                <Button
                  variant="contained"
                  disabled
                  startIcon={<EmailOutlined />}
                  sx={{
                    background: "rgba(45, 212, 255, 0.15)",
                    color: "#2DD4FF",
                    border: "1px solid rgba(45, 212, 255, 0.3)",
                    "&:hover": {
                      background: "rgba(45, 212, 255, 0.25)",
                    },
                    "&.Mui-disabled": {
                      background: "rgba(255,255,255,0.03)",
                      color: "rgba(255,255,255,0.3)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Abrir e-mail
                </Button>
              </span>
            </Tooltip>
          </Box>

          {/* Additional info */}
          <Box
            sx={{
              mt: 2,
              p: 2.5,
              borderRadius: 2,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              width: "100%",
              maxWidth: 500,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.5)",
                mb: 1,
              }}
            >
              <strong>Dicas:</strong>
            </Typography>
            <Box
              component="ul"
              sx={{
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.5)",
                pl: 2.5,
                m: 0,
                "& li": { mb: 0.5 },
              }}
            >
              <li>Descreva o problema com o máximo de detalhes possível</li>
              <li>Inclua capturas de tela se aplicável</li>
              <li>Informe o navegador e dispositivo que você está usando</li>
            </Box>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}
