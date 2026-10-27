/**
 * Design Token Layer — WYZ Design
 * Single source of truth for color, typography, spacing, and radius.
 * All component code should import from here instead of hardcoding hex/rgb.
 */

export const colors = {
  // Brand core
  red: "#DF3131",
  redDark: "#B82020",
  textRed: "#C00000",
  gold: "#C9A227",
  goldLight: "#E7C873",
  goldDeep: "#8C6A1D",

  // Neutrals
  white: "#FFFFFF",
  text: "#333333",
  textSecondary: "#666665",
  muted: "#666666",
  border: "#E2E2E2",
  card: "#FFFFFF",

  // Dark mode surfaces
  darkSurface: "#252528",
  darkPage: "#1C1C1E",
  darkDeep: "#111",
  darkText: "#E0E0E0",
  darkMuted: "#B0B0B0",
  darkBorder: "#444",
};

export const typography = {
  heading: {
    fontFamily: "Montserrat",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    lineHeight: 0.9,
  },
  body: {
    fontFamily: "Inter",
    fontSize: 17,
    lineHeight: 1.65,
  },
  scale: {
    h1: { size: "2rem", lineHeight: "0.9" },
    h2: { size: "1.35rem", lineHeight: "1.25" },
    h3: { size: "1.05rem", lineHeight: "1.3" },
    h4: { size: "0.875rem", lineHeight: "1.4" },
    body: { size: 17, lineHeight: 1.65 },
  },
} as const;

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "2.5rem",
} as const;

export const radius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  full: "9999px",
} as const;

export const fontFamilies = {
  heading: "'Montserrat', sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as const;

export const fontSizes = {
  h1: "clamp(2rem, 2rem + 2.5vw, 4.8rem)",
  h2: "clamp(1.35rem, 1.35rem + 1.5vw, 3.3rem)",
  h3: "clamp(1.05rem, 1.05rem + 1vw, 2.1rem)",
  h4: "clamp(0.875rem, 0.875rem + 0.75vw, 1.5rem)",
  body: "17px",
} as const;

export const zIndex = {
  base: 1,
  dropdown: 40,
  sticky: 50,
  overlay: 60,
  modal: 200,
  lightbox: 210,
  cursor: 99997,
  toast: 99999,
} as const;

export const touchTargets = {
  minHeight: 44, // px, WCAG AA
  buttonMinHeight: 44,
  inputMinHeight: 44,
  submitMinHeight: 44,
} as const;

export const motion = {
  standard: "0.25s cubic-bezier(0.16, 1, 0.3, 1)",
  tap: "0.97",
  reduced: "0.01ms",
} as const;

const designTokens = {
  colors,
  typography,
  spacing,
  radius,
  fontFamilies,
  fontSizes,
  zIndex,
  touchTargets,
  motion,
};

export default designTokens;
