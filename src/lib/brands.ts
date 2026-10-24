export const BRANDS = [
  {
    name: "WYZ Design",
    tagline: "The Company",
    shortDesc: "Full-service creative direction and production. Photography, graphic design, web design, videography, branding, and printing. The umbrella every other brand operates under.",
    longDesc: "WYZ Design is the full-service creative engine. Photography, graphic design, web design, videography, branding, and printing. Everything under one roof. Founded in Chicago in January 2022, scaling in Los Angeles.",
    color: "#DF3131",
    href: "/",
    cta: "Visit the main site",
  },
  {
    name: "Wild Yet Zealous",
    tagline: "The Root of Everything",
    shortDesc: "The creative philosophy behind it all, born in Chicago's DIY art and music scene. Wild ideas deserve zealous execution. That's the standard every project carries.",
    longDesc: "Born in Chicago's DIY art and music scene, Wild Yet Zealous is the creative philosophy behind WYZ Design. It's the belief that wild ideas deserve zealous execution, that creativity without discipline is chaos, and discipline without creativity is empty. Every project we touch carries this ethos: bold vision, relentless standards, zero shortcuts.",
    color: "#DF3131",
    href: "/about",
    cta: "Read the philosophy",
  },
  {
    name: "Dying Breed Crew",
    tagline: "The Clothing Label",
    shortDesc: "A separate clothing label under the WYZ umbrella. Streetwear drops, lookbooks, and collaborations made for the people who show up.",
    longDesc: "Dying Breed Crew is a separate clothing label under the WYZ umbrella, not the magazine's identity. Founded in January 2022 alongside WYZ Design, it is built around drops, lookbooks and collaborations for the people who make culture instead of just consuming it.",
    color: "#C9A227",
    href: "/about",
    cta: "Shop the merch",
  },
  {
    name: "Nomadic Breed",
    tagline: "The Magazine",
    shortDesc: "An independent magazine from WYZ Design, founded in January 2022. Digital-first, documenting the people, places and scenes that move culture.",
    longDesc: "Nomadic Breed is an independent magazine published under WYZ Design. Founded in January 2022 alongside the agency, it is digital-first with print to follow, running long-form interviews, photo essays and process documentation about the people and scenes that move culture.",
    color: "#6E6E6E",
    href: "/about",
    cta: "See the events",
  },
] as const;

export const SUB_BRANDS = BRANDS.slice(1);

export type Brand = (typeof BRANDS)[number];

const TAGLINE_COLORS: Record<string, string> = {
  "#DF3131": "#C41C1C",
  "#C9A227": "#8C6A1D",
  "#6E6E6E": "#006064",
};

export function taglineColor(color: string): string {
  return TAGLINE_COLORS[color] ?? color;
}
