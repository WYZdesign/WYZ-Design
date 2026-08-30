"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiCamera, FiMonitor, FiVideo, FiMessageCircle, FiGlobe, FiSearch, FiZap, FiAward, FiTrendingUp } from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";
import { MouseGlow } from "@/components/MouseGlow";
import CardTilt from "@/components/CardTilt";
import Testimonials from "@/components/Testimonials";
import LeadMagnet from "@/components/LeadMagnet";
import GyroTilt from "@/components/GyroTilt";
import TextMaskReveal from "@/components/TextMaskReveal";
import MagneticElement from "@/components/MagneticElement";
import EnhancedMarquee from "@/components/EnhancedMarquee";
import ScrollParallaxCard from "@/components/ScrollParallaxCard";
import ParticleBackground from "@/components/ParticleBackground";
import TextSplit from "@/components/TextSplit";
import ImageReveal from "@/components/ImageReveal";
import { shuffleArray } from "@/lib/utils";

const LOGO_INTROS_RAW = [
 "/videos/logo-intro-00.mp4",
 "/videos/logo-intro-02.mp4",
 "/videos/logo-intro-03.mp4",
 "/videos/logo-intro-04.mp4",
 "/videos/logo-intro-05.mp4",
 "/videos/logo-intro-06.mp4",
 "/videos/logo-intro-07.mp4",
 "/videos/logo-intro-08.mp4",
 "/videos/logo-intro-09.mp4",
 "/videos/logo-intro-10.mp4",
 "/videos/logo-intro-11.mp4",
 "/videos/logo-intro-12.mp4",
 "/videos/logo-intro-13.mp4",
 "/videos/logo-intro-14.mp4",
 "/videos/logo-intro-15.mp4",
 "/videos/logo-intro-16.mp4",
 "/videos/logo-intro-17.mp4",
 "/videos/logo-intro-18.mp4",
 "/videos/logo-intro-19.mp4",
 "/videos/logo-intro-20.mp4",
 "/videos/logo-intro-21.mp4",
];

const HERO_IMAGES_RAW = [
 "/images/home/carousel_top/wix_0094.jpg",
 "/images/home/carousel_top/wix_0033.jpg",
 "/images/home/carousel_top/wix_0035.jpg",
 "/images/home/carousel_top/wix_0038.jpg",
 "/images/home/carousel_top/wix_0041.jpg",
 "/images/home/carousel_top/wix_0043.jpg",
 "/images/home/carousel_top/wix_0045.jpg",
 "/images/home/carousel_top/wix_0046.jpg",
 "/images/home/carousel_top/wix_0047.jpg",
 "/images/home/carousel_top/wix_0051.jpg",
 "/images/home/carousel_top/wix_0053.jpg",
 "/images/home/carousel_top/wix_0056.jpg",
 "/images/home/carousel_top/wix_0064.jpg",
 "/images/home/carousel_top/wix_0066.jpg",
 "/images/home/carousel_top/wix_0073.jpg",
 "/images/home/carousel_top/wix_0075.jpg",
 "/images/home/carousel_top/wix_0080.jpg",
 "/images/home/carousel_top/wix_0085.jpg",
 "/images/home/carousel_top/wix_0086.jpg",
 "/images/home/carousel_top/wix_0090.jpg",
 "/images/home/carousel_top/wix_0375.jpg",
 "/images/home/carousel_top/wix_0377.jpg",
 "/images/home/carousel_top/wix_0378.jpg",
 "/images/home/carousel_top/wix_0380.jpg",
 "/images/home/carousel_top/wix_0382.jpg",
 "/images/home/carousel_top/wix_0385.jpg",
 "/images/home/carousel_top/wix_0389.jpg",
 "/images/home/carousel_top/wix_0395.jpg",
 "/images/home/carousel_top/wix_0398.jpg",
 "/images/home/carousel_top/wix_0401.jpg",
];

const CLIENT_LOGOS_RAW = [
  { name: "YCA", img: "/images/client-logos/yca.jpg" },
  { name: "Ent-Icing Edibles", img: "/images/client-logos/ent-icing-edibles.jpg" },
  { name: "Nuvonic", img: "/images/client-logos/nuvonic.jpg" },
  { name: "LSG Production", img: "/images/client-logos/lsg-production.jpg" },
  { name: "YALL", img: "/images/client-logos/yall.png" },
  { name: "New Summit", img: "/images/client-logos/new-summit.jpg" },
  { name: "Premo", img: "/images/client-logos/premo.jpg" },
  { name: "KTM", img: "/images/client-logos/ktm.jpg" },
  { name: "XXXtra Society", img: "/images/client-logos/xxxtra-society.jpg" },
  { name: "Greater Emmanuel", img: "/images/client-logos/greater-emmanuel.jpg" },
  { name: "Enticing Cafe", img: "/images/client-logos/33_Enticing_Cafe_Final_Logo_2.jpg" },
  { name: "AM", img: "/images/client-logos/am.jpg" },
  { name: "Diamond Kiss", img: "/images/client-logos/diamond-kiss.jpg" },
  { name: "AP", img: "/images/client-logos/37_AP_Logo.jpg" },
  { name: "Justy", img: "/images/client-logos/38_JUSTY_Logo__crown_.jpg" },
  { name: "Vanity J", img: "/images/client-logos/vanity-j.jpg" },
  { name: "LaBelleza", img: "/images/client-logos/40_LaBelleza.jpg" },
  { name: "K&G", img: "/images/client-logos/k-and-g.jpg" },
  { name: "PornEstrella", img: "/images/client-logos/pornestrella.jpg" },
  { name: "Baderbrau", img: "/images/client-logos/Baderbrau-Logo-570x558.jpg" },
  { name: "Fun Timez", img: "/images/client-logos/Fun Timez Logo.jpg" },
  { name: "Redeaux", img: "/images/client-logos/Redeaux Logo.png" },
  { name: "Sheba", img: "/images/client-logos/Sheba logo draft 3.png" },
  { name: "Win E", img: "/images/client-logos/Win E Logo (no background).png" },
];

const SERVICES = [
 { icon: <FiCamera />, name: "Artist Launch Kit", desc: "Creative direction, photoshoot, cover art, social graphics, landing page. For musicians, models, performers ready to level up.", href: "/plans", tab: "FOR ARTISTS" },
 { icon: <FiMonitor />, name: "Brand Identity System", desc: "Logo refresh, visual identity, web design, photo content, social kit. For businesses tired of looking forgettable.", href: "/plans", tab: "FOR BRANDS" },
 { icon: <FiVideo />, name: "Studio Growth System", desc: "Event programming, promotional assets, recap content, booking strategy. For studios and production spaces.", href: "/plans", tab: "FOR STUDIOS" },
 { icon: <FiMessageCircle />, name: "Event Production", desc: "Flyers, social rollout, Eventbrite setup, photo/video recap, artist coordination. From concept to curtains.", href: "/events", tab: "EVENTS" },
 { icon: <FiGlobe />, name: "WYZMiND Systems", desc: "AI intake bots, client portals, booking tools, and automated workflows. Systems that keep up as you grow.", href: "/services", tab: "SYSTEMS" },
];

const SERVICE_LIST = [
  { cat: "Photography", name: "Photoshoot", desc: "Capture authentic moments with sleek, professional photography.", dur: "1 hr", price: "$100", href: "/booking-calendar/photoshoot", img: "/images/services/Photography.webp" },
  { cat: "Photography", name: "Event Photography", desc: "Capturing every moment, from public showcases to private events.", dur: "3 hr", price: "$200", href: "/service-page/event-photography", img: "/images/services/Event Photography.jpg" },
  { cat: "Branding Design", name: "Logo Design", desc: "Custom logos designed to represent who you are.", dur: "3 hr", price: "$100", href: "/booking", img: "/images/services/Logo Design.jpg" },
  { cat: "Web Design", name: "Website Design", desc: "Professional website design to help your business thrive online.", dur: "3 hr", price: "$500", href: "/booking", img: "/images/services/Website Design.jpg" },
  { cat: "Photography", name: "Photo Retouching", desc: "Basic to Advanced Professional Photo Retouching.", dur: "2 hr", price: "$50", href: "/service-page/photo-retouching", img: "/images/services/Photo Retouching.jpg" },
  { cat: "Videography", name: "Video Shoot", desc: "Make an unforgettable impression with professional video production.", dur: "3 hr", price: "$200", href: "/booking", img: "/images/services/Video Shoot.jpg" },
];

