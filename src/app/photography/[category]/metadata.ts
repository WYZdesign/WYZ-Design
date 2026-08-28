import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photography Category — WYZ Design",
  description: "Browse WYZ Design photography by category: Portraits, Events, Editorial, Commercial, Studio, Urbex, Outdoors, Conceptual, Concerts, Street, Products, Bodypaint, Boudoir.",
  keywords: ["photography category", "portrait photography", "event photography", "editorial photography", "commercial photography", "studio photography", "WYZ Design gallery"],
  openGraph: {
    title: "Photography Category | WYZ Design",
    description: "Browse photography by category. Portraits, events, editorial, commercial, studio, urbex, outdoors, conceptual, concerts, street, products, bodypaint, boudoir.",
    url: "https://wyzdesign.com/photography",
    siteName: "WYZ Design",
    type: "website",
    images: [{ url: "/wyz-og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/photography",
  },
};