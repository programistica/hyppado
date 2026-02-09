"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Grid,
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
  Dashboard,
  VideoLibrary,
  Inventory2,
  Person,
  TrendingUp,
  Settings,
  Logout,
} from "@mui/icons-material";

import { VideoGrid } from "@/app/components/dashboard/VideoGrid";
import { DashboardHeader } from "@/app/components/dashboard/DashboardHeader";
import { RightPanel } from "@/app/components/dashboard/RightPanel";
import {
  ProductTable,
  CreatorTable,
} from "@/app/components/dashboard/DataTable";
import type {
  TimeRange,
  VideoDTO,
  ProductDTO,
  CreatorDTO,
  SavedItemDTO,
  CollectionDTO,
  AlertDTO,
  NoteDTO,
} from "@/lib/types/kalodata";

// Hyppado dark theme (navy #06080F + accent #2DD4FF) — zero green
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

// Sidebar navigation items
const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: Dashboard,
    href: "/app",
    active: true,
    disabled: false,
  },
  { label: "Vídeos", icon: VideoLibrary, href: "/app/videos", disabled: true },
  {
    label: "Produtos",
    icon: Inventory2,
    href: "/app/produtos",
    disabled: true,
  },
  { label: "Creators", icon: Person, href: "/app/creators", disabled: true },
  {
    label: "Tendências",
    icon: TrendingUp,
    href: "/app/tendencias",
    disabled: true,
  },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Data states
  const [videos, setVideos] = useState<VideoDTO[]>([]);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [newProducts, setNewProducts] = useState<ProductDTO[]>([]);
  const [creators, setCreators] = useState<CreatorDTO[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItemDTO[]>([]);
  const [collections, setCollections] = useState<CollectionDTO[]>([]);
  const [alerts, setAlerts] = useState<AlertDTO[]>([]);
  const [notes, setNotes] = useState<NoteDTO[]>([]);
  const [savedVideoIds, setSavedVideoIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ range: timeRange, limit: "10" });
      if (searchQuery) params.set("search", searchQuery);

      // Fetch new products separately with filter=new
      const newProductsParams = new URLSearchParams({
        range: timeRange,
        limit: "5",
        filter: "new",
      });
      if (searchQuery) newProductsParams.set("search", searchQuery);

      const [
        videosRes,
        productsRes,
        newProductsRes,
        creatorsRes,
        savedRes,
        collectionsRes,
        alertsRes,
        notesRes,
      ] = await Promise.all([
        fetch(`/api/kalodata/videos?${params}`),
        fetch(`/api/kalodata/products?${params}`),
        fetch(`/api/kalodata/products?${newProductsParams}`),
        fetch(`/api/kalodata/creators?${params}`),
        fetch("/api/me/saved"),
        fetch("/api/me/collections"),
        fetch("/api/me/alerts"),
        fetch("/api/me/notes"),
      ]);

      // Parse all responses (APIs now always return success:true with empty array on error)
      const [
        videosJson,
        productsJson,
        newProductsJson,
        creatorsJson,
        savedData,
        collectionsData,
        alertsData,
        notesData,
      ] = await Promise.all([
        videosRes.json(),
        productsRes.json(),
        newProductsRes.json(),
        creatorsRes.json(),
        savedRes.ok ? savedRes.json() : [],
        collectionsRes.ok ? collectionsRes.json() : [],
        alertsRes.ok ? alertsRes.json() : [],
        notesRes.ok ? notesRes.json() : [],
      ]);

      // Extract items from API response structure: { success, data: { items } }
      const videoItems: VideoDTO[] = videosJson?.data?.items ?? [];
      const productItems: ProductDTO[] = productsJson?.data?.items ?? [];
      const newProductItems: ProductDTO[] = newProductsJson?.data?.items ?? [];
      const creatorItems: CreatorDTO[] = creatorsJson?.data?.items ?? [];
      const savedItemsList: SavedItemDTO[] = savedData?.data?.items ?? [];
      const collectionsList: CollectionDTO[] =
        collectionsData?.data?.items ?? [];
      const alertsList: AlertDTO[] = alertsData?.data?.items ?? [];
      const notesList: NoteDTO[] = notesData?.data?.items ?? [];

      setVideos(videoItems);
      setProducts(productItems);
      setNewProducts(newProductItems);
      setCreators(creatorItems);
      setSavedItems(savedItemsList);
      setCollections(collectionsList);
      setAlerts(alertsList);
      setNotes(notesList);
      setSavedVideoIds(
        new Set(
          savedItemsList
            .filter((s: SavedItemDTO) => s.type === "video")
            .map((s: SavedItemDTO) => s.externalId),
        ),
      );

      // Check if any API returned an error flag (soft error - data still available)
      if (
        videosJson?.data?.error ||
        productsJson?.data?.error ||
        creatorsJson?.data?.error
      ) {
        console.warn("Some data sources returned errors:", {
          videos: videosJson?.data?.error,
          products: productsJson?.data?.error,
          creators: creatorsJson?.data?.error,
        });
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Erro ao carregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [timeRange, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
        <Link href="/" style={{ display: "inline-block" }}>
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
        {NAV_ITEMS.map(({ label, icon: Icon, href, active, disabled }) => (
          <ListItem key={label} disablePadding>
            <Tooltip title={disabled ? "Em breve" : ""} placement="right">
              <span style={{ width: "100%" }}>
                <ListItemButton
                  component={disabled ? "div" : Link}
                  href={disabled ? undefined : href}
                  disabled={disabled}
                  sx={{
                    mx: 1.5,
                    borderRadius: 2,
                    mb: 0.5,
                    py: 1.25,
                    background: active
                      ? "rgba(45, 212, 255, 0.1)"
                      : "transparent",
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.5 : 1,
                    "&:hover": {
                      background: disabled
                        ? "transparent"
                        : active
                          ? "rgba(45, 212, 255, 0.15)"
                          : "rgba(255,255,255,0.04)",
                    },
                    "&.Mui-disabled": {
                      opacity: 0.5,
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
              </span>
            </Tooltip>
          </ListItem>
        ))}
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
                <Box
                  component="img"
                  src="/logo/logo.png"
                  alt="Hyppado"
                  sx={{ height: 28 }}
                />
              </Box>
            </Toolbar>
          </AppBar>

          {/* Page Content */}
          <Box sx={{ flex: 1, py: { xs: 3, md: 4 }, px: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" disableGutters>
              {/* Header with Title + Time Range + Search */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: { xs: "1.5rem", md: "1.75rem" },
                      fontWeight: 700,
                      color: "#fff",
                      mb: 0.5,
                    }}
                  >
                    Dashboard
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    Vídeos em alta e métricas de performance
                  </Typography>
                </Box>
                <DashboardHeader
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onRefresh={fetchData}
                  loading={loading}
                />
              </Box>

              {/* Error State */}
              {error && (
                <Box
                  role="alert"
                  aria-live="assertive"
                  sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: 2,
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    color: "#ef4444",
                    fontSize: "0.875rem",
                  }}
                >
                  {error}
                </Box>
              )}

              {/* ========== VIDEO GRID FIRST (PRIORITY) ========== */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "#fff",
                    mb: 2,
                  }}
                >
                  Top 10 Vídeos em Alta
                </Typography>
                <VideoGrid
                  videos={videos}
                  loading={loading}
                  error={error}
                  savedVideoIds={savedVideoIds}
                  onVideoSave={(video) => {
                    // Toggle saved state
                    setSavedVideoIds((prev) => {
                      const newSet = new Set(prev);
                      if (newSet.has(video.id)) {
                        newSet.delete(video.id);
                      } else {
                        newSet.add(video.id);
                      }
                      return newSet;
                    });
                  }}
                />
              </Box>

              {/* Two-column layout: Left (Products/Creators) + Right (User Features) */}
              <Grid container spacing={3}>
                {/* Left Column - Products and Creators */}
                <Grid item xs={12} lg={8}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {/* Top 10 Products */}
                    <ProductTable
                      products={products}
                      loading={loading}
                      title="Top 10 Produtos"
                    />

                    {/* Top 5 New Products */}
                    <ProductTable
                      products={newProducts}
                      loading={loading}
                      title="Novos Produtos Detectados"
                      showNewBadge
                    />

                    {/* Top 5 Creators */}
                    <CreatorTable
                      creators={creators}
                      loading={loading}
                      title="Top 5 Creators"
                    />
                  </Box>
                </Grid>

                {/* Right Column - User Features */}
                <Grid item xs={12} lg={4}>
                  <RightPanel
                    savedItems={savedItems}
                    collections={collections}
                    alerts={alerts}
                    notes={notes}
                    loading={loading}
                  />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