function HomeServiceFlipCard({ s }: { s: typeof SERVICE_LIST[0] }) {
  const [flipped, setFlipped] = useState(false);
  const canHover = useRef(false);
  useEffect(() => { canHover.current = window.matchMedia("(hover: hover)").matches; }, []);
  return (
    <div
      className="group relative cursor-pointer w-full"
      style={{ perspective: "1200px" }}
      role="button"
      tabIndex={0}
      aria-expanded={flipped}
      aria-label={`${s.name} details`}
      onMouseEnter={() => { if (canHover.current) setFlipped(true); }}
      onMouseLeave={() => { if (canHover.current) setFlipped(false); }}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped((f) => !f); } }}
    >
      <div className="relative w-full" style={{ minHeight: "min(380px, 50vh)" }}>
        {/* Front */}
        <div
          className="absolute inset-0 transition-all duration-700 ease-in-out"
          style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)" }}
        >
          <div className="relative w-full h-full overflow-hidden border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#DF3131]/10">
             <Image src={s.img} alt={s.name} fill sizes="(max-width:640px) 50vw, (max-width:768px) 33vw, 25vw" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <h3 className="font-heading font-black text-white text-[20px] sm:text-[22px] md:text-[24px] tracking-[0.06em] text-center drop-shadow-lg px-4 uppercase">{s.name}</h3>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 transition-all duration-700 ease-in-out"
          style={{ backfaceVisibility: "hidden", transform: flipped ? "rotateY(0deg)" : "rotateY(180deg)" }}
        >
          <div className="w-full h-full bg-[#DF3131] text-white p-5 sm:p-6 pb-8 sm:pb-10 flex flex-col items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
               <Image src={s.img} alt={s.name} fill sizes="100vw" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 text-center flex flex-col items-center justify-center">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 mb-2 block">{s.cat}</span>
              <h3 className="font-heading font-black text-white text-[22px] sm:text-[24px] tracking-[0.03em] mb-3 uppercase">{s.name}</h3>
              <p className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed mb-4 max-w-xs">{s.desc}</p>
              <div className="flex flex-col items-center justify-center gap-0 mb-5">
                <span className="text-[48px] sm:text-[56px] font-black leading-none">{s.price}</span>
                <span className="text-white/60 text-[15px] mt-1">{s.dur}</span>
              </div>
              <div className="flex gap-2 w-full max-w-xs">
                <Link href={s.href} className="flex-1 text-center py-2.5 bg-white text-[#111] text-[13px] font-bold tracking-[0.08em] hover:bg-[#333] hover:text-white transition-all" onClick={(e) => e.stopPropagation()}>
                  BOOK NOW
                </Link>
                <Link href="/plans" className="flex-1 text-center py-2.5 border-2 border-white text-white text-[13px] font-bold tracking-[0.08em] hover:bg-white hover:text-[#DF3131] transition-all" onClick={(e) => e.stopPropagation()}>
                  VIEW PLANS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRICING_PLANS = [
 { name: "Starter Pack", price: "$250", badge: "", desc: "For artists, models, and young brands building their foundation. Design tasks, strategy calls, web updates included.", valid: "Every 3 months. Cancel anytime." },
  { name: "Business Boost", price: "$500", badge: "Most Popular", desc: "For brands, studios, and businesses ready to grow. Content, design, event support, and campaign planning.", valid: "Every 3 months. Cancel anytime." },
  { name: "Pro Plus", price: "$750", badge: "", desc: "For established businesses needing consistent creative direction. Full visual identity, web, photo, video, and strategy.", valid: "Every 3 months. Cancel anytime." },
  { name: "Ultimate Suite", price: "$1,000", desc: "For serious brands and studios. Unlimited design, content production, event programming, AI systems, and support.", valid: "Every 3 months. Cancel anytime." },
];

const QUICK_LINKS = [
 { label: "PARTNERSHIPS", href: "/partnerships" }, { label: "SUBSCRIPTIONS", href: "/plans" },
 { label: "GIFT CARD", href: "/gift-card" }, { label: "MODEL ARCHIVE", href: "/model-archive" },
 { label: "DESIGNS", href: "/designs" }, { label: "PHOTOGRAPHY", href: "/photography" },
 { label: "DIY EVENTS", href: "/events" }, { label: "GET FEATURED", href: "/featured-artist" },
 { label: "BE A MODEL", href: "/model-archive" }, { label: "MERCH STORE", href: "/merch" },
 { label: "MEMBERS", href: "/loyalty" }, { label: "CONSULTATION", href: "/service-page/creative-consultation" },
];

const DESIGN_SHOWCASE_RAW = [
 "/images/home/carousel_bottom/wix_0149.jpg",
 "/images/home/carousel_bottom/wix_0151.jpg",
 "/images/home/carousel_bottom/wix_0153.jpg",
 "/images/home/carousel_bottom/wix_0157.jpg",
 "/images/home/carousel_bottom/wix_0096.jpg",
 "/images/home/carousel_bottom/wix_0098.jpg",
 "/images/home/carousel_bottom/wix_0100.jpg",
 "/images/home/carousel_bottom/wix_0103.jpg",
 "/images/home/carousel_bottom/wix_0109.jpg",
 "/images/home/carousel_bottom/wix_0113.jpg",
 "/images/home/carousel_bottom/wix_0115.jpg",
 "/images/home/carousel_bottom/wix_0119.jpg",
 "/images/home/carousel_bottom/wix_0120.jpg",
 "/images/home/carousel_bottom/wix_0125.jpg",
 "/images/home/carousel_bottom/wix_0130.jpg",
 "/images/home/carousel_bottom/wix_0134.jpg",
 "/images/home/carousel_bottom/wix_0136.jpg",
 "/images/home/carousel_bottom/wix_0138.jpg",
 "/images/home/carousel_bottom/wix_0143.jpg",
 "/images/home/carousel_bottom/wix_0145.jpg",
 "/images/home/carousel_bottom/wix_0403.jpg",
 "/images/home/carousel_bottom/wix_0407.jpg",
 "/images/home/carousel_bottom/wix_0411.jpg",
 "/images/home/carousel_bottom/wix_0413.jpg",
 "/images/home/carousel_bottom/wix_0415.jpg",
 "/images/home/carousel_bottom/wix_0416.jpg",
 "/images/home/carousel_bottom/wix_0418.jpg",
 "/images/home/carousel_bottom/wix_0419.jpg",
 "/images/home/carousel_bottom/wix_0424.jpg",
];

