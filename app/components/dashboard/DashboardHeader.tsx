"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { Search, FilterList, Refresh } from "@mui/icons-material";
import type { TimeRange } from "@/lib/types/kalodata";

interface DashboardHeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function DashboardHeader({
  timeRange,
  onTimeRangeChange,
  searchQuery,
  onSearchChange,
  onRefresh,
  loading = false,
}: DashboardHeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearchChange(localSearch);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSearchSubmit}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 1.5,
        alignItems: { xs: "stretch", md: "center" },
      }}
    >
      {/* Time Range Selector - Disabled since XLSX data is fixed to 7 days */}
      <Tooltip title="Dados fixos dos últimos 7 dias">
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            id="time-range-select"
            value="7d"
            disabled
            aria-label="Período: Últimos 7 dias"
            sx={{
              borderRadius: 1.5,
              backgroundColor: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.75rem",
              height: 36,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(45, 212, 255, 0.08)",
              },
              "&.Mui-disabled": {
                color: "rgba(255,255,255,0.5)",
              },
              "& .MuiSelect-icon": {
                color: "rgba(255,255,255,0.3)",
              },
            }}
          >
            <MenuItem value="7d">Últimos 7 dias</MenuItem>
          </Select>
        </FormControl>
      </Tooltip>

      {/* Search Input */}
      <TextField
        id="dashboard-search"
        placeholder="Buscar vídeo, produto ou criador..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        onKeyDown={handleSearchKeyDown}
        disabled={loading}
        size="small"
        sx={{
          flex: 1,
          maxWidth: { md: 350 },
          "& .MuiOutlinedInput-root": {
            borderRadius: 1.5,
            backgroundColor: "rgba(255,255,255,0.04)",
            color: "#fff",
            fontSize: "0.75rem",
            height: 36,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(45, 212, 255, 0.18)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(45, 212, 255, 0.35)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2DD4FF",
            },
          },
          "& .MuiInputBase-input": {
            padding: "6px 8px",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "rgba(255,255,255,0.4)",
            opacity: 1,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "rgba(255,255,255,0.4)", fontSize: 18 }} />
            </InputAdornment>
          ),
          "aria-label": "Buscar",
        }}
      />

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 0.75 }}>
        <Tooltip title="Em breve">
          <span>
            <IconButton
              aria-label="Filtros avançados (em breve)"
              disabled
              sx={{
                color: "rgba(255,255,255,0.3)",
                border: "1px solid rgba(45, 212, 255, 0.08)",
                borderRadius: 1.5,
                width: 36,
                height: 36,
                "&.Mui-disabled": {
                  color: "rgba(255,255,255,0.3)",
                },
              }}
            >
              <FilterList sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>

        {onRefresh && (
          <Tooltip title="Atualizar dados">
            <IconButton
              onClick={onRefresh}
              disabled={loading}
              aria-label="Atualizar dados"
              sx={{
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(45, 212, 255, 0.18)",
                borderRadius: 1.5,
                width: 36,
                height: 36,
                "&:hover": {
                  color: "#2DD4FF",
                  borderColor: "rgba(45, 212, 255, 0.35)",
                },
                "&.Mui-disabled": {
                  color: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <Refresh
                className={loading ? "animate-spin" : ""}
                sx={{ fontSize: 18 }}
              />
            </IconButton>
          </Tooltip>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            display: { xs: "flex", md: "none" },
            background: "#2DD4FF",
            color: "#06080F",
            fontWeight: 600,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              background: "#5BE0FF",
            },
          }}
        >
          Buscar
        </Button>
      </Box>
    </Box>
  );
}
