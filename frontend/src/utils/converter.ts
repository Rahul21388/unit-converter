// Pure conversion functions. No I/O, no side effects.
// Temperature uses direct formulas; all other categories use the base-unit
// approach: value_in_base = value * fromFactor; output = value_in_base / toFactor.

import { CategoryDef, UnitDef } from "@/src/constants/units";

export function convert(
  value: number,
  fromUnit: UnitDef,
  toUnit: UnitDef,
  category: CategoryDef,
): number {
  if (!Number.isFinite(value)) return NaN;
  if (category.key === "temperature") {
    return convertTemperature(value, fromUnit.key, toUnit.key);
  }
  const inBase = value * fromUnit.factor;
  return inBase / toUnit.factor;
}

function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value;
  // First convert to Celsius.
  let c: number;
  switch (from) {
    case "c": c = value; break;
    case "f": c = (value - 32) * (5 / 9); break;
    case "k": c = value - 273.15; break;
    default: return NaN;
  }
  // Then from Celsius to target.
  switch (to) {
    case "c": return c;
    case "f": return c * (9 / 5) + 32;
    case "k": return c + 273.15;
    default: return NaN;
  }
}

// Pretty-print a number: avoid trailing zeros, cap precision, handle huge/tiny.
export function formatResult(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e12 || abs < 1e-6) {
    return n.toExponential(6).replace(/\.?0+e/, "e");
  }
  // Up to 8 significant digits, then strip trailing zeros.
  const fixed = n.toPrecision(8);
  return parseFloat(fixed).toString();
}
