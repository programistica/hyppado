"use client";

import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
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
  ListItemIcon,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  ThemeProvider,
  CssBaseline,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  PersonOutline,
  CheckCircleOutline,
  ExpandMore as ExpandMoreIcon,
  Instagram as InstagramIcon,
  HomeOutlined,
  AutoAwesomeOutlined,
  GroupOutlined,
  WorkspacePremiumOutlined,
  HelpOutlineOutlined,
  LoginOutlined,
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import theme from "./theme";
import { PLANS } from "./data/plans";

/* ============================================
   NAV LINKS CONFIG
============================================ */
const NAV_LINKS = [
  { label: "Início", href: "#inicio", icon: HomeOutlined },
  { label: "Como funciona", href: "#como-funciona", icon: AutoAwesomeOutlined },
  { label: "Para quem é", href: "#para-quem-e", icon: GroupOutlined },
  { label: "Planos", href: "#planos", icon: WorkspacePremiumOutlined },
  { label: "FAQ", href: "#faq", icon: HelpOutlineOutlined },
];

const NAVBAR_OFFSET = 80;

/* ============================================
   SCROLL STATE HOOK
============================================ */
function useScrollState() {
  const [scrollY, setScrollY] = useState(0);
  const [isNearTop, setIsNearTop] = useState(true);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrollY(y);
        setIsNearTop(y < 120);
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { scrollY, isNearTop };
}

/* ============================================
   SCROLL HELPERS
============================================ */
function scrollToId(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  const y =
    element.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function getNextSectionId(): string {
  const sections = document.querySelectorAll("section[id]");
  const ids = Array.from(sections).map((s) => s.id);
  const inicioIndex = ids.indexOf("inicio");
  if (inicioIndex !== -1 && inicioIndex < ids.length - 1) {
    return ids[inicioIndex + 1];
  }
  return "como-funciona";
}

/* ============================================
   REVEAL COMPONENT (IntersectionObserver)
============================================ */
function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : "translateY(14px)",
        transition: `opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Box>
  );
}

/* ============================================
   SCROLL FAB COMPONENT
============================================ */
function ScrollFAB() {
  const { isNearTop } = useScrollState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    if (isNearTop) {
      const nextId = getNextSectionId();
      scrollToId(nextId);
    } else {
      scrollToId("inicio");
    }
  };

  if (!mounted) return null;

  return (
    <Tooltip title={isNearTop ? "Continuar" : "Topo"} placement="left" arrow>
      <Box
        component="button"
        onClick={handleClick}
        aria-label={isNearTop ? "Rolar para próxima seção" : "Voltar ao topo"}
        sx={{
          position: "fixed",
          bottom: { xs: 18, md: 24 },
          right: { xs: 18, md: 24 },
          zIndex: 1200,
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(13, 21, 32, 0.72)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 10px 28px rgba(0, 0, 0, 0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.25s ease",
          "&:hover": {
            borderColor: "rgba(57, 213, 255, 0.25)",
            transform: "translateY(-2px)",
            boxShadow:
              "0 12px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(57, 213, 255, 0.15)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        }}
      >
        {isNearTop ? (
          <KeyboardArrowDownRounded sx={{ fontSize: 26, color: "#39D5FF" }} />
        ) : (
          <KeyboardArrowUpRounded sx={{ fontSize: 26, color: "#39D5FF" }} />
        )}
      </Box>
    </Tooltip>
  );
}

/* ============================================
   SECTION SHELL - BACKGROUND SYSTEM
============================================ */
type SectionVariant = "hero" | "how" | "who" | "pricing" | "faq";

interface SectionShellProps {
  id: string;
  children: ReactNode;
  variant: SectionVariant;
  noDivider?: boolean;
}

const SECTION_STYLES: Record<
  SectionVariant,
  {
    base: string;
    decorative: string;
    dividerColor: string;
    py: { xs: number; md: number };
    pt?: { xs: number; md: number };
    pb?: { xs: number; md: number };
    minHeight?: { xs: string; md: string };
  }
> = {
  hero: {
    base: `
      linear-gradient(175deg, #0c1420 0%, #070B12 55%, #050810 100%)
    `,
    decorative: `
      radial-gradient(ellipse 55% 45% at 12% 25%, rgba(57, 213, 255, 0.10) 0%, transparent 55%),
      radial-gradient(ellipse 45% 40% at 85% 55%, rgba(57, 213, 255, 0.06) 0%, transparent 50%),
      repeating-linear-gradient(90deg, rgba(57, 213, 255, 0.02) 0px, transparent 1px, transparent 120px)
    `,
    dividerColor: "rgba(13, 21, 32, 0.85)",
    py: { xs: 0, md: 0 },
    pt: { xs: 14, md: 12 },
    pb: { xs: 8, md: 8 },
    minHeight: { xs: "auto", md: "82vh" },
  },
  how: {
    base: `
      linear-gradient(180deg, rgba(13, 21, 32, 0.65) 0%, rgba(9, 14, 22, 0.9) 45%, rgba(7, 11, 18, 1) 100%)
    `,
    decorative: `
      linear-gradient(90deg, transparent 47px, rgba(57, 213, 255, 0.025) 48px, transparent 49px),
      linear-gradient(0deg, transparent 47px, rgba(57, 213, 255, 0.025) 48px, transparent 49px),
      radial-gradient(ellipse 60% 40% at 50% 0%, rgba(57, 213, 255, 0.04) 0%, transparent 60%)
    `,
    dividerColor: "rgba(57, 213, 255, 0.04)",
    py: { xs: 10, md: 14 },
  },
  who: {
    base: `
      linear-gradient(180deg, rgba(57, 213, 255, 0.05) 0%, rgba(10, 15, 24, 0.95) 40%, rgba(7, 11, 18, 1) 100%)
    `,
    decorative: `
      radial-gradient(ellipse 50% 50% at 15% 30%, rgba(255, 77, 166, 0.04) 0%, transparent 60%),
      radial-gradient(ellipse 45% 45% at 85% 70%, rgba(57, 213, 255, 0.05) 0%, transparent 55%)
    `,
    dividerColor: "#060912",
    py: { xs: 10, md: 14 },
  },
  pricing: {
    base: `
      linear-gradient(180deg, #060912 0%, #070B12 45%, #050810 100%)
    `,
    decorative: `
      radial-gradient(ellipse 80% 30% at 50% 50%, rgba(57, 213, 255, 0.03) 0%, transparent 70%),
      linear-gradient(180deg, transparent 30%, rgba(57, 213, 255, 0.015) 50%, transparent 70%)
    `,
    dividerColor: "rgba(13, 21, 32, 0.75)",
    py: { xs: 10, md: 14 },
  },
  faq: {
    base: `
      linear-gradient(180deg, rgba(13, 21, 32, 0.75) 0%, rgba(9, 14, 22, 0.9) 50%, rgba(7, 11, 18, 1) 100%)
    `,
    decorative: `
      radial-gradient(circle at 20% 80%, rgba(57, 213, 255, 0.02) 0%, transparent 40%),
      radial-gradient(circle at 80% 20%, rgba(57, 213, 255, 0.02) 0%, transparent 40%)
    `,
    dividerColor: "transparent",
    py: { xs: 10, md: 14 },
  },
};

function SectionShell({
  id,
  children,
  variant,
  noDivider = false,
}: SectionShellProps) {
  const styles = SECTION_STYLES[variant];
  const isHero = variant === "hero";

  return (
    <Box
      id={id}
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        scrollMarginTop: isHero ? 0 : "90px",
        ...(styles.minHeight && { minHeight: styles.minHeight }),
        ...(styles.pt ? { pt: styles.pt } : {}),
        ...(styles.pb ? { pb: styles.pb } : {}),
        ...(!styles.pt && !styles.pb ? { py: styles.py } : {}),
        display: isHero ? "flex" : "block",
        alignItems: isHero ? "center" : undefined,
      }}
    >
      {/* A) Base background layer */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: styles.base,
        }}
      />

      {/* B) Decorative glows layer */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: styles.decorative,
          backgroundSize:
            variant === "how" ? "48px 48px, 48px 48px, 100% 100%" : "100% 100%",
        }}
      />

      {/* C) Content wrapper */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
        }}
      >
        {children}
      </Box>

      {/* D) Divider to blend into next section */}
      {!noDivider && styles.dividerColor !== "transparent" && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -1,
            height: { xs: 100, md: 160 },
            zIndex: 3,
            pointerEvents: "none",
            background: `linear-gradient(to bottom, transparent 0%, ${styles.dividerColor} 100%)`,
          }}
        />
      )}
    </Box>
  );
}

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
        overflow: "hidden",
        isolation: "isolate",
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
          overflow: "hidden",
          isolation: "isolate",
          // Máscara que dissolve a parte inferior da imagem
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
          maskRepeat: "no-repeat",
          maskSize: "100% 100%",
        }}
      >
        <HeroMedia hasError={imageError} onError={() => setImageError(true)} />
      </Box>
    </Box>
  );
}

/* ============================================
   HERO BACKGROUND VIDEO COMPONENT
============================================ */
function HeroBackgroundVideo() {
  return (
    <Box
      component="video"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
        pointerEvents: "none",
      }}
    >
      <source src="/hero/hero-bg.webm" type="video/webm" />
      <source src="/hero/hero-bg.mp4" type="video/mp4" />
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
          background: "#070B12",
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
                spacing={1}
                sx={{
                  display: { xs: "none", md: "flex" },
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                {NAV_LINKS.map(({ label, href, icon: Icon }) => (
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
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.75,
                      px: 1.5,
                      py: 0.75,
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#9AA8B8",
                      whiteSpace: "nowrap",
                      borderRadius: "999px",
                      border: "1px solid transparent",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      "&:hover": {
                        color: "#fff",
                        background: "rgba(255, 255, 255, 0.04)",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                      },
                      "& .nav-icon": {
                        fontSize: 18,
                        opacity: 0.7,
                        transition: "opacity 0.2s ease",
                      },
                      "&:hover .nav-icon": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Icon className="nav-icon" />
                    {label}
                  </Link>
                ))}
              </Stack>

              {/* Desktop right section - Entrar */}
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Link
                  href="#"
                  underline="none"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#fff",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#39D5FF",
                    },
                    "& .login-icon": {
                      fontSize: 18,
                      transition: "color 0.2s ease",
                    },
                  }}
                >
                  <LoginOutlined className="login-icon" />
                  Entrar
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
              {NAV_LINKS.map(({ label, href, icon: Icon }) => (
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
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Icon sx={{ fontSize: 20, color: "#9AA8B8" }} />
                    </ListItemIcon>
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
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LoginOutlined sx={{ fontSize: 20, color: "#39D5FF" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Entrar"
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
        <SectionShell id="inicio" variant="hero">
          {/* Video Background - zIndex 0 */}
          <HeroBackgroundVideo />

          {/* Overlay 1 — Contraste/legibilidade */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              background:
                "linear-gradient(to bottom, rgba(7,11,18,0.55) 0%, rgba(7,11,18,0.80) 55%, rgba(7,11,18,0.92) 75%, rgba(7,11,18,1) 100%)",
            }}
          />

          {/* Overlay 2 — Accent sutil lado esquerdo */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at 18% 35%, rgba(57,213,255,0.10) 0%, rgba(57,213,255,0.05) 25%, transparent 60%)",
              mixBlendMode: "normal",
            }}
          />

          {/* Overlay 3 — Vinheta suave */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.25) 85%)",
              opacity: 0.9,
            }}
          />

          {/* Conteúdo do hero */}
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 4 }}>
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
                  </Box>
                </Box>
              </Grid>

              {/* ===== RIGHT COLUMN - Glass Card Visual ===== */}
              <Grid item xs={12} md={6}>
                <HeroVisual />
              </Grid>
            </Grid>
          </Container>
        </SectionShell>

        {/* ==================== COMO FUNCIONA SECTION ==================== */}
        <SectionShell id="como-funciona" variant="how">
          <Container maxWidth="lg">
            <Reveal>
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
            </Reveal>

            <Reveal delay={100}>
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
            </Reveal>

            {/* ===== A) O QUE VOCÊ RECEBE ===== */}
            <Reveal delay={50}>
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
                      description:
                        "Isole oportunidades por categoria e público.",
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
            </Reveal>

            {/* ===== B) DO DADO À AÇÃO ===== */}
            <Reveal delay={50}>
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
            </Reveal>

            {/* ===== C) MODELAGEM DE CRIATIVO ===== */}
            <Reveal delay={50}>
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
                                    border:
                                      "1px solid rgba(57, 213, 255, 0.25)",
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
            </Reveal>

            {/* ===== E) CTA FINAL ===== */}
            <Reveal delay={50}>
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
            </Reveal>
          </Container>
        </SectionShell>

        {/* ==================== PARA QUEM É SECTION ==================== */}
        <SectionShell id="para-quem-e" variant="who">
          <Container maxWidth="lg">
            <Reveal>
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
            </Reveal>

            {/* Two Column Cards */}
            <Reveal delay={100}>
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
            </Reveal>

            {/* CTA Row */}
            <Reveal delay={150}>
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
            </Reveal>
          </Container>
        </SectionShell>

        {/* ==================== PLANOS SECTION ==================== */}
        <SectionShell id="planos" variant="pricing">
          <Container maxWidth="lg">
            <Reveal>
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
                Escolha o plano ideal para organizar ideias, transcrever vídeos
                e modelar criativos com mais direção.
              </Typography>
            </Reveal>

            <Reveal delay={100}>
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
            </Reveal>
          </Container>
        </SectionShell>

        {/* ==================== FAQ SECTION ==================== */}
        <SectionShell id="faq" variant="faq" noDivider>
          <Container maxWidth="lg">
            <Reveal>
              <Grid
                container
                spacing={{ xs: 4, md: 8 }}
                alignItems="flex-start"
              >
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
                      Respostas diretas para você entender a Hyppado e decidir
                      com segurança.
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
            </Reveal>
          </Container>
        </SectionShell>

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
            <Grid
              container
              spacing={{ xs: 4, md: 6 }}
              sx={{ mb: { xs: 4, md: 6 } }}
            >
              {/* Column 1 - Brand */}
              <Grid item xs={12} md={5}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.25}
                  sx={{ mb: 2.5 }}
                >
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
                          document.getElementById(id)?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
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

        {/* Scroll FAB */}
        <ScrollFAB />
      </Box>
    </ThemeProvider>
  );
}
