"use client";

// New component (2026-10-30, Claude): lightweight, dependency-free count-up
// for stat numbers like "90+" / "10,000+". Parses the leading digits out of
// a string value and animates 0 -> that number with an eased
// requestAnimationFrame loop, then re-appends whatever suffix/formatting
// (commas, "+", "%", etc.) the original string had. Only starts once the
// element scrolls into view (IntersectionObserver, fires once), and is a
// no-op passthrough when the visitor has prefers-reduced-motion set -- it
// just renders the final value immediately, no animation, consistent with
// how the rest of this app (globals.css) already treats that preference.
import { useEffect, useRef, useState } from "react";

function parseValue(raw: string): { target: number; prefix: string; suffix: string; format: (n: number) => string } {
  const match = raw.match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!match) return { target: 0, prefix: "", suffix: raw, format: () => raw };
  const [, prefix, digits, suffix] = match;
  const hasCommas = digits.includes(",");
  const target = parseInt(digits.replace(/,/g, ""), 10) || 0;
  const format = (n: number) => (hasCommas ? n.toLocaleString("en-US") : String(n));
  return { target, prefix, suffix, format };
}

export default function CountUp({ value, duration = 1400, className }: { value: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { target, prefix, suffix, format } = parseValue(value);

    if (reduceMotion || target === 0) {
      setDisplay(value);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        obs.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = now - start;
          const t = Math.min(elapsed / duration, 1);
          // easeOutExpo - fast start, gentle settle, reads as "counting up to a real number" rather than a linear tick
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          const current = Math.round(target * eased);
          setDisplay(`${prefix}${format(current)}${suffix}`);
          if (t < 1) requestAnimationFrame(tick);
          else setDisplay(value);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
