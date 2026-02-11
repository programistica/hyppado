/**
 * Time range utilities for filtering data by period
 */

export type TimeRange = "1d" | "7d" | "30d" | "90d";

export interface TimeRangeOption {
  value: TimeRange;
  label: string;
  days: number;
}

export const TIME_RANGES: TimeRangeOption[] = [
  { value: "1d", label: "Último dia", days: 1 },
  { value: "7d", label: "Últimos 7 dias", days: 7 },
  { value: "30d", label: "Últimos 30 dias", days: 30 },
  { value: "90d", label: "Últimos 90 dias", days: 90 },
];

/**
 * Normalize a time range input to a valid TimeRange value
 * @param input - Raw input from URL or user
 * @returns Valid TimeRange, defaults to "7d"
 */
export function normalizeRange(input?: string | null): TimeRange {
  const valid: TimeRange[] = ["1d", "7d", "30d", "90d"];
  if (input && valid.includes(input as TimeRange)) {
    return input as TimeRange;
  }
  return "7d";
}

/**
 * Convert a time range to number of days
 * @param range - TimeRange value
 * @returns Number of days
 */
export function rangeToDays(range: TimeRange): number {
  const option = TIME_RANGES.find((r) => r.value === range);
  return option?.days ?? 7;
}

/**
 * Get label for a time range
 * @param range - TimeRange value
 * @returns Display label
 */
export function getRangeLabel(range: TimeRange): string {
  const option = TIME_RANGES.find((r) => r.value === range);
  return option?.label ?? "Últimos 7 dias";
}

/**
 * Build query string from params object
 * @param params - Current URL params
 * @param overrides - Params to override
 * @returns Query string (without ?)
 */
export function buildQueryString(
  params: Record<string, string | null | undefined>,
  overrides: Record<string, string | null | undefined> = {},
): string {
  const merged = { ...params, ...overrides };
  const filtered = Object.entries(merged).filter(
    ([_, value]) => value != null && value !== "",
  );
  return new URLSearchParams(
    filtered.map(([key, value]) => [key, value as string]),
  ).toString();
}