const MODELS_RAW_RECORDS = [
  "/images/models/ADRIENNE.jpg",
  "/images/models/AECH_DOT.jpg",
  "/images/models/AJA.jpg",
  "/images/models/ALEXANDRIA.JPG",
  "/images/models/ANGEL.JPG",
  "/images/models/ANGELICA.JPG",
  "/images/models/ANTHONIA.JPG",
  "/images/models/ARCANA.JPG",
  "/images/models/ASH.jpg",
  "/images/models/ASHONDI.jpg",
  "/images/models/AUDREY.jpg",
  "/images/models/BRIAN.JPG",
  "/images/models/BRIYANNA.JPG",
  "/images/models/BROCK.JPG",
  "/images/models/BROOK.jpg",
  "/images/models/BROOKE.JPG",
  "/images/models/BRYSON.jpg",
  "/images/models/CAMILLE.JPG",
  "/images/models/CHER.jpg",
  "/images/models/CHHAVI.JPG",
  "/images/models/CITLALI.JPG",
  "/images/models/CLAIRE.jpg",
  "/images/models/CLAUDIA.jpg",
  "/images/models/CORI.JPG",
  "/images/models/CRISTINA.JPG",
  "/images/models/CRYSTAL.JPG",
  "/images/models/DANIELLE.JPG",
  "/images/models/DARRYL.jpg",
  "/images/models/DEKETRA.jpg",
  "/images/models/DOT.jpg",
  "/images/models/DRAKE.JPG",
  "/images/models/EBONIE.JPG",
  "/images/models/EBONY.JPG",
  "/images/models/EDEN.JPG",
  "/images/models/FARREN.jpg",
  "/images/models/FARREN_BODYPAINT.jpg",
  "/images/models/FLUFFY.jpg",
  "/images/models/GREYSON.jpg",
  "/images/models/HANNAH.jpg",
  "/images/models/HEADY.jpg",
  "/images/models/IVY.jpg",
  "/images/models/J.RED.JPG",
  "/images/models/JAKALA.jpg",
  "/images/models/JANELLE.JPG",
  "/images/models/JATOHN.jpg",
  "/images/models/JEREMY.jpg",
  "/images/models/JERMAINE.jpg",
  "/images/models/JIMMY.JPG",
  "/images/models/JORDAN.JPG",
  "/images/models/KATARA.jpg",
  "/images/models/KATHRYN.jpg",
  "/images/models/KAYLEN.jpg",
  "/images/models/KIDLYN.JPG",
  "/images/models/LAUREN.JPG",
  "/images/models/LAUSHERN.JPG",
  "/images/models/LORIE.jpg",
  "/images/models/MAKAYLA.jpg",
  "/images/models/MALIKA.jpg",
  "/images/models/MARISSA.JPG",
  "/images/models/MARSHAWNA.JPG",
  "/images/models/MAYA.jpg",
  "/images/models/MITRI.jpg",
  "/images/models/MONICA.JPG",
  "/images/models/NAKIA.jpg",
  "/images/models/NICO___DRACO.JPG",
  "/images/models/NIISHA___PATRICK.jpg",
  "/images/models/NIK.jpg",
  "/images/models/NIYAH.JPG",
  "/images/models/ODU.jpg",
  "/images/models/PEYTON.JPG",
  "/images/models/PRADIA.JPG",
  "/images/models/QUANISHA.JPG",
  "/images/models/RANISHA.jpg",
  "/images/models/REBECCA.JPG",
  "/images/models/ROBERT.JPG",
  "/images/models/ROY.jpg",
  "/images/models/SIMONE.jpg",
  "/images/models/STAR.jpg",
  "/images/models/SYDNEY.JPG",
  "/images/models/SYETA.JPG",
  "/images/models/TE'JUAN.JPG",
  "/images/models/TED___SYLVIA.jpg",
  "/images/models/TEREZA.jpg",
  "/images/models/TONI.jpg",
  "/images/models/TORREE.jpg",
  "/images/models/TOSH.jpg",
  "/images/models/TYLIN.jpg",
  "/images/models/VAHN.JPG",
  "/images/models/VERONICA.JPG",
  "/images/models/WESLEY.jpg",
  "/images/models/WOLF.jpg",
  "/images/models/XOCHI.JPG",
  "/images/models/ADRIENNE/Adrienne%2010.jpg",
  "/images/models/ADRIENNE/Adrienne%2014.jpg",
  "/images/models/ADRIENNE/Adrienne%205.jpg",
  "/images/models/AECH%20DOT/Copy%20of%20Studio%20Shoot-5.jpg",
  "/images/models/AECH%20DOT/Copy%20of%20Studio%20Shoot-56.jpg",
  "/images/models/AECH%20DOT/Copy%20of%20Studio%20Shoot-9.jpg",
  "/images/models/AJA/Aja-7.jpg",
  "/images/models/AJA/Aja-8.jpg",
  "/images/models/AJA/Aja.jpg",
  "/images/models/ALEXANDRIA/Retouched-12.JPG",
  "/images/models/ALEXANDRIA/Retouched-2.JPG",
  "/images/models/ALEXANDRIA/Retouched-4.JPG",
  "/images/models/ANGEL/Angel-180.JPG",
  "/images/models/ANGEL/Retouched-6.JPG",
  "/images/models/ANGEL/Retouched-7.JPG",
  "/images/models/ANGELICA/ANGELICA-142.JPG",
  "/images/models/ANGELICA/ANGELICA-149.JPG",
  "/images/models/ANGELICA/ANGELICA-153.JPG",
  "/images/models/ANTHONIA/Retouched-10.JPG",
  "/images/models/ANTHONIA/Retouched-2.JPG",
  "/images/models/ANTHONIA/Retouched-7.JPG",
  "/images/models/ARCANA/Bodypaint-262.JPG",
  "/images/models/ARCANA/Bodypaint-263.JPG",
  "/images/models/ARCANA/Bodypaint-266.JPG",
  "/images/models/ASH/Ash%20(61%20of%2069).jpg",
  "/images/models/ASH/Ash%20(63%20of%2069).jpg",
  "/images/models/ASH/Ash%20(64%20of%2069).jpg",
  "/images/models/ASHONDI/Ashondi-12.jpg",
  "/images/models/ASHONDI/Ashondi-47.jpg",
  "/images/models/ASHONDI/Ashondi-67.jpg",
  "/images/models/AUDREY/Audrey-28.jpg",
  "/images/models/AUDREY/Audrey-38.jpg",
  "/images/models/AUDREY/Audrey-68.jpg",
  "/images/models/BRIAN/Shoot-216.JPG",
  "/images/models/BRIAN/Shoot-217.JPG",
  "/images/models/BRIAN/Shoot-218.JPG",
  "/images/models/BRIYANNA/Bri'Yanna-194.JPG",
  "/images/models/BRIYANNA/Retouched-10.JPG",
  "/images/models/BRIYANNA/Retouched-4.JPG",
  "/images/models/BROCK/IMG_1638.JPG",
  "/images/models/BROCK/IMG_1725.JPG",
  "/images/models/BROCK/IMG_1727.JPG",
  "/images/models/BROOK/Brooke-10.jpg",
  "/images/models/BROOK/Brooke-144.jpg",
  "/images/models/BROOK/Brooke-9.jpg",
  "/images/models/BROOKE/Chinatown-77.JPG",
  "/images/models/BROOKE/Chinatown-86.JPG",
  "/images/models/BROOKE/Chinatown-89.JPG",
  "/images/models/BRYSON/Bryson-14.jpg",
  "/images/models/BRYSON/Bryson-15.jpg",
  "/images/models/BRYSON/Bryson.jpg",
  "/images/models/CAMILLE/Camille-327.JPG",
  "/images/models/CAMILLE/Camille-335.JPG",
  "/images/models/CAMILLE/Retouched-12.JPG",
  "/images/models/CHER/CHER-216.jpg",
  "/images/models/CHER/CHER-254.jpg",
  "/images/models/CHER/CHER-255.jpg",
  "/images/models/CHHAVI/Chhavi-80.JPG",
  "/images/models/CHHAVI/Retouched-7.JPG",
  "/images/models/CHHAVI/Retouched-9.JPG",
  "/images/models/CITLALI/Bodypaint-126.JPG",
  "/images/models/CITLALI/Bodypaint-73.JPG",
  "/images/models/CITLALI/Bodypaint-89.JPG",
  "/images/models/CLAIRE/Claire-93.jpg",
  "/images/models/CLAIRE/Claire-94.jpg",
  "/images/models/CLAIRE/Claire-95.jpg",
  "/images/models/CLAUDIA/Claudia-20.jpg",
  "/images/models/CLAUDIA/Claudia-26.jpg",
  "/images/models/CLAUDIA/Claudia-28.jpg",
  "/images/models/CORI/Cori-146.JPG",
  "/images/models/CORI/Cori-147.JPG",
  "/images/models/CORI/Cori-159.JPG",
  "/images/models/CRISTINA/20171120125946_IMG_2977.JPG",
  "/images/models/CRISTINA/20171120125948_IMG_2978.JPG",
  "/images/models/CRISTINA/20171120131432_IMG_3130.JPG",
  "/images/models/CRYSTAL/Crystal-12.JPG",
  "/images/models/CRYSTAL/Crystal-6.JPG",
  "/images/models/CRYSTAL/Crystal-8.JPG",
  "/images/models/DANIELLE/Danielle-51.JPG",
  "/images/models/DANIELLE/Danielle-63.JPG",
  "/images/models/DANIELLE/Retouched-2.JPG",
  "/images/models/DARRYL/Darryl-19.jpg",
  "/images/models/DARRYL/Darryl-57.jpg",
  "/images/models/DARRYL/Darryl-58.jpg",
  "/images/models/DEKETRA/Dee-110.jpg",
  "/images/models/DEKETRA/Dee-113.jpg",
  "/images/models/DEKETRA/Dee-114.jpg",
  "/images/models/DOT/Copy%20of%20Studio%20Shoot-5.jpg",
  "/images/models/DOT/Copy%20of%20Studio%20Shoot-56.jpg",
  "/images/models/DOT/Studio%20Shoot-5.jpg",
  "/images/models/DRAKE/South%20Loop-193.JPG",
  "/images/models/DRAKE/South%20Loop-194.JPG",
  "/images/models/DRAKE/South%20Loop-231.JPG",
  "/images/models/EBONIE/Ebonie-374.JPG",
  "/images/models/EBONIE/Ebonie-386.JPG",
  "/images/models/EBONIE/Ebonie-392.JPG",
  "/images/models/EBONY/Apartment-258.JPG",
  "/images/models/EBONY/Ebony-54.JPG",
  "/images/models/EBONY/Ebony-57.JPG",
  "/images/models/EDEN/Retouched-14.JPG",
  "/images/models/EDEN/Retouched-15.JPG",
  "/images/models/EDEN/South%20Loop-144.JPG",
  "/images/models/FARREN/Bodypaint-133.jpg",
  "/images/models/FARREN/Bodypaint-135.jpg",
  "/images/models/FARREN/Bodypaint-37.jpg",
  "/images/models/FARREN_BODYPAINT/Bodypaint-133.jpg",
  "/images/models/FARREN_BODYPAINT/Bodypaint-135.jpg",
  "/images/models/FARREN_BODYPAINT/Bodypaint-37.jpg",
  "/images/models/FLUFFY/Group%20Shoot-6.jpg",
  "/images/models/FLUFFY/Group%20Shoot-7.jpg",
  "/images/models/FLUFFY/Group%20Shoot.jpg",
  "/images/models/GREYSON/GREY-157.jpg",
  "/images/models/GREYSON/GREY-67.jpg",
  "/images/models/GREYSON/GREY-79.jpg",
  "/images/models/HANNAH/HANNAH%20(retouched)-3.jpg",
  "/images/models/HANNAH/HANNAH%20(retouched)-5.jpg",
  "/images/models/HANNAH/HANNAH%20(retouched)-9.jpg",
  "/images/models/HEADY/Heady%20Lovell-106.jpg",
  "/images/models/HEADY/Heady%20Lovell-108.jpg",
  "/images/models/HEADY/Heady%20Lovell-43.jpg",
  "/images/models/IVY/Ivy-11.jpg",
  "/images/models/IVY/Ivy-23.jpg",
  "/images/models/IVY/Ivy-8.jpg",
  "/images/models/J.RED/J.Red-228.JPG",
  "/images/models/J.RED/J.Red-229.JPG",
  "/images/models/J.RED/Retouched-8.JPG",
  "/images/models/JANELLE/IMG_1345.JPG",
  "/images/models/JANELLE/IMG_1832.JPG",
  "/images/models/JANELLE/IMG_1833.JPG",
  "/images/models/JATOHN/NIKKI-17.jpg",
  "/images/models/JATOHN/NIKKI-20.jpg",
  "/images/models/JATOHN/NIKKI-3.jpg",
  "/images/models/JEREMY/JEREMY-10.jpg",
  "/images/models/JEREMY/JEREMY-17.jpg",
  "/images/models/JEREMY/JEREMY-23.jpg",
  "/images/models/JERMAINE/Jermaine-5.jpg",
  "/images/models/JERMAINE/Jermaine-6.jpg",
  "/images/models/JERMAINE/Jermaine.jpg",
  "/images/models/JIMMY/Retouched-101.JPG",
  "/images/models/JIMMY/Retouched-224.JPG",
  "/images/models/JIMMY/Retouched-227.JPG",
  "/images/models/JORDAN/Bodypaint-119.JPG",
  "/images/models/JORDAN/Bodypaint-42.JPG",
  "/images/models/JORDAN/Bodypaint-89.JPG",
  "/images/models/KATARA/Katara-12.jpg",
  "/images/models/KATARA/Katara-13.jpg",
  "/images/models/KATARA/Katara-2.jpg",
  "/images/models/KATHRYN/KAT-100.jpg",
  "/images/models/KATHRYN/KAT-121.jpg",
  "/images/models/KATHRYN/KAT-79.jpg",
  "/images/models/KAYLEN/kaylen-127.jpg",
  "/images/models/KAYLEN/kaylen-139.jpg",
  "/images/models/KAYLEN/kaylen-142.jpg",
  "/images/models/KIDLYN/Retouched-2.JPG",
  "/images/models/KIDLYN/Retouched-3.JPG",
  "/images/models/KIDLYN/Retouched-4.JPG",
  "/images/models/LAUREN/Lauren-42.JPG",
  "/images/models/LAUREN/Lauren-43.JPG",
  "/images/models/LAUREN/Lauren-44.JPG",
  "/images/models/LAUSHERN/Laushern-96.JPG",
  "/images/models/LAUSHERN/Laushern-97.JPG",
  "/images/models/LAUSHERN/Laushern-99.JPG",
  "/images/models/LORIE/IMG_1687.jpg",
  "/images/models/LORIE/IMG_1689.jpg",
  "/images/models/LORIE/IMG_1691.jpg",
  "/images/models/MALIKA/luv-190.jpg",
  "/images/models/MALIKA/luv-198.jpg",
  "/images/models/MALIKA/luv-200.jpg",
  "/images/models/MARISSA/Blah-262.JPG",
  "/images/models/MARISSA/Blah-268.JPG",
  "/images/models/MARISSA/Blah-4.JPG",
  "/images/models/MARSHAWNA/Marshawna-241.JPG",
  "/images/models/MARSHAWNA/Marshawna-242.JPG",
  "/images/models/MARSHAWNA/Marshawna-253.JPG",
  "/images/models/MAYA/Maya-44.jpg",
  "/images/models/MAYA/Maya-47.jpg",
  "/images/models/MAYA/Maya-48.jpg",
  "/images/models/MITRI/Mitri-42.jpg",
  "/images/models/MITRI/Mitri-43.jpg",
  "/images/models/MITRI/Mitri-53.jpg",
  "/images/models/MONICA/Monica-11.JPG",
  "/images/models/MONICA/Monica-5.JPG",
  "/images/models/MONICA/Monica-6.JPG",
  "/images/models/NAKIA/Nakia-149.jpg",
  "/images/models/NAKIA/Nakia-151.jpg",
  "/images/models/NAKIA/Nakia-160.jpg",
  "/images/models/NICO%20+%20DRACO/Nico%20+%20Draco-44.JPG",
  "/images/models/NICO%20+%20DRACO/Nico%20+%20Draco-96.JPG",
  "/images/models/NICO%20+%20DRACO/Nico%20+%20Draco-97.JPG",
  "/images/models/NIK/Nik-73.jpg",
  "/images/models/NIK/Nik-74.jpg",
  "/images/models/NIK/Nik-81.jpg",
  "/images/models/NIYAH/Niya-37.JPG",
  "/images/models/NIYAH/Niya-38.JPG",
  "/images/models/NIYAH/Niya.JPG",
  "/images/models/ODU/MVIMG_20180307_103317.jpg",
  "/images/models/ODU/MVIMG_20180307_103918.jpg",
  "/images/models/ODU/Odu-14.jpg",
  "/images/models/PEYTON/Peyton-435.JPG",
  "/images/models/PEYTON/Peyton-436.JPG",
  "/images/models/PEYTON/Peyton-437.JPG",
  "/images/models/PRADIA/Pradia-39.JPG",
  "/images/models/PRADIA/Pradia-40.JPG",
  "/images/models/PRADIA/Pradia-41.JPG",
  "/images/models/QUANISHA/Quanisha-151.JPG",
  "/images/models/QUANISHA/Quanisha-171.JPG",
  "/images/models/QUANISHA/Quanisha-175.JPG",
  "/images/models/RANISHA/NISHA-13.jpg",
  "/images/models/RANISHA/NISHA-14.jpg",
  "/images/models/RANISHA/NISHA-21.jpg",
  "/images/models/REBECCA/Retouched-12.JPG",
  "/images/models/REBECCA/Retouched-5.JPG",
  "/images/models/REBECCA/Retouched.JPG",
  "/images/models/ROBERT/Robert-445.JPG",
  "/images/models/ROBERT/Robert-447.JPG",
  "/images/models/ROBERT/Robert-448.JPG",
  "/images/models/ROY/Roy-51.jpg",
  "/images/models/ROY/Roy-52.jpg",
  "/images/models/ROY/Roy-53.jpg",
  "/images/models/SIMONE/Simone-35.jpg",
  "/images/models/SIMONE/Simone-38.jpg",
  "/images/models/SIMONE/Simone-88.jpg",
  "/images/models/STAR/Star-217.jpg",
  "/images/models/STAR/Star-235.jpg",
  "/images/models/STAR/Star-236.jpg",
  "/images/models/SYDNEY/20200521-IMG_6465.JPG",
  "/images/models/SYDNEY/20200521-IMG_6466.JPG",
  "/images/models/SYDNEY/20200521-IMG_6467.JPG",
  "/images/models/SYETA/Syeta-158.JPG",
  "/images/models/SYETA/Syeta-159.JPG",
  "/images/models/SYETA/Syeta-164.JPG",
  "/images/models/TE'JUAN/Retouched-11.JPG",
  "/images/models/TE'JUAN/Retouched.JPG",
  "/images/models/TE'JUAN/Te'Juan-96.JPG",
  "/images/models/TED%20+%20SYLVIA/Edited-12.jpg",
  "/images/models/TED%20+%20SYLVIA/Shoot-30.jpg",
  "/images/models/TED%20+%20SYLVIA/Shoot-41.jpg",
  "/images/models/TEREZA/Tereza-24.jpg",
  "/images/models/TEREZA/Tereza-25.jpg",
  "/images/models/TEREZA/Tereza-7.jpg",
  "/images/models/TONI/Toni-134.jpg",
  "/images/models/TONI/Toni-141.jpg",
  "/images/models/TONI/Toni-142.jpg",
  "/images/models/TORREE/VILLAINS-2.jpg",
  "/images/models/TORREE/VILLAINS-4.jpg",
  "/images/models/TORREE/VILLAINS.jpg",
  "/images/models/TOSH/Natosha-2.jpg",
  "/images/models/TOSH/Natosha-27.jpg",
  "/images/models/TOSH/Natosha-8.jpg",
  "/images/models/TYLIN/Tylin-21.jpg",
  "/images/models/TYLIN/Tylin-3.jpg",
  "/images/models/TYLIN/Tylin-4.jpg",
  "/images/models/VAHN/Retouched-23.JPG",
  "/images/models/VAHN/VAHN-241.JPG",
  "/images/models/VAHN/VAHN-243.JPG",
  "/images/models/VERONICA/Retouched-14.JPG",
  "/images/models/VERONICA/Retouched-15.JPG",
  "/images/models/VERONICA/Retouched-9.JPG",
  "/images/models/WESLEY/Wesley-26.jpg",
  "/images/models/WESLEY/Wesley-33.jpg",
  "/images/models/WESLEY/Wesley-34.jpg",
  "/images/models/WOLF/Wolf-5.jpg",
  "/images/models/WOLF/Wolf-98.jpg",
  "/images/models/WOLF/Wolf.jpg",
  "/images/models/XOCHI/Retouched-10.JPG",
  "/images/models/XOCHI/Xochi-195.JPG",
  "/images/models/XOCHI/Xochi-196.JPG",
];

