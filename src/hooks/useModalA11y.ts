"use client";

import { useEffect, useRef } from "react";

let lockCount = 0;
let savedOverflow = "";
const stack: symbol[] = [];

/**
 * Esc-to-close + focus trap + focus restore for overlay components.
 * Stores document.activeElement on activation, traps focus within the
 * modal container, and returns focus on cleanup.
 * Binds a keydown listener so only the innermost overlay closes on Escape.
 * Optional scroll lock via lockScroll, counter-based so nested overlays
 * don't release the lock early.
 */
export function useModalA11y(onClose: () => void, opts?: { lockScroll?: boolean; active?: boolean; containerRef?: React.RefObject<HTMLElement | null> }) {
  const lockScroll = opts?.lockScroll ?? false;
  const active = opts?.active ?? true;
  const containerRef = opts?.containerRef ?? null;
  const restoreRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) return;

    restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const id = Symbol("modal");
    stack.push(id);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stack[stack.length - 1] === id) onCloseRef.current();
      if (e.key === "Tab" && containerRef?.current) {
        const focusable = containerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);

    if (lockScroll) {
      if (lockCount === 0) {
        savedOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }
      lockCount += 1;
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const idx = stack.lastIndexOf(id);
      if (idx !== -1) stack.splice(idx, 1);
      if (lockScroll) {
        lockCount -= 1;
        if (lockCount === 0) document.body.style.overflow = savedOverflow;
      }
      const el = restoreRef.current;
      if (el && el.isConnected) el.focus();
    };
  }, [active, lockScroll, containerRef]);
}
