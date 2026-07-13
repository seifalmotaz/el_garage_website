/**
 * Pure numeric / string formatters used by the car-listing UI.
 *
 * The backend returns numeric fields (`price`, `mileage`, `year`) as raw
 * numbers. These helpers bridge that gap so presentation code can stay
 * free of `Intl.NumberFormat` calls.
 *
 * All functions are pure and side-effect free — no React, no fetch.
 */

/** Locale used for thousands separators. */
const LOCALE = "en-US";

/**
 * Format a price as a thousands-separated string. The caller is responsible
 * for appending any currency suffix (e.g. ` ج.م`).
 *
 *   `formatPrice(6200000)` → `"6,200,000"`
 */
export function formatPrice(n: number): string {
  return new Intl.NumberFormat(LOCALE).format(n);
}

/**
 * Format a mileage value with thousands separators and the Arabic unit
 * suffix used throughout the app.
 *
 *   `formatMileage(45000)` → `"45,000 كم"`
 */
export function formatMileage(n: number): string {
  return `${new Intl.NumberFormat(LOCALE).format(n)} كم`;
}

/**
 * Format a model year. Years don't need thousands separators, so this is a
 * trivial `String(n)` wrapper that exists for symmetry with the other
 * formatters and lets callers use a uniform `{formatX(value)}` pattern.
 */
export function formatYear(n: number): string {
  return String(n);
}