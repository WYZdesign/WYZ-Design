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
 *
 * 2026-10-08 (Claude): preventDefault() alone only suppresses the browser's
 * own native scroll action -- it does NOT stop any other listener on the
 * same event from running. Lenis (SmoothScrollProvider) registers its own
 * wheel/touchmove listeners in a child-after-parent effect that, due to
 * React's child-effects-run-before-parent-effects order on first mount,
 * attaches AFTER this hook's blockers. That meant Lenis kept processing
 * wheel/touch input and driving its own internal scroll position even
 * while this hook had "locked" native scrolling, which is what let a
 * scroll/swipe on the splash leak through to the home page underneath.
 * stopImmediatePropagation() closes that gap by stopping every other
 * listener (Lenis's included) on the same event from firing at all.
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

    const blockScroll = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const blockKeyScroll = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
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

    // capture: true so these run before any bubble-phase listener Lenis or
    // anything else registers on window, regardless of attach order.
    window.addEventListener("wheel", blockScroll, { passive: false, capture: true });
    window.addEventListener("touchmove", blockScroll, { passive: false, capture: true });
    window.addEventListener("touchstart", blockScroll, { passive: false, capture: true });
    window.addEventListener("keydown", blockKeyScroll, { capture: true });

    return () => {
      window.removeEventListener("wheel", blockScroll, { capture: true } as EventListenerOptions);
      window.removeEventListener("touchmove", blockScroll, { capture: true } as EventListenerOptions);
      window.removeEventListener("touchstart", blockScroll, { capture: true } as EventListenerOptions);
      window.removeEventListener("keydown", blockKeyScroll, { capture: true } as EventListenerOptions);
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
