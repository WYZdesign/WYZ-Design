"use client";

import { useState, use } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import ScrollReveal from "@/components/ScrollReveal";
import LeadMagnet from "@/components/LeadMagnet";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  colors: string[];
  image: string;
  hoverImage?: string;
  materials?: string[];
}

const FALLBACK_PRODUCTS: Product[] = [
  { id: 1, name: "Denim Tee", category: "Apparel", price: 34.99, description: "Unisex premium denim tee. Heavyweight cotton with a lived-in feel.", colors: ["#282828", "#1B3A5C"], image: "/images/merch/dbc-archive/WYZ-Crown-Unisex-denim-jacket.jpg", materials: ["100% Cotton", "Heavyweight 8oz"] },
  { id: 2, name: "Zip-Up Hoodie", category: "Apparel", price: 64.99, description: "Unisex fleece zip-up hoodie. Brushed interior, metal hardware.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie.jpg", materials: ["80% Cotton", "20% Polyester"] },
  { id: 3, name: "Hooded Long Sleeve", category: "Apparel", price: 44.99, description: "Unisex hooded long sleeve tee. Lightweight layering piece.", colors: ["#282828", "#7A8B99"], image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie-1.jpg", materials: ["60% Cotton", "40% Polyester"] },
  { id: 4, name: "Cropped Hoodie", category: "Apparel", price: 54.99, description: "Women's cropped hoodie. Relaxed fit, raw hem, ribbed cuffs.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/98442d-bd1e1406036dba99d4f8197e1495333~mv2.jpg", materials: ["70% Cotton", "30% Polyester"] },
  { id: 5, name: "Ribbed Beanie", category: "Headwear", price: 24.99, description: "Organic ribbed beanie. One-size-fits-all, folded cuff.", colors: ["#282828", "#DF3131", "#FFFFFF"], image: "/images/merch/dbc-archive/98442d-60d7fe9cb1a14d4696d62ca1b5902cdf~mv2.jpg", materials: ["100% Organic Cotton"] },
  { id: 6, name: "Snapback Cap", category: "Headwear", price: 32.99, description: "Adjustable snapback cap. Structured crown, flat visor.", colors: ["#282828", "#DF3131", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg", materials: ["Cotton Twill", "Structured Cap"] },
  { id: 7, name: "Crop Top", category: "Apparel", price: 29.99, description: "Classic crop top. Premium ring-spun cotton, retail fit.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/98442d-c13840a266e44b959886dc63b5826213~mv2.jpg", materials: ["100% Ring-spun Cotton"] },
  { id: 8, name: "Denim Tote Bag", category: "Accessories", price: 39.65, description: "Organic denim tote bag. Spacious, functional, everyday use.", colors: ["#282828"], image: "/images/merch/dbc-archive/WYZ-Crown-Organic-denim-tote-bag.jpg", materials: ["Organic Denim", "15oz Canvas"] },
  { id: 9, name: "Ceramic Mug", category: "Accessories", price: 14.99, description: "Black glossy ceramic mug. 11oz, dishwasher safe.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-White-glossy-mug.jpg", materials: ["Ceramic", "Dishwasher Safe"] },
  { id: 10, name: "Stainless Tumbler", category: "Accessories", price: 27.78, description: "Stainless steel tumbler. Protects against peeling and fading.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Stainless-steel-tumbler.jpg", materials: ["18/8 Stainless Steel", "Double-walled"] },
  { id: 11, name: "Embroidered Patches", category: "Accessories", price: 11.87, description: "Embroidered patches. Durable twill fabric, adds color to any outfit.", colors: ["#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Embroidered-patches.jpg", materials: ["Twill Fabric", "Iron-on Backing"] },
  { id: 12, name: "Embroidered Socks", category: "Accessories", price: 29.77, description: "Embroidered socks. Bold minimalist look, US-made.", colors: ["#282828", "#999999", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Embroidered-socks.jpg", materials: ["Cotton Blend", "US-made"] },
  { id: 13, name: "Water Bottle", category: "Accessories", price: 22.00, description: "Flip straw water bottle. BPA-free, on-the-go hydration.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Flip-straw-water-bottle.jpg", materials: ["BPA-free Plastic", "24oz Capacity"] },
  { id: 14, name: "Organic Apron", category: "Accessories", price: 32.18, description: "Organic cotton apron. 100% organic, sturdy cotton.", colors: ["#282828"], image: "/images/merch/dbc-archive/WYZ-Crown-Organic-cotton-apron.jpg", materials: ["100% Organic Cotton", "Adjustable Strap"] },
];

export default function MerchProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const productId = parseInt(id, 10);
  const product = FALLBACK_PRODUCTS.find(p => p.id === productId);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "#282828");
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1C1C1E] flex flex-col items-center justify-center px-6">
        <h1 className="font-heading font-black text-[#333] dark:text-white text-2xl mb-4">Product Not Found</h1>
        <p className="text-[#666] dark:text-white/70 mb-6">This product may have been removed or the link is invalid.</p>
        <Link href="/merch" className="px-6 py-3 bg-[#DF3131] text-white font-bold tracking-[0.1em] hover:bg-[#B82020] transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#1C1C1E]">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <Link href="/merch" className="inline-flex items-center gap-2 text-[#666] dark:text-white/70 hover:text-[#DF3131] transition-colors mb-8 text-sm font-semibold tracking-[0.1em] uppercase">
          ← Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <ScrollReveal animation="fadeUp">
            <div className="relative aspect-square bg-[#f5f5f5] dark:bg-[#252528] rounded-xl overflow-hidden">
              <SafeImage src={product.image} alt={product.name} fill className="object-cover" priority />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="flex flex-col">
              <span className="text-[#DF3131] text-[11px] font-bold tracking-[0.25em] uppercase mb-2">{product.category}</span>
              <h1 className="font-heading font-black text-[#333] dark:text-white text-3xl lg:text-4xl tracking-[0.04em] uppercase mb-4">{product.name}</h1>
              <p className="text-[#666] dark:text-white/70 text-lg leading-relaxed mb-6">{product.description}</p>
              
              <div className="text-4xl font-black text-[#333] dark:text-white mb-6">${product.price.toFixed(2)}</div>

              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#666] dark:text-white/70 mb-3">Color</p>
                  <div className="flex gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? "border-[#DF3131] scale-110" : "border-transparent hover:scale-105"}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color} color`}
                        aria-pressed={selectedColor === color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.materials && product.materials.length > 0 && (
                <div className="mb-6">
                  <p className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#666] dark:text-white/70 mb-2">Materials</p>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map(m => (
                      <span key={m} className="px-3 py-1 bg-[#f5f5f5] dark:bg-[#252528] text-[#666] dark:text-white/70 text-[12px] font-semibold tracking-[0.05em] rounded-full">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className={`mt-4 w-full py-4 text-[14px] font-bold tracking-[0.12em] uppercase transition-all ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-[#DF3131] text-white hover:bg-[#B82020]"
                }`}
              >
                {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>

              <p className="text-[#999] dark:text-white/50 text-[12px] text-center mt-3">
                Print-on-demand via Printful. Ships in 3-5 business days.
              </p>

              <div className="mt-8 pt-8 border-t border-[#E2E2E2] dark:border-[#444]">
                <Link href="/merch" className="text-[#DF3131] hover:underline text-sm font-semibold tracking-[0.05em]">
                  Continue Shopping →
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <LeadMagnet />
    </main>
  );
}