const FAQ_ITEMS = [
 { q: "What services does WYZ Design offer?", a: "WYZ Design offers photography, graphic design, videography, web design, digital printing, and marketing/branding consultations." },
 { q: "How much does a photoshoot session cost?", a: "Our photoshoot sessions start at $100 per hour, including free basic retouching and a 24-hour turnaround." },
 { q: "Can WYZ Design help with website design?", a: "Yes, we offer professional website design services starting at a flat rate of $500 for a website of up to 5 pages." },
 { q: "Does WYZ Design provide printing services?", a: "Absolutely! We offer digital printing for various materials such as stickers, flyers, prints, and posters on different paper types." },
 { q: "Do you offer marketing and branding consultations?", a: "Yes, we offer marketing and branding strategy consultations at $50 per hour, providing expert advice and clear next steps." },
 { q: "What is the turnaround time for projects?", a: "Most projects are completed within 3-7 business days depending on scope. Rush delivery is available for an additional fee." },
 { q: "Do you work with clients outside the local area?", a: "Yes! While based locally, we serve clients nationwide and handle remote projects without missing a beat." },
 { q: "What is included in a photoshoot session?", a: "Each photoshoot includes professional lighting, a creative concept discussion, outfit guidance, and a minimum of 20 edited high-resolution images delivered within 24 hours." },
 { q: "Do you offer event photography for weddings?", a: "Yes! We offer full-day event photography packages for weddings, parties, and private functions. Custom packages are available upon request." },
 { q: "What graphic design services do you provide?", a: "We design logos, brand identities, flyers, posters, album covers, social media content, banners, business cards, and any custom print materials." },
 { q: "How many revisions are included with design work?", a: "Logo design includes 5 revisions. Graphic design packages include 3 revisions. Additional revisions are available at $50 per set of 3." },
 { q: "Can you create a full brand identity for my business?", a: "Absolutely. Our brand identity packages include logo design, color palette, typography selection, brand guidelines, and social media templates." },
 { q: "What video production services do you offer?", a: "We produce music videos, promotional videos, event coverage, drone footage, and social media reels, from concept to final edit." },
 { q: "How much does a music video cost?", a: "Music video production starts at $200 for a basic shoot and edit. Premium packages with special effects, multiple locations, and advanced editing are available at custom rates." },
 { q: "Do you offer SEO services?", a: "Yes! We provide SEO audits starting at $50, covering keyword analysis, on-page optimization recommendations, and a competitor breakdown report." },
 { q: "What does a website design package include?", a: "Our $500 website package includes up to 5 custom pages, mobile-responsive design, contact form integration, basic SEO setup, and one round of revisions." },
 { q: "Can I add extra pages to my website later?", a: "Yes. Additional pages are available for $75 each. We also offer ongoing maintenance and update packages." },
 { q: "Do you offer retouching for personal photos?", a: "Yes! Photo retouching starts at $50 and covers skin smoothing, color correction, background removal, and blemish cleanup." },
 { q: "What is a Creative Consultation?", a: "A free 30-minute strategy session where we discuss your vision, goals, and recommend the best services and packages for your project." },
 { q: "Can I book a consultation for logo design specifically?", a: "Yes! Our dedicated Logo Consultation is a 2-hour deep-dive session for $50, covering competitor research, mood boards, and initial concept direction." },
 { q: "Do you offer package deals or bundles?", a: "Yes! Our subscription plans (Starter Pack, Business Boost, Pro Plus, Ultimate Suite) bundle multiple services at a significant discount." },
 { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, Venmo, Zelle, and cash. A 50% deposit is required to book most services." },
 { q: "Can I reschedule or cancel a booking?", a: "Yes. Reschedules are free if made 48 hours in advance. Cancellations within 48 hours of the appointment forfeit the deposit." },
 { q: "Do you work with influencers or content creators?", a: "Absolutely. We offer creator-specific packages including headshot sessions, brand content shoots, and social media asset creation at discounted rates." },
 { q: "How do I get started?", a: "Book a free Creative Consultation through our booking page. We'll discuss your needs, recommend services, and put together a custom plan." },
 { q: "Do you offer same-day or rush delivery?", a: "Yes! Rush delivery is available for most services at a 25-50% premium. Contact us to discuss your timeline." },
 { q: "What is the difference between graphic design and branding?", a: "Graphic design covers individual assets (flyers, logos). Branding covers the whole picture: your visual identity, voice, and market positioning." },
 { q: "Can you design merchandise for my brand?", a: "Yes! We design custom merch including t-shirts, hats, stickers, and apparel. We also handle printing through our in-house digital printing service." },
 { q: "Do you provide mockups for design projects?", a: "Yes. All logo and branding projects include realistic mockup presentations so you can see your design in real-world applications before finalizing." },
 { q: "What file formats do I receive for my designs?", a: "You receive PNG, JPG, PDF, and SVG for logos. Print-ready files include CMYK versions and bleed marks. Source files are available upon request." },
  { q: "Is there a rewards program?", a: "Yes! Zeal Rewards earns you Zeal points on every purchase that can be redeemed for discounts, free upgrades, and exclusive perks." },
 { q: "How can I become a WYZ Design model?", a: "Visit our Model Archive page and click 'Become a Model.' Fill out the form with your portfolio details and we'll reach out for an audition session." },
 { q: "What DIY events does WYZ Design host?", a: "We host music showcases, art shows, open mic nights, and creative meetups. Check our Events page or subscribe to our newsletter for upcoming dates." },
];

function SmoothCarousel({ items, className = "", speed = 0.5, direction = "left" }: { items: string[]; className?: string; speed?: number; direction?: "left" | "right" }) {
 const trackRef = useRef<HTMLDivElement>(null);
 const offsetRef = useRef(0);
 const paused = useRef(false);
 const sectionRef = useRef<HTMLDivElement>(null);
 const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 const touchStartX = useRef<number | null>(null);
 const dirRef = useRef(direction === "right" ? -1 : 1);

 useEffect(() => { dirRef.current = direction === "right" ? -1 : 1; }, [direction]);

 useEffect(() => {
 const sec = sectionRef.current;
 if (!sec) return;
 const obs = new IntersectionObserver(([e]) => { paused.current = !e.isIntersecting; }, { threshold: 0 });
 obs.observe(sec);
 return () => obs.disconnect();
 }, []);

 useEffect(() => {
 const el = trackRef.current;
 if (!el) return;
 let raf: number;
 const tick = () => {
 if (!paused.current && el) {
 offsetRef.current -= speed * dirRef.current;
 const half = el.scrollWidth / 2;
 if (Math.abs(offsetRef.current) >= half) offsetRef.current += half;
 el.style.transform = `translateX(${offsetRef.current}px)`;
 }
 raf = requestAnimationFrame(tick);
 };
 raf = requestAnimationFrame(tick);
 return () => cancelAnimationFrame(raf);
 }, [speed]);

 const handleClick = () => {
 paused.current = true;
 if (clickTimer.current) clearTimeout(clickTimer.current);
 clickTimer.current = setTimeout(() => { paused.current = false; }, 3000);
 };

 const handleTouchStart = (e: React.TouchEvent) => {
 touchStartX.current = e.touches[0].clientX;
 paused.current = true;
 };

 const handleTouchEnd = (e: React.TouchEvent) => {
 if (touchStartX.current !== null) {
 const dx = e.changedTouches[0].clientX - touchStartX.current;
 offsetRef.current += dx * 2;
 if (trackRef.current) trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
 }
 touchStartX.current = null;
 if (clickTimer.current) clearTimeout(clickTimer.current);
 clickTimer.current = setTimeout(() => { paused.current = false; }, 3000);
 };

 const doubled = [...items, ...items];

 return (
   <div ref={sectionRef} className={`overflow-hidden ${className}`} onClick={handleClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
    <div ref={trackRef} className="flex flex-nowrap items-start gap-4 py-2 will-change-transform cursor-pointer">
      {doubled.map((src, i) => (
     <div key={i} className="flex-none w-[32vw] sm:w-[230px] md:w-[320px] h-32 sm:h-48 md:h-64 relative overflow-hidden rounded-sm">
       <Image src={src} alt="WYZ Design portfolio" fill sizes="(max-width:640px) 32vw, 320px" className="absolute inset-0 w-full h-full object-contain" loading="lazy" decoding="async" />
     </div>
     ))}
  </div>
  </div>
 );
}

function LogoCarousel({ items, speed = 0.5 }: { items: { name: string; img: string }[]; speed?: number }) {
 const trackRef = useRef<HTMLDivElement>(null);
 const offsetRef = useRef(0);
 const paused = useRef(false);
 const sectionRef = useRef<HTMLDivElement>(null);
 const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 const touchStartX = useRef<number | null>(null);

 useEffect(() => {
 const sec = sectionRef.current;
 if (!sec) return;
 const obs = new IntersectionObserver(([e]) => { paused.current = !e.isIntersecting; }, { threshold: 0 });
 obs.observe(sec);
 return () => obs.disconnect();
 }, []);

 useEffect(() => {
 const el = trackRef.current;
 if (!el) return;
 let raf: number;
 const tick = () => {
 if (!paused.current && el) {
 offsetRef.current += speed;
 const half = el.scrollWidth / 2;
 if (offsetRef.current >= half) offsetRef.current -= half;
 el.style.transform = `translateX(${-offsetRef.current}px)`;
 }
 raf = requestAnimationFrame(tick);
 };
 raf = requestAnimationFrame(tick);
 return () => cancelAnimationFrame(raf);
 }, [speed]);

 const handleClick = () => {
 paused.current = true;
 if (clickTimer.current) clearTimeout(clickTimer.current);
 clickTimer.current = setTimeout(() => { paused.current = false; }, 3000);
 };

 const handleTouchStart = (e: React.TouchEvent) => {
 touchStartX.current = e.touches[0].clientX;
 paused.current = true;
 };

 const handleTouchEnd = (e: React.TouchEvent) => {
 if (touchStartX.current !== null) {
 const dx = e.changedTouches[0].clientX - touchStartX.current;
 offsetRef.current -= dx * 2;
 if (trackRef.current) trackRef.current.style.transform = `translateX(${-offsetRef.current}px)`;
 }
 touchStartX.current = null;
 if (clickTimer.current) clearTimeout(clickTimer.current);
 clickTimer.current = setTimeout(() => { paused.current = false; }, 3000);
 };

 const tripled = [...items, ...items, ...items];

 return (
 <div ref={sectionRef} className="overflow-hidden" onClick={handleClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
  <div ref={trackRef} className="flex gap-4 sm:gap-6 lg:gap-8 items-center py-3 will-change-transform cursor-pointer">
  {tripled.map((logo, i) => (
  <div key={i} className="flex-none flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110">
    <Image src={logo.img} alt={logo.name} width={64} height={64} className="h-6 sm:h-8 max-w-[60px] sm:max-w-[90px] w-auto object-contain transition-all duration-300" />
 </div>
 ))}
 </div>
 </div>
 );
}

function VideoPlaylist({ videos }: { videos: string[] }) {
 const videoRef = useRef<HTMLVideoElement>(null);
 const idxRef = useRef(0);

 const advance = useCallback(() => {
 idxRef.current = (idxRef.current + 1) % videos.length;
 const el = videoRef.current;
 if (el) {
 el.src = videos[idxRef.current];
 el.load();
 el.play().catch(() => {});
 }
 }, [videos]);

 useEffect(() => {
 idxRef.current = 0;
 const el = videoRef.current;
 if (el && videos.length > 0) {
 el.src = videos[0];
 el.load();
 el.play().catch(() => {});
 }
 }, [videos]);

 return (
 <div className="h-full w-full bg-black relative overflow-hidden flex items-center justify-center">
  <video
  ref={videoRef}
  className="absolute w-full h-full object-cover"
  style={{ transform: "scale(1.10)" }}
  muted
  playsInline
  onEnded={advance}
  preload="metadata"
  />
 </div>
 );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("ALL");
 const [spTab, setSpTab] = useState<"services" | "plans">("services");
 const [openFaq, setOpenFaq] = useState<number | null>(null);
 const [faqSearch, setFaqSearch] = useState("");
 const [faqCount, setFaqCount] = useState(7);
 const [flippedPlans, setFlippedPlans] = useState<Record<number, boolean>>({});
 const heroRef = useRef<HTMLDivElement>(null);
 const [heroVis, setHeroVis] = useState(false);
  const [shuffledHero, setShuffledHero] = useState<string[]>([]);
  const [shuffledDesign, setShuffledDesign] = useState<string[]>([]);
  const [shuffledModels, setShuffledModels] = useState<string[]>([]);
  const [logoIntros, setLogoIntros] = useState(LOGO_INTROS_RAW);
  const [clientLogos, setClientLogos] = useState(CLIENT_LOGOS_RAW);

  useEffect(() => {
  setShuffledHero(shuffleArray(HERO_IMAGES_RAW));
  setShuffledDesign(shuffleArray(DESIGN_SHOWCASE_RAW));
  setShuffledModels(shuffleArray(MODELS_RAW_RECORDS));
  setLogoIntros(shuffleArray(LOGO_INTROS_RAW));
  setClientLogos(shuffleArray(CLIENT_LOGOS_RAW));
  }, []);

 useEffect(() => {
 const el = heroRef.current;
 if (!el) return;
 const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeroVis(true); obs.disconnect(); } }, { threshold: 0.1 });
 obs.observe(el);
 const t = setTimeout(() => setHeroVis(true), 1200);
 return () => { obs.disconnect(); clearTimeout(t); };
 }, []);

 const filteredFaq = FAQ_ITEMS.filter(f =>
 f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase())
 );

  return (
 <main className="pt-0">
 <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.wyzdesign.com" },
      ],
    }),
  }}
 />
 <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    }),
  }}
 />
 <style>{`
 @keyframes heroSlideIn { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: none; } }
 @keyframes heroSlideInR { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: none; } }
 @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
 .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
 .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
 `}</style>

    <section ref={heroRef} className="relative -mt-20 lg:-mt-24 pt-20 lg:pt-24 min-h-[80vh] sm:min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden hero-banner">
    {/* Single wrapper — keeps this the only direct child of .hero-banner so mobile padding-stripping CSS doesn't hit the text container */}
    <div className="absolute inset-0 flex items-center justify-center">
    {/* Background: video fills entire hero */}
    <div className="absolute inset-0 z-0 bg-black">
    <VideoPlaylist videos={logoIntros} />
    </div>
     {/* 80% + 30% black overlay (or overall opacity increase) between video and text */}
       <div className="absolute inset-0 bg-black/65 z-[1]" />
     <ParticleBackground count={25} color="#DF3131" maxSize={2} speed={0.2} className="z-[2]" />
     {/* Text content on top */}
    <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center px-4 sm:px-10 lg:px-16 py-8 sm:py-12 overflow-hidden"
    style={{ opacity: heroVis ? 1 : 0, transform: heroVis ? "none" : "translateY(24px)", transition: "all 0.8s ease-out" }}>
     <GyroTilt intensity={8} enableOnDesktop>
     <p className="text-white/70 text-[10px] sm:text-[13px] font-heading font-bold tracking-[0.1em] uppercase text-center mb-6 sm:mb-8 max-w-full">
        <TextSplit stagger={0.04} direction="up">Wild Vision. Zealous Execution.</TextSplit>
      </p>
        <TextMaskReveal direction="up">
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-white tracking-[0.08em] text-center mb-6 sm:mb-10 max-w-lg mx-auto" style={{ lineHeight: 0.9 }}>
           <span>WE <span className="text-[#DF3131]">MAKE</span></span><br />
           <span>WHAT <span className="text-[#DF3131]">WORKS</span></span>
        </h1>
        </TextMaskReveal>
         <p className="text-white/70 text-[14px] sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xs sm:max-w-sm mx-auto text-center">
       We help artists, brands, and real people build creative work that actually looks good.
       </p>
       </GyroTilt>
