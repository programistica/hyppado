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
  },
});

// Sidebar navigation items (Dashboard removed)
const NAV_ITEMS = [
  { label: "Vídeos", icon: VideoLibrary, href: "/app/videos" },
  { label: "Produtos", icon: Inventory2, href: "/app/products" },
  { label: "Creators", icon: Person, href: "/app/creators" },
  { label: "Tendências", icon: TrendingUp, href: "/app/trends" },
];

// Bottom nav items (Admin only shown if NEXT_PUBLIC_ADMIN_MODE === "true")
const isAdminMode = process.env.NEXT_PUBLIC_ADMIN_MODE === "true";
const BOTTOM_NAV_ITEMS = isAdminMode
  ? [{ label: "Admin", icon: AdminPanelSettingsOutlined, href: "/app/admin" }]
  : [];

/** Desktop Header with Quota Pills */
function QuotaHeader() {
  const quota = useQuotaUsage();

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 2,
        px: 4,
        py: 2,
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
          px: 3,
          py: 2.5,
          minHeight: 72,
          flexShrink: 0,
        }}
      >
        <Logo
          href="/app/videos"
          mode="dark"
          variant="full"
          responsiveHeight={{ xs: 32, sm: 34, md: 38, lg: 42 }}
        />
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

      {/* Navigation */}
      <List
        sx={{
          flex: 1,
          py: 2,
          overflowY: "auto",
          overscrollBehavior: "contain",
        }}
      >
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const active = isActive(href);
          return (
            <ListItem key={label} disablePadding>
              <ListItemButton
                component={Link}
                href={href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  mx: 1.5,
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.25,
                  background: active
                    ? "rgba(45, 212, 255, 0.1)"
                    : "transparent",
                  "&:hover": {
                    background: active
                      ? "rgba(45, 212, 255, 0.15)"
                      : "rgba(255,255,255,0.04)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Icon
                    sx={{
                      fontSize: 20,
                      color: active ? "#2DD4FF" : "rgba(255,255,255,0.5)",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 500,
                    color: active ? "#2DD4FF" : "rgba(255,255,255,0.75)",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", flexShrink: 0 }} />

      {/* Bottom actions */}
      <List sx={{ py: 2, flexShrink: 0 }}>
        {BOTTOM_NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const active = isActive(href);
          return (
            <ListItem key={label} disablePadding>
              <ListItemButton
                component={Link}
                href={href}
                onClick={() => setMobileOpen(false)}
                sx={{
                  mx: 1.5,
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.25,
                  background: active
                    ? "rgba(45, 212, 255, 0.1)"
                    : "transparent",
                  "&:hover": {
                    background: active
                      ? "rgba(45, 212, 255, 0.15)"
                      : "rgba(255,255,255,0.04)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Icon
                    sx={{
                      fontSize: 20,
                      color: active ? "#2DD4FF" : "rgba(255,255,255,0.5)",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 500,
                    color: active ? "#2DD4FF" : "rgba(255,255,255,0.75)",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/login"
            sx={{
              mx: 1.5,
              borderRadius: 2,
              py: 1.25,
              "&:hover": { background: "rgba(255,255,255,0.04)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Logout sx={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }} />
            </ListItemIcon>
            <ListItemText
              primary="Sair"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.75)",
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
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
            <Toolbar sx={{ minHeight: 64, justifyContent: "space-between" }}>
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
              py: { xs: 3, md: 4 },
              px: { xs: 2, md: 4 },
              overflowY: "auto",
              overscrollBehavior: "contain",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
