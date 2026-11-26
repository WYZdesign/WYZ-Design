"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useTheme as useLightDarkMode } from "@/components/ThemeProvider";

export type ColorThemeName = "default" | "ocean" | "forest" | "sunset" | "midnight" | "rose" | "sky" | "indigo" | "amber";

interface ModeColors {
  primary: string;
  primaryHover: string;
  // Secondary (tertiary) accent: the gold/alt accent used for eyebrows,
  // badges and small highlights. secondaryText is a contrast-safe variant
  // for text on the page background.
  secondary: string;
  secondaryText: string;
  // Contrast-safe companions (2026-11-26 audit). onPrimary / onPrimaryHover
  // are the text colors to place ON a primary / primary-hover fill (white
  // fails WCAG on the bright theme primaries). primaryText is primary-colored
  // text on the page background; primaryTextSm is the same for small text.
  onPrimary: string;
  onPrimaryHover: string;
  primaryText: string;
  primaryTextSm: string;
}

export interface ColorTheme {
  name: ColorThemeName;
  label: string;
  swatch: string; // small decorative secondary swatch shown next to primary in the picker
  // Every theme has its own light-mode AND dark-mode pair. Which pair is
  // actually applied follows the site's existing light/dark toggle (top
  // right) -- this picker only ever chooses the color family, never the
  // light/dark state itself, so the two controls stop fighting over it.
  light: ModeColors;
  dark: ModeColors;
}

export const colorThemes: Record<ColorThemeName, ColorTheme> = {
  default: {
    name: "default",
    label: "Classic",
    swatch: "#C9A227",
    light: { primary: "#DF3131", primaryHover: "#B82020", secondary: "#C9A227", secondaryText: "#8C6A1D", onPrimary: "#FFFFFF", onPrimaryHover: "#FFFFFF", primaryText: "#DF3131", primaryTextSm: "#B82020" },
    dark: { primary: "#FF5C5C", primaryHover: "#DF3131", secondary: "#E7C873", secondaryText: "#E7C873", onPrimary: "#111111", onPrimaryHover: "#FFFFFF", primaryText: "#FF5C5C", primaryTextSm: "#DF3131" },
  },
  ocean: {
    name: "ocean",
    label: "Ocean",
    swatch: "#67E8F9",
    light: { primary: "#06B6D4", primaryHover: "#0891B2", secondary: "#22D3EE", secondaryText: "#0E7490", onPrimary: "#111111", onPrimaryHover: "#111111", primaryText: "#04768A", primaryTextSm: "#04768A" },
    dark: { primary: "#22D3EE", primaryHover: "#06B6D4", secondary: "#67E8F9", secondaryText: "#67E8F9", onPrimary: "#111111", onPrimaryHover: "#111111", primaryText: "#22D3EE", primaryTextSm: "#06B6D4" },
  },
  forest: {
    name: "forest",
    label: "Forest",
    swatch: "#86EFAC",
    light: { primary: "#22C55E", primaryHover: "#16A34A", secondary: "#4ADE80", secondaryText: "#15803D", onPrimary: "#111111", onPrimaryHover: "#111111", primaryText: "#167E3C", primaryTextSm: "#167E3C" },
    dark: { primary: "#4ADE80", primaryHover: "#22C55E", secondary: "#86EFAC", secondaryText: "#86EFAC", onPrimary: "#111111", onPrimaryHover: "#111111", primaryText: "#4ADE80", primaryTextSm: "#22C55E" },
  },
  sunset: {
    name: "sunset",
    label: "Sunset",
    swatch: "#FDBA74",
    light: { primary: "#F97316", primaryHover: "#EA580C", secondary: "#FB923C", secondaryText: "#C2410C", onPrimary: "#111111", onPrimaryHover: "#111111", primaryText: "#AE500F", primaryTextSm: "#AE500F" },
    dark: { primary: "#FDBA74", primaryHover: "#F97316", secondary: "#FED7AA", secondaryText: "#FED7AA", onPrimary: "#111111", onPrimaryHover: "#111111", primaryText: "#FDBA74", primaryTextSm: "#F97316" },
  },
  midnight: {
    name: "midnight",
    label: "Midnight",
    swatch: "#A78BFA",
    light: { primary: "#8B5CF6", primaryHover: "#7C3AED", secondary: "#A78BFA", secondaryText: "#6D28D9", onPrimary: "#000000", onPrimaryHover: "#FFFFFF", primaryText: "#7950D6", primaryTextSm: "#7950D6" },
    dark: { primary: "#A78BFA", primaryHover: "#8B5CF6", secondary: "#C4B5FD", secondaryText: "#C4B5FD", onPrimary: "#111111", onPrimaryHover: "#111111", primaryText: "#A78BFA", primaryTextSm: "#8B5CF6" },
  },
  rose: {
    name: "rose",
    label: "Rose",
    swatch: "#F9A8D4",
    light: { primary: "#EC4899", primaryHover: "#DB2777", secondary: "#F472B6", secondaryText: "#BE185D", onPrimary: "#111111", onPrimaryHover: "#FFFFFF", primaryText: "#B83877", primaryTextSm: "#B83877" },
    dark: { primary: "#F472B6", primaryHover: "#EC4899", secondary: "#FBCFE8", secondaryText: "#FBCFE8", onPrimary: "#111111", onPrimaryHover: "#111111", primaryText: "#F472B6", primaryTextSm: "#EC4899" },
  },
  sky: {
    name: "sky",
    label: "Sky",
    swatch: "#93C5FD",
    light: { primary: "#3B82F6", primaryHover: "#2563EB", secondary: "#60A5FA", secondaryText: "#1D4ED8", onPrimary: "#111111", onPrimaryHover: "#FFFFFF", primaryText: "#3069C7", primaryTextSm: "#3069C7" },
    dark: { primary: "#60A5FA", primaryHover: "#3B82F6", secondary: "#93C5FD", secondaryText: "#93C5FD", onPrimary: "#111111", onPrimaryHover: "#111111", primaryText: "#60A5FA", primaryTextSm: "#3B82F6" },
  },
  indigo: {
    name: "indigo",
    label: "Indigo",
    swatch: "#818CF8",
    light: { primary: "#6366F1", primaryHover: "#4F46E5", secondary: "#818CF8", secondaryText: "#3730A3", onPrimary: "#000000", onPrimaryHover: "#FFFFFF", primaryText: "#585BD6", primaryTextSm: "#585BD6" },
    dark: { primary: "#818CF8", primaryHover: "#6366F1", secondary: "#A5B4FC", secondaryText: "#A5B4FC", onPrimary: "#111111", onPrimaryHover: "#111111", primaryText: "#818CF8", primaryTextSm: "#6366F1" },
  },
  amber: {
    name: "amber",
    label: "Amber",
    swatch: "#FCD34D",
    light: { primary: "#F59E0B", primaryHover: "#D97706", secondary: "#FBBF24", secondaryText: "#B45309", onPrimary: "#111111", onPrimaryHover: "#111111", primaryText: "#986207", primaryTextSm: "#986207" },
    dark: { primary: "#FBBF24", primaryHover: "#F59E0B", secondary: "#FCD34D", secondaryText: "#FCD34D", onPrimary: "#111111", onPrimaryHover: "#111111", primaryText: "#FBBF24", primaryTextSm: "#F59E0B" },
  },
};

