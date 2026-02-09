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
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  VideoLibrary,
  Inventory2,
  Person,
  TrendingUp,
  Settings,
  Logout,
} from "@mui/icons-material";

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
      sx={{
        width: 260,
        height: "100%",
        background: "#0A0F18",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Link href="/app/videos" style={{ display: "inline-block" }}>
          <Box
            component="img"
            src="/logo/logo.png"
            alt="Hyppado"
            sx={{ height: 32 }}
          />
        </Link>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

      {/* Navigation */}
      <List sx={{ flex: 1, py: 2 }}>
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

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

      {/* Bottom actions */}
      <List sx={{ py: 2 }}>
        <ListItem disablePadding>
          <Tooltip title="Em breve" placement="right">
            <span style={{ width: "100%" }}>
              <ListItemButton
                disabled
                sx={{
                  mx: 1.5,
                  borderRadius: 2,
                  py: 1.25,
                  opacity: 0.5,
                  cursor: "not-allowed",
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Settings
                    sx={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Configurações"
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.75)",
                  }}
                />
              </ListItemButton>
            </span>
          </Tooltip>
        </ListItem>
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
        sx={{
          minHeight: "100vh",
          background: `
            radial-gradient(ellipse 800px 500px at 10% 10%, rgba(45, 212, 255, 0.04), transparent 50%),
            radial-gradient(ellipse 600px 400px at 90% 90%, rgba(45, 212, 255, 0.03), transparent 45%),
            #06080F
          `,
          display: "flex",
        }}
      >
        {/* Desktop Sidebar */}
        <Box
          component="nav"
          sx={{
            width: { md: 260 },
            flexShrink: 0,
            display: { xs: "none", md: "block" },
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
            "& .MuiDrawer-paper": { width: 260 },
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
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="abrir menu"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ ml: 2 }}>
                <Link href="/app/videos">
                  <Box
                    component="img"
                    src="/logo/logo.png"
                    alt="Hyppado"
                    sx={{ height: 28 }}
                  />
                </Link>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Page Content */}
          <Box sx={{ flex: 1, py: { xs: 3, md: 4 }, px: { xs: 2, md: 4 } }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
