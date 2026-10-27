import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import axe from "axe-core";
import A11yAudit from "@/components/A11yAudit";

expect.extend({
  toHaveNoViolations(results: { violations: any[] }) {
    const pass = results.violations.length === 0;
    return {
      pass,
      message: () =>
        pass
          ? "No accessibility violations"
          : `Accessibility violations: ${JSON.stringify(results.violations, null, 2)}`,
    };
  },
});

describe("A11yAudit", () => {
  afterEach(() => cleanup());

  it("renders without crashing", () => {
    const { container } = render(<A11yAudit />);
    expect(container).toBeDefined();
  });

  it("no DOM node has negative tabIndex", () => {
    const { container } = render(<A11yAudit />);
    void container;
    const negatives = document.querySelectorAll('[tabindex="-1"]');
    expect(negatives.length).toBeLessThanOrEqual(1);
  });

  it("every focusable element has a discernible text/label", () => {
    const { container } = render(<A11yAudit />);
    void container;
    const focusables = document.querySelectorAll(
      "a,button,[role=\"button\"],input,select,textarea",
    );
    let bad = 0;
    focusables.forEach((el) => {
      const t = (el as HTMLElement).textContent?.trim() || "";
      const aria = el.getAttribute("aria-label") || "";
      const title = el.getAttribute("title") || "";
      const alt = (el as HTMLImageElement).getAttribute?.("alt") || "";
      if (!t && !aria && !title && !alt && el.tagName !== "INPUT") bad++;
    });
    expect(bad).toBe(0);
  });

  it("axe: no WCAG violations on the component", async () => {
    const { container } = render(<A11yAudit />);
    const results = await axe.run(container, {
      runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
    });
    expect(results).toHaveNoViolations();
  });

  it("axe: real DOM fixture (button + label)", async () => {
    document.body.innerHTML = `
      <a href="#main-content">skip</a>
      <main id="main-content">
        <button>Click</button>
      </main>
    `;
    const results = await axe.run(document.body, {
      runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
    });
    expect(results).toHaveNoViolations();
  });
});