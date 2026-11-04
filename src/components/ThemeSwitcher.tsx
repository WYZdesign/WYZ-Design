"use client";

import { useColorTheme } from "@/lib/color-theme-context";
import { useState, useRef, useEffect } from "react";
import { FiSettings, FiX } from "react-icons/fi";
import { useModalA11y } from "@/hooks/useModalA11y";

export function ThemeSwitcher() {
  const { theme, setTheme, availableThemes } = useColorTheme();
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-lg text-[13px] font-bold tracking-[0.08em] text-[#333] dark:text-white hover:border-[#DF3131] transition-all"
        aria-label="Theme settings"
        aria-expanded={open}
      >
        <FiSettings className="w-4 h-4 text-[#DF3131]" />
        <span className="hidden sm:inline">{theme.label}</span>
        <FiSettings className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#444] rounded-lg shadow-xl overflow-hidden z-50 animate-fadeIn">
          <div className="p-3 border-b border-[#E2E2E2] dark:border-[#444] flex items-center justify-between">
            <h3 className="font-heading font-bold text-[#333] dark:text-white text-[13px]">Choose Theme</h3>
            <button onClick={() => setOpen(false)} className="text-[#666] dark:text-[#aaa] hover:text-[#DF3131] min-w-[44px] min-h-[44px]" aria-label="Close">
              <FiX className="w-4 h-4" />
            </button>
          </div>
          <div className="p-2 max-h-80 overflow-y-auto">
            {availableThemes.map((t) => (
              <button
                key={t.name}
                onClick={() => { setTheme(t.name); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                  theme.name === t.name
                    ? "bg-[#DF3131]/10 border border-[#DF3131]/30"
                    : "hover:bg-[#F5F5F3] dark:hover:bg-[#2a2a2a]"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 border-2"
                  style={{ backgroundColor: t.colors.primary, borderColor: t.colors.secondary }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#333] dark:text-white text-[13px] truncate">{t.label}</p>
                  <p className="text-[11px] text-[#666] dark:text-[#aaa] truncate">{t.name === "default" ? "Red · Gold · White · Gray" : ""}</p>
                </div>
                {theme.name === t.name && <FiSettings className="w-4 h-4 text-[#DF3131]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}