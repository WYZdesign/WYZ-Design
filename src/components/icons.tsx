import type { SVGProps } from "react";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" {...base} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
export function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" {...base} {...props}>
      <path d="M12 3l2.6 5.6 6 .7-4.4 4.2 1.2 6L12 16.5l-5.4 3 1.2-6L3.4 9.3l6-.7z" />
    </svg>
  );
}
export function AgeRestrictedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded border border-current px-1 text-[0.65em] font-bold leading-4 ${className}`}
      aria-label="18 and over"
    >
      18+
    </span>
  );
}
