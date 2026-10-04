"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function A11yAudit() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    import("axe-core").then((axe) => {
      const target = document.getElementById("main-content");
      if (!target) return;

      axe.default.run(target, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }).then((results) => {
        if (results.violations.length === 0) {
          logger.info("a11y", "No accessibility violations found");
          return;
        }
        results.violations.forEach((v) => {
          logger.warn("a11y", {
            issue: `${v.id}: ${v.help} (${v.impact ?? "unknown"})`,
            nodes: v.nodes.map((n) => n.html),
          });
        });
      });
    });
  }, []);

  return null;
}
