"use client";

import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface CategoryFilterProps {
  value: string;
  onChange: (category: string) => void;
  categories: string[];
  size?: "small" | "medium";
  disabled?: boolean;
  allLabel?: string;
}

export function CategoryFilter({
  value,
  onChange,
  categories,
  size = "small",
  disabled = false,
  allLabel = "Todas",
}: CategoryFilterProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size={size} sx={{ minWidth: 140 }}>
      <Select
        id="category-filter-select"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        displayEmpty
        aria-label={`Categoria: ${value || allLabel}`}
        sx={{
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
          "& .MuiSelect-icon": {
            color: "rgba(255,255,255,0.5)",
          },
        }}
        renderValue={(selected) => {
          if (!selected) {
            return (
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Categoria</span>
            );
          }
          return selected;
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.75rem" }}>
          {allLabel}
        </MenuItem>
        {categories.map((category) => (
          <MenuItem
            key={category}
            value={category}
            sx={{ fontSize: "0.75rem" }}
          >
            {category}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
