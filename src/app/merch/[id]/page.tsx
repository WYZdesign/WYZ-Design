import type { Metadata } from "next";
import Link from "next/link";
import { getProductWithVariants } from "@/lib/printful";
import MerchProductClient from "./MerchProductClient";

const SITE = "https://www.wyzdesign.com";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (!productId || isNaN(productId)) return {};
  const product = await getProductWithVariants(productId);
  if (!product) return {};
  const url = `${SITE}/merch/${productId}`;
  const description = `Premium print-on-demand ${product.type || "apparel"}, printed fresh on every order. Dying Breed Crew. Ships in 3-5 business days via Printful.`;
  return {
    title: `${product.title} | WYZ Merch`,
    description,
    alternates: { canonical: `/merch/${productId}` },
    openGraph: {
      title: product.title,
      description,
      url,
      siteName: "WYZ Design",
      type: "website",
      images: [{ url: product.image, width: 1200, height: 1200, alt: product.title }],
    },
  };
}

export default async function MerchProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  const product = !productId || isNaN(productId) ? null : await getProductWithVariants(productId);

  if (!product) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1C1C1E] flex flex-col items-center justify-center px-6">
        <h1 className="font-heading font-black text-[#333] dark:text-white text-2xl mb-4">Product Not Found</h1>
        <p className="text-[#666] dark:text-white/70 mb-6 text-center max-w-md">
          This product may have been removed or the link is invalid.
        </p>
        <Link href="/merch" className="px-6 py-3 bg-[#DF3131] text-white font-bold tracking-[0.1em] hover:bg-[#B82020] transition-colors">
          Back to Shop
        </Link>
      </main>
    );
  }

  const pricedVariants = product.variants.filter((v) => v.price > 0);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: pricedVariants.length ? Math.min(...pricedVariants.map((v) => v.price)) : 0,
      highPrice: pricedVariants.length ? Math.max(...pricedVariants.map((v) => v.price)) : 0,
      offerCount: pricedVariants.length,
      availability: pricedVariants.length ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MerchProductClient product={product} />
    </>
  );
}
