"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiTwitter, FiFacebook, FiInstagram, FiLinkedin, FiYoutube, FiArrowRight, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import { FaTiktok } from "react-icons/fa6";
import { trackMetaEvent } from "@/components/AnalyticsProvider";
import { useZeal } from "@/components/ZealProvider";

const SITEMAP = {
  Services: [
    { href: "/photography", label: "Photography" },
    { href: "/designs", label: "Graphic Design" },
    { href: "/web-design", label: "Web Design" },
    { href: "/printing", label: "Custom Printing" },
    { href: "/events", label: "Event Planning" },
    { href: "/services", label: "All Services" },
  ],
  Company: [
    { href: "/home", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/brands", label: "Our Brands" },
    { href: "/plans", label: "Pricing" },
    { href: "/merch", label: "Merch Store" },
    { href: "/gift-card", label: "Gift Cards" },
    { href: "/loyalty", label: "Zeal Rewards" },
    { href: "/referral", label: "Referral Program" },
    { href: "/featured-artist", label: "Featured Artist" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/community", label: "Community" },
  ],
  Legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-and-conditions", label: "Terms & Conditions" },
    { href: "/refund-return-policy", label: "Refund Policy" },
    { href: "/shipping-policy", label: "Shipping Policy" },
    { href: "/copyright-notice", label: "Copyright Notice" },
  ],
};

const SOCIALS = [
  { icon: FiInstagram, href: "https://www.instagram.com/wyzdesign/", label: "Instagram" },
  { icon: FiTwitter, href: "https://x.com/WYZdesign", label: "X" },
  { icon: FaTiktok, href: "https://www.tiktok.com/@wyzdesign", label: "TikTok" },
  { icon: FiYoutube, href: "https://www.youtube.com/channel/UCfd75GcUKsGqWo-sgSQjZBg", label: "YouTube" },
  { icon: FiFacebook, href: "https://www.facebook.com/wyzdesign", label: "Facebook" },
  { icon: FiLinkedin, href: "https://www.linkedin.com/in/torre%C3%A9-harris-11180b89/", label: "LinkedIn" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const { earn } = useZeal();
  const h = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribing(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setSubscribed(true); setEmail(""); toast.success("Subscribed! Check your inbox."); trackMetaEvent("Subscribe"); void earn("subscribe-newsletter"); }
      else { toast.error(data.error || "Subscription failed. Please try again."); }
    } catch { toast.error("Network error. Please try again."); }
    finally { setSubscribing(false); }
  };

  const footerBg = "relative bg-[#111] dark:bg-[#111]";
  const videoBg = (
    <>
      <div className="absolute inset-0 wyz-red-gradient dark:wyz-red-gradient-light" />
      <video src="/videos/wyz-nav-bg-new.mp4" poster="/images/hero-footer.jpg" className="hidden lg:block absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "center top" }} autoPlay muted loop playsInline preload="metadata" />
      <div className="absolute inset-0 bg-black/15 dark:bg-black/15" />
    </>
  );
  const textPrimary = "text-white dark:text-white";
  const textSecondary = "text-white/70 dark:text-white/70";
  const textMuted = "text-white/50 dark:text-white/50";
  const textLink = "text-white/60 dark:text-white/60 hover:text-white dark:hover:text-white";
  const headingColor = "text-white dark:text-white";
  const borderColor = "border-white/10 dark:border-white/10";
  const socialBorder = "border-white/15 dark:border-white/15";
  const socialText = "text-white/60 dark:text-white/60";
  const copyrightColor = "text-white/40 dark:text-white/40";
  const precisionColor = "text-white/30 dark:text-white/30";
  const inputBg = "bg-white text-[14px] text-[#333] placeholder:text-[#999] border-[#333]";

  return (
    <footer className="relative overflow-hidden bg-[#111] dark:bg-[#111]">
      {/* Newsletter banner */}
      <div className="bg-[#111] dark:bg-[#111]">
        <div className="max-w-[115rem] mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-white dark:text-white font-heading font-bold text-xl sm:text-2xl tracking-[0.08em] whitespace-nowrap">STAY IN THE LOOP</h3>
            <p className="text-white/80 dark:text-white/80 text-[14px] mt-1">Get exclusive updates, promotions, and behind-the-scenes content.</p>
          </div>
          <form onSubmit={h} className="flex flex-col sm:flex-row w-full max-w-full mx-auto md:mx-0 md:w-auto md:max-w-md gap-2">
            <input
              placeholder="Enter your email"
              aria-label="Email address for newsletter"
              value={email}
              onChange={e => setEmail(e.target.value)}
              data-kp-light
              className="flex-1 w-full px-4 py-3 bg-white text-[14px] text-[#333] placeholder:text-[#999] focus:outline-none focus:border-white border-2 border-white text-center md:text-left"
            />
            <button type="submit" disabled={subscribing} data-kp-light className="px-6 py-3 bg-[#DF3131] text-white text-[13px] font-bold tracking-[0.1em] hover:bg-white hover:text-[#111] transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 border-2 border-[#DF3131] disabled:opacity-50 disabled:cursor-not-allowed">
              {subscribed ? "THANKS!" : subscribing ? "SUBSCRIBING..." : "SUBSCRIBE"} <FiArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className={footerBg}>
        {videoBg}
        <div className="relative max-w-[115rem] mx-auto px-6 lg:px-12 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded flex items-center justify-center shrink-0">
                  <Image src="/wyz-crown-square.png" alt="WYZ Crown" width={24} height={24} className="object-contain" loading="lazy" />
                </div>
                <span className={`${textPrimary} font-heading font-bold text-xl`}>WYZ <span className="text-[#DF3131]">Design</span></span>
              </Link>
              <p className={`${textMuted} text-[14px] leading-relaxed mb-5 max-w-sm`}>Creative growth studio for artists, brands, and culture. Built in Chicago. Scaling in Los Angeles. Wild vision. Zealous execution.</p>
              <div className="flex items-center gap-3">
                {SOCIALS.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className={`w-9 h-9 flex items-center justify-center border ${socialBorder} ${socialText} hover:border-white hover:text-white hover:bg-white/10 transition-all rounded-full`}>
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
              <div className={`mt-5 space-y-1.5 text-[14px] ${textMuted}`}>
                <p className="flex items-center gap-2"><FiPhone className="w-3.5 h-3.5" /> (213) 399-9610</p>
                <p className="flex items-center gap-2"><FiMail className="w-3.5 h-3.5" /> info@wyzdesign.com</p>
                <p className="flex items-center gap-2"><FiMapPin className="w-3.5 h-3.5" /> Chicago, IL + Los Angeles, CA</p>
              </div>
            </div>

            {/* Sitemap columns */}
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {Object.entries(SITEMAP).map(([title, links]) => (
              <div key={title} className="text-center">
                <h4 className={`font-heading font-bold ${headingColor} text-[13px] tracking-[0.15em] uppercase mb-4`}>{title}</h4>
                <div className="space-y-2">
                  {links.map(l => (
                    <Link key={l.label} href={l.href} className={`block text-[14px] ${textLink} hover:translate-x-1 transition-all duration-200`}>{l.label}</Link>
                  ))}
                </div>
              </div>
            ))}
            </div>
          </div>

          <div className={`mt-12 pt-6 ${borderColor} flex flex-col sm:flex-row items-center justify-between gap-3`}>
            <p className={`text-[13px] ${copyrightColor}`}>&copy; {new Date().getFullYear()} WYZ Design LLC. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <p className={`text-[13px] ${precisionColor}`}>Designed & built with precision.</p>
               <Image src="/images/wix-extracted/common/logo/common_logo_00_98442d_d7e48f1e01ab4d7b87f7e4f779f4dfd9.png.png" alt="Wix Editor X Partner" width={80} height={80} className="opacity-60 hover:opacity-100 transition-opacity w-8 h-8 object-contain" />
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <Image src="/wyz-crown-square.png" alt="WYZ Design" width={16} height={16} className="w-4 h-4 object-contain opacity-50" loading="lazy" />
          </div>
        </div>
      </div>
    </footer>
  );
}