"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ColorThemeName = "default" | "ocean" | "forest" | "sunset" | "midnight" | "rose";

export interface ColorTheme {
  name: ColorThemeName;
  label: string;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    cardBg: string;
    heroGradient: string;
  };
}

export const colorThemes: Record<ColorThemeName, ColorTheme> = {
  default: {
    name: "default",
    label: "Classic",
    colors: {
      primary: "#DF3131",
      primaryHover: "#B82020",
      secondary: "#C9A227",
      accent: "#DF3131",
      background: "#FFFFFF",
      surface: "#F5F5F3",
      text: "#111111",
      textMuted: "#666666",
      border: "#E2E2E2",
      cardBg: "#FFFFFF",
      heroGradient: "linear-gradient(135deg, #DF3131 0%, #C9A227 100%)",
    },
  },
  ocean: {
    name: "ocean",
    label: "Ocean",
    colors: {
      primary: "#006D77",
      primaryHover: "#004D53",
      secondary: "#83C5BE",
      accent: "#006D77",
      background: "#F0F8FA",
      surface: "#E8F4F6",
      text: "#003D44",
      textMuted: "#4A8C94",
      border: "#B5E2E8",
      cardBg: "#FFFFFF",
      heroGradient: "linear-gradient(135deg, #006D77 0%, #83C5BE 100%)",
    },
  },
  forest: {
    name: "forest",
    label: "Forest",
    colors: {
      primary: "#2D5016",
      primaryHover: "#1B3A0E",
      secondary: "#8FBC8F",
      accent: "#2D5016",
      background: "#F4F8F1",
      surface: "#E8F0E1",
      text: "#1A3C0D",
      textMuted: "#5D8A4A",
      border: "#C5D9BE",
      cardBg: "#FFFFFF",
      heroGradient: "linear-gradient(135deg, #2D5016 0%, #8FBC8F 100%)",
    },
  },
  sunset: {
    name: "sunset",
    label: "Sunset",
    colors: {
      primary: "#E85D04",
      primaryHover: "#B84703",
      secondary: "#FFB84D",
      accent: "#E85D04",
      background: "#FFF5EB",
      surface: "#FFE8D6",
      text: "#7A3000",
      textMuted: "#B8763A",
      border: "#F0D5B8",
      cardBg: "#FFFFFF",
      heroGradient: "linear-gradient(135deg, #E85D04 0%, #FFB84D 100%)",
    },
  },
  midnight: {
    name: "midnight",
    label: "Midnight",
    colors: {
      primary: "#6C5CE7",
      primaryHover: "#5548C8",
      secondary: "#A29BFE",
      accent: "#6C5CE7",
      background: "#1A1A2E",
      surface: "#16213E",
      text: "#EAEAEA",
      textMuted: "#A0A0B8",
      border: "#2D2D4A",
      cardBg: "#1F2D55",
      heroGradient: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)",
    },
  },
  rose: {
    name: "rose",
    label: "Rose",
    colors: {
      primary: "#D63384",
      primaryHover: "#A8286A",
      secondary: "#F7A8C9",
      accent: "#D63384",
      background: "#FFF0F6",
      surface: "#FFE4EE",
      text: "#7A1A4B",
      textMuted: "#B85A8A",
      border: "#F0C5D8",
      cardBg: "#FFFFFF",
      heroGradient: "linear-gradient(135deg, #D63384 0%, #F7A8C9 100%)",
    },
  },
};

interface ColorThemeContextType {
  theme: ColorTheme;
  setTheme: (themeName: ColorThemeName) => void;
  availableThemes: ColorTheme[];
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ColorTheme>(colorThemes.default);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("wyz-color-theme") as ColorThemeName | null;
    if (saved && colorThemes[saved]) {
      setThemeState(colorThemes[saved]);
      applyTheme(colorThemes[saved]);
    } else {
      applyTheme(colorThemes.default);
    }
  }, []);

  const setTheme = (themeName: ColorThemeName) => {
    const newTheme = colorThemes[themeName];
    setThemeState(newTheme);
    localStorage.setItem("wyz-color-theme", themeName);
    applyTheme(newTheme);
  };

  const applyTheme = (t: ColorTheme) => {
    if (!mounted) return;
    const root = document.documentElement;
    root.style.setProperty("--wyz-primary", t.colors.primary);
    root.style.setProperty("--wyz-primary-hover", t.colors.primaryHover);
    root.style.setProperty("--wyz-secondary", t.colors.secondary);
    root.style.setProperty("--wyz-accent", t.colors.accent);
    root.style.setProperty("--wyz-bg", t.colors.background);
    root.style.setProperty("--wyz-surface", t.colors.surface);
    root.style.setProperty("--wyz-text", t.colors.text);
    root.style.setProperty("--wyz-text-muted", t.colors.textMuted);
    root.style.setProperty("--wyz-border", t.colors.border);
    root.style.setProperty("--wyz-card-bg", t.colors.cardBg);
    root.style.setProperty("--wyz-hero-gradient", t.colors.heroGradient);
    
    // Apply dark mode variant for midnight theme
    if (t.name === "midnight") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ColorThemeContext.Provider value={{ theme, setTheme, availableThemes: Object.values(colorThemes) }}>
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