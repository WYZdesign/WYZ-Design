import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, screen, act } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import GlobalError from "./global-error";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [k: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/errorTracker", () => ({ trackError: vi.fn() }));

describe("GlobalError boundary", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the document wrapper (html + body) required by Next's global-error", () => {
    // React 19 hoists <html>/<body> out of RTL containers, so assert the
    // component's actual server output instead of DOM placement.
    const markup = renderToStaticMarkup(
      <GlobalError error={new Error("boom")} reset={() => {}} />
    );
    expect(markup).toContain('<html lang="en"');
    expect(markup).toMatch(/<body[^>]*class="[^"]*bg-white/);
    expect(markup).toContain("SOMETHING WENT WRONG");
  });

  it("wires refresh + home recovery controls (auto-reset once, manual retry after)", () => {
    vi.useFakeTimers();
    const reset = vi.fn();
    render(<GlobalError error={new Error("boom")} reset={reset} />);

    act(() => {
      vi.advanceTimersByTime(1300);
    });
    expect(reset).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Refresh"));
    expect(reset).toHaveBeenCalledTimes(2);

    const home = screen.getByRole("link", { name: /go home/i });
    expect(home).toHaveAttribute("href", "/home");
  });

  it("fits a 320px viewport: single-column stack with side inset, capped width", () => {
    render(<GlobalError error={new Error("boom")} reset={() => {}} />);
    const main = document.querySelector("main");
    expect(main).toHaveClass("px-6");
    expect(main).toHaveClass("flex", "items-center", "justify-center");
    // controls stack vertically below sm, return to a row above it
    const controls = main?.querySelector("div.flex-col");
    expect(controls).not.toBeNull();
    expect(controls).toHaveClass("sm:flex-row");
    expect(main?.querySelector(".max-w-md")).not.toBeNull();
  });
});