<div className="flex flex-row gap-3 justify-center overflow-hidden px-2">
      <MagneticElement tag="div" strength={0.25}>
      <Link href="/about"
       className="inline-block bg-white text-[#111] border-2 border-white px-5 py-3 font-heading font-bold tracking-[0.15em] uppercase text-[12px] sm:text-[15px] text-center hover:bg-white hover:text-[#111] hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:shadow-white/20 transition-all">
      SEE THE STORY
      </Link>
      </MagneticElement>
      <MagneticElement tag="div" strength={0.25}>
      <Link href="/contact"
       className="inline-block bg-[#DF3131] text-white border-2 border-[#DF3131] px-5 py-3 font-heading font-bold tracking-[0.15em] uppercase text-[12px] sm:text-[15px] text-center hover:bg-[#B82020] hover:border-[#B82020] transition-all">
      START A PROJECT
      </Link>
      </MagneticElement>
     </div>
   </div>
   </div>
   </section>

{/* ═══ IMAGE GALLERY STRIP ═══ */}
<ScrollReveal animation="fadeIn" duration={1}>
   <ImageReveal direction="up">
   <section className="py-2 w-full relative overflow-hidden mt-2 mb-0">
   <SmoothCarousel items={shuffledHero.length > 0 ? shuffledHero : HERO_IMAGES_RAW} speed={0.55} direction="right" />
   </section>
   </ImageReveal>
   </ScrollReveal>

