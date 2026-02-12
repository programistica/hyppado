"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  VideoLibrary,
  Inventory2,
  Person,
  TrendingUp,
  AdminPanelSettingsOutlined,
  Logout,
  SubtitlesOutlined,
  TerminalOutlined,
  BookmarkBorder,
  Whatshot,
  FiberNew,
  CardMembership,
  HelpOutline,
} from "@mui/icons-material";
import { Logo } from "@/app/components/ui/Logo";
import { useQuotaUsage, formatQuotaDisplay } from "@/lib/admin/useQuotaUsage";

// Hyppado dark theme (navy #06080F + accent #2DD4FF)
const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#06080F",
      paper: "#0A0F18",
    },
    primary: {
      main: "#2DD4FF",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.7)",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    fontSize: 13,
    h1: {
      fontSize: "1.25rem",
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h2: {
      fontSize: "1.1rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: "0.8125rem",
      lineHeight: 1.4,
    },
    body2: {
      fontSize: "0.75rem",
      lineHeight: 1.35,
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "0.8125rem",
        },
        input: {
          padding: "6px 8px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "0.8125rem",
        },
        sizeSmall: {
          padding: "4px 10px",
          fontSize: "0.75rem",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: "6px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: "0.6875rem",
          height: "22px",
        },
      },
    },
  },
});

// Sidebar navigation items organized in sections
const NAV_SECTIONS = [
  {
    label: "EXPLORAR",
    items: [
      { label: "Vídeos em Alta", icon: VideoLibrary, href: "/app/videos" },
      { label: "Produtos Hype", icon: Whatshot, href: "/app/products" },
      { label: "Novos Produtos", icon: FiberNew, href: "/app/trends" },
      { label: "Creators", icon: Person, href: "/app/creators" },
    ],
  },
  {
    label: "BIBLIOTECA",
    items: [
      {
        label: "Vídeos salvos",
        icon: BookmarkBorder,
        href: "/app/videos-salvos",
      },
      {
        label: "Produtos salvos",
        icon: Inventory2,
        href: "/app/produtos-salvos",
      },
    ],
  },
  {
    label: "CONTA",
    items: [
      { label: "Assinatura", icon: CardMembership, href: "/app/assinatura" },
      { label: "Suporte", icon: HelpOutline, href: "/app/suporte" },
    ],
  },
];

// Bottom nav section (Admin + Sair)
const isAdminMode = process.env.NEXT_PUBLIC_ADMIN_MODE === "true";

/** Desktop Header with Quota Pills */
function QuotaHeader() {
  const quota = useQuotaUsage();

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 1.5,
        px: 3,
        py: 1.25,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "rgba(10, 15, 24, 0.5)",
      }}
    >
      {/* Transcripts */}
      <Tooltip title="Transcrições usadas este mês">
        <Chip
          icon={<SubtitlesOutlined sx={{ fontSize: 16 }} />}
          label={`Transcripts: ${formatQuotaDisplay(quota.transcripts.used, quota.transcripts.max)}`}
          size="small"
          sx={{
            background: "rgba(45, 212, 255, 0.1)",
            border: "1px solid rgba(45, 212, 255, 0.2)",
            color: "#2DD4FF",
            "& .MuiChip-icon": { color: "#2DD4FF" },
            fontWeight: 500,
            fontSize: "0.75rem",
          }}
        />
      </Tooltip>

      {/* Scripts */}
      <Tooltip title="Roteiros gerados este mês">
        <Chip
          icon={<TerminalOutlined sx={{ fontSize: 16 }} />}
          label={`Scripts: ${formatQuotaDisplay(quota.scripts.used, quota.scripts.max)}`}
          size="small"
          sx={{
            background: "rgba(156, 39, 176, 0.1)",
            border: "1px solid rgba(156, 39, 176, 0.2)",
            color: "#CE93D8",
            "& .MuiChip-icon": { color: "#CE93D8" },
            fontWeight: 500,
            fontSize: "0.75rem",
          }}
        />
      </Tooltip>
    </Box>
  );
}

