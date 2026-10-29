/**
 * WCAG color-contrast utility — WYZ Design
 * Uses the WCAG 2.1 relative luminance algorithm to check whether
 * two hex colors meet AA (4.5:1 for body text) or AAA (7:1) contrast.
 *
 * Usage:
 *   import { checkContrast, isAccessible } from "@/lib/contrast";
 *   const { ratio, aa, aaa } = checkContrast("#DF3131", "#FFFFFF");
 *   if (!isAccessible(ratio, "body")) warn(...);
 */

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const n = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return [r, g, b];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export interface ContrastResult {
  fg: string;
  bg: string;
  ratio: number;
  aa: boolean;
  aaLarge: boolean;
  aaa: boolean;
  level: "fail" | "aa" | "aaa";
}

export function checkContrast(fg: string, bg: string): ContrastResult {
  const l1 = relativeLuminance(hexToRgb(fg));
  const l2 = relativeLuminance(hexToRgb(bg));
  const ratio = l1 > l2 ? (l2 + 0.05) / (l1 + 0.05) : (l1 + 0.05) / (l2 + 0.05);
  const r = 1 / ratio;

  const aa = r >= 4.5;
  const aaLarge = r >= 3.0;
  const aaa = r >= 7.0;

  let level: "fail" | "aa" | "aaa" = "fail";
  if (aaa) level = "aaa";
  else if (aa) level = "aa";

  return { fg, bg, ratio: Math.round(r * 100) / 100, aa, aaLarge, aaa, level };
}

export function isAccessible(ratio: number, size: "body" | "large" | "ui"): boolean {
  if (size === "body") return ratio >= 4.5;
  if (size === "large") return ratio >= 3.0;
  if (size === "ui") return ratio >= 3.0;
  return false;
}

export const DESIGN_COLOR_PALETTE = {
  red: "#DF3131",
  redDark: "#B82020",
  textRed: "#C00000",
  gold: "#C9A227",
  goldLight: "#E7C873",
  white: "#FFFFFF",
  text: "#333333",
  textSecondary: "#666665",
  darkPage: "#1C1C1E",
  darkText: "#E0E0E0",
} as const;

export function auditPalette(): ContrastResult[] {
  const bg = DESIGN_COLOR_PALETTE.white;
  const darkBg = DESIGN_COLOR_PALETTE.darkPage;
  const results: ContrastResult[] = [];
  Object.entries(DESIGN_COLOR_PALETTE).forEach(([name, fg]) => {
    results.push({ ...checkContrast(fg, bg), fg: name } as any);
    results.push({ ...checkContrast(fg, darkBg), fg: name, bg: darkBg } as any);
  });
  return results;
}

// Verify known brand colors at module load for fast feedback
console.table(
  auditPalette().map((r) => ({
    color: r.fg,
    bg: r.bg?.slice(0, 7),
    ratio: r.ratio,
    aa: r.aa ? "OK" : "FAIL",
    aaa: r.aaa ? "OK" : "FAIL",
  })),
);
