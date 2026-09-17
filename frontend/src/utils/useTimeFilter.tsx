import { useMemo } from "react";
import type { Request } from "../../../types";

export type TimeRange = "1H" | "8H" | "1D" | "1W" | "ALL";

export const rangeLabels: Record<TimeRange, string> = {
  "1H": "Last 1h",
  "8H": "Last 8h",
  "1D": "Last 24h",
  "1W": "Last 7 Days",
  "ALL": "All Time",
};

export function useFilteredData(data: Request[], timeRange: TimeRange) {
  return useMemo(() => {
    if (!data || data.length === 0) return [];
    if (timeRange === "ALL") return data;

    const currentTime = new Date().getTime();
    const oneHour = 60 * 60 * 1000;
    
    const timeLimits: Record<Exclude<TimeRange, "ALL">, number> = {
      "1H": oneHour,
      "8H": oneHour * 8,
      "1D": oneHour * 24,
      "1W": oneHour * 24 * 7,
    };

    const limit = timeLimits[timeRange];

    return data.filter((d) => {
      const pointTime = new Date(d.timestamp).getTime();
      return currentTime - pointTime <= limit;
    });
  }, [data, timeRange]);
}