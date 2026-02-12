"use client";

import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  Grid,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  EmailOutlined,
  HelpOutline,
  WhatsApp,
  CheckCircle,
  Article,
  Schedule,
} from "@mui/icons-material";
import {
  mockSupportContact,
  mockSuggestedArticles,
} from "../../lib/mocks/supportMock";

// ============================================
// Design Tokens
// ============================================

const UI = {
  card: {
    bg: "rgba(10,15,24,0.6)",
    border: "rgba(255,255,255,0.06)",
    borderHover: "rgba(45,212,255,0.12)",
    radius: 3,
  },
  text: {
    primary: "rgba(255,255,255,0.90)",
    secondary: "rgba(255,255,255,0.65)",
    hint: "rgba(255,255,255,0.45)",
  },
  accent: "#2DD4FF",
  success: "#4CAF50",
};

// ============================================
// Main Component
// ============================================

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
            color: UI.text.primary,
            mb: 0.5,
          }}
        >
          Suporte
        </Typography>
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: UI.text.secondary,
          }}
        >
          Entre em contato conosco ou consulte a central de ajuda.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Canais de Contato */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: UI.card.radius,
              background: UI.card.bg,
              border: `1px solid ${UI.card.border}`,
              p: { xs: 2, md: 3 },
              height: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: UI.text.primary,
                mb: 2,
              }}
            >
              Canais de Contato
            </Typography>

            <Stack spacing={2}>
              {/* Email */}
              <Button
                component="a"
                href={`mailto:${mockSupportContact.supportEmail}`}
                variant="outlined"
                fullWidth
                startIcon={<EmailOutlined />}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderColor: UI.card.border,
                  color: UI.text.primary,
                  py: 1.5,
                  "&:hover": {
                    borderColor: UI.accent,
                    backgroundColor: "rgba(45,212,255,0.05)",
                  },
                }}
              >
                <Box sx={{ textAlign: "left", flex: 1 }}>
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    Email
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.75rem", color: UI.text.secondary }}
                  >
                    {mockSupportContact.supportEmail}
                  </Typography>
                </Box>
              </Button>

              {/* WhatsApp */}
              {mockSupportContact.whatsapp && (
                <Button
                  component="a"
                  href={`https://wa.me/${mockSupportContact.whatsapp.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  fullWidth
                  startIcon={<WhatsApp />}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    borderColor: UI.card.border,
                    color: UI.text.primary,
                    py: 1.5,
                    "&:hover": {
                      borderColor: UI.accent,
                      backgroundColor: "rgba(45,212,255,0.05)",
                    },
                  }}
                >
                  <Box sx={{ textAlign: "left", flex: 1 }}>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      WhatsApp
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.75rem", color: UI.text.secondary }}
                    >
                      {mockSupportContact.whatsapp.label}
                    </Typography>
                  </Box>
                </Button>
              )}

              {/* Central de Ajuda */}
              <Button
                component="a"
                href={mockSupportContact.helpCenterUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                fullWidth
                startIcon={<HelpOutline />}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderColor: UI.card.border,
                  color: UI.text.primary,
                  py: 1.5,
                  "&:hover": {
                    borderColor: UI.accent,
                    backgroundColor: "rgba(45,212,255,0.05)",
                  },
                }}
              >
                <Box sx={{ textAlign: "left", flex: 1 }}>
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    Central de Ajuda
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.75rem", color: UI.text.secondary }}
                  >
                    Tutoriais e documentação
                  </Typography>
                </Box>
              </Button>
            </Stack>

            {/* Status do Sistema */}
            <Box
              sx={{
                mt: 3,
                pt: 2,
                borderTop: `1px solid ${UI.card.border}`,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <CheckCircle sx={{ fontSize: 16, color: UI.success }} />
                <Typography sx={{ fontSize: "0.75rem", color: UI.text.hint }}>
                  Status do Sistema
                </Typography>
              </Stack>
              <Chip
                label={mockSupportContact.systemStatus.label}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  backgroundColor: "rgba(76,175,80,0.15)",
                  color: UI.success,
                  border: "none",
                }}
              />
            </Box>

            {/* Horário de Atendimento */}
            <Box sx={{ mt: 2 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Schedule sx={{ fontSize: 16, color: UI.text.hint }} />
                <Typography sx={{ fontSize: "0.75rem", color: UI.text.hint }}>
                  Horário de Atendimento
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: UI.text.secondary,
                  ml: 3,
                }}
              >
                {mockSupportContact.businessHours}
              </Typography>
            </Box>

            {/* SLA */}
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: "0.75rem", color: UI.text.hint }}>
                Tempo de Resposta
              </Typography>
              <Stack direction="column" spacing={1} sx={{ mt: 1 }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: UI.text.secondary,
                    }}
                  >
                    <strong>Primeira resposta:</strong>{" "}
                    {mockSupportContact.avgFirstResponse}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: UI.text.secondary,
                    }}
                  >
                    <strong>Resolução:</strong>{" "}
                    {mockSupportContact.avgResolution}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* Artigos Sugeridos */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: UI.card.radius,
              background: UI.card.bg,
              border: `1px solid ${UI.card.border}`,
              p: { xs: 2, md: 3 },
              height: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: UI.text.primary,
                mb: 2,
              }}
            >
              Artigos Populares
            </Typography>

            <List disablePadding>
              {mockSuggestedArticles.map((article, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  sx={{
                    mb: index < mockSuggestedArticles.length - 1 ? 2 : 0,
                    pb: index < mockSuggestedArticles.length - 1 ? 2 : 0,
                    borderBottom:
                      index < mockSuggestedArticles.length - 1
                        ? `1px solid ${UI.card.border}`
                        : "none",
                  }}
                >
                  <Article
                    sx={{
                      fontSize: 20,
                      color: UI.accent,
                      mr: 1.5,
                      flexShrink: 0,
                    }}
                  />
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: UI.text.primary,
                          mb: 0.5,
                        }}
                      >
                        {article.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: UI.text.secondary,
                          lineHeight: 1.5,
                        }}
                      >
                        {article.description}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
