/**
 * Accessibility + mobile regression gate (board task 6).
 *
 * Locks the invariants that earlier audits fixed so they cannot silently regress:
 *  - every revenue route keeps its page + loading + error files
 *  - the shared loading/error states stay accessible (roles, live region, labels)
 *  - rendered components pass axe-core with no serious/critical violations
 *  - the shipped mobile fixes (cart stacking, cookie clear-zone, webkit flip
 *    parity) are still present in source
 *
 * Runs under the existing vitest + jsdom setup; no new dependencies.
 */
import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import axe from "axe-core";

import RouteLoading from "@/components/RouteLoading";
import RouteErrorState from "@/components/RouteErrorState";

vi.mock("@/lib/errorTracker", () => ({ trackError: vi.fn() }));

const ROOT = process.cwd();
const srcPath = (...p: string[]) => path.join(ROOT, "src", ...p);
const read = (...p: string[]) => fs.readFileSync(srcPath(...p), "utf8");

const REVENUE_ROUTES = ["booking", "services", "merch", "contact", "plans"];

describe("route contract: revenue routes keep page + loading + error", () => {
  for (const route of REVENUE_ROUTES) {
    it(`/${route} ships page.tsx, loading.tsx and error.tsx`, () => {
      for (const file of ["page.tsx", "loading.tsx", "error.tsx"]) {
        expect(fs.existsSync(srcPath("app", route, file)), `${route}/${file} missing`).toBe(true);
      }
    });

    it(`/${route}/error.tsx is a client boundary that accepts reset`, () => {
      const src = read("app", route, "error.tsx");
      expect(src).toMatch(/^"use client"/m);
      expect(src).toMatch(/reset/);
      expect(src).toMatch(/RouteErrorState/);
    });
  }

  it("keeps the app-level error and not-found boundaries", () => {
    expect(fs.existsSync(srcPath("app", "error.tsx"))).toBe(true);
    expect(fs.existsSync(srcPath("app", "global-error.tsx"))).toBe(true);
    expect(fs.existsSync(srcPath("app", "not-found.tsx"))).toBe(true);
  });
});

describe("shared state accessibility", () => {
  it("loading state is a polite live region with an accessible message", () => {
    render(<RouteLoading title="booking calendar" variant="calendar" />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText(/loading booking calendar/i)).toBeInTheDocument();
  });

  it("error state is an alert with a labelled retry and a home link", () => {
    render(<RouteErrorState title="Merch" error={new Error("boom")} reset={() => {}} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go home/i })).toHaveAttribute("href", "/home");
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});

async function axeViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      // jsdom has no layout/rendering, so colour-contrast cannot be evaluated here.
      "color-contrast": { enabled: false },
    },
  });
  return results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
}

