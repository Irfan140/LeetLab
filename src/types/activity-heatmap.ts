import { colors } from "@/theme/theme";

export const CELL = 12;
export const GAP = 3;
export const WEEKS = 53;
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const LEVELS = [
  "rgba(255,255,255,0.06)",
  "rgba(189, 240, 110, 0.22)",
  "rgba(189, 240, 110, 0.45)",
  "rgba(189, 240, 110, 0.7)",
  colors.lime,
];

export type DayCell = {
  key: string;
  date: Date;
  count: number;
  level: number;
  inRange: boolean;
};