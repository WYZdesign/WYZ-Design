/**
 * NSFW content gating configuration and utilities.
 *
 * Bodypaint is the primary gated category. Boudoir/lingerie are also gated.
 * Individual images within any category can be auto-detected as NSFW by the
 * client-side nsfwjs scanner, or manually flagged via the admin panel.
 */

/** Categories that are gated at the album level (always blurred + age-gated). */
export const NSFW_CATEGORIES = ["Boudoir", "Bodypaint"];

/** Threshold for classifying an image as NSFW (Porn + Sexy combined confidence). */
export const NSFW_CONFIDENCE_THRESHOLD = 0.65;

/** Check if a category is NSFW-gated */
export function isNsfwCategory(category: string): boolean {
  return NSFW_CATEGORIES.some(
    (c) => c.toLowerCase() === category.toLowerCase()
  );
}