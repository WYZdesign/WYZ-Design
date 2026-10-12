// Shared types/data extracted from src/app/merch/page.tsx (oversized-file
// split, board S3). Pure data + the one tiny formatter helper -- no JSX.
// Rendered output must stay byte-for-byte identical.

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  colors: string[];
  image: string;
  hoverImage?: string;
  badge?: string;
  materials?: string[];
}

export const fmt = (n: number) => (n > 0 ? `$${n.toFixed(2)}` : "Price on request");

export const ARCHIVE_IMAGES = [
  "/images/merch/dbc-archive/98442d-488e206ac0954202bc9563140aa2b55b~mv2.jpg",
  "/images/merch/dbc-archive/98442d-b3c114b8dab6450887e3d3aee9c71030~mv2.jpg",
  "/images/merch/dbc-archive/98442d-bd1e1406036d4ba99d4f8197e1495337~mv2.jpg",
  "/images/merch/dbc-archive/98442d-c13840a266e44b959886dc63b5826213~mv2.jpg",
  "/images/merch/dbc-archive/98442d-95706f79d3f649dd9dda6bc28ef99f65~mv2.jpg",
  "/images/merch/dbc-archive/98442d-71e847c4dd9546b0bef2a69d72d2baa6~mv2.jpg",
  "/images/merch/dbc-archive/98442d-7ef7fb49e39942f687d13018406e72a8~mv2.jpg",
  "/images/merch/dbc-archive/98442d-3aa0e795baf84e72affb65d9c1cf76a6~mv2.jpg",
  "/images/merch/dbc-archive/98442d-a35038eae10c4de8a68b7ca3aa5f28f3~mv2.jpg",
  "/images/merch/dbc-archive/98442d-60d7fe9cb1a14d4696d62ca1b5902cdf~mv2.jpg",
  "/images/merch/dbc-archive/nsplsh-ea5cee04903c44399fee2f8de391fa51~mv2.jpg",
  "/images/merch/dbc-archive/98442d-422f5f161e544ce9bf0e06f901881db4~mv2.jpg",
];

export const CATEGORIES = ["All", "Apparel", "Headwear", "Accessories"];
export const FAOTM_URL = "/featured-artist";
export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export const DBC_MODEL_MOCKUPS = [
  { id: 1, name: "Denim Jacket", category: "Outerwear", price: 89.99, img: "/images/merch/dbc-archive/WYZ-Crown-Unisex-denim-jacket.jpg", model: "/images/merch/dbc-archive/98442d-488e206ac0954202bc9563140aa2b55b~mv2.jpg" },
  { id: 2, name: "Zip-Up Hoodie", category: "Apparel", price: 64.99, img: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie.jpg", model: "/images/merch/dbc-archive/98442d-b3c114b8dab6450887e3d3aee9c71030~mv2.jpg" },
  { id: 3, name: "Crown Tee", category: "Apparel", price: 34.99, img: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie-1.jpg", model: "/images/merch/dbc-archive/98442d-bd1e1406036d4ba99d4f8197e1495337~mv2.jpg" },
  { id: 4, name: "Dad Hat", category: "Headwear", price: 32.99, img: "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg", model: "/images/merch/dbc-archive/98442d-c13840a266e44b959886dc63b5826213~mv2.jpg" },
  { id: 5, name: "Ribbed Beanie", category: "Headwear", price: 24.99, img: "/images/merch/dbc-archive/WYZ-Crown-Embroidered-patches.jpg", model: "/images/merch/dbc-archive/98442d-95706f79d3f649dd9dda6bc28ef99f65~mv2.jpg" },
  { id: 6, name: "Embroidered Socks", category: "Accessories", price: 29.77, img: "/images/merch/dbc-archive/WYZ-Crown-Embroidered-socks.jpg", model: "/images/merch/dbc-archive/98442d-a35038eae10c4de8a68b7ca3aa5f28f3~mv2.jpg" },
  { id: 7, name: "White Glossy Mug", category: "Accessories", price: 14.99, img: "/images/merch/dbc-archive/WYZ-Crown-White-glossy-mug.jpg", model: "/images/merch/dbc-archive/98442d-71e847c4dd9546b0bef2a69d72d2baa6~mv2.jpg" },
  { id: 8, name: "Denim Tote Bag", category: "Accessories", price: 39.65, img: "/images/merch/dbc-archive/WYZ-Crown-Organic-denim-tote-bag.jpg", model: "/images/merch/dbc-archive/98442d-7ef7fb49e39942f687d13018406e72a8~mv2.jpg" },
];