/** Mobile Quota Pills - Compact */
function MobileQuotaPills() {
  const quota = useQuotaUsage();

  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip
        title={`Transcripts: ${formatQuotaDisplay(quota.transcripts.used, quota.transcripts.max)}`}
      >
        <Chip
          icon={<SubtitlesOutlined sx={{ fontSize: 12 }} />}
          label={formatQuotaDisplay(
            quota.transcripts.used,
            quota.transcripts.max,
          )}
          size="small"
          sx={{
            background: "rgba(45, 212, 255, 0.1)",
            color: "#2DD4FF",
            "& .MuiChip-icon": { color: "#2DD4FF", ml: 0.5 },
            height: 24,
            fontSize: "0.65rem",
            "& .MuiChip-label": { px: 0.75 },
          }}
        />
      </Tooltip>
      <Tooltip
        title={`Scripts: ${formatQuotaDisplay(quota.scripts.used, quota.scripts.max)}`}
      >
        <Chip
          icon={<TerminalOutlined sx={{ fontSize: 12 }} />}
          label={formatQuotaDisplay(quota.scripts.used, quota.scripts.max)}
          size="small"
          sx={{
            background: "rgba(156, 39, 176, 0.1)",
            color: "#CE93D8",
            "& .MuiChip-icon": { color: "#CE93D8", ml: 0.5 },
            height: 24,
            fontSize: "0.65rem",
            "& .MuiChip-label": { px: 0.75 },
          }}
        />
      </Tooltip>
    </Stack>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Check if current path matches nav item
  const isActive = (href: string) => {
    if (href === "/app/videos" && pathname === "/app") return true;
    return pathname === href || pathname?.startsWith(href + "/");
  };

  // Sidebar content
  const sidebarContent = (
    <Box
      className="app-sidebar"
      sx={{
        width: 260,
        height: { xs: "100dvh", md: "100dvh" },
        minHeight: { xs: "100dvh", md: "100dvh" },
        maxHeight: { xs: "100dvh", md: "100dvh" },
        background: "#0A0F18",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Logo / Brand Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1.5,
          py: 1,
          minHeight: 40,
          flexShrink: 0,
        }}
      >
        <Logo
          href="/app/videos"
          mode="dark"
          variant="full"
          responsiveHeight={{ xs: 22, sm: 24, md: 26, lg: 28 }}
        />
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", flexShrink: 0 }} />

      {/* Navigation - no scroll */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          px: 1.25,
          py: 1,
          minHeight: 0,
        }}
      >
        {NAV_SECTIONS.map((section, sectionIndex) => (
          <Box
            key={section.label}
            sx={{ mb: sectionIndex < NAV_SECTIONS.length - 1 ? 0.9 : 0 }}
          >
            {/* Section Label */}
            <Typography
              sx={{
                fontSize: "0.55rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                px: 1,
                mb: 0.3,
              }}
            >
              {section.label}
            </Typography>

            {/* Section Items */}
            <List
              disablePadding
              sx={{ display: "flex", flexDirection: "column", gap: 0.15 }}
            >
              {section.items.map(({ label, icon: Icon, href }) => {
                const active = isActive(href);
                return (
                  <ListItem key={label} disablePadding>
                    <ListItemButton
                      component={Link}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      sx={{
                        borderRadius: 2,
                        minHeight: 32,
                        px: 1,
                        py: 0.35,
                        position: "relative",
                        background: active
                          ? "rgba(45, 212, 255, 0.08)"
                          : "transparent",
                        "&:hover": {
                          background: active
                            ? "rgba(45, 212, 255, 0.12)"
                            : "rgba(255,255,255,0.03)",
                        },
                        "&::before": active
                          ? {
                              content: '""',
                              position: "absolute",
                              left: 0,
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: 3,
                              height: 14,
                              borderRadius: "0 4px 4px 0",
                              background: "#2DD4FF",
                            }
                          : {},
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <Icon
                          sx={{
                            fontSize: 15,
                            color: active ? "#2DD4FF" : "rgba(255,255,255,0.5)",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={label}
                        primaryTypographyProps={{
                          fontSize: "0.75rem",
                          fontWeight: active ? 600 : 500,
                          color: active ? "#2DD4FF" : "rgba(255,255,255,0.75)",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Bottom actions - fixed at bottom */}
      <Box sx={{ flexShrink: 0, px: 1.25, pb: 0.75, pt: 0.75 }}>
        {/* Admin section (if enabled) */}
        {isAdminMode && (
          <Box sx={{ mb: 0.6 }}>
            <Typography
              sx={{
                fontSize: "0.55rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                px: 1,
                mb: 0.3,
              }}
            >
              ADMIN
            </Typography>
            <List disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/app/admin"
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    minHeight: 32,
                    px: 1,
                    py: 0.35,
                    position: "relative",
                    background: isActive("/app/admin")
                      ? "rgba(45, 212, 255, 0.08)"
                      : "transparent",
                    "&:hover": {
                      background: isActive("/app/admin")
                        ? "rgba(45, 212, 255, 0.12)"
                        : "rgba(255,255,255,0.03)",
                    },
                    "&::before": isActive("/app/admin")
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 3,
                          height: 14,
                          borderRadius: "0 4px 4px 0",
                          background: "#2DD4FF",
                        }
                      : {},
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <AdminPanelSettingsOutlined
                      sx={{
                        fontSize: 15,
                        color: isActive("/app/admin")
                          ? "#2DD4FF"
                          : "rgba(255,255,255,0.5)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Admin"
                    primaryTypographyProps={{
                      fontSize: "0.75rem",
                      fontWeight: isActive("/app/admin") ? 600 : 500,
                      color: isActive("/app/admin")
                        ? "#2DD4FF"
                        : "rgba(255,255,255,0.75)",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        )}

        {/* Sair (Logout) */}
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/login"
              sx={{
                borderRadius: 2,
                minHeight: 32,
                px: 1,
                py: 0.35,
                "&:hover": { background: "rgba(255,255,255,0.03)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 24 }}>
                <Logout sx={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }} />
              </ListItemIcon>
              <ListItemText
                primary="Sair"
                primaryTypographyProps={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.75)",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        className="app-shell"
        sx={{
          height: { xs: "100dvh", md: "100dvh" },
          minHeight: { xs: "100dvh", md: "100dvh" },
          maxHeight: { xs: "100dvh", md: "100dvh" },
          background: `
            radial-gradient(ellipse 800px 500px at 10% 10%, rgba(45, 212, 255, 0.04), transparent 50%),
            radial-gradient(ellipse 600px 400px at 90% 90%, rgba(45, 212, 255, 0.03), transparent 45%),
            #06080F
          `,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Desktop Sidebar */}
        <Box
          component="nav"
          sx={{
            width: { md: 260 },
            flexShrink: 0,
            display: { xs: "none", md: "block" },
            height: "100%",
          }}
        >
          {sidebarContent}
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: 260,
              height: "100dvh",
              maxHeight: "100dvh",
              overflow: "hidden",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          {sidebarContent}
        </Drawer>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Desktop Header with Quota Pills */}
          <QuotaHeader />

          {/* Mobile Top Bar */}
          <AppBar
            position="static"
            elevation={0}
            sx={{
              display: { xs: "block", md: "none" },
              background: "rgba(10, 15, 24, 0.9)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Toolbar sx={{ minHeight: 52, justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="abrir menu"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
                <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
                  <Logo href="/app/videos" mode="dark" size="nav" />
                </Box>
              </Box>
              {/* Mobile quota pills - compact */}
              <MobileQuotaPills />
            </Toolbar>
          </AppBar>

          {/* Page Content */}
          <Box
            sx={{
              flex: 1,
              py: { xs: 2, md: 2.5 },
              px: { xs: 2, md: 3 },
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
