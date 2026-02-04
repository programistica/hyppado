"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#070B12",
      paper: "#0D1520",
    },
    primary: {
      main: "#39D5FF",
      light: "#6BE0FF",
      dark: "#00B8E6",
      contrastText: "#070B12",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A0B0C0",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: "3.25rem",
      fontWeight: 800,
      lineHeight: 1.08,
      letterSpacing: "-0.025em",
    },
    body1: {
      fontSize: "1.0625rem",
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "0.9375rem",
      lineHeight: 1.65,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },
        html: {
          margin: 0,
          padding: 0,
          backgroundColor: "#070B12",
        },
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: "#070B12",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(7, 11, 18, 0.85)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "999px",
        },
        containedPrimary: {
          backgroundColor: "#39D5FF",
          color: "#070B12",
          boxShadow: "0 0 24px rgba(57, 213, 255, 0.4)",
          "&:hover": {
            backgroundColor: "#5CE0FF",
            boxShadow: "0 0 32px rgba(57, 213, 255, 0.55)",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#8595A5",
          textDecoration: "none",
          transition: "color 0.2s ease",
          "&:hover": {
            color: "#FFFFFF",
          },
        },
      },
    },
  },
});

export default theme;
