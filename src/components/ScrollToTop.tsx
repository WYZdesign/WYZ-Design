"use client";

import { useEffect, useState, useRef } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTop() {
  const [scrollY, setScrollY] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hidden, setHidden] = useState(false);

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

  const bodyLocked = typeof document !== "undefined" && document.body.style.overflow === "hidden";
  const visible = scrollY > 400 && !bodyLocked;

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

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
