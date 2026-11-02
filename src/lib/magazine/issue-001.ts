// Nomadic Breed Magazine - Issue 001 Data
// Based on InDesign document structure from _STATE/nomadic/LINK_MAP_CURRENT.md
// 24-page magazine structure (16-page pilot per master doc, but InDesign has 24 pages)

export interface MagazinePage {
  pageNumber: number;
  src: string;
  alt: string;
  type: "cover" | "toc" | "masthead" | "feature" | "department" | "ads" | "back-cover";
  title?: string;
  description?: string;
  spread?: boolean; // true if this is part of a two-page spread
}

export const ISSUE_001_PAGES = [
  {
    pageNumber: 1,
    src: "/images/nomadic-breed/issue-001/cover.jpg",
    alt: "Nomadic Breed Issue 001 Cover - Hand-painted red NOMADIC BREED title, gritty back-alley aesthetic with red neon",
    type: "cover",
    title: "Cover",
  },
  {
    pageNumber: 2,
    src: "/images/nomadic-breed/issue-001/inside-cover.jpg",
    alt: "Inside cover - Masthead and contributors",
    type: "masthead",
    title: "Masthead & Contributors",
  },
  {
    pageNumber: 3,
    src: "/images/nomadic-breed/issue-001/pg-03.jpg",
    alt: "Table of Contents - Nomadic Breed Issue 001",
    type: "toc",
    title: "Table of Contents",
  },
  {
    pageNumber: 4,
    src: "/images/nomadic-breed/issue-001/pg-04.jpg",
    alt: "Nomadic Status Vol. 1 - Featured artist profile",
    type: "feature",
    title: "Nomadic Status: Vol. 1",
  },
  {
    pageNumber: 5,
    src: "/images/nomadic-breed/issue-001/pg-05.jpg",
    alt: "Breed Files - Photo essay from the underground",
    type: "feature",
    title: "Breed Files: Echoes of the Concrete Jungle",
  },
  {
    pageNumber: 6,
    src: "/images/nomadic-breed/issue-001/pg-06.jpg",
    alt: "In Transit - Journal entries from artists on the move",
    type: "feature",
    title: "In Transit: Postcards from the Borderless",
  },
  {
    pageNumber: 7,
    src: "/images/nomadic-breed/issue-001/pg-07.jpg",
    alt: "Pack Light - Nomad survival gear guide",
    type: "department",
    title: "Pack Light: Nomad Survival Guide",
  },
  {
    pageNumber: 8,
    src: "/images/nomadic-breed/issue-001/pg-08.jpg",
    alt: "Exit Wounds - Poetry and final words",
    type: "department",
    title: "Exit Wounds: Beauty in Ruin",
  },
  {
    pageNumber: 9,
    src: "/images/nomadic-breed/issue-001/pg-09.jpg",
    alt: "Breed Files - Echoes of the Concrete Jungle continued",
    type: "feature",
    title: "Breed Files: Echoes of the Concrete Jungle (cont.)",
  },
  {
    pageNumber: 10,
    src: "/images/nomadic-breed/issue-001/pg-10.jpg",
    alt: "In Transit continued - Postcards from the Borderless",
    type: "feature",
    title: "In Transit: Postcards from the Borderless (cont.)",
  },
  {
    pageNumber: 11,
    src: "/images/nomadic-breed/issue-001/pg-11.jpg",
    alt: "Breed Talk - Raw interviews with impact players",
    type: "feature",
    title: "Breed Talk: The Raw Interviews",
  },
  {
    pageNumber: 12,
    src: "/images/nomadic-breed/issue-001/pg-12.jpg",
    alt: "Pack Light continued - Survival gear from the fringe",
    type: "department",
    title: "Pack Light: Survival Gear from the Fringe",
  },
  {
    pageNumber: 13,
    src: "/images/nomadic-breed/issue-001/pg-13.jpg",
    alt: "Exit Wounds continued - Beauty in Ruin",
    type: "department",
    title: "Exit Wounds: The Beautiful Scars We Carry (cont.)",
  },
  {
    pageNumber: 14,
    src: "/images/nomadic-breed/issue-001/pg-14.jpg",
    alt: "The Fold - Community bulletin and resource guide",
    type: "department",
    title: "The Fold: Community Bulletin",
  },
  {
    pageNumber: 15,
    src: "/images/nomadic-breed/issue-001/pg-15.jpg",
    alt: "Breed Lookbook - Dying Breed Crew seasonal feature",
    type: "feature",
    title: "Breed Lookbook: Dying Breed Crew Collection",
  },
  {
    pageNumber: 16,
    src: "/images/nomadic-breed/issue-001/back-cover.jpg",
    alt: "Back cover - Nomadic Breed Issue 001",
    type: "back-cover",
    title: "Back Cover",
  },
] as const;

export type Issue001Page = typeof ISSUE_001_PAGES[number];

// Helper to get page by number
export function getPage(pageNumber: number) {
  return ISSUE_001_PAGES.find((p) => p.pageNumber === pageNumber);
}

// Get all pages as array for flipbook
export function getFlipbookPages() {
  return ISSUE_001_PAGES.map((p) => ({
    pageNumber: p.pageNumber,
    src: p.src,
    alt: p.alt,
    width: 800,
    height: 1040,
  }));
}

// Issue metadata
export const ISSUE_001_META = {
  issueNumber: 1,
  volume: "Vol. 1",
  title: "Nomadic Breed",
  subtitle: "A Wild Yet Zealous Publication",
  publishDate: "2026-01-15",
  pageCount: 16,
  coverImage: "/images/nomadic-breed/issue-001/cover.jpg",
  description:
    "The inaugural issue of Nomadic Breed Magazine. Featuring Nomadic Status Vol. 1, Breed Files from the concrete jungle, In Transit dispatches, Pack Light survival guide, and Exit Wounds poetry.",
  tagline: "A Wild Yet Zealous Publication",
  price: "Free Digital / $15 Print",
  issn: "TBD",
  publisher: "WYZ Design",
  editor: "Torreé Marcel",
  creativeDirector: "Torreé Marcel",
  contributors: [
    "Torreé Marcel",
    "Anastasia Antoinette",
    "John McGrath",
    "Various LA underground artists",
  ],
  themes: [
    "Nomadic Status: Rogue Visionaries",
    "Breed Files: Echoes of the Concrete Jungle",
    "In Transit: Postcards from the Borderless",
    "Pack Light: Nomad Survival Guide",
    "Exit Wounds: Beauty in Ruin",
  ],
  coverArtist: "TBD",
  coverPhotographer: "TBD",
};