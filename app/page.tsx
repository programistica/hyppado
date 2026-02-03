"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Link,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  PersonOutline,
  CheckCircleOutline,
} from "@mui/icons-material";
import theme from "./theme";

/* ============================================
   NAV LINKS CONFIG
============================================ */
const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
  { label: "Para quem é", href: "#para-quem-e" },
  { label: "FAQ", href: "#faq" },
];

/* ============================================
   HERO IMAGE COMPONENT WITH FALLBACK
============================================ */
function HeroMedia({
  hasError,
  onError,
}: {
  hasError: boolean;
  onError: () => void;
}) {
  if (hasError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          py: 8,
        }}
      >
        <PersonOutline
          sx={{ fontSize: 72, color: "rgba(57, 213, 255, 0.25)" }}
        />
        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.35)",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          Imagem do hero
        </Typography>
      </Box>
    );
  }

  return (
    <Image
      src="/hero/influencer-hero.png"
      alt="Influenciadora usando a plataforma Hyppado"
      width={560}
      height={700}
      priority
      onError={onError}
      style={{
        height: "100%",
        width: "auto",
        maxWidth: "none",
        objectFit: "contain",
        objectPosition: "center bottom",
        filter: "drop-shadow(0 20px 35px rgba(0, 0, 0, 0.55))",
      }}
    />
  );
}

/* ============================================
   HERO VISUAL - FLOATING INFLUENCER WITH GLOW
============================================ */
function HeroVisual() {
  const [imageError, setImageError] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        minHeight: { xs: 400, sm: 480, md: 520, lg: 580 },
      }}
    >
      {/* ===== DECORATIVE LAYERS (no glass panel) ===== */}

      {/* Large radial glow - main */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 380, sm: 480, md: 560, lg: 640 },
          height: { xs: 480, sm: 580, md: 660, lg: 740 },
          borderRadius: "50%",
          background: `radial-gradient(
            ellipse at center,
            rgba(57, 213, 255, 0.14) 0%,
            rgba(57, 213, 255, 0.06) 35%,
            rgba(57, 213, 255, 0.02) 55%,
            transparent 70%
          )`,
          filter: "blur(60px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* Secondary glow - accent top right */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 160, md: 220 },
          height: { xs: 160, md: 220 },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(57, 213, 255, 0.12) 0%, transparent 65%)",
          filter: "blur(40px)",
          top: { xs: "5%", md: "8%" },
          right: { xs: "5%", md: "10%" },
          pointerEvents: "none",
        }}
      />

      {/* Concentric ring 1 - inner */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 300, sm: 360, md: 420, lg: 480 },
          height: { xs: 300, sm: 360, md: 420, lg: 480 },
          borderRadius: "50%",
          border: "1px solid rgba(57, 213, 255, 0.08)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* Concentric ring 2 - outer */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 400, sm: 480, md: 560, lg: 640 },
          height: { xs: 400, sm: 480, md: 560, lg: 640 },
          borderRadius: "50%",
          border: "1px solid rgba(57, 213, 255, 0.04)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* ===== INFLUENCER IMAGE ===== */}
      <Box
        sx={{
          position: "relative",
          zIndex: 5,
          height: { xs: 380, sm: 460, md: 500, lg: 560 },
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <HeroMedia hasError={imageError} onError={() => setImageError(true)} />
      </Box>

      {/* Ground shadow beneath influencer */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "2%", md: "4%" },
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: 160, md: 220 },
          height: { xs: 14, md: 20 },
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.35) 0%, transparent 70%)",
          filter: "blur(14px)",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />

      {/* ===== BOTTOM FADE / VIGNETTE ===== */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 6,
          background: `
            linear-gradient(
              to bottom,
              rgba(7, 11, 18, 0) 0%,
              rgba(7, 11, 18, 0) 55%,
              rgba(7, 11, 18, 0.5) 80%,
              rgba(7, 11, 18, 0.85) 95%,
              rgba(7, 11, 18, 1) 100%
            ),
            radial-gradient(
              ellipse 120% 60% at 50% 100%,
              rgba(7, 11, 18, 0.7) 0%,
              transparent 70%
            )
          `,
        }}
      />
    </Box>
  );
}

