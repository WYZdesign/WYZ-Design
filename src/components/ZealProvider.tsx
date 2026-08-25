"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface EarnPayload {
  success: boolean;
  zeal?: number;
  total?: number;
  tier?: string;
  tierUp?: boolean;
  reason?: string;
  achievement?: { id: string; title: string; zeal: number };
  quest?: { id: string; title: string; bonusZeal: number };
}

interface ZealContextValue {
  points: number | null;
  tier: string | null;
  earn: (action: string) => Promise<EarnPayload | null>;
  refresh: () => Promise<void>;
}

const ZealContext = createContext<ZealContextValue>({
  points: null,
  tier: null,
  earn: async () => null,
  refresh: async () => {},
});

export function useZeal() {
  return useContext(ZealContext);
}

const ROUTE_ACTIONS: [RegExp, string][] = [
  [/^\/$/, "visit-homepage"],
  [/^\/home/, "visit-homepage"],
  [/^\/about/, "visit-about"],
  [/^\/photography/, "visit-service-page"],
  [/^\/designs/, "visit-service-page"],
  [/^\/web-design/, "visit-service-page"],
  [/^\/printing/, "visit-service-page"],
  [/^\/events/, "visit-service-page"],
  [/^\/services/, "visit-service-page"],
  [/^\/plans/, "visit-pricing"],
  [/^\/gallery/, "visit-gallery"],
];

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

function sessionHas(key: string): boolean {
  try { return sessionStorage.getItem(key) === "1"; } catch { return false; }
}
function sessionMark(key: string): void {
  try { sessionStorage.setItem(key, "1"); } catch {}
}

export default function ZealProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const [points, setPoints] = useState<number | null>(null);
  const [tier, setTier] = useState<string | null>(null);
  const konamiIdx = useRef(0);
  const pathnameRef = useRef<string | undefined>(undefined);
  pathnameRef.current = pathname ?? undefined;

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/zeal/status");
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.points === "number") setPoints(data.points);
      if (typeof data.tier === "string") setTier(data.tier);
    } catch {}
  }, []);

  const earn = useCallback(async (action: string): Promise<EarnPayload | null> => {
    if (status !== "authenticated") return null;
    let payload: EarnPayload;
    try {
      const res = await fetch("/api/zeal/earn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, localHour: new Date().getHours(), metaPath: pathnameRef.current }),
      });
      if (res.status === 401) return null;
      if (res.status === 429) return null;
      payload = await res.json();
    } catch {
      return null;
    }
    if (!payload.success || !payload.zeal) return payload;

    if (typeof payload.total === "number") setPoints(payload.total);
    if (payload.tier) setTier(payload.tier);

    if (payload.tierUp) {
      const t = payload.tier ? payload.tier.charAt(0).toUpperCase() + payload.tier.slice(1) : "";
      toast.success(`Tier up! Welcome to ${t}`, { duration: 6000 });
    }
    if (payload.quest) {
      toast.success(`Quest Complete: ${payload.quest.title} +${payload.quest.bonusZeal} Zeal`, { duration: 6000 });
    }
    if (payload.achievement) {
      toast.success(`Achievement Unlocked: ${payload.achievement.title}`, { duration: 6000 });
    }
    toast.success(`+${payload.zeal} Zeal! ${payload.reason ?? ""}`);
    return payload;
  }, [status]);

  // Route-based discovery actions, once per route per session
  useEffect(() => {
    if (status !== "authenticated" || !pathname) return;
    const match = ROUTE_ACTIONS.find(([re]) => re.test(pathname));
    if (!match) return;
    const key = `zeal:route:${pathname}`;
    if (sessionHas(key)) return;
    void earn(match[1]).then(payload => {
      if (payload?.success) sessionMark(key);
    });
  }, [pathname, status, earn]);

  // Daily login on sign-in (server evaluates night-owl from localHour)
  useEffect(() => {
    if (status === "authenticated") {
      void earn("daily-login");
      void refresh();
    }
    if (status === "unauthenticated") {
      setPoints(null);
      setTier(null);
    }
  }, [status, earn, refresh]);

  // Scroll tracking: full page reads and the trio bonus
  useEffect(() => {
    if (status !== "authenticated") return;
    const key = `zeal:scrolled:${pathname}`;
    const onScroll = () => {
      const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (!bottom || sessionHas(key)) return;
      void earn("scroll-full-page").then(payload => {
        if (!payload?.success) return;
        sessionMark(key);
        try {
          const raw = sessionStorage.getItem("zeal:scrolled-count");
          const count = (raw ? parseInt(raw, 10) : 0) + 1;
          sessionStorage.setItem("zeal:scrolled-count", String(count));
          if (count >= 3 && !sessionHas("zeal:trio")) {
            sessionMark("zeal:trio");
            void earn("scroll-trio");
          }
        } catch {}
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, status, earn]);

  // Konami code listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const expected = KONAMI[konamiIdx.current];
      const got = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (got === expected) {
        konamiIdx.current += 1;
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0;
          void earn("konami-code");
        }
      } else {
        konamiIdx.current = got === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [earn]);

  return (
    <ZealContext.Provider value={{ points, tier, earn, refresh }}>
      {children}
    </ZealContext.Provider>
  );
}
