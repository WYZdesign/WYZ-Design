"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import ScrollReveal from "@/components/ScrollReveal";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  colors: string[];
  image: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  materials?: string[];
  sizes?: string[];
}

const FALLBACK_PRODUCTS: Product[] = [
  { id: 71, name: "Unisex Staple T-Shirt", category: "Apparel", price: 29.99, description: "Custom Bella+Canvas 3001, Dying Breed Crew x WYZ Design", colors: ["#333333", "#DF3131", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg", rating: 4.7, reviews: 89, materials: ["100% combed ringspun cotton", "Side-seamed construction", "Retail fit"], sizes: ["S", "M", "L", "XL", "2XL"] },
  { id: 12, name: "Unisex Basic Softstyle T-Shirt", category: "Apparel", price: 24.99, description: "Custom Gildan 64000, Dying Breed Crew x WYZ Design", colors: ["#333333", "#DF3131", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Unisex-denim-jacket.jpg", rating: 4.7, reviews: 112, materials: ["100% ring-spun cotton", "4.5 oz lightweight", "Tear-away label"], sizes: ["S", "M", "L", "XL", "2XL"] },
  { id: 831, name: "Unisex Organic Hoodie", category: "Apparel", price: 64.99, description: "Custom Stanley/Stella, Dying Breed Crew x WYZ Design", colors: ["#333333", "#DF3131", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie.jpg", rating: 4.8, reviews: 67, materials: ["80% organic cotton, 20% recycled polyester", "Brushed interior", "Fleece lined"], sizes: ["S", "M", "L", "XL", "2XL"] },
  { id: 77, name: "Snapback Cap", category: "Headwear", price: 32.99, description: "Custom snapback cap, Dying Breed Crew x WYZ Design", colors: ["#333333", "#DF3131", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg", rating: 4.7, reviews: 89, materials: ["100% chino cotton twill", "6-panel construction", "Adjustable snap closure"], sizes: ["One Size"] },
  { id: 100, name: "5 Panel Trucker Cap", category: "Headwear", price: 29.99, description: "Custom 5-panel trucker, Dying Breed Crew x WYZ Design", colors: ["#333333", "#DF3131", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg", rating: 4.6, reviews: 54, materials: ["Front foam panel", "Mesh back", "Snapback closure"], sizes: ["One Size"] },
  { id: 140, name: "Closed-Back Structured Cap", category: "Headwear", price: 34.99, description: "Custom structured cap, Dying Breed Crew x WYZ Design", colors: ["#333333", "#DF3131", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg", rating: 4.7, reviews: 41, materials: ["Structured crown", "Closed back", "Embroidered front"], sizes: ["One Size"] },
  { id: 300, name: "Black Glossy Mug", category: "Accessories", price: 14.99, description: "Custom 11oz ceramic mug, Dying Breed Crew x WYZ Design", colors: ["#333333", "#FFFFFF"], image: "/images/merch/dbc-archive/WYZ-Crown-White-glossy-mug.jpg", rating: 4.8, reviews: 189, materials: ["Ceramic, 11oz capacity", "Glossy finish", "Dishwasher & microwave safe"], sizes: ["11oz"] },
  { id: 2, name: "Framed Poster", category: "Art", price: 39.99, description: "Custom framed poster, Dying Breed Crew x WYZ Design", colors: ["#333333"], image: "/images/merch/dbc-archive/WYZ-Crown-Unisex-denim-jacket.jpg", rating: 4.6, reviews: 34, materials: ["Museum-quality paper", "Hardwood frame", "Acrylic front"], sizes: ["12x18", "18x24", "24x36"] },
  { id: 3, name: "Canvas", category: "Art", price: 49.99, description: "Custom canvas print, Dying Breed Crew x WYZ Design", colors: ["#333333"], image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie-1.jpg", rating: 4.7, reviews: 28, materials: ["Poly-cotton canvas", "1.5\" stretcher bars", "Wire hanger"], sizes: ["12x12", "16x20", "24x36"] },
  { id: 350, name: "All-Over Print Fanny Pack", category: "Accessories", price: 29.99, description: "Custom all-over print fanny pack, Dying Breed Crew x WYZ Design", colors: ["#333333", "#DF3131"], image: "/images/merch/dbc-archive/WYZ-Crown-Organic-denim-tote-bag.jpg", rating: 4.5, reviews: 45, materials: ["100% polyester", "All-over sublimation print", "Adjustable waist strap"], sizes: ["One Size"] },
  { id: 465, name: "All-Over Print Duffle Bag", category: "Accessories", price: 79.99, description: "Custom all-over print duffle bag, Dying Breed Crew x WYZ Design", colors: ["#333333", "#DF3131"], image: "/images/merch/dbc-archive/WYZ-Crown-Organic-denim-tote-bag.jpg", rating: 4.6, reviews: 22, materials: ["100% polyester", "All-over sublimation print", "Inner pocket"], sizes: ["One Size"] },
  { id: 400, name: "All-Over Print Joggers", category: "Apparel", price: 59.99, description: "Custom all-over print joggers, Dying Breed Crew x WYZ Design", colors: ["#333333", "#DF3131"], image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie.jpg", rating: 4.7, reviews: 38, materials: ["100% polyester", "All-over sublimation print", "Elastic waistband"], sizes: ["S", "M", "L", "XL"] },
  { id: 200, name: "All-Over Print Crop Top", category: "Apparel", price: 34.99, description: "Custom all-over print crop top, Dying Breed Crew x WYZ Design", colors: ["#333333", "#DF3131"], image: "/images/merch/dbc-archive/98442d-c13840a266e44b959886dc63b5826213~mv2.jpg", rating: 4.6, reviews: 52, materials: ["100% polyester", "All-over sublimation print", "Cropped fit"], sizes: ["XS", "S", "M", "L"] },
  { id: 619, name: "Cropped Windbreaker", category: "Apparel", price: 69.99, description: "Custom cropped windbreaker, Dying Breed Crew x WYZ Design", colors: ["#333333", "#DF3131"], image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie.jpg", rating: 4.8, reviews: 19, materials: ["100% nylon", "Water-resistant", "Cropped hem"], sizes: ["S", "M", "L", "XL"] },
  { id: 301, name: "Rash Guard", category: "Apparel", price: 44.99, description: "Custom rash guard, Dying Breed Crew x WYZ Design", colors: ["#333333", "#DF3131"], image: "/images/merch/dbc-archive/WYZ-Crown-Crop-Hoodie-1.jpg", rating: 4.5, reviews: 31, materials: ["82% polyester, 18% spandex", "UPF 50+", "Flatlock seams"], sizes: ["S", "M", "L", "XL"] },
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [allProducts, setAllProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/printful-catalog")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (cancelled || !data.products?.length) return;
        const printfulProducts: Product[] = data.products.map((p: Record<string, unknown>) => ({
          id: p.id as number,
          name: (p.title as string) || "Product",
          category: (p.category as string) || "Apparel",
          price: (p.price as number) || 0,
          description: `Custom ${p.title}, Dying Breed Crew x WYZ Design`,
          colors: ["#333333", "#DF3131", "#FFFFFF"],
          image: (p.image as string) || "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg",
          rating: 4.7,
          reviews: Math.floor(Math.random() * 150) + 20,
        }));
        setAllProducts(printfulProducts);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const product = allProducts.find((p) => p.id === Number(id));

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#1C1C1E] flex items-center justify-center pt-32 lg:pt-40">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#DF3131] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[14px] text-[#666] dark:text-[#aaa]">Loading product...</p>
        </div>
      </main>
    );
  }

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

  const related = allProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  if (related.length < 4) {
    const extra = allProducts.filter((p) => p.id !== product.id && p.category !== product.category).slice(0, 4 - related.length);
    related.push(...extra);
  }

  const handleAddToCart = () => {
    setAdded(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAdded(false), 2000);
  };

  const materials = product.materials || ["Premium materials", "Ethically sourced", "Machine washable"];
  const sizes = product.sizes || ["S", "M", "L", "XL"];

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
                    <svg key={i} className={`w-4 h-4 ${i <= Math.round(product.rating || 0) ? "text-[#D49341]" : "text-[#ddd]"}`} fill="currentColor" viewBox="0 0 20 20">
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
                  {sizes.map((s, i) => (
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
                  {materials.map((m, i) => (
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
                       <Image src={p.image} alt={p.name} fill sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 25vw" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
