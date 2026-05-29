// All unit definitions and conversion factors.
// Each non-temperature category uses a "base unit" approach: every unit has a
// factor relative to the chosen base. Temperature is handled separately in
// the converter utility using direct formulas.

export type CategoryKey =
  | "length"
  | "weight"
  | "temperature"
  | "area"
  | "volume"
  | "speed"
  | "time"
  | "data";

export interface UnitDef {
  key: string;
  label: string;
  symbol: string;
  // factor to convert from this unit to base unit (e.g. metres for length).
  factor: number;
}

export interface CategoryDef {
  key: CategoryKey;
  name: string;
  icon: string; // emoji
  base: string; // base unit key
  units: UnitDef[];
  // Visual colors come from `categoryColors` below.
}

export const CATEGORIES: CategoryDef[] = [
  {
    key: "length",
    name: "Length",
    icon: "📏",
    base: "m",
    units: [
      { key: "mm", label: "Millimetre", symbol: "mm", factor: 0.001 },
      { key: "cm", label: "Centimetre", symbol: "cm", factor: 0.01 },
      { key: "m", label: "Metre", symbol: "m", factor: 1 },
      { key: "km", label: "Kilometre", symbol: "km", factor: 1000 },
      { key: "inch", label: "Inch", symbol: "in", factor: 0.0254 },
      { key: "foot", label: "Foot", symbol: "ft", factor: 0.3048 },
      { key: "yard", label: "Yard", symbol: "yd", factor: 0.9144 },
      { key: "mile", label: "Mile", symbol: "mi", factor: 1609.344 },
    ],
  },
  {
    key: "weight",
    name: "Weight",
    icon: "⚖️",
    base: "kg",
    units: [
      { key: "mg", label: "Milligram", symbol: "mg", factor: 0.000001 },
      { key: "g", label: "Gram", symbol: "g", factor: 0.001 },
      { key: "kg", label: "Kilogram", symbol: "kg", factor: 1 },
      { key: "tonne", label: "Tonne", symbol: "t", factor: 1000 },
      { key: "ounce", label: "Ounce", symbol: "oz", factor: 0.0283495 },
      { key: "pound", label: "Pound", symbol: "lb", factor: 0.453592 },
    ],
  },
  {
    key: "temperature",
    name: "Temperature",
    icon: "🌡️",
    base: "c", // unused; handled via formulas
    units: [
      { key: "c", label: "Celsius", symbol: "°C", factor: 1 },
      { key: "f", label: "Fahrenheit", symbol: "°F", factor: 1 },
      { key: "k", label: "Kelvin", symbol: "K", factor: 1 },
    ],
  },
  {
    key: "area",
    name: "Area",
    icon: "📐",
    base: "m2",
    units: [
      { key: "mm2", label: "Square Millimetre", symbol: "mm²", factor: 0.000001 },
      { key: "cm2", label: "Square Centimetre", symbol: "cm²", factor: 0.0001 },
      { key: "m2", label: "Square Metre", symbol: "m²", factor: 1 },
      { key: "km2", label: "Square Kilometre", symbol: "km²", factor: 1_000_000 },
      { key: "acre", label: "Acre", symbol: "ac", factor: 4046.8564224 },
      { key: "hectare", label: "Hectare", symbol: "ha", factor: 10000 },
      { key: "sqft", label: "Square Foot", symbol: "ft²", factor: 0.09290304 },
      { key: "sqin", label: "Square Inch", symbol: "in²", factor: 0.00064516 },
    ],
  },
  {
    key: "volume",
    name: "Volume",
    icon: "🧪",
    base: "l",
    units: [
      { key: "ml", label: "Millilitre", symbol: "ml", factor: 0.001 },
      { key: "l", label: "Litre", symbol: "L", factor: 1 },
      { key: "m3", label: "Cubic Metre", symbol: "m³", factor: 1000 },
      { key: "tsp", label: "Teaspoon (US)", symbol: "tsp", factor: 0.00492892 },
      { key: "tbsp", label: "Tablespoon (US)", symbol: "tbsp", factor: 0.0147868 },
      { key: "cup", label: "Cup (US)", symbol: "cup", factor: 0.24 },
      { key: "pint", label: "Pint (US)", symbol: "pt", factor: 0.473176 },
      { key: "gallon", label: "Gallon (US)", symbol: "gal", factor: 3.78541 },
    ],
  },
  {
    key: "speed",
    name: "Speed",
    icon: "🚀",
    base: "mps",
    units: [
      { key: "mps", label: "Metre per Second", symbol: "m/s", factor: 1 },
      { key: "kmh", label: "Kilometre per Hour", symbol: "km/h", factor: 0.277778 },
      { key: "mph", label: "Mile per Hour", symbol: "mph", factor: 0.44704 },
      { key: "knot", label: "Knot", symbol: "kn", factor: 0.514444 },
    ],
  },
  {
    key: "time",
    name: "Time",
    icon: "⏱️",
    base: "s",
    units: [
      { key: "s", label: "Second", symbol: "s", factor: 1 },
      { key: "min", label: "Minute", symbol: "min", factor: 60 },
      { key: "hr", label: "Hour", symbol: "hr", factor: 3600 },
      { key: "day", label: "Day", symbol: "day", factor: 86400 },
      { key: "week", label: "Week", symbol: "wk", factor: 604800 },
      { key: "month", label: "Month", symbol: "mo", factor: 2629800 }, // avg
      { key: "year", label: "Year", symbol: "yr", factor: 31557600 }, // avg
    ],
  },
  {
    key: "data",
    name: "Data Storage",
    icon: "💾",
    base: "byte",
    units: [
      { key: "bit", label: "Bit", symbol: "bit", factor: 0.125 },
      { key: "byte", label: "Byte", symbol: "B", factor: 1 },
      { key: "kb", label: "Kilobyte", symbol: "KB", factor: 1024 },
      { key: "mb", label: "Megabyte", symbol: "MB", factor: 1024 ** 2 },
      { key: "gb", label: "Gigabyte", symbol: "GB", factor: 1024 ** 3 },
      { key: "tb", label: "Terabyte", symbol: "TB", factor: 1024 ** 4 },
    ],
  },
];

export interface CategoryColor {
  bg: string;
  text: string;
  icon: string;
}

export const categoryColors: Record<CategoryKey, CategoryColor> = {
  length: { bg: "#A7F3D0", text: "#064E3B", icon: "#059669" },
  weight: { bg: "#DDD6FE", text: "#3730A3", icon: "#4F46E5" },
  temperature: { bg: "#FECACA", text: "#7F1D1D", icon: "#DC2626" },
  area: { bg: "#FDE047", text: "#713F12", icon: "#CA8A04" },
  volume: { bg: "#BAE6FD", text: "#0C4A6E", icon: "#0284C7" },
  speed: { bg: "#FBCFE8", text: "#831843", icon: "#DB2777" },
  time: { bg: "#D9F99D", text: "#3F6212", icon: "#65A30D" },
  data: { bg: "#E5E7EB", text: "#1F2937", icon: "#4B5563" },
};

export function getCategory(key: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.key === key);
}