{/* ═══ BRAND MARQUEE ═══ */}
  <EnhancedMarquee speed="semislow" pauseOnHover gradientFade className="py-4 bg-white dark:bg-[#1C1C1E]">
    {(["PHOTOGRAPHY","DESIGN","PRINT","WEB","VIDEO","EVENTS","BRANDING"] as const).map((word, i) => {
      const M = ["text-[#DF3131]", "text-[#111] dark:text-white", "marquee-outline", "text-[#6E6E6E] dark:text-[#8F8F8F]"];
      return (
        <span key={i} className="inline-flex items-center">
          <span className={`inline-flex items-center text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 ${M[i % 4]}`}>{word}</span>
          <span className="inline-flex items-center text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] font-heading font-black tracking-[0.08em] uppercase px-4 sm:px-6 opacity-50 text-[#111] dark:text-white">&bull;</span>
        </span>
      );
    })}
  </EnhancedMarquee>

{/* ═══ SERVICES + PRICING PLANS ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <section className="pt-8 sm:pt-12 lg:pt-16 pb-20 sm:pb-28 lg:pb-36 relative overflow-hidden wyz-gradient-flow">
 {/* Decorative background elements */}
 <div className="absolute top-0 right-0 w-96 h-96 bg-[#DF3131]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
 <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#DF3131]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

  <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