// Guests only ever preview a theme for the current tab -- it is never
// written anywhere, so a reload always comes back to the real default.
// Once someone is signed in, their pick is treated as a real, persisted
// default and saved under this account-scoped key. (This is still a
// per-browser localStorage value, not yet synced to the account/profile in
// the database -- see the handover for that follow-up.)
const ACCOUNT_STORAGE_KEY = "wyz-color-theme-account";

interface ColorThemeContextType {
  theme: ColorTheme;
  setTheme: (themeName: ColorThemeName) => void;
  availableThemes: ColorTheme[];
  isPersisted: boolean; // false for a guest preview, true once saved as a real account default
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const { theme: mode } = useLightDarkMode(); // "light" | "dark" from the existing toggle
  const [themeName, setThemeName] = useState<ColorThemeName>("default");
  const [mounted, setMounted] = useState(false);
  const signedIn = status === "authenticated";

  const applyColors = useCallback((name: ColorThemeName, modeNow: "light" | "dark") => {
    const t = colorThemes[name];
    const pair = modeNow === "dark" ? t.dark : t.light;
    const root = document.documentElement;
    root.style.setProperty("--wyz-primary", pair.primary);
    root.style.setProperty("--wyz-primary-hover", pair.primaryHover);
    root.style.setProperty("--wyz-secondary", pair.secondary);
    root.style.setProperty("--wyz-secondary-text", pair.secondaryText);
    root.style.setProperty("--wyz-on-primary", pair.onPrimary);
    root.style.setProperty("--wyz-on-primary-hover", pair.onPrimaryHover);
    root.style.setProperty("--wyz-primary-text", pair.primaryText);
    root.style.setProperty("--wyz-primary-text-sm", pair.primaryTextSm);
    // RGB triplet of the primary, for rgba(...) tint usages that can't use a hex var.
    const h = pair.primary.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(full, 16);
    const rgb = Number.isNaN(n) ? "223, 49, 49" : `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
    root.style.setProperty("--wyz-primary-rgb", rgb);
    root.setAttribute("data-color-theme", name);
  }, []);

  // Mount: a signed-in visitor's saved pick is their real default and gets
  // restored. A guest always starts from Classic -- nothing was ever saved
  // for them, so there is nothing to restore.
  useEffect(() => {
    setMounted(true);
    let initial: ColorThemeName = "default";
    if (status === "authenticated") {
      try {
        const saved = localStorage.getItem(ACCOUNT_STORAGE_KEY) as ColorThemeName | null;
        if (saved && colorThemes[saved]) initial = saved;
      } catch {}
    }
    setThemeName(initial);
  }, [status]);

  // Re-apply whenever the color theme OR the light/dark mode changes, so the
  // two controls stay in sync instead of racing each other.
  useEffect(() => {
    if (!mounted) return;
    applyColors(themeName, mode);
  }, [mounted, themeName, mode, applyColors]);

  const setTheme = useCallback((name: ColorThemeName) => {
    setThemeName(name);
    if (signedIn) {
      try { localStorage.setItem(ACCOUNT_STORAGE_KEY, name); } catch {}
    }
    // A guest's pick is intentionally never written to storage -- it only
    // lives in this render's state, so a refresh or a new tab always comes
    // back to the real site default.
  }, [signedIn]);

  // Always provide the context, even before mount. Previously this returned
  // bare children until mounted, which meant any SSR-rendered consumer of
  // useColorTheme() threw "must be used within a ColorThemeProvider". The
  // theme/light-dark values only matter once mounted (the apply effect), so
  // providing the default context up front is safe and fixes SSR.
  return (
    <ColorThemeContext.Provider
      value={{
        theme: colorThemes[themeName],
        setTheme,
        availableThemes: Object.values(colorThemes),
        isPersisted: signedIn,
      }}
    >
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider");
  }
  return context;
}
