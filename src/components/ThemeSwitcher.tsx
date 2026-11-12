"use client";

import { useColorTheme } from "@/lib/color-theme-context";
import { useTheme as useLightDarkMode } from "@/components/ThemeProvider";
import { useState, useRef, useEffect } from "react";
import { FiDroplet, FiX, FiCheck, FiLock, FiUser } from "react-icons/fi";
import { useModalA11y } from "@/hooks/useModalA11y";

export function ThemeSwitcher({ compact = false }: { compact?: boolean } = {}) {
  const { theme, setTheme, availableThemes, isPersisted } = useColorTheme();
  const { theme: mode } = useLightDarkMode();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useModalA11y(() => setOpen(false), { active: open });

  if (!mounted) return null;

  const currentPair = mode === "dark" ? theme.dark : theme.light;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-full text-[12px] font-bold tracking-[0.06em] text-[#333] dark:text-white hover:border-[#DF3131] transition-all ${compact ? "p-1.5" : "gap-2 pl-1.5 pr-3 py-1.5"}`}
        aria-label="Theme settings"
        aria-expanded={open}
      >
        <span
          className="w-8 h-5 rounded-full flex-shrink-0 border border-black/10 dark:border-white/15 shadow-sm"
          style={{ background: `linear-gradient(90deg, ${currentPair.primary} 50%, ${theme.swatch} 50%)` }}
          aria-hidden="true"
        />
        {!compact && <span className="hidden sm:inline">{theme.label}</span>}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
          <div className="p-4 border-b border-[#E2E2E2] dark:border-[#444] flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-[#333] dark:text-white text-[14px] tracking-[0.04em] flex items-center gap-2">
                <FiDroplet className="w-4 h-4 text-[#DF3131]" /> Site Theme
              </h3>
              <p className="text-[11px] text-[#888] dark:text-[#999] mt-0.5">
                {mode === "dark" ? "Dark variant" : "Light variant"} &middot; follows the sun/moon toggle
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#666] dark:text-[#aaa] hover:text-[#DF3131] min-w-[36px] min-h-[36px] flex items-center justify-center" aria-label="Close">
              <FiX className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 grid grid-cols-3 gap-2 max-h-72 overflow-y-auto">
            {availableThemes.map((t) => {
              const pair = mode === "dark" ? t.dark : t.light;
              const active = theme.name === t.name;
              return (
                <button
                  key={t.name}
                  onClick={() => setTheme(t.name)}
                  aria-pressed={active}
                  className={`flex flex-col items-center gap-1.5 rounded-lg p-2.5 text-center transition-all border ${
                    active
                      ? "border-[#DF3131] bg-[#DF3131]/5"
                      : "border-transparent hover:border-[#E2E2E2] dark:hover:border-[#444] hover:bg-[#F5F5F3] dark:hover:bg-[#2a2a2a]"
                  }`}
                >
                  <span className="relative w-full h-4 rounded-full border border-black/10 dark:border-white/15 shadow-sm" style={{ background: `linear-gradient(90deg, ${pair.primary} 50%, ${t.swatch} 50%)` }}>
                    {active && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DF3131] text-white flex items-center justify-center">
                        <FiCheck className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-bold text-[#333] dark:text-white leading-tight">{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t border-[#E2E2E2] dark:border-[#444] flex items-start gap-2">
            {isPersisted ? (
              <>
                <FiUser className="w-3.5 h-3.5 text-[#666] dark:text-[#aaa] mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-[#666] dark:text-[#aaa] leading-snug">
                  Saved as your default -- it&apos;ll be here next time you&apos;re signed in.
                </p>
              </>
            ) : (
              <>
                <FiLock className="w-3.5 h-3.5 text-[#666] dark:text-[#aaa] mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-[#666] dark:text-[#aaa] leading-snug">
                  Just previewing -- this resets when you leave. Sign in and set it from your account to keep it.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