<div className="text-center mb-12 sm:mb-16 md:mb-20">
      <h2 className="text-[1.25rem] sm:text-[2.3rem] md:text-[2.875rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] mb-6">
      <TextSplit stagger={0.02} direction="up">WHAT</TextSplit> <span className="text-[#DF3131]"><TextSplit stagger={0.02} direction="up">WE DO</TextSplit></span>
     </h2>
     <p className="text-[#666] dark:text-white/70 text-[15px] sm:text-base max-w-xl mx-auto leading-relaxed mt-4">Every service we offer comes from one simple place: we make things that look good and actually work. WYZ Design started in Chicago&apos;s DIY art and music scene, making flyers for friends, shooting shows in basements, and learning every part of the creative process by doing it. Founder Torreé Marcel Harris built this from the ground up: over 60 events produced, over 30 clients supported. Now based in Los Angeles, we help artists, brands, studios, and anyone with a creative vision turn scattered ideas into work that looks and feels like them.</p>
   </div>
  </div>
   {/* Full-width carousel — full bleed stretching to both sides */}
   <div className="relative z-10 my-16 sm:my-24 w-full overflow-hidden">
      <SmoothCarousel items={shuffledModels.length > 0 ? shuffledModels : MODELS_RAW_RECORDS} speed={0.55} />
   </div>
  <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
  {/* Animated tab switcher */}
 <div className="flex justify-center gap-4 mb-10">
 <button onClick={() => setSpTab("services")}
 className={`px-8 py-3 font-heading font-bold tracking-[0.15em] uppercase text-sm border-2 transition-all duration-500 relative overflow-hidden group ${
 spTab === "services" ? "bg-[#333] text-white border-[#333] shadow-lg shadow-[#333]/20" : "bg-white dark:bg-[#1C1C1E] text-[#333] dark:text-white border-[#ccc] dark:border-[#444] hover:border-[#DF3131] hover:text-[#DF3131]"
 }`}>
 <span className="relative z-10">Services</span>
 {spTab !== "services" && <div className="absolute inset-0 bg-[#DF3131]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
 </button>
 <button onClick={() => setSpTab("plans")}
 className={`px-8 py-3 font-heading font-bold tracking-[0.15em] uppercase text-sm border-2 transition-all duration-500 relative overflow-hidden group ${
 spTab === "plans" ? "bg-[#333] text-white border-[#333] shadow-lg shadow-[#333]/20" : "bg-white dark:bg-[#1C1C1E] text-[#333] dark:text-white border-[#ccc] dark:border-[#444] hover:border-[#DF3131] hover:text-[#DF3131]"
 }`}>
 <span className="relative z-10">Pricing Plans</span>
 {spTab !== "plans" && <div className="absolute inset-0 bg-[#DF3131]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
 </button>
 </div>

 <div className="min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
  {/* ── SERVICES TAB ── */}
  {spTab === "services" && (
<div className="max-w-6xl mx-auto animate-fadeIn">
   <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.1em] uppercase text-center mb-8">Services</h2>
   <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-10 -mx-6 px-6">
   <button onClick={() => setActiveTab("ALL")}
    className={`min-h-[44px] px-6 py-2.5 text-xs font-heading font-bold tracking-[0.1em] uppercase border transition-all duration-300 relative overflow-hidden group whitespace-nowrap flex-shrink-0 ${
   activeTab === "ALL"
   ? "bg-[#DF3131] text-white border-[#DF3131] shadow-md shadow-[#DF3131]/20"
   : "bg-white dark:bg-[#1C1C1E] text-[#333] dark:text-white border-[#ccc] dark:border-[#444] hover:border-[#DF3131] hover:text-[#DF3131]"
   }`}>
   <span className="relative z-10">ALL</span>
   </button>
   {SERVICES.map((s) => (
    <button key={s.tab} onClick={() => setActiveTab(s.tab)}
    className={`min-h-[44px] px-6 py-2.5 text-xs font-heading font-bold tracking-[0.1em] uppercase border transition-all duration-300 relative overflow-hidden group whitespace-nowrap flex-shrink-0 ${
   activeTab === s.tab
   ? "bg-[#DF3131] text-white border-[#DF3131] shadow-md shadow-[#DF3131]/20"
   : "bg-white dark:bg-[#1C1C1E] text-[#333] dark:text-white border-[#ccc] dark:border-[#444] hover:border-[#DF3131] hover:text-[#DF3131]"
   }`}>
   <span className="relative z-10">{s.tab}</span>
   </button>
   ))}
   </div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
   {SERVICES.filter(s => activeTab === "ALL" || s.tab === activeTab).map((s) => (
     <div key={s.name} className="group relative p-8 border border-[#E2E2E2] dark:border-[#444] hover:border-[#DF3131] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#DF3131]/10 bg-white dark:bg-[#252528] text-center">
       <div className="w-14 h-14 mx-auto flex items-center justify-center bg-[#DF3131]/10 text-[#DF3131] text-2xl mb-6 group-hover:bg-[#DF3131] group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
         {s.icon}
       </div>
       <h3 className="font-heading font-bold text-[#333] dark:text-white text-[15px] tracking-[0.05em] uppercase mb-4">{s.name}</h3>
       <p className="text-[13px] text-[#666] dark:text-white/70 leading-relaxed mb-6">{s.desc}</p>
       <Link href={s.href} className="inline-flex items-center gap-1 text-[#DF3131] text-sm font-bold tracking-[0.08em] uppercase hover:underline">
         Read More <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
       </Link>
     </div>
   ))}
   </div>
   <h3 className="text-center font-heading font-black text-[#333] dark:text-white tracking-[0.1em] uppercase text-2xl sm:text-3xl md:text-4xl mb-8 mt-16">Popular Services</h3>
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
   {SERVICE_LIST.map((s) => (
     <HomeServiceFlipCard key={s.name} s={s} />
   ))}
   </div>
    <div className="text-center mt-16 relative z-10">
    <Link href="/services" className="inline-block px-8 py-3 bg-[#333] text-white dark:bg-white dark:text-[#111] border-2 border-[#333] dark:border-white font-heading font-bold tracking-[0.12em] uppercase text-sm hover:bg-[#DF3131] hover:border-[#DF3131] hover:text-white dark:hover:bg-[#DF3131] dark:hover:text-white dark:hover:border-[#DF3131] transition-all duration-300 hover:shadow-lg hover:shadow-[#DF3131]/20">
    VIEW ALL SERVICES
    </Link>
    </div>
  </div>
  )}

 {/* ── PLANS TAB ── */}
  {spTab === "plans" && (
  <div className="max-w-4xl mx-auto animate-fadeIn">
   <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.1em] uppercase text-center mb-4">Pricing Plans</h2>
   <p className="text-[#666] dark:text-white/50 text-sm mb-8 text-center">Affordable Plans for Any Budget</p>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
 {PRICING_PLANS.map((p, i) => (
 <div key={p.name}
  className="relative cursor-pointer"
  style={{ perspective: "1000px" }}
  onClick={() => setFlippedPlans(prev => ({ ...prev, [i]: !prev[i] }))}>
 {/* Card container with 3D flip */}
 <div className="relative w-full transition-transform duration-700"
  style={{ transformStyle: "preserve-3d", minHeight: "368px", transform: flippedPlans[i] ? "rotateY(180deg)" : "rotateY(0deg)" }}>
 {/* Front face — just plan name big & bold */}
 <div className={`absolute inset-0 p-8 text-center backface-hidden flex flex-col items-center justify-center transition-all duration-300 ${
  p.badge ? "border-[3px] border-[#DF3131] shadow-lg shadow-[#DF3131]/10 bg-white dark:bg-[#252528]" : "border border-[#E2E2E2] hover:border-[#DF3131] bg-white dark:bg-[#252528]"
 }`} style={{ backfaceVisibility: "hidden" }}>
 {p.badge && (
  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#DF3131] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 whitespace-nowrap">
  {p.badge}
  </div>
 )}
   <h3 className="font-heading font-black text-[#333] dark:text-white text-[28px] sm:text-[32px] tracking-[0.06em] uppercase leading-tight mb-3">{p.name}</h3>
   <p className="text-4xl sm:text-5xl font-black text-[#DF3131] mt-4">{p.price}</p>
   <p className="text-xs text-[#888] dark:text-white/50 mt-3">Tap to see details</p>
 </div>
 {/* Back face — all info + subscribe */}
 <div className="absolute inset-0 p-6 text-center bg-[#DF3131] text-white flex flex-col items-center justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
 <h3 className="font-heading font-bold text-lg tracking-[0.1em] uppercase mb-3">{p.name}</h3>
 <p className="text-4xl font-black mb-1">{p.price}</p>
 <p className="text-white/80 text-xs mb-1 font-bold italic">Every 3 months</p>
 <p className="text-white/70 text-xs mb-4">{p.desc}</p>
 <p className="text-white/50 text-[10px] mb-4">{p.valid}</p>
  <Link href="/plans" className="w-full py-3 bg-white text-[#111] font-heading font-bold tracking-[0.1em] uppercase text-sm hover:bg-[#333] dark:hover:bg-[#111] hover:text-white transition-all">
 SUBSCRIBE
 </Link>
 </div>
 </div>
 </div>
 ))}
 </div>
 <div className="text-center mt-8">
  <Link href="/plans" className="inline-block px-6 sm:px-8 py-3 border-2 border-[#333] text-[#333] font-heading font-bold tracking-[0.12em] uppercase text-[12px] sm:text-sm text-center hover:bg-[#DF3131] hover:border-[#DF3131] hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#DF3131]/20">
  VIEW ALL PLANS
  </Link>
 </div>
 </div>
 )}
 </div>
 </div>
 </section>
  </ScrollReveal>

<div className="h-12 sm:h-16 lg:h-20" />

