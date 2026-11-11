/**
 * Data colors stored as literal brand hexes (community categories, Zeal tiers)
 * are rendered inline, so Tailwind class remapping never reaches them. These
 * helpers map the two themeable brand hexes to the active color-theme vars at
 * render time and leave every other color untouched (semantic/brand colors).
 */
const PRIMARY = "#df3131";
const SECONDARY = "#c9a227";

function key(c: string): string {
  return c.trim().toLowerCase();
}

/** Fill/background color that follows the active theme. */
export function themeColor(c: string): string {
  const k = key(c);
  if (k === PRIMARY) return "var(--wyz-primary)";
  if (k === SECONDARY) return "var(--wyz-secondary)";
  return c;
}

/** Readable text color on a light/dark surface that follows the active theme. */
export function themeText(c: string): string {
  const k = key(c);
  if (k === PRIMARY) return "var(--wyz-primary-hover)";
  if (k === SECONDARY) return "var(--wyz-secondary-text)";
  return c;
}

/** Translucent tint of the (themed) color, replacing hex-alpha suffixes. */
export function themeTint(c: string, percent: number): string {
  return `color-mix(in oklab, ${themeColor(c)} ${percent}%, transparent)`;
}
