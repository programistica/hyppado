"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
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
                    onClick={(e) => {
                      if (href.startsWith("#")) {
                        e.preventDefault();
                        document.getElementById(href.slice(1))?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#9AA8B8",
                      whiteSpace: "nowrap",
                      transition: "color 0.2s ease",
                      cursor: "pointer",
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
                    onClick={(e: React.MouseEvent) => {
                      handleDrawerToggle();
                      if (href.startsWith("#")) {
                        e.preventDefault();
                        setTimeout(() => {
                          document
                            .getElementById(href.slice(1))
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        }, 300);
                      }
                    }}
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

        {/* ==================== COMO FUNCIONA SECTION ==================== */}
        <Box
          id="como-funciona"
          component="section"
          sx={{
            py: { xs: 10, md: 14 },
            background:
              "linear-gradient(180deg, transparent 0%, rgba(13, 21, 32, 0.4) 50%, transparent 100%)",
          }}
        >
          <Container maxWidth="lg">
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "#fff",
                textAlign: "center",
                mb: 2,
              }}
            >
              Como funciona
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "#A0B0C0",
                textAlign: "center",
                maxWidth: 560,
                mx: "auto",
                mb: 6,
              }}
            >
              Da conexão à ação: veja como a Hyppado transforma dados em
              oportunidades para criadores e afiliados.
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {[
                {
                  step: "1",
                  title: "Conecte sua conta",
                  description:
                    "Crie sua conta em segundos e acesse o painel. Sem burocracia.",
                },
                {
                  step: "2",
                  title: "Descubra produtos em alta",
                  description:
                    "Explore milhares de produtos com métricas de desempenho.",
                },
                {
                  step: "3",
                  title: "Analise vídeos e métricas",
                  description:
                    "Veja quais vídeos estão bombando e entenda os padrões.",
                },
                {
                  step: "4",
                  title: "Aja com confiança",
                  description:
                    "Tome decisões baseadas em dados reais. Promova os produtos certos.",
                },
              ].map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.step}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, rgba(57, 213, 255, 0.2) 0%, rgba(57, 213, 255, 0.05) 100%)",
                        border: "1px solid rgba(57, 213, 255, 0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "1.125rem",
                          fontWeight: 700,
                          color: "#39D5FF",
                        }}
                      >
                        {item.step}
                      </Typography>
                    </Box>
                    <Typography
                      component="h3"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#fff",
                        mb: 1,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: "#8595A5",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* ===== A) O QUE VOCÊ RECEBE ===== */}
            <Box sx={{ mt: { xs: 12, md: 16 } }}>
              <Typography
                component="h3"
                sx={{
                  fontSize: { xs: "1.5rem", md: "1.75rem" },
                  fontWeight: 700,
                  color: "#fff",
                  textAlign: "center",
                  mb: 1.5,
                }}
              >
                O que você recebe
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  color: "#8595A5",
                  textAlign: "center",
                  maxWidth: 480,
                  mx: "auto",
                  mb: 5,
                }}
              >
                Ferramentas práticas para quem quer resultados reais.
              </Typography>

              <Grid container spacing={3}>
                {[
                  {
                    title: "Radar de produtos",
                    description: "Veja o que está subindo antes de saturar.",
                  },
                  {
                    title: "Biblioteca de vídeos",
                    description: "Encontre referências por formato e estilo.",
                  },
                  {
                    title: "Filtros por nicho",
                    description: "Isole oportunidades por categoria e público.",
                  },
                  {
                    title: "Métricas essenciais",
                    description: "Valide sinais com números claros.",
                  },
                  {
                    title: "Transcrição de vídeos",
                    description:
                      "Transforme vídeo em texto para analisar rápido.",
                  },
                  {
                    title: "Prompts para criativos",
                    description:
                      "Gere prompts para modelar variações do criativo.",
                  },
                ].map((card, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: "rgba(13, 21, 32, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        height: "100%",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "rgba(13, 21, 32, 0.8)",
                          borderColor: "rgba(57, 213, 255, 0.15)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background:
                            "linear-gradient(135deg, rgba(57, 213, 255, 0.15) 0%, rgba(57, 213, 255, 0.05) 100%)",
                          border: "1px solid rgba(57, 213, 255, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: "#39D5FF",
                            boxShadow: "0 0 12px rgba(57, 213, 255, 0.5)",
                          }}
                        />
                      </Box>
                      <Typography
                        component="h4"
                        sx={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: "#fff",
                          mb: 0.75,
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          color: "#8595A5",
                          lineHeight: 1.55,
                        }}
                      >
                        {card.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* ===== B) DO DADO À AÇÃO ===== */}
            <Box sx={{ mt: { xs: 12, md: 16 } }}>
              <Typography
                component="h3"
                sx={{
                  fontSize: { xs: "1.5rem", md: "1.75rem" },
                  fontWeight: 700,
                  color: "#fff",
                  textAlign: "center",
                  mb: 1.5,
                }}
              >
                Do dado à ação
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  color: "#8595A5",
                  textAlign: "center",
                  maxWidth: 480,
                  mx: "auto",
                  mb: 6,
                }}
              >
                Um fluxo simples para transformar informação em resultado.
              </Typography>

              <Grid container spacing={2} justifyContent="center">
                {[
                  {
                    step: "1",
                    title: "Descubra",
                    description:
                      "Encontre produtos e vídeos em alta com filtros inteligentes.",
                  },
                  {
                    step: "2",
                    title: "Valide",
                    description:
                      "Analise métricas reais antes de investir tempo ou dinheiro.",
                  },
                  {
                    step: "3",
                    title: "Compare",
                    description:
                      "Coloque opções lado a lado e identifique a melhor escolha.",
                  },
                  {
                    step: "4",
                    title: "Aja",
                    description:
                      "Promova com confiança sabendo que os dados sustentam sua decisão.",
                  },
                ].map((item, index, arr) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={item.step}
                    sx={{ position: "relative" }}
                  >
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 3,
                        position: "relative",
                      }}
                    >
                      {/* Connector line */}
                      {index < arr.length - 1 && (
                        <Box
                          sx={{
                            display: { xs: "none", md: "block" },
                            position: "absolute",
                            top: 32,
                            right: -16,
                            width: 32,
                            height: 2,
                            background:
                              "linear-gradient(90deg, rgba(57, 213, 255, 0.3) 0%, rgba(57, 213, 255, 0.1) 100%)",
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, rgba(57, 213, 255, 0.25) 0%, rgba(57, 213, 255, 0.08) 100%)",
                          border: "2px solid rgba(57, 213, 255, 0.35)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 2,
                          boxShadow: "0 0 20px rgba(57, 213, 255, 0.15)",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "1.25rem",
                            fontWeight: 800,
                            color: "#39D5FF",
                          }}
                        >
                          {item.step}
                        </Typography>
                      </Box>
                      <Typography
                        component="h4"
                        sx={{
                          fontSize: "1.125rem",
                          fontWeight: 700,
                          color: "#fff",
                          mb: 1,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          color: "#8595A5",
                          lineHeight: 1.6,
                          maxWidth: 200,
                          mx: "auto",
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* ===== C) PERGUNTAS QUE A HYPPADO RESPONDE ===== */}
            <Box sx={{ mt: { xs: 12, md: 16 } }}>
              <Typography
                component="h3"
                sx={{
                  fontSize: { xs: "1.5rem", md: "1.75rem" },
                  fontWeight: 700,
                  color: "#fff",
                  textAlign: "center",
                  mb: 1.5,
                }}
              >
                Perguntas que a Hyppado responde
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  color: "#8595A5",
                  textAlign: "center",
                  maxWidth: 480,
                  mx: "auto",
                  mb: 5,
                }}
              >
                Dúvidas práticas que você resolve em segundos na plataforma.
              </Typography>

              <Stack spacing={2} sx={{ maxWidth: 720, mx: "auto" }}>
                {[
                  {
                    question: "O que está subindo agora?",
                    answer:
                      "A Hyppado destaca sinais de tração com base no comportamento recente de vídeos e produtos. Você enxerga o que está chamando atenção e ganhando força para decidir mais rápido o que vale testar.",
                  },
                  {
                    question: "Quais vídeos estão puxando resultado?",
                    answer:
                      "Navegue pela biblioteca de vídeos e descubra quais conteúdos estão convertendo. Use a transcrição automática para entender a estrutura e replicar o que funciona.",
                  },
                  {
                    question:
                      "Esse produto ainda está no começo ou já saturou?",
                    answer:
                      "A Hyppado te ajuda a avaliar o nível de concorrência e o fôlego do produto a partir de sinais práticos do mercado. Assim, você entende se ainda existe espaço para entrar com um bom criativo ou se vale buscar outra aposta.",
                  },
                  {
                    question: "O que comparar antes de postar?",
                    answer:
                      'Antes de postar, valide o "pacote completo": produto, promessa, formato do vídeo e abordagem do criativo. A Hyppado te dá clareza do que costuma funcionar naquele tipo de produto para você escolher melhor o que testar.',
                  },
                  {
                    question: "Como sair do 'achismo' na escolha do criativo?",
                    answer:
                      "Analise vídeos de sucesso com a transcrição e gere prompts para modelar variações. Assim você cria com base em dados, não em intuição.",
                  },
                ].map((faq, index) => (
                  <Box
                    key={index}
                    component="details"
                    sx={{
                      borderRadius: 2,
                      background: "rgba(13, 21, 32, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      overflow: "hidden",
                      "&[open]": {
                        borderColor: "rgba(57, 213, 255, 0.15)",
                      },
                      "&[open] summary": {
                        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                      },
                    }}
                  >
                    <Box
                      component="summary"
                      sx={{
                        p: 2.5,
                        cursor: "pointer",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#fff",
                        listStyle: "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        "&::-webkit-details-marker": {
                          display: "none",
                        },
                        "&::after": {
                          content: '"+"',
                          color: "#39D5FF",
                          fontSize: "1.25rem",
                          fontWeight: 400,
                        },
                        "[open] &::after": {
                          content: '"-"',
                        },
                      }}
                    >
                      {faq.question}
                    </Box>
                    <Box sx={{ p: 2.5, pt: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          color: "#A0B0C0",
                          lineHeight: 1.7,
                          pt: 2,
                        }}
                      >
                        {faq.answer}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* ===== D) CTA FINAL ===== */}
            <Box
              sx={{
                mt: { xs: 12, md: 16 },
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                background:
                  "linear-gradient(135deg, rgba(57, 213, 255, 0.08) 0%, rgba(13, 21, 32, 0.8) 100%)",
                border: "1px solid rgba(57, 213, 255, 0.15)",
                textAlign: "center",
              }}
            >
              <Typography
                component="h3"
                sx={{
                  fontSize: { xs: "1.5rem", md: "1.75rem" },
                  fontWeight: 700,
                  color: "#fff",
                  mb: 1.5,
                }}
              >
                Pronto para encontrar oportunidades antes do mercado?
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  color: "#A0B0C0",
                  maxWidth: 480,
                  mx: "auto",
                  mb: 4,
                }}
              >
                Acesse a Hyppado e comece a validar tendências com dados.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 5,
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
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
