"use client";

import { useEffect } from "react";

const SCROLL_KEYS = new Set([
  " ",
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
]);

/**
 * Makes a full-viewport brand intro a real interaction boundary. A fixed
 * overlay alone does not stop a wheel, touch move, or smooth-scroll provider
 * from moving the page beneath it.
 */
export function useSplashScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const root = document.documentElement;
    const body = document.body;
    const previous = {
      rootOverflow: root.style.overflow,
      rootHeight: root.style.height,
      rootOverscrollBehavior: root.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyHeight: body.style.height,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      bodyTouchAction: body.style.touchAction,
    };

    const blockScroll = (event: Event) => event.preventDefault();
    const blockKeyScroll = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) event.preventDefault();
    };

    root.dataset.splashLocked = "true";
    window.dispatchEvent(new CustomEvent<boolean>("wyz:splash-lock", { detail: true }));
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    root.style.overflow = "hidden";
    root.style.height = "100%";
    root.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.height = "100%";
    body.style.overscrollBehavior = "none";
    body.style.touchAction = "none";

    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("keydown", blockKeyScroll);

    return () => {
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("keydown", blockKeyScroll);
      root.style.overflow = previous.rootOverflow;
      root.style.height = previous.rootHeight;
      root.style.overscrollBehavior = previous.rootOverscrollBehavior;
      delete root.dataset.splashLocked;
      body.style.overflow = previous.bodyOverflow;
      body.style.height = previous.bodyHeight;
      body.style.overscrollBehavior = previous.bodyOverscrollBehavior;
      body.style.touchAction = previous.bodyTouchAction;
      window.dispatchEvent(new CustomEvent<boolean>("wyz:splash-lock", { detail: false }));
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };
  }, [locked]);
}
