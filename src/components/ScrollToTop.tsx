"use client";

import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className="fixed bottom-6 left-6 z-[var(--z-toast)] w-11 h-11 bg-[#DF3131] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#B82020] hover:scale-110 transition-all"
    >
      <FiArrowUp className="w-5 h-5" />
    </button>
  );
}
