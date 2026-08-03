"use client";
import { useEffect } from "react";

export default function ScrollAnimator() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("wz-revealed");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -30px 0px", threshold: 0.05 });

    function scan() {
      const sel = "h1, h2, h3, h4, p";
      document.querySelectorAll(sel).forEach((el) => {
        if (el.classList.contains("wz-reveal")) return;
        if (el.closest("nav, footer, [role='navigation'], .fixed, .sticky, .absolute")) return;
        el.classList.add("wz-reveal");
        io.observe(el);
        // Defensive fallback: if the IntersectionObserver never fires for this
        // element (race condition with layout/reflow timing, e.g. flex `order`
        // reshuffling on mobile), force it visible after 2s so content can
        // never be permanently stuck at opacity:0.
        setTimeout(() => {
          if (!el.classList.contains("wz-revealed")) {
            el.classList.add("wz-revealed");
          }
        }, 2000);
      });
    }

    scan();
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { mo.disconnect(); io.disconnect(); };
  }, []);
  return null;
}