{/* ═══ DIGITAL PRINTING BANNER ═══ */}
  <ScrollReveal animation="scaleIn" delay={0.1}>
  <section className="relative py-8 sm:py-12 lg:py-16 overflow-hidden bg-black hero-banner">
  <div className="absolute inset-0">
   <Image src="/images/printing/wix_0164.jpg" alt="Digital Printing" fill className="w-full h-full object-cover opacity-60" priority />
  </div>
  <div className="absolute inset-0 bg-black/20 z-[1]" />
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
<h2 className="text-[0.84rem] sm:text-[1.25rem] md:text-[2.5rem] lg:text-[3rem] font-heading font-black text-white tracking-[0.15em] uppercase whitespace-nowrap mb-3" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
  DIGITAL <span className="text-[#DF3131]">PRINTING</span>
  </h2>
  <p className="text-white/80 tracking-[0.3em] text-[10px] sm:text-sm uppercase mb-3 max-sm:px-2">Flyers | Stickers | Posters | Prints</p>
  <Link href="/printing" className="inline-block px-8 py-4 bg-white text-[#111] border-2 border-white text-[14px] font-bold tracking-[0.12em] hover:bg-[#DF3131] hover:text-white hover:border-[#DF3131] transition-all whitespace-nowrap mt-4">
  CUSTOM PRINTING →
  </Link>
  </div>
  </section>
  </ScrollReveal>

 {/* ═══ CLIENTS ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <section className="py-12 bg-white dark:bg-[#1C1C1E] overflow-hidden">
  <div className="max-w-6xl mx-auto px-6 text-center mb-4">
  <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.1em] uppercase mb-4">Clients</h2>
 </div>
 <LogoCarousel items={clientLogos} speed={0.5} />
  </section>
  </ScrollReveal>

  {/* ═══ TESTIMONIALS ═══ */}
  <ScrollReveal animation="fadeUp" delay={0.1}>
    <Testimonials />
  </ScrollReveal>

  {/* ═══ FAQ ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <section className="py-12 bg-white dark:bg-[#1C1C1E] border-t border-[#E2E2E2] dark:border-[#444]">
  <div className="max-w-7xl mx-auto px-6">
  <div className="relative flex flex-col lg:flex-row gap-8">
  <div className="lg:w-1/3 lg:sticky lg:top-28 lg:self-start">
   <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[3rem] xl:text-[3.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] uppercase mb-4">FAQ</h2>
   <div className="w-16 h-1 bg-[#DF3131] mx-auto mb-3"></div>
  <p className="text-[#666] dark:text-white/70 text-[15px] leading-relaxed mb-4">Have questions? We have answers. If you can&apos;t find what you&apos;re looking for, reach out to our team.</p>
 <div className="relative mb-4">
 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] dark:text-white/50 w-5 h-5" />
  <input
  type="text"
  placeholder="Search questions..."
  value={faqSearch}
  onChange={(e) => setFaqSearch(e.target.value)}
  aria-label="Search frequently asked questions"
  className="w-full pl-10 pr-4 py-3 border-2 border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#252528] text-sm text-[#333] dark:text-white outline-none focus:border-[#DF3131] transition-colors rounded-lg"
  />
 </div>
 <p className="text-[13px] text-[#888] dark:text-white/50">{filteredFaq.length} question{filteredFaq.length !== 1 ? "s" : ""} found</p>
 </div>
  <div className="lg:w-2/3 pr-2">
 <div className="space-y-3">
 {filteredFaq.slice(0, faqCount).map((faq, i) => (
 <div key={i}
  className="border border-[#E2E2E2] dark:border-[#444] rounded-lg overflow-hidden transition-all duration-300"
 style={{
 maxHeight: openFaq === i ? "300px" : "60px",
 boxShadow: openFaq === i ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
 }}>
  <button
  onClick={() => setOpenFaq(openFaq === i ? null : i)}
  className="w-full text-left px-4 sm:px-6 py-4 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
  <span className={`w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-300 flex-shrink-0 ${
  openFaq === i ? "bg-[#DF3131] text-white rotate-45" : "bg-[#F5F5F3] dark:bg-[#252528] text-[#333] dark:text-white"
  }`}>+</span>
   <span className={`font-heading font-bold text-[13px] sm:text-sm tracking-[0.02em] transition-colors ${
   openFaq === i ? "text-[#DF3131]" : "text-[#333] dark:text-white"
   }`}>
     {faq.q}
   </span>
  </button>
 <div className="px-6 pb-4 pl-14 sm:pl-[4.5rem]">
 <p className="text-[15px] text-[#666] dark:text-white/70 leading-relaxed">{faq.a}</p>
 </div>
 </div>
 ))}
 </div>
 {faqCount < filteredFaq.length && (
 <button
 onClick={() => setFaqCount(prev => Math.min(prev + 7, filteredFaq.length))}
   className="mt-6 w-full py-3 border-2 border-[#E2E2E2] dark:border-[#444] text-[#333] dark:text-white text-sm font-bold tracking-[0.08em] hover:border-[#DF3131] hover:text-[#DF3131] transition-all rounded-lg text-center">
  Load More ({filteredFaq.length - faqCount} remaining)
 </button>
 )}
 {filteredFaq.length === 0 && (
 <div className="text-center py-12">
 <p className="text-[#888] dark:text-white/50 text-[15px]">No questions match your search. Try different keywords.</p>
 </div>
 )}
 </div>
 </div>
 </div>
 </section>
 </ScrollReveal>

 {/* ═══ VALUE CARDS ═══ */}
 <ScrollReveal animation="fadeUp">
 <section className="py-8 sm:py-10 lg:py-14 bg-white dark:bg-[#1C1C1E] border-t border-[#E2E2E2] dark:border-[#444]">
 <div className="max-w-[130rem] mx-auto px-6 lg:px-12">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
 {[
 { title: "We Actually Do the Work", body: "We show up, we shoot, we design, we build. No outsourcing to strangers. No passing you around to three different people who don't talk to each other.", color: "#DF3131", icon: FiZap },
 { title: "Good Work Costs What It Costs", body: "We don't work for exposure, good vibes, or vague promises of future referrals. Creativity is real work. Real work earns real money. We also have accessible options for artists just getting started.", color: "#D49341", icon: FiAward },
  { title: "Fast, But Never Sloppy", body: "We move quick because we know what we're doing. But nothing leaves the desk looking rushed, generic, or like someone stopped caring halfway through.", color: "#888888", icon: FiTrendingUp },
 ].map((c, i) => {
 const Icon = c.icon;
  return (
   <GyroTilt key={i} intensity={6} enableOnDesktop>
   <CardTilt intensity={10}>
   <ScrollParallaxCard tiltAmount={4} scaleAmount={1.03}>
    <div className="group relative bg-gradient-to-br from-white to-[#FFFFFF] dark:from-[#252528] dark:to-[#252528] border border-[#E2E2E2] dark:border-[#444] p-6 sm:p-8 lg:p-12 hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1 min-h-[320px] sm:min-h-[360px] flex flex-col justify-center">
  <div className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-2" style={{ background: `linear-gradient(90deg, ${c.color}, ${c.color}88)` }} />
  <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700" style={{ background: `radial-gradient(circle at 50% 0%, ${c.color}22, transparent 70%)` }} />
   <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700 group-hover:scale-150 rounded-full" style={{ background: c.color }} />
     <div className="flex flex-col items-center text-center gap-3">
     <Icon className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1" style={{ color: c.color }} />
     <div>
    <h3 className="font-heading font-bold text-[14px] sm:text-[16px] lg:text-[17px] text-[#333] dark:text-white tracking-[0.04em] group-hover:text-[#DF3131] transition-colors duration-300 text-center mb-3">{c.title}</h3>
    <p className="text-[14px] text-[#666] dark:text-white/70 leading-relaxed text-center">{c.body}</p>
    </div>
   </div>
  </div>
  </ScrollParallaxCard>
  </CardTilt>
  </GyroTilt>
 );
 })}
 </div>
 </div>
 </section>
 </ScrollReveal>

 {/* ═══ QUICK LINKS ═══ */}
 <ScrollReveal animation="fadeUp" delay={0.1}>
 <section className="py-12 bg-white dark:bg-[#1C1C1E]">
  <div className="max-w-6xl mx-auto px-6 text-center">
  <h2 className="text-[1.1rem] sm:text-[1.25rem] md:text-[1.5rem] lg:text-[2rem] font-heading font-black text-[#333] dark:text-white tracking-[0.15em] uppercase mb-4">Quick Links</h2>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 sm:gap-x-8 md:gap-x-12 gap-y-6 md:gap-y-8 max-w-5xl mx-auto">
 {QUICK_LINKS.map((link) => (
  <Link key={link.label} href={link.href}
   className="bg-[#F5F5F5] dark:bg-[#252528] border-2 border-[#DF3131] text-[#DF3131] py-3 px-4 font-heading font-bold tracking-[0.1em] uppercase text-xs hover:bg-[#DF3131] hover:text-white transition-all text-center">
 {link.label}
 </Link>
 ))}
 </div>
 </div>
 </section>
 </ScrollReveal>

 {/* ═══ DESIGN SHOWCASE CAROUSEL ═══ */}
 <ScrollReveal animation="fadeIn" duration={1}>
 <section className="py-6">
 <SmoothCarousel items={shuffledDesign.length > 0 ? shuffledDesign : DESIGN_SHOWCASE_RAW} speed={0.55} />
  </section>
  </ScrollReveal>

  <LeadMagnet />
  </main>
 );
}
