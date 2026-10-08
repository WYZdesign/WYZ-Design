import { ReactNode } from "react";

/**
 * Shared hero wrapper. Sets the standard full-height brand banner geometry
 * (sits under the fixed nav, vertically centered, overflow hidden) so pages
 * stop hand-rolling `-mt-20 pt-20 min-h-screen … hero-banner`. Adopt per page
 * as heroes are refactored (see WYZDESIGN_CONSOLIDATION_AUDIT.md).
 */
export default function Hero({
  children,
  className = "",
  minH = "min-h-[80vh] sm:min-h-[90vh] lg:min-h-screen",
}: {
  children: ReactNode;
  className?: string;
  minH?: string;
}) {
  return (
    <section className={`relative -mt-20 lg:-mt-24 pt-20 lg:pt-24 ${minH} flex items-center justify-center overflow-hidden hero-banner ${className}`.trim()}>
      {children}
    </section>
  );
}
