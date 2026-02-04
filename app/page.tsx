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
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  PersonOutline,
  CheckCircleOutline,
  ExpandMore as ExpandMoreIcon,
  Instagram as InstagramIcon,
} from "@mui/icons-material";
import theme from "./theme";
import { PLANS } from "./data/plans";

/* ============================================
   NAV LINKS CONFIG
============================================ */
const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Para quem é", href: "#para-quem-e" },
  { label: "Planos", href: "#planos" },
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
        display: "block",
        height: "100%",
        width: "auto",
        maxWidth: "none",
        objectFit: "contain",
        objectPosition: "center bottom",
        filter: "none",
        boxShadow: "none",
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
      {/* ===== GLOW DE FUNDO ===== */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 70% 60% at 50% 40%, rgba(57, 213, 255, 0.10) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 70% 30%, rgba(57, 213, 255, 0.06) 0%, transparent 50%)
          `,
        }}
      />

      {/* Anéis decorativos */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 300, sm: 360, md: 420, lg: 480 },
          height: { xs: 300, sm: 360, md: 420, lg: 480 },
          borderRadius: "50%",
          border: "1px solid rgba(57, 213, 255, 0.06)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: { xs: 400, sm: 480, md: 560, lg: 640 },
          height: { xs: 400, sm: 480, md: 560, lg: 640 },
          borderRadius: "50%",
          border: "1px solid rgba(57, 213, 255, 0.03)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* ===== IMAGEM COM MÁSCARA DE FADE ===== */}
      <Box
        sx={{
          position: "relative",
          zIndex: 5,
          height: { xs: 380, sm: 460, md: 500, lg: 560 },
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          // Máscara que dissolve a parte inferior da imagem
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
        }}
      >
        <HeroMedia hasError={imageError} onError={() => setImageError(true)} />
      </Box>
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

            {/* ===== PASSO A PASSO ===== */}
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#39D5FF",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                textAlign: "center",
                mb: 4,
              }}
            >
              PASSO A PASSO
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

            {/* ===== C) MODELAGEM DE CRIATIVO ===== */}
            <Box sx={{ mt: { xs: 12, md: 16 } }}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#39D5FF",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  textAlign: "center",
                  mb: 2,
                }}
              >
                MODELAGEM DE CRIATIVO
              </Typography>

              <Typography
                component="h3"
                sx={{
                  fontSize: { xs: "1.5rem", md: "1.75rem" },
                  fontWeight: 700,
                  color: "#fff",
                  textAlign: "center",
                  mb: 2,
                }}
              >
                Transforme um vídeo em variações prontas para testar
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  color: "#A0B0C0",
                  textAlign: "center",
                  maxWidth: 640,
                  mx: "auto",
                  mb: 6,
                }}
              >
                Você sai do &quot;não sei o que gravar&quot; para um roteiro
                claro, com opções de ganchos e chamadas, em minutos.
              </Typography>

              {/* Timeline - Desktop (horizontal) */}
              <Box
                sx={{
                  display: { xs: "none", md: "block" },
                  position: "relative",
                }}
              >
                {/* Connecting line */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 24,
                    left: "12.5%",
                    right: "12.5%",
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, rgba(57, 213, 255, 0.3) 20%, rgba(57, 213, 255, 0.3) 80%, transparent)",
                    zIndex: 0,
                  }}
                />

                <Grid container spacing={3}>
                  {[
                    {
                      step: 1,
                      title: "Escolha o que testar",
                      text: "Encontre um produto com sinais de oportunidade para começar com mais direção.",
                    },
                    {
                      step: 2,
                      title: "Transcreva o vídeo",
                      text: "Entenda a estrutura: gancho, prova, ritmo e chamada para ação.",
                    },
                    {
                      step: 3,
                      title: "Gere variações",
                      text: "Receba ideias de ângulos, ganchos e roteiros para modelar o criativo.",
                      chips: ["Gancho", "Prova", "Roteiro", "CTA"],
                    },
                    {
                      step: 4,
                      title: "Teste e aprenda",
                      text: "Publique versões, compare respostas e refine o que funciona.",
                    },
                  ].map((item) => (
                    <Grid item xs={12} md={3} key={item.step}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        {/* Step dot */}
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #39D5FF 0%, #1a8fb3 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 3,
                            boxShadow: "0 0 20px rgba(57, 213, 255, 0.4)",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1.125rem",
                              fontWeight: 800,
                              color: "#070B12",
                            }}
                          >
                            {item.step}
                          </Typography>
                        </Box>

                        {/* Card */}
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            background: "rgba(13, 21, 32, 0.6)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            height: "100%",
                            width: "100%",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(13, 21, 32, 0.8)",
                              borderColor: "rgba(57, 213, 255, 0.15)",
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <Typography
                            component="h4"
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 700,
                              color: "#fff",
                              mb: 1.5,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              color: "#8595A5",
                              lineHeight: 1.6,
                              mb: item.chips ? 2 : 0,
                            }}
                          >
                            {item.text}
                          </Typography>

                          {/* Chips for step 3 */}
                          {item.chips && (
                            <Stack
                              direction="row"
                              spacing={0.75}
                              flexWrap="wrap"
                              justifyContent="center"
                              sx={{ gap: 0.75 }}
                            >
                              {item.chips.map((chip) => (
                                <Box
                                  key={chip}
                                  sx={{
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: "999px",
                                    background: "rgba(57, 213, 255, 0.1)",
                                    border:
                                      "1px solid rgba(57, 213, 255, 0.25)",
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    color: "#39D5FF",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.02em",
                                  }}
                                >
                                  {chip}
                                </Box>
                              ))}
                            </Stack>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Timeline - Mobile (vertical) */}
              <Box
                sx={{
                  display: { xs: "block", md: "none" },
                  position: "relative",
                  pl: 4,
                }}
              >
                {/* Vertical connecting line */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 24,
                    bottom: 24,
                    left: 11,
                    width: 2,
                    background:
                      "linear-gradient(180deg, rgba(57, 213, 255, 0.3), rgba(57, 213, 255, 0.15))",
                    zIndex: 0,
                  }}
                />

                <Stack spacing={3}>
                  {[
                    {
                      step: 1,
                      title: "Escolha o que testar",
                      text: "Encontre um produto com sinais de oportunidade para começar com mais direção.",
                    },
                    {
                      step: 2,
                      title: "Transcreva o vídeo",
                      text: "Entenda a estrutura: gancho, prova, ritmo e chamada para ação.",
                    },
                    {
                      step: 3,
                      title: "Gere variações",
                      text: "Receba ideias de ângulos, ganchos e roteiros para modelar o criativo.",
                      chips: ["Gancho", "Prova", "Roteiro", "CTA"],
                    },
                    {
                      step: 4,
                      title: "Teste e aprenda",
                      text: "Publique versões, compare respostas e refine o que funciona.",
                    },
                  ].map((item) => (
                    <Box
                      key={item.step}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {/* Step dot */}
                      <Box
                        sx={{
                          position: "absolute",
                          left: -28,
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #39D5FF 0%, #1a8fb3 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 0 12px rgba(57, 213, 255, 0.4)",
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: "#070B12",
                          }}
                        >
                          {item.step}
                        </Typography>
                      </Box>

                      {/* Card */}
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: 2.5,
                          background: "rgba(13, 21, 32, 0.6)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          width: "100%",
                        }}
                      >
                        <Typography
                          component="h4"
                          sx={{
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            color: "#fff",
                            mb: 1,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            color: "#8595A5",
                            lineHeight: 1.6,
                            mb: item.chips ? 2 : 0,
                          }}
                        >
                          {item.text}
                        </Typography>

                        {/* Chips for step 3 */}
                        {item.chips && (
                          <Stack
                            direction="row"
                            spacing={0.75}
                            flexWrap="wrap"
                            sx={{ gap: 0.75 }}
                          >
                            {item.chips.map((chip) => (
                              <Box
                                key={chip}
                                sx={{
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: "999px",
                                  background: "rgba(57, 213, 255, 0.1)",
                                  border: "1px solid rgba(57, 213, 255, 0.25)",
                                  fontSize: "0.65rem",
                                  fontWeight: 600,
                                  color: "#39D5FF",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.02em",
                                }}
                              >
                                {chip}
                              </Box>
                            ))}
                          </Stack>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* ===== E) CTA FINAL ===== */}
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

        {/* ==================== PARA QUEM É SECTION ==================== */}
        <Box
          id="para-quem-e"
          component="section"
          sx={{
            py: { xs: 10, md: 14 },
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
              Para quem é a Hyppado
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "#A0B0C0",
                textAlign: "center",
                maxWidth: 640,
                mx: "auto",
                mb: 6,
              }}
            >
              Para criadores e afiliados que querem decidir o que testar e
              acelerar a criação de criativos com clareza.
            </Typography>

            {/* Two Column Cards */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
              {/* Left Card - Ideal para você se... */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    background: "rgba(13, 21, 32, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    height: "100%",
                  }}
                >
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "#39D5FF",
                      mb: 3,
                    }}
                  >
                    Ideal para você se...
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      "Você quer escolher produtos com mais chance de performar",
                      "Você precisa de um processo simples para testar ideias com consistência",
                      "Você quer transformar vídeos em insights práticos (sem adivinhação)",
                      "Você quer produzir criativos mais rápido, sem perder qualidade",
                    ].map((item, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                      >
                        <CheckCircleOutline
                          sx={{
                            fontSize: 18,
                            color: "#39D5FF",
                            mt: 0.25,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "0.95rem",
                            color: "#C0D0E0",
                            lineHeight: 1.6,
                          }}
                        >
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Grid>

              {/* Right Card - Você ganha com... */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, rgba(57, 213, 255, 0.08) 0%, rgba(13, 21, 32, 0.7) 100%)",
                    border: "1px solid rgba(57, 213, 255, 0.15)",
                    height: "100%",
                  }}
                >
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "#fff",
                      mb: 3,
                    }}
                  >
                    Você ganha com...
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      "Transcrição do vídeo para entender o que prende atenção",
                      "Sugestões de ângulos e roteiros para modelar o criativo",
                      "Estrutura pronta para testar variações (gancho, prova, CTA)",
                      "Mais velocidade para publicar e aprender com os testes",
                    ].map((item, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                      >
                        <CheckCircleOutline
                          sx={{
                            fontSize: 18,
                            color: "#39D5FF",
                            mt: 0.25,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "0.95rem",
                            color: "#C0D0E0",
                            lineHeight: 1.6,
                          }}
                        >
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>

            {/* CTA Row */}
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  color: "#8595A5",
                  mb: 3,
                }}
              >
                Sem promessas mágicas. Só um processo mais inteligente para
                testar.
              </Typography>
              <Button
                variant="contained"
                size="large"
                href="#planos"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("planos")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                sx={{
                  px: 4,
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

        {/* ==================== PLANOS SECTION ==================== */}
        <Box
          id="planos"
          component="section"
          sx={{
            py: { xs: 10, md: 14 },
            scrollMarginTop: "80px",
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
              Planos
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "#A0B0C0",
                textAlign: "center",
                maxWidth: 600,
                mx: "auto",
                mb: 8,
              }}
            >
              Escolha o plano ideal para organizar ideias, transcrever vídeos e
              modelar criativos com mais direção.
            </Typography>

            <Grid container spacing={3} justifyContent="center">
              {PLANS.map((plan) => (
                <Grid item xs={12} sm={6} md={4} key={plan.id}>
                  <Box
                    sx={{
                      position: "relative",
                      p: { xs: 3, md: 4 },
                      borderRadius: 3,
                      background: plan.highlight
                        ? "linear-gradient(135deg, rgba(57, 213, 255, 0.08) 0%, rgba(13, 21, 32, 0.9) 100%)"
                        : "rgba(13, 21, 32, 0.6)",
                      border: plan.highlight
                        ? "2px solid rgba(57, 213, 255, 0.4)"
                        : "1px solid rgba(255, 255, 255, 0.06)",
                      boxShadow: plan.highlight
                        ? "0 0 40px rgba(57, 213, 255, 0.15), 0 8px 32px rgba(0,0,0,0.3)"
                        : "none",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: plan.highlight
                          ? "rgba(57, 213, 255, 0.6)"
                          : "rgba(57, 213, 255, 0.2)",
                        boxShadow: plan.highlight
                          ? "0 0 50px rgba(57, 213, 255, 0.2), 0 12px 40px rgba(0,0,0,0.35)"
                          : "0 8px 24px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <Chip
                        label={plan.badge}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -12,
                          left: "50%",
                          transform: "translateX(-50%)",
                          background:
                            "linear-gradient(135deg, #39D5FF 0%, #00B8E6 100%)",
                          color: "#070B12",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          letterSpacing: "0.02em",
                          px: 1.5,
                          height: 24,
                        }}
                      />
                    )}

                    {/* Plan name */}
                    <Typography
                      component="h3"
                      sx={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "#fff",
                        mb: 1,
                        mt: plan.badge ? 1 : 0,
                      }}
                    >
                      {plan.name}
                    </Typography>

                    {/* Price */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: { xs: "2rem", md: "2.5rem" },
                          fontWeight: 800,
                          color: plan.highlight ? "#39D5FF" : "#fff",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {plan.price}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "0.95rem",
                          color: "#8595A5",
                          ml: 0.5,
                        }}
                      >
                        /{plan.period}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        color: "#A0B0C0",
                        mb: 3,
                        lineHeight: 1.5,
                      }}
                    >
                      {plan.description}
                    </Typography>

                    {/* Features */}
                    <Stack spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
                      {plan.features.map((feature, index) => (
                        <Stack
                          key={index}
                          direction="row"
                          spacing={1.5}
                          alignItems="flex-start"
                        >
                          <CheckCircleOutline
                            sx={{
                              fontSize: 18,
                              color: plan.highlight ? "#39D5FF" : "#5A6A7A",
                              mt: 0.25,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              color: "#C0D0E0",
                              lineHeight: 1.5,
                            }}
                          >
                            {feature}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>

                    {/* CTA Button */}
                    <Button
                      variant={plan.highlight ? "contained" : "outlined"}
                      fullWidth
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        // Placeholder for checkout or signup flow
                      }}
                      sx={{
                        py: 1.5,
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        borderRadius: "999px",
                        textTransform: "none",
                        ...(plan.highlight
                          ? {
                              background: "#39D5FF",
                              color: "#070B12",
                              boxShadow:
                                "0 0 20px rgba(57, 213, 255, 0.35), 0 4px 12px rgba(0,0,0,0.2)",
                              "&:hover": {
                                background: "#5BE0FF",
                                boxShadow:
                                  "0 0 28px rgba(57, 213, 255, 0.5), 0 6px 16px rgba(0,0,0,0.25)",
                              },
                            }
                          : {
                              borderColor: "rgba(57, 213, 255, 0.3)",
                              color: "#39D5FF",
                              "&:hover": {
                                borderColor: "rgba(57, 213, 255, 0.6)",
                                background: "rgba(57, 213, 255, 0.08)",
                              },
                            }),
                      }}
                    >
                      Quero acesso agora
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ==================== FAQ SECTION ==================== */}
        <Box
          id="faq"
          component="section"
          sx={{
            py: { xs: 10, md: 14 },
            scrollMarginTop: "80px",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 4, md: 8 }} alignItems="flex-start">
              {/* Left Column - Title and supporting text */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    position: { md: "sticky" },
                    top: { md: 120 },
                  }}
                >
                  <Typography
                    component="h2"
                    sx={{
                      fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
                      fontWeight: 800,
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                      color: "#fff",
                      mb: 2,
                    }}
                  >
                    Perguntas frequentes
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.05rem" },
                      color: "#A0B0C0",
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    Respostas diretas para você entender a Hyppado e decidir com
                    segurança.
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: "#6A7A8A",
                      mb: 3,
                    }}
                  >
                    Ainda com dúvidas? Fale com a gente.
                  </Typography>
                  <Button
                    variant="contained"
                    size="medium"
                    href="#planos"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("planos")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    sx={{
                      px: 3,
                      py: 1.25,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      borderRadius: "999px",
                      background: "#39D5FF",
                      color: "#070B12",
                      textTransform: "none",
                      boxShadow:
                        "0 0 20px rgba(57, 213, 255, 0.35), 0 4px 12px rgba(0,0,0,0.2)",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        background: "#5BE0FF",
                        boxShadow:
                          "0 0 28px rgba(57, 213, 255, 0.5), 0 6px 16px rgba(0,0,0,0.25)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Fale com nosso suporte
                  </Button>
                </Box>
              </Grid>

              {/* Right Column - Accordions */}
              <Grid item xs={12} md={8}>
                <Stack spacing={2}>
                  {[
                    {
                      question: "O que é a Hyppado?",
                      answer:
                        "Uma plataforma para descobrir oportunidades e acelerar a criação de criativos. Você pode transcrever vídeos e gerar prompts para modelar variações do criativo com mais direção.",
                    },
                    {
                      question: "Para quem é?",
                      answer:
                        "Para criadores e afiliados que querem decidir o que testar e produzir com consistência, sem depender de 'achismo'.",
                    },
                    {
                      question: "A Hyppado serve para quem está começando?",
                      answer:
                        "Sim. Você consegue partir de exemplos, entender a estrutura do vídeo e usar prompts para guiar seu primeiro roteiro e suas variações.",
                    },
                    {
                      question: "O que eu recebo no plano?",
                      answer:
                        "Acesso aos recursos do seu plano, incluindo descoberta de produtos e vídeos, transcrição de vídeo e prompts para modelagem do criativo. Os detalhes exatos ficam descritos em cada plano.",
                    },
                    {
                      question: "Eu preciso instalar alguma coisa?",
                      answer:
                        "Não. É uma plataforma web: você acessa pelo navegador e organiza seu processo por lá.",
                    },
                    {
                      question: "Posso cancelar quando quiser?",
                      answer:
                        "Sim. Você pode cancelar quando quiser. Assim que o cancelamento for confirmado, você mantém acesso até o fim do período contratado.",
                    },
                  ].map((faq, index) => (
                    <Accordion
                      key={index}
                      disableGutters
                      elevation={0}
                      sx={{
                        background: "rgba(13, 21, 32, 0.5)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: "12px !important",
                        overflow: "hidden",
                        "&:before": {
                          display: "none",
                        },
                        "&.Mui-expanded": {
                          borderColor: "rgba(57, 213, 255, 0.2)",
                          margin: 0,
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon sx={{ color: "#39D5FF" }} />
                        }
                        sx={{
                          px: 3,
                          py: 1,
                          minHeight: 64,
                          "& .MuiAccordionSummary-content": {
                            my: 1.5,
                          },
                          "&:hover": {
                            background: "rgba(57, 213, 255, 0.04)",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            color: "#fff",
                          }}
                        >
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          px: 3,
                          pb: 3,
                          pt: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.9rem",
                            color: "#A0B0C0",
                            lineHeight: 1.7,
                          }}
                        >
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* ==================== FOOTER ==================== */}
        <Box
          component="footer"
          sx={{
            mt: "auto",
            pt: { xs: 6, md: 8 },
            pb: { xs: 4, md: 5 },
            background:
              "linear-gradient(180deg, rgba(7, 11, 18, 0) 0%, rgba(13, 21, 32, 0.5) 100%)",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Container maxWidth="lg">
            {/* Footer Main Content - 3 Columns */}
            <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mb: { xs: 4, md: 6 } }}>
              {/* Column 1 - Brand */}
              <Grid item xs={12} md={5}>
                <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      background:
                        "linear-gradient(135deg, #39D5FF 0%, #0099CC 100%)",
                      borderRadius: "4px",
                      transform: "rotate(45deg)",
                      boxShadow: "0 0 10px rgba(57, 213, 255, 0.4)",
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      color: "#fff",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Hyppado
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "#8595A5",
                    lineHeight: 1.7,
                    maxWidth: 360,
                  }}
                >
                  A Hyppado ajuda criadores e afiliados a escolher produtos e
                  entender criativos com mais clareza, usando transcrição e
                  sugestões de prompt para modelagem.
                </Typography>
              </Grid>

              {/* Column 2 - Quick Access */}
              <Grid item xs={6} md={3}>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#fff",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    mb: 2.5,
                  }}
                >
                  Acesso Rápido
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    { label: "Início", href: "#inicio" },
                    { label: "Como funciona", href: "#como-funciona" },
                    { label: "Para quem é", href: "#para-quem-e" },
                    { label: "Planos", href: "#planos" },
                    { label: "FAQ", href: "#faq" },
                    { label: "Suporte", href: "mailto:suporte@hyppado.com" },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      underline="none"
                      onClick={(e) => {
                        if (link.href.startsWith("#")) {
                          e.preventDefault();
                          const id = link.href.slice(1);
                          document
                            .getElementById(id)
                            ?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      sx={{
                        fontSize: "0.875rem",
                        color: "#9AA8B8",
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: "#39D5FF",
                        },
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </Grid>

              {/* Column 3 - Legal */}
              <Grid item xs={6} md={4}>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#fff",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    mb: 2.5,
                  }}
                >
                  Legal
                </Typography>
                <Stack spacing={1.5}>
                  <Link
                    href="#"
                    underline="none"
                    sx={{
                      fontSize: "0.875rem",
                      color: "#9AA8B8",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "#39D5FF",
                      },
                    }}
                  >
                    Termos de Uso
                  </Link>
                  <Link
                    href="#"
                    underline="none"
                    sx={{
                      fontSize: "0.875rem",
                      color: "#9AA8B8",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        color: "#39D5FF",
                      },
                    }}
                  >
                    Política de Privacidade
                  </Link>
                </Stack>
              </Grid>
            </Grid>

            {/* Divider */}
            <Divider
              sx={{
                borderColor: "rgba(255, 255, 255, 0.06)",
                mb: { xs: 3, md: 4 },
              }}
            />

            {/* Bottom Row - Copyright & Social */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "center", sm: "center" }}
              spacing={2}
            >
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: "#6A7A8A",
                }}
              >
                © Hyppado 2026. Todos os direitos reservados.
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#6A7A8A",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Siga-nos nas redes sociais:
                </Typography>
                <IconButton
                  aria-label="Instagram da Hyppado"
                  href="https://instagram.com/hyppado"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#9AA8B8",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#39D5FF",
                      background: "rgba(57, 213, 255, 0.1)",
                    },
                  }}
                >
                  <InstagramIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
