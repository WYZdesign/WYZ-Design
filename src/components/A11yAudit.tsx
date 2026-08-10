"use client";

import { useEffect } from "react";

interface A11yViolation {
  id: string;
  help: string;
  impact: string;
  nodes: { html: string }[];
}

export default function A11yAudit() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    import("axe-core").then((axe) => {
      const target = document.getElementById("main-content");
      if (!target) return;

      axe.default.run(target, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }).then((results) => {
        if (results.violations.length === 0) {
          console.log("[A11y] No accessibility violations found");
          return;
        }
        console.group("[A11y] Accessibility violations:");
        results.violations.forEach((v: A11yViolation) => {
          console.warn(`${v.id}: ${v.help} (${v.impact})`, v.nodes.map((n) => n.html));
        });
        console.groupEnd();
      });
    });
  }, []);

  return null;
}
