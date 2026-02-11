"use client";

import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { TimeRange, TIME_RANGES, getRangeLabel } from "@/lib/filters/timeRange";

interface TimeRangeSelectProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  size?: "small" | "medium";
  disabled?: boolean;
}

export function TimeRangeSelect({
  value,
  onChange,
  size = "small",
  disabled = false,
}: TimeRangeSelectProps) {
  const handleChange = (event: SelectChangeEvent<TimeRange>) => {
    onChange(event.target.value as TimeRange);
  };

  return (
    <FormControl size={size} sx={{ minWidth: 140 }}>
      <Select
        id="time-range-select"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        aria-label={`Período: ${getRangeLabel(value)}`}
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
      >
        {TIME_RANGES.map((range) => (
          <MenuItem
            key={range.value}
            value={range.value}
            sx={{ fontSize: "0.75rem" }}
          >
            {range.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
