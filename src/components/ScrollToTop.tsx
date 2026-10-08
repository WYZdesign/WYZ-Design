"use client";

import { useEffect, useState, useRef } from "react";
import { FiArrowUp } from "react-icons/fi";
import { useCart } from "@/lib/cart";

export default function ScrollToTop() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hidden, setHidden] = useState(false);
  // Full visual audit (2026-10-08, Claude): this button and CartButton were
  // both hard-coded to the exact same `fixed bottom-6 left-6` spot. CartButton
  // only renders once the cart has items, but when it does, this button's
  // z-[var(--z-toast)] (99999) sits flush on top of CartButton's z-[100],
  // completely covering it the moment someone scrolls past 400px with
  // anything in their cart -- the cart FAB became unreachable, not just
  // visually messy. useCart() is safe here: ScrollToTop already mounts
  // inside <CartProvider> in layout.tsx. When the cart is non-empty, stack
  // this button one slot higher (bottom-24) instead of sharing CartButton's
  // corner, the same 6rem stacking increment already used for the chat
  // bubble/panel pair in ChatWidget.tsx.
  const { count } = useCart();
  // Same audit: CookieBanner is a real role="dialog" aria-modal panel that
  // spans the full width of the bottom of the screen on mobile
  // (`fixed bottom-0 left-0 right-0`) while it's up, and tags itself
  // data-chat-avoid for exactly this reason (ChatWidget already dodges it).
  // This button didn't, so on a first visit where someone scrolls past
  // 400px before answering the cookie prompt, this button's 99999 z-index
  // rendered on top of the dialog, which is capable of blocking its own
  // bottom-left control under this button's footprint. Reuse the same
  // marker + corner-intersection technique ChatWidget uses (board #29),
  // mirrored to this button's bottom-LEFT corner instead of bottom-right.
  const [clearZone, setClearZone] = useState(false);

  useEffect(() => {
    const handler = () => {
      setScrollY(window.scrollY);
      setHidden(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setHidden(false), 600);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const checkMenu = () => {
      const menu = document.querySelector('[data-mobile-menu="true"]');
      setMenuOpen(!!menu && getComputedStyle(menu).display !== 'none');
    };
    const interval = setInterval(checkMenu, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-chat-avoid]"));
    if (targets.length === 0) { setClearZone(false); return; }
    const CLEARANCE = 56; // 44px button + ~12px breathing room
    let observer: IntersectionObserver | null = null;
    const corner = () => ({
      top: Math.max(window.innerHeight - CLEARANCE - 24, 0),
      right: Math.max(window.innerWidth - CLEARANCE - 24, 0),
    });
    const checkNow = () => {
      const { top, right } = corner();
      const hit = targets.some((t) => {
        const r = t.getBoundingClientRect();
        return r.bottom > top && r.left < right && r.top < window.innerHeight && r.right > 0;
      });
      setClearZone(hit);
    };
    const build = () => {
      observer?.disconnect();
      const { top, right } = corner();
      // Shrink the root to this button's own LOWER-LEFT corner: negative top
      // margin drops the root's top edge down, negative RIGHT margin pulls
      // the right edge in (mirrors ChatWidget's lower-right version).
      observer = new IntersectionObserver(
        (entries) => setClearZone(entries.some((e) => e.isIntersecting)),
        { rootMargin: `-${top}px -${right}px 0px 0px` }
      );
      targets.forEach((t) => observer!.observe(t));
    };
    checkNow();
    build();
    window.addEventListener("resize", build);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", build);
    };
  }, []);

  const visible = scrollY > 400 && !menuOpen && !clearZone;

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className={`fixed ${count > 0 ? "bottom-24" : "bottom-6"} left-6 z-[var(--z-toast)] w-11 h-11 bg-[#DF3131] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#B82020] hover:scale-110 transition-all duration-300 ${!visible || hidden ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100"}`}
    >
      <FiArrowUp className="w-5 h-5" />
    </button>
  );
}
