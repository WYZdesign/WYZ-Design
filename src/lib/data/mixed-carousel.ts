// Mixed carousel data for home page - combines photography, designs, models, and client logos
// Evenly interleaved and shuffled for variety

import { HERO_IMAGES_RAW, DESIGN_SHOWCASE_RAW, MODELS_RAW_RECORDS, CLIENT_LOGOS_RAW } from "./home";

export interface MixedCarouselItem {
  src: string;
  type: "photography" | "design" | "model" | "client-logo";
  alt?: string;
}

// Combine all sources with type tags
const allPhotography: MixedCarouselItem[] = [...HERO_IMAGES_RAW, ...MODELS_RAW_RECORDS].map((src) => ({
  src,
  type: "photography" as const,
}));

const allDesigns: MixedCarouselItem[] = DESIGN_SHOWCASE_RAW.map((src) => ({
  src,
  type: "design" as const,
}));

const allModels: MixedCarouselItem[] = MODELS_RAW_RECORDS.map((src) => ({
  src,
  type: "model" as const,
}));

const allClientLogos: MixedCarouselItem[] = CLIENT_LOGOS_RAW.map((item) => ({
  src: item.img,
  type: "client-logo" as const,
  alt: item.name,
}));

// Interleave arrays evenly - round-robin distribution
function interleaveEvenly<T extends MixedCarouselItem>(arrays: T[][]): MixedCarouselItem[] {
  const result: MixedCarouselItem[] = [];
  const maxLen = Math.max(...arrays.map((a) => a.length));
  for (let i = 0; i < maxLen; i++) {
    for (const arr of arrays) {
      if (i < arr.length) result.push(arr[i]);
    }
  }
  return result;
}

// Create mixed pool with even distribution
const mixedPool = interleaveEvenly([
  allPhotography,
  allDesigns,
  allModels,
  allClientLogos,
]);

// Fisher-Yates shuffle for consistent but randomized ordering
function shuffleArray<T>(array: T[], seed?: number): T[] {
  const arr = [...array];
  let random: () => number;
  if (seed !== undefined) {
    // Seeded PRNG for consistent shuffles
    let s = seed;
    random = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
  } else {
    random = Math.random;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Export pre-shuffled versions for different carousel positions
export const MIXED_CAROUSEL_1 = shuffleArray(mixedPool, 1);
export const MIXED_CAROUSEL_2 = shuffleArray(mixedPool, 2);
export const MIXED_CAROUSEL_3 = shuffleArray(mixedPool, 3);

// Also export raw arrays for backward compatibility
export { HERO_IMAGES_RAW, DESIGN_SHOWCASE_RAW, MODELS_RAW_RECORDS, CLIENT_LOGOS_RAW };