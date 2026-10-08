"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CartLine, MAX_CART_LINES, cartSubtotalCents, sanitizeCartLine } from "@/lib/merch";

const STORAGE_KEY = "wyz_cart_v1";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  ready: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  addLine: (line: CartLine) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  removeLine: (variantId: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeCartLine).filter(Boolean).slice(0, MAX_CART_LINES) as CartLine[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLines(readStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage full or blocked - cart still works for this session */
    }
  }, [lines, ready]);

  const addLine = useCallback((line: CartLine) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === line.variantId);
      if (existing) {
        return prev.map((l) =>
          l.variantId === line.variantId
            ? { ...l, quantity: Math.min(l.quantity + line.quantity, 10) }
            : l
        );
      }
      return [...prev, line].slice(0, MAX_CART_LINES);
    });
    setOpen(true);
  }, []);

  const updateQuantity = useCallback((variantId: number, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.variantId === variantId ? { ...l, quantity: Math.max(0, Math.min(quantity, 10)) } : l))
        .filter((l) => l.quantity > 0)
    );
  }, []);

  const removeLine = useCallback((variantId: number) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotalCents: cartSubtotalCents(lines),
      ready,
      open,
      setOpen,
      addLine,
      updateQuantity,
      removeLine,
      clear,
    }),
    [lines, ready, open, addLine, updateQuantity, removeLine, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
