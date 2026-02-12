"use client";

import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  ListSubheader,
} from "@mui/material";
import type { ShopCategory } from "@/lib/types/echotik";

interface CategoryFilterProps {
  value: string;
  onChange: (category: string) => void;
  /** Pode receber ShopCategory[] ou string[] para compatibilidade */
  categories: ShopCategory[] | string[];
  size?: "small" | "medium";
  disabled?: boolean;
  allLabel?: string;
}

/**
 * CategoryFilter - Filtro de categoria com suporte hierárquico
 *
 * Aceita tanto ShopCategory[] (com path/slug) quanto string[] simples.
 * Em modo ShopCategory, exibe o path hierárquico e usa slug como value.
 */
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

  // Detectar se são ShopCategory ou strings simples
  const isShopCategories =
    categories.length > 0 && typeof categories[0] !== "string";

  // Organizar categorias por nível para exibição hierárquica
  const renderCategories = () => {
    if (!isShopCategories) {
      // Modo simples: strings
      return (categories as string[]).map((category) => (
        <MenuItem key={category} value={category} sx={{ fontSize: "0.75rem" }}>
          {category}
        </MenuItem>
      ));
    }

    // Modo ShopCategory: exibir com hierarquia visual
    const shopCategories = categories as ShopCategory[];

    // Agrupar por categoria raiz
    const rootCategories = shopCategories.filter((c) => c.level === 0);
    const items: React.ReactNode[] = [];

    rootCategories.forEach((root) => {
      // Adicionar categoria raiz como subheader
      items.push(
        <ListSubheader
          key={`header-${root.id}`}
          sx={{
            backgroundColor: "rgba(45, 212, 255, 0.08)",
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.7rem",
            fontWeight: 600,
            lineHeight: "28px",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          {root.name}
        </ListSubheader>,
      );

      // Adicionar a própria categoria raiz como opção
      items.push(
        <MenuItem
          key={root.id}
          value={root.slug}
          sx={{
            fontSize: "0.75rem",
            pl: 2,
            fontWeight: 500,
          }}
        >
          Todos em {root.name}
        </MenuItem>,
      );

      // Adicionar subcategorias
      const subs = shopCategories.filter((c) => c.parentId === root.id);
      subs.forEach((sub) => {
        items.push(
          <MenuItem
            key={sub.id}
            value={sub.slug}
            sx={{
              fontSize: "0.75rem",
              pl: 3,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {sub.name}
          </MenuItem>,
        );

        // Subcategorias de nível 2
        const subs2 = shopCategories.filter((c) => c.parentId === sub.id);
        subs2.forEach((sub2) => {
          items.push(
            <MenuItem
              key={sub2.id}
              value={sub2.slug}
              sx={{
                fontSize: "0.7rem",
                pl: 4,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {sub2.name}
            </MenuItem>,
          );
        });
      });
    });

    return items;
  };

  // Encontrar label para exibição do valor selecionado
  const getDisplayValue = (selected: string) => {
    if (!selected) {
      return <span style={{ color: "rgba(255,255,255,0.5)" }}>Categoria</span>;
    }

    if (isShopCategories) {
      const shopCategories = categories as ShopCategory[];
      const found = shopCategories.find((c) => c.slug === selected);
      return found?.path || found?.name || selected;
    }

    return selected;
  };

  return (
    <FormControl size={size} sx={{ minWidth: 160 }}>
      <Select
        id="category-filter-select"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        displayEmpty
        aria-label={`Categoria: ${value || allLabel}`}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 320,
              backgroundColor: "#0A0F18",
              border: "1px solid rgba(45, 212, 255, 0.15)",
            },
          },
        }}
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
        renderValue={(selected) => getDisplayValue(selected)}
      >
        <MenuItem value="" sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
          {allLabel}
        </MenuItem>
        {renderCategories()}
      </Select>
    </FormControl>
  );
}