/* ============================================
   MAIN PAGE COMPONENT
============================================ */
export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Full page wrapper */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: `
            radial-gradient(ellipse 50% 40% at 10% 20%, rgba(57, 213, 255, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 40% 35% at 80% 60%, rgba(57, 213, 255, 0.05) 0%, transparent 45%),
            linear-gradient(175deg, #0c1420 0%, #070B12 50%, #050810 100%)
          `,
          position: "relative",
        }}
      >
        {/* ==================== NAVBAR ==================== */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: "rgba(7, 11, 18, 0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Container maxWidth="lg">
            <Toolbar
              disableGutters
              sx={{
                justifyContent: "space-between",
                py: 1,
                minHeight: { xs: 64, md: 72 },
              }}
            >
              {/* Logo */}
              <Stack direction="row" alignItems="center" spacing={1.25}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    background:
                      "linear-gradient(135deg, #39D5FF 0%, #0099CC 100%)",
                    borderRadius: "5px",
                    transform: "rotate(45deg)",
                    boxShadow: "0 0 12px rgba(57, 213, 255, 0.5)",
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "#fff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Hyppado
                </Typography>
              </Stack>

              {/* Desktop nav links - centered */}
              <Stack
                component="nav"
                direction="row"
                spacing={4}
                sx={{
                  display: { xs: "none", md: "flex" },
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    underline="none"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#9AA8B8",
                      whiteSpace: "nowrap",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "#fff",
                      },
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </Stack>

              {/* Desktop right section - Login only (NO CTA) */}
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Link
                  href="#"
                  underline="none"
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#fff",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "#39D5FF",
                    },
                  }}
                >
                  Login
                </Link>
              </Box>

              {/* Mobile menu icon */}
              <IconButton
                aria-label="abrir menu"
                onClick={handleDrawerToggle}
                sx={{
                  display: { xs: "flex", md: "none" },
                  color: "#fff",
                }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          PaperProps={{
            sx: {
              width: 280,
              background: "#0D1520",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="flex-end">
              <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff" }}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <List sx={{ mt: 2 }}>
              {NAV_LINKS.map(({ label, href }) => (
                <ListItem key={label} disablePadding>
                  <ListItemButton
                    component="a"
                    href={href}
                    onClick={handleDrawerToggle}
                    sx={{
                      py: 1.5,
                      "&:hover": { background: "rgba(57,213,255,0.08)" },
                    }}
                  >
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "#C0D0E0",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  href="#"
                  onClick={handleDrawerToggle}
                  sx={{
                    py: 1.5,
                    "&:hover": { background: "rgba(57,213,255,0.08)" },
                  }}
                >
                  <ListItemText
                    primary="Login"
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "#39D5FF",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* ==================== HERO SECTION ==================== */}
        <Box
          id="inicio"
          component="section"
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: { xs: "auto", md: "82vh" },
            pt: { xs: 14, md: 12 },
            pb: { xs: 8, md: 8 },
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
              {/* ===== LEFT COLUMN - Content ===== */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    maxWidth: { xs: "100%", md: 480 },
                    textAlign: { xs: "center", md: "left" },
                    mx: { xs: "auto", md: 0 },
                  }}
                >
                  {/* H1 */}
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: {
                        xs: "2rem",
                        sm: "2.5rem",
                        md: "2.75rem",
                        lg: "3rem",
                      },
                      fontWeight: 800,
                      lineHeight: 1.1,
                      letterSpacing: "-0.03em",
                      color: "#fff",
                      mb: 2.5,
                    }}
                  >
                    Hyppado — Encontre produtos em alta.
                  </Typography>

                  {/* Subtitle */}
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.125rem" },
                      lineHeight: 1.6,
                      color: "#A8B8C8",
                      mb: 4,
                    }}
                  >
                    Veja tendências antes do mercado e decida com dados.
                  </Typography>

                  {/* Bullet points */}
                  <Stack spacing={2} sx={{ mb: 4 }}>
                    {[
                      "Métricas em tempo real para validar oportunidades.",
                      "Insights claros para criadores e afiliados.",
                      "Descoberta rápida de vídeos e produtos em alta.",
                    ].map((text, i) => (
                      <Stack
                        key={i}
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                        sx={{
                          justifyContent: { xs: "center", md: "flex-start" },
                        }}
                      >
                        <CheckCircleOutline
                          sx={{
                            fontSize: 20,
                            color: "#39D5FF",
                            mt: 0.25,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: { xs: "0.9rem", md: "0.95rem" },
                            color: "#C0CDD8",
                            lineHeight: 1.5,
                            textAlign: { xs: "left", md: "left" },
                          }}
                        >
                          {text}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  {/* CTA - THE ONLY ONE */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: { xs: "center", md: "flex-start" },
                      gap: 1.5,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        px: 4.5,
                        py: 1.5,
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        borderRadius: "999px",
                        background: "#39D5FF",
                        color: "#070B12",
                        textTransform: "none",
                        boxShadow:
                          "0 0 24px rgba(57, 213, 255, 0.4), 0 4px 16px rgba(0,0,0,0.25)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          background: "#5BE0FF",
                          boxShadow:
                            "0 0 32px rgba(57, 213, 255, 0.55), 0 6px 20px rgba(0,0,0,0.3)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Quero acesso agora
                    </Button>
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: "#7A8A9A",
                      }}
                    >
                      Sem compromisso. Você pode cancelar quando quiser.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* ===== RIGHT COLUMN - Glass Card Visual ===== */}
              <Grid item xs={12} md={6}>
                <HeroVisual />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
