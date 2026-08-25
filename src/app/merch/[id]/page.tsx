"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import ScrollReveal from "@/components/ScrollReveal";
import SafeImage from "@/components/SafeImage";

const PRODUCTS = [
  { id: 1, name: "Denim Tee", category: "Apparel", price: 34.99, description: "Unisex premium denim tee. Heavyweight cotton with a lived-in feel.", colors: ["#282828", "#1B3A5C"], image: "/images/merch/dbc-archive/WYZ-Crown-Unisex-denim-jacket.jpg", rating: 4.8, reviews: 124, badge: "Best Seller", materials: ["100% heavyweight cotton", "Pre-shrunk denim weave", "Reinforced stitching", "Machine washable"], sizes: ["S", "M", "L", "XL", "2XL"] },
  { id: 2, name: "Zip-Up Hoodie", category: "Apparel", price: 64.99, description: "Unisex fleece zip-up hoodie. Brushed interior, metal hardware.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie.jpg", rating: 4.9, reviews: 87, badge: "Premium", materials: ["80% cotton, 20% polyester fleece", "Brushed interior lining", "YKK metal zipper", "Ribbed cuffs and hem"], sizes: ["S", "M", "L", "XL", "2XL"] },
  { id: 3, name: "Hooded Long Sleeve", category: "Apparel", price: 44.99, description: "Unisex hooded long sleeve tee. Lightweight layering piece.", colors: ["#282828", "#7A8B99"], image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie-1.jpg", rating: 4.7, reviews: 65, materials: ["100% ring-spun cotton", "Lightweight 4.2 oz fabric", "Attached hood with drawstring", "Tagless neck label"], sizes: ["S", "M", "L", "XL"] },
  { id: 4, name: "Cropped Hoodie", category: "Apparel", price: 54.99, description: "Women's cropped hoodie. Relaxed fit, raw hem, ribbed cuffs.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg", rating: 4.8, reviews: 52, badge: "New", materials: ["50% cotton, 50% polyester", "Cropped raw hem finish", "Ribbed cuffs and waistband", "Front pouch pocket"], sizes: ["XS", "S", "M", "L"] },
  { id: 5, name: "Ribbed Beanie", category: "Headwear", price: 24.99, description: "Organic ribbed beanie. One-size-fits-all, folded cuff.", colors: ["#282828", "#DF3131", "#FFFFFF"], image: "/images/merch/dbc-archive/98442d-60d7fe9cb1a14d4696d62ca1b5902cdf~mv2.jpg", rating: 4.7, reviews: 203, badge: "Popular", materials: ["100% organic acrylic rib knit", "One-size-fits-all", "Folded cuff design", "Warm winter weight"], sizes: ["One Size"] },
  { id: 6, name: "Snapback Cap", category: "Headwear", price: 32.99, description: "Adjustable snapback cap. Structured crown, flat visor.", colors: ["#282828", "#DF3131", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg", rating: 4.7, reviews: 89, materials: ["100% chino cotton twill", "6-panel construction", "Embroidered eyelets", "Adjustable snap closure"], sizes: ["One Size"] },
  { id: 7, name: "Crop Top", category: "Apparel", price: 29.99, description: "Classic crop top. Premium ring-spun cotton, retail fit.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie-1.jpg", rating: 4.6, reviews: 156, materials: ["100% ring-spun cotton", "4.3 oz lightweight fabric", "Retail fit, cropped length", "Tear-away label"], sizes: ["XS", "S", "M", "L"] },
  { id: 8, name: "Denim Tote Bag", category: "Accessories", price: 39.65, description: "Organic denim tote bag. Spacious, functional, everyday use.", colors: ["#282828"], image: "/images/merch/dbc-archive/WYZ-Crown-Organic-denim-tote-bag.jpg", rating: 4.5, reviews: 45, materials: ["100% organic cotton denim", "Interior pocket", "Reinforced handles", "Machine washable"], sizes: ["One Size"] },
  { id: 9, name: "Ceramic Mug", category: "Accessories", price: 14.99, description: "Black glossy ceramic mug. 11oz, dishwasher safe.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-White-glossy-mug.jpg", rating: 4.6, reviews: 189, materials: ["Ceramic, 11oz capacity", "Glossy finish", "Dishwasher & microwave safe", "C-handle design"], sizes: ["11oz"] },
  { id: 10, name: "Stainless Tumbler", category: "Accessories", price: 27.78, description: "Stainless steel tumbler. Protects against peeling and fading.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Stainless-steel-tumbler.jpg", rating: 4.8, reviews: 76, materials: ["18/8 stainless steel", "Double-wall vacuum insulated", "Keeps drinks cold 24hrs / hot 12hrs", "Powder-coated finish"], sizes: ["20oz"] },
  { id: 11, name: "Embroidered Patches", category: "Accessories", price: 11.87, description: "Embroidered patches. Durable twill fabric, adds color to any outfit.", colors: ["#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Embroidered-patches.jpg", rating: 4.9, reviews: 54, badge: "Value", materials: ["Twill fabric base", "Iron-on backing", "Merrowed border", "3.5\" diameter"], sizes: ["One Size"] },
  { id: 12, name: "Embroidered Socks", category: "Accessories", price: 29.77, description: "Embroidered socks. Bold minimalist look, US-made.", colors: ["#282828", "#999999", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Embroidered-socks.jpg", rating: 4.7, reviews: 67, materials: ["75% combed cotton", "22% nylon, 3% spandex", "Reinforced heel & toe", "Made in USA"], sizes: ["S/M", "L/XL"] },
  { id: 13, name: "Water Bottle", category: "Accessories", price: 22.00, description: "Flip straw water bottle. BPA-free, on-the-go hydration.", colors: ["#282828", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Flip-straw-water-bottle.jpg", rating: 4.5, reviews: 41, materials: ["BPA-free Tritan plastic", "Flip-up straw lid", "Locking mechanism", "26oz capacity"], sizes: ["26oz"] },
  { id: 14, name: "Organic Apron", category: "Accessories", price: 32.18, description: "Organic cotton apron. 100% organic, sturdy cotton.", colors: ["#282828"], image: "/images/merch/dbc-archive/WYZ-Crown-Organic-cotton-apron.jpg", rating: 4.6, reviews: 33, materials: ["100% organic cotton", "Adjustable neck strap", "Front pocket", "Machine washable"], sizes: ["One Size"] },
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = PRODUCTS.find(p => p.id === Number(id));
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1C1C1E] flex items-center justify-center pt-32 lg:pt-40">
        <div className="text-center">
          <h1 className="font-heading font-black text-[2rem] text-[#333] dark:text-[#e0e0e0] mb-4">Product Not Found</h1>
          <Link href="/merch" className="text-[#DF3131] font-bold hover:underline">Back to Shop</Link>
        </div>
      </main>
    );
  }

  const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
  if (related.length < 4) {
    const extra = PRODUCTS.filter(p => p.id !== product.id && p.category !== product.category).slice(0, 4 - related.length);
    related.push(...extra);
  }

  const handleAddToCart = () => {
    setAdded(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#1C1C1E] pb-20">
      {/* Breadcrumb */}
      <div className="max-w-[130rem] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-6">
        <nav className="flex items-center gap-2 text-[13px] text-[#666] dark:text-[#aaa]">
          <Link href="/merch" className="hover:text-[#DF3131] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#333] dark:text-[#e0e0e0]">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <ScrollReveal animation="fadeUp">
            <div className="relative aspect-square overflow-hidden bg-[#f5f5f5] dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] group">
              <Image src={product.image} alt={product.name} fill className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" priority />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-[#DF3131] text-white text-[11px] font-bold tracking-[0.1em] px-3 py-1 uppercase z-10">
                  {product.badge}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Info */}
          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#DF3131] mb-2">{product.category}</span>
              <h1 className="font-heading font-black text-[2rem] sm:text-[2.5rem] md:text-[3rem] text-[#333] dark:text-[#e0e0e0] tracking-[0.03em] mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? "text-[#D49341]" : "text-[#ddd]"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[14px] text-[#666] dark:text-[#aaa]">{product.rating} ({product.reviews} reviews)</span>
              </div>

              <p className="text-[2rem] font-heading font-black text-[#DF3131] mb-2">${product.price.toFixed(2)}</p>
              <p className="text-[15px] text-[#666] dark:text-[#b0b0b0] leading-relaxed mb-6">{product.description}</p>

              {/* Color Selector */}
              <div className="mb-6">
                <p className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-3">Color</p>
                <div className="flex gap-3">
                  {product.colors.map((c, i) => (
                    <button key={i} onClick={() => setSelectedColor(i)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${i === selectedColor ? "border-[#DF3131] scale-110 shadow-lg" : "border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131]/50"}`}
                      style={{ backgroundColor: c }} aria-label={`Color option ${i + 1}`} />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <p className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s, i) => (
                    <button key={i} onClick={() => setSelectedSize(i)}
                      className={`px-4 py-2 text-[13px] font-bold tracking-[0.05em] border transition-all ${i === selectedSize ? "bg-[#DF3131] text-white border-[#DF3131]" : "bg-white dark:bg-[#252528] text-[#333] dark:text-[#e0e0e0] border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131]"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border border-[#E2E2E2] dark:border-[#444] flex items-center justify-center text-[#333] dark:text-[#e0e0e0] hover:border-[#DF3131] transition-colors text-lg">-</button>
                  <span className="text-[16px] font-bold text-[#333] dark:text-[#e0e0e0] w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border border-[#E2E2E2] dark:border-[#444] flex items-center justify-center text-[#333] dark:text-[#e0e0e0] hover:border-[#DF3131] transition-colors text-lg">+</button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mb-8">
                <button onClick={handleAddToCart} className="flex-1 py-4 bg-[#DF3131] text-white font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-[#B82020] transition-all hover:shadow-lg">
                  {added ? "ADDED" : "ADD TO CART"}
                </button>
                <button onClick={handleAddToCart} className="flex-1 py-4 border-2 border-[#333] dark:border-white text-[#333] dark:text-white font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-[#333] hover:text-white dark:hover:bg-white dark:hover:text-[#111] transition-all">
                  BUY NOW
                </button>
              </div>

              {/* Material Specs */}
              <div className="border-t border-[#E2E2E2] dark:border-[#444] pt-6">
                <p className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-3">Material Specs</p>
                <ul className="space-y-2">
                  {product.materials.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-[14px] text-[#666] dark:text-[#b0b0b0]">
                      <span className="text-[#DF3131] mt-0.5">+</span> {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* POD Disclosure */}
              <div className="mt-6 p-4 bg-[#f9f9f9] dark:bg-[#2a2a2a] border border-[#E2E2E2] dark:border-[#444] rounded-lg">
                <p className="text-[13px] text-[#666] dark:text-[#b0b0b0] leading-relaxed">
                  This product is made especially for you as soon as you place an order. Production times vary by product. We partner with ethical manufacturers to help reduce overproduction, so thank you for making thoughtful purchasing decisions.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* You Might Also Like */}
      {related.length > 0 && (
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <section className="mt-20 py-12 border-t border-[#E2E2E2] dark:border-[#444]">
            <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
              <h2 className="font-heading font-black text-[1.5rem] sm:text-[2rem] text-[#333] dark:text-[#e0e0e0] tracking-[0.06em] mb-8 text-center">YOU MIGHT ALSO LIKE</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map(p => (
                  <Link key={p.id} href={`/merch/${p.id}`} className="group">
                    <div className="relative aspect-square overflow-hidden bg-[#f5f5f5] dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all mb-3">
                      <Image src={p.image} alt={p.name} fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="font-heading font-bold text-[14px] text-[#333] dark:text-[#e0e0e0] group-hover:text-[#DF3131] transition-colors">{p.name}</p>
                    <p className="text-[13px] text-[#DF3131] font-bold">${p.price.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}
    </main>
  );
}
