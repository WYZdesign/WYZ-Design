import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Page from "./page";

vi.mock("@/components/SplashVariants", () => ({
  RandomSplash: ({ onEnter }: { onEnter: () => void }) => (
    <button type="button" onClick={onEnter}>Enter Site</button>
  ),
}));

vi.mock("@/hooks/useSplashScrollLock", () => ({
  useSplashScrollLock: vi.fn(),
}));

vi.mock("./home/page", () => ({
  default: () => <main>Home content</main>,
}));

describe("root splash entry", () => {
  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("enters only through the visible Enter Site control", () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    render(<Page />);

    const enter = screen.getByRole("button", { name: "Enter Site" });
    const splash = enter.parentElement;
    expect(splash).not.toBeNull();

    fireEvent.click(splash!);
    expect(screen.getByRole("button", { name: "Enter Site" })).toBeInTheDocument();

    fireEvent.click(enter);
    expect(screen.queryByRole("button", { name: "Enter Site" })).not.toBeInTheDocument();
    expect(sessionStorage.getItem("wyz-splash-seen")).toBe("1");
  });
});
