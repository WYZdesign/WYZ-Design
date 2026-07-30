"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronRight } from "react-icons/fi";

const LABELS: Record<string, string> = {
  "home": "Home",
  "services": "Services",
  "designs": "Designs",
  "events": "Events",
  "photography": "Photography",
  "merch": "Merch",
  "contact": "Contact",
  "booking": "Booking",
  "plans": "Plans",
  "community": "Community",
  "wyzmind": "WYZMiND",
  "featured-artist": "Featured Artist",
  "web-design": "Web Design",
  "printing": "Printing",
  "faq": "FAQ",
  "blog": "Blog",
  "model-archive": "Model Archive",
  "3pointprogram": "3-Point Program",
  "case-studies": "Case Studies",
  "search": "Search",
  "gift-card": "Gift Card",
  "gallery": "Gallery",
  "privacy-policy": "Privacy",
  "terms-and-conditions": "Terms",
  "refund-return-policy": "Refunds",
  "shipping-policy": "Shipping",
  "copyright-notice": "Copyright",
};

export default function Breadcrumb({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`py-3 px-6 max-w-[130rem] mx-auto ${className}`}>
      <ol className="flex items-center gap-1.5 text-[12px] text-[#8F8F8F] font-body flex-wrap">
        <li>
          <Link href="/" className="hover:text-[#DF3131] transition-colors">Home</Link>
        </li>
        {segments.map((seg, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/");
          const isLast = i === segments.length - 1;
          const label = LABELS[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          return (
            <li key={href} className="flex items-center gap-1.5">
              <FiChevronRight className="w-3 h-3 text-[#ccc]" />
              {isLast ? (
                <span className="text-[#333] font-semibold">{label}</span>
              ) : (
                <Link href={href} className="hover:text-[#DF3131] transition-colors">{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
