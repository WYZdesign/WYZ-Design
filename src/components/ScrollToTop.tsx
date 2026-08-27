"use client";

import { useEffect, useState, useRef } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => {
      const scrolled = window.scrollY > 400;
      setVisible(scrolled);
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

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className={`fixed bottom-6 left-6 z-[var(--z-toast)] w-11 h-11 bg-[#DF3131] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#B82020] hover:scale-110 transition-all duration-300 ${hidden ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100"}`}
    >
      <FiArrowUp className="w-5 h-5" />
    </button>
  );
}
