"use client";

import { useEffect, useState } from "react";
import { type Product } from "@/lib/data/merch";

export type CatalogStatus = "idle" | "loading" | "loaded" | "error";

// Shared live-catalog fetch, extracted from src/app/merch/page.tsx so any page
// that wants real, order-able products (not mock/archive data) can pull the
// same retrying fetch against /api/printful-catalog instead of duplicating it.
export function usePrintfulCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [catalogStatus, setCatalogStatus] = useState<CatalogStatus>("idle");

  useEffect(() => {
    setCatalogStatus("loading");
    let attempts = 0;
    const maxAttempts = 3;
    const delay = 1000;
    const controller = new AbortController();

    const fetchCatalog = () => {
      fetch("/api/printful-catalog", { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((data) => {
          const list: Record<string, unknown>[] = Array.isArray(data.products) ? data.products : [];
          if (list.length === 0) { setProducts([]); setCatalogStatus("loaded"); return; }
          const printfulProducts: Product[] = list.map((p) => ({
            id: p.id as number,
            name: p.title as string,
            category: (p.category as string) || "Apparel",
            price: (p.price as number) || 0,
            description: `Custom ${p.title}, Dying Breed Crew x WYZ Design`,
            colors: ["#333333", "#DF3131", "#FFFFFF"],
            image: (p.image as string) || "/images/merch/dbc-archive/WYZ-Crown-Dad-hat.jpg",
          }));
          setProducts(printfulProducts);
          setCatalogStatus("loaded");
        })
        .catch(() => {
          attempts++;
          if (attempts < maxAttempts && !controller.signal.aborted) {
            setTimeout(fetchCatalog, delay * attempts);
          } else {
            setCatalogStatus("error");
          }
        });
    };
    fetchCatalog();
    return () => controller.abort();
  }, []);

  return { products, catalogStatus };
}
