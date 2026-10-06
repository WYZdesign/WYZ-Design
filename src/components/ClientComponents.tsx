"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false });
const CookieBanner = dynamic(() => import("@/components/CookieBanner"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const NoiseOverlay = dynamic(() => import("@/components/NoiseOverlay"), { ssr: false });
const A11yAudit = dynamic(() => import("@/components/A11yAudit"), { ssr: false });

export default function ClientComponents() {
  return (
    <>
      <CustomCursor />
      <A11yAudit />
      <ChatWidget />
      <NoiseOverlay />
      <CookieBanner />
    </>
  );
}
