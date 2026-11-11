"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useTheme as useLightDarkMode } from "@/components/ThemeProvider";

export type ColorThemeName = "default" | "ocean" | "forest" | "sunset" | "midnight" | "rose";

interface ModeColors {
  primary: string;
  primaryHover: string;
  // Secondary (tertiary) accent: the gold/alt accent used for eyebrows,
  // badges and small highlights. secondaryText is a contrast-safe variant
  // for text on the page background.
  secondary: string;
  secondaryText: string;
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
    light: { primary: "#DF3131", primaryHover: "#B82020", secondary: "#C9A227", secondaryText: "#8C6A1D" },
    dark: { primary: "#FF5C5C", primaryHover: "#DF3131", secondary: "#E7C873", secondaryText: "#E7C873" },
  },
  ocean: {
    name: "ocean",
    label: "Ocean",
    swatch: "#83C5BE",
    light: { primary: "#006D77", primaryHover: "#004D53", secondary: "#83C5BE", secondaryText: "#3A7C74" },
    dark: { primary: "#4DD9E8", primaryHover: "#1DB8C9", secondary: "#A9E3DC", secondaryText: "#A9E3DC" },
  },
  forest: {
    name: "forest",
    label: "Forest",
    swatch: "#8FBC8F",
    light: { primary: "#2D5016", primaryHover: "#1B3A0E", secondary: "#8FBC8F", secondaryText: "#4F7A4F" },
    dark: { primary: "#6FCF52", primaryHover: "#4F9E39", secondary: "#B8DDB8", secondaryText: "#B8DDB8" },
  },
  sunset: {
    name: "sunset",
    label: "Sunset",
    swatch: "#FFB84D",
    light: { primary: "#E85D04", primaryHover: "#B84703", secondary: "#FFB84D", secondaryText: "#A85F00" },
    dark: { primary: "#FF8C42", primaryHover: "#E85D04", secondary: "#FFD08A", secondaryText: "#FFD08A" },
  },
  midnight: {
    name: "midnight",
    label: "Midnight",
    swatch: "#A29BFE",
    light: { primary: "#6C5CE7", primaryHover: "#5548C8", secondary: "#A29BFE", secondaryText: "#5B4FC8" },
    dark: { primary: "#9C8CFF", primaryHover: "#6C5CE7", secondary: "#C4BEFF", secondaryText: "#C4BEFF" },
  },
  rose: {
    name: "rose",
    label: "Rose",
    swatch: "#F7A8C9",
    light: { primary: "#D63384", primaryHover: "#A8286A", secondary: "#F7A8C9", secondaryText: "#A83B6A" },
    dark: { primary: "#FF6FAE", primaryHover: "#D63384", secondary: "#FFC2DA", secondaryText: "#FFC2DA" },
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
