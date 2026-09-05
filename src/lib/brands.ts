export const BRANDS = [
  {
    name: "WYZ Design",
    tagline: "The Company",
    shortDesc: "Full-service creative direction and production. Photography, graphic design, web design, videography, branding, and printing. The umbrella every other brand operates under.",
    longDesc: "WYZ Design is the full-service creative engine. Photography, graphic design, web design, videography, branding, and printing. Everything under one roof. Built in Chicago, scaling in Los Angeles.",
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
    tagline: "The Community",
    shortDesc: "The community and clothing arm. A collective of artists, musicians, models, and culture-makers who refuse to blend in. Merch, events, and collaborations that keep authentic culture alive.",
    longDesc: "Dying Breed Crew is the community arm of WYZ Design, a collective of artists, musicians, models, and culture-makers who refuse to blend in. DBC represents the doers, the ones who show up, the ones who create when nobody's watching. Through merch, events, and creative collaborations, DBC keeps the spirit of authentic culture alive.",
    color: "#D49341",
    href: "/dying-breed-crew",
    cta: "Shop the merch",
  },
  {
    name: "Nomadic Breed",
    tagline: "The Movement",
    shortDesc: "The mobile arm, built for creators who don't stay in one place. Pop-up shoots, touring event coverage, and the WYZ standard delivered wherever the work takes us.",
    longDesc: "Nomadic Breed is the mobile arm of WYZ Design, built for creators who don't stay in one place. From pop-up shoots to touring event coverage, Nomadic Breed brings the WYZ standard wherever the work takes us. No studio? No problem. Every location is a set. Every city is an opportunity.",
    color: "#00E5FF",
    href: "/nomadic-breed",
    cta: "See the events",
  },
] as const;

export const SUB_BRANDS = BRANDS.slice(1);

export type Brand = (typeof BRANDS)[number];