describe("axe-core: rendered surfaces have no serious/critical violations", () => {
  it("RouteErrorState", async () => {
    const { container } = render(
      <RouteErrorState title="Plans" error={new Error("boom")} reset={() => {}} />
    );
    expect(await axeViolations(container)).toEqual([]);
  });

  it("RouteLoading (cards)", async () => {
    const { container } = render(<RouteLoading title="services" variant="cards" />);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("mobile regression locks (source-level)", () => {
  it("ScrollToTop stacks above the cart and watches the cookie dialog", () => {
    const src = read("components", "ScrollToTop.tsx");
    expect(src).toMatch(/useCart/);
    expect(src).toMatch(/bottom-24/);
    expect(src).toMatch(/data-chat-avoid/);
    expect(src).toMatch(/MutationObserver/);
  });

  it("CookieBanner tags itself data-chat-avoid", () => {
    expect(read("components", "CookieBanner.tsx")).toMatch(/data-chat-avoid/);
  });

  it("flip cards carry the -webkit backface prefix on every audited page", () => {
    const prefix = /Webkit(BackfaceVisibility|TransformStyle)|-webkit-(backface-visibility|transform-style)/;
    for (const route of ["home", "services", "printing", "photography", "plans", "web-design"]) {
      expect(read("app", route, "page.tsx"), `${route} missing -webkit prefix`).toMatch(prefix);
    }
  });

  it("merch empty catalog resolves to a real empty state, not an endless skeleton", () => {
    const src = read("app", "merch", "page.tsx");
    expect(src).toMatch(/setCatalogStatus\("loaded"\)/);
    expect(src).toMatch(/New pieces are coming soon/);
  });
});

describe("splash mobile policy", () => {
  const splash = () => read("components", "SplashVariants.tsx");

  it("excludes cursor-oriented variants from the mobile set", () => {
    const src = splash();
    for (const name of ["Spotlight", "Duotone", "GrainReveal", "CursorRibbon"]) {
      expect(src, `${name} must be mobile:false`).toMatch(new RegExp(`Comp:\\s*${name}\\b[^}]*mobile:\\s*false`));
    }
  });

  it("ships tilt-first mobile variants and marks them eligible", () => {
    const src = splash();
    for (const name of ["TiltLevel", "TiltSheen"]) {
      expect(src, `${name} must be mobile:true`).toMatch(new RegExp(`Comp:\\s*${name}\\b[^}]*mobile:\\s*true`));
    }
  });

  it("RandomSplash filters by touch input", () => {
    expect(splash()).toMatch(/pickVariant\(isTouchPrimary\(\)\)/);
    expect(splash()).toMatch(/gyroNeedsGesture\(\)/);
  });

  it("requests device-orientation on the first user gesture (iOS gate)", () => {
    const gyro = read("hooks", "useGyroPermission.ts");
    expect(gyro).toMatch(/pointerdown/);
    expect(gyro).toMatch(/touchstart/);
    expect(gyro).toMatch(/requestPerm\(\)/);
  });
});

describe("page section order", () => {
  it("contact renders the brand-audit lead magnet last (K15)", () => {
    const src = read("app", "contact", "page.tsx");
    const partners = src.indexOf("<PartnershipsPage");
    const lead = src.indexOf("<LeadMagnet");
    expect(partners, "PartnershipsPage missing").toBeGreaterThan(-1);
    expect(lead, "LeadMagnet missing").toBeGreaterThan(-1);
    expect(lead, "LeadMagnet must render after PartnershipsPage").toBeGreaterThan(partners);
  });
});

describe("splash entry", () => {
  it("enters only via the Enter Site button, never a full-screen tap", () => {
    const root = read("app", "page.tsx");
    expect(root, "full-screen tap must not enter").not.toMatch(/onClick=\{handleEnter\}/);
    expect(root).toMatch(/<RandomSplash onEnter=\{handleEnter\} \/>/);
    const brand = read("components", "splash", "SplashBrand.tsx");
    expect(brand, "Enter Site button must call onEnter").toMatch(/<button[^>]*onClick=\{onEnter\}/);
  });
});

describe("preview routes", () => {
  it("internal splash previews are noindexed", () => {
    for (const route of ["mobile-splash", "splash-showcase", "splash-gallery", "splash"]) {
      const src = read("app", route, "layout.tsx");
      expect(src, `${route} must be noindex`).toMatch(/robots:\s*\{\s*index:\s*false/);
    }
  });
});

describe("pricing canon", () => {
  it("plans match the approved catalog and are monthly only", () => {
    const plans = read("app", "plans", "page.tsx");
    for (const [name, price] of [["Starter Pack", "$250"], ["Business Boost", "$500"], ["Pro Plus", "$750"], ["Ultimate Suite", "$1,000"]] as const) {
      expect(plans, `${name} price`).toMatch(new RegExp(`name: "${name}", price: "${price.replace("$", "\\$")}"`));
    }
    expect(plans).toMatch(/auto-renew monthly/);
    expect(plans).not.toMatch(/quarterly/i);
  });

  it("services + booking carry the canon graphic-design and retouching prices", () => {
    const svc = read("app", "services", "page.tsx");
    expect(svc).toMatch(/name: "Graphic Design", price: "\$150"/);
    expect(svc).toMatch(/name: "Photo Retouching", price: "from \$15"/);
    expect(read("app", "booking", "page.tsx")).toMatch(/"Graphic Design": "\$150"/);
  });
});
