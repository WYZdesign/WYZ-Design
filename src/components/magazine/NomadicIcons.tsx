// Custom vector marks for the Nomadic Breed magazine, hand-drawn per section
// (not generic icon-library glyphs, and never emojis). Stroke-based and
// currentColor so they inherit the surrounding text color / hover state.

type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function InterviewIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 3c-5 0-9 2.6-9 6.1 0 1.9 1 3.6 2.6 4.7L5 17.2l3.2-1.6c1.2.3 2.4.5 3.8.5 5 0 9-2.6 9-6.1S17 3 12 3z" />
      <path d="M8.2 8.4h.01M12 8.4h.01M15.8 8.4h.01" strokeWidth={2.2} />
    </svg>
  );
}

export function PhotoEssayIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <circle cx="12" cy="13.5" r="4" />
      <path d="M8.5 7l1.4-2.4h4.2L15.5 7" />
    </svg>
  );
}

export function ProcessIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M7 3h8l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M15 3v4h4" />
      <path d="M8.5 12h7M8.5 15.5h7M8.5 8.5h2.5" />
    </svg>
  );
}

export function StatusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M15.4 8.6l-1.9 5.1-5.1 1.9 1.9-5.1z" />
    </svg>
  );
}

export function TransitIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M21.5 2.5L10.5 13.5" />
      <path d="M21.5 2.5l-7.3 19-3.7-8.5-8.5-3.7z" />
    </svg>
  );
}

export function PackIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M8 4.5a4 4 0 0 1 8 0" />
      <path d="M7 4.5h10a2 2 0 0 1 2 2V20H5V6.5a2 2 0 0 1 2-2z" />
      <path d="M9.5 9h5M9.5 12.5h5" />
    </svg>
  );
}

export function ExitWoundsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M20 4c-6.2 0-12.5 4.3-13.4 14" />
      <path d="M20 4c0 6.5-2.8 10.7-7.4 12.6" />
      <path d="M3.5 20.5c2.3-3.9 5.2-6.6 8.5-8.2" />
      <path d="M20 4l-7.5 7.5" />
    </svg>
  );
}

export function FoldIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 5.5h16M4 12h16M4 18.5h9" />
      <path d="M18.5 17v4M16.5 19h4" strokeWidth={1.8} />
    </svg>
  );
}

export function LookbookIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 7a2 2 0 1 1 2-2" />
      <path d="M4.5 20L12 7.5 19.5 20H4.5z" />
      <path d="M4.5 20c0-1.7 3.3-2.6 7.5-2.6s7.5.9 7.5 2.6" />
    </svg>
  );
}
