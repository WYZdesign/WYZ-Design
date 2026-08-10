"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

const SERVICES = [
  "Photoshoot",
  "Photo Retouching",
  "Event Photography",
  "Graphic Design",
  "Logo Design",
  "Videography",
  "Video Editing",
  "Creative Consultation",
  "Logo Consultation",
  "Marketing Consultation",
  "Website Design",
  "SEO Audit",
  "Event Planning",
  "Custom Printing",
  "Branding Package",
];

const PRICING_MAP: Record<string, string> = {
  "Photoshoot": "$100/hr",
  "Photo Retouching": "Varies",
  "Event Photography": "$200/event",
  "Graphic Design": "$75+",
  "Logo Design": "$100+",
  "Videography": "$200/event",
  "Video Editing": "$100+",
  "Creative Consultation": "Free",
  "Logo Consultation": "$50",
  "Marketing Consultation": "$50",
  "Website Design": "$500+",
  "SEO Audit": "$50",
  "Event Planning": "Custom",
  "Custom Printing": "Custom",
  "Branding Package": "Custom",
};

const SERVICE_PRICES: Record<string, number> = {
  "Photoshoot": 100,
  "Event Photography": 200,
  "Logo Consultation": 50,
  "Marketing Consultation": 50,
  "SEO Audit": 50,
};

export default function BookingPage() {
  const calLink = "torree-harris-ddqqep";
  const [submitted, setSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.service = selectedService;

    setLoading(true);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: "booking", data }),
      });
      if (!res.ok) {
        throw new Error("Submission failed");
      }
      setSubmitted(true);
    } catch (err) {
      console.error("Booking submission failed:", err);
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function payNow() {
    const price = SERVICE_PRICES[selectedService];
    if (!price) { toast.error("This service has custom pricing. Submit a request and we'll send you a quote."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "service", serviceName: selectedService, servicePrice: price }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Checkout failed. Make sure Stripe is configured.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pb-12 bg-white dark:bg-[#1C1C1E]">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-black text-[#333333] dark:text-[#e0e0e0] tracking-[0.15em] text-center mb-6 sm:mb-8" style={{ lineHeight: 1 }}>Book a Service</h1>
        <p className="text-center text-[#666665] dark:text-[#b0b0b0] text-[15px] mt-2">Tell us about your project and we&apos;ll get back to you within 24 hours.</p>

        {submitted ? (
          <div className="mt-16 text-center py-16 border border-[#E2E2E2] dark:border-[#333] bg-white dark:bg-[#252528]">
            <div className="w-16 h-16 bg-[#DF3131] rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold text-[#333] dark:text-[#e0e0e0] mb-4">Request Submitted!</h2>
            <p className="text-[15px] text-[#666] dark:text-[#b0b0b0] mb-6">We&apos;ll review your request and get back to you within 24 hours.</p>
            <Link href="/" className="inline-block px-6 py-2.5 bg-[#DF3131] text-white font-bold text-sm tracking-wider hover:bg-[#B82020] transition-all">
              Back to Home
            </Link>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="mt-10 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-[13px] font-heading font-semibold tracking-[0.08em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">Full Name *</label>
                <input type="text" required className="w-full px-4 py-3 border border-[#E2E2E2] dark:border-[#555] text-[15px] text-[#333] dark:text-white dark:bg-[#252528] placeholder-[#8F8F8F] outline-none focus:border-[#DF3131] transition-colors" placeholder="Your name" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[13px] font-heading font-semibold tracking-[0.08em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">Email *</label>
                <input type="email" required className="w-full px-4 py-3 border border-[#E2E2E2] dark:border-[#555] text-[15px] text-[#333] dark:text-white dark:bg-[#252528] placeholder-[#8F8F8F] outline-none focus:border-[#DF3131] transition-colors" placeholder="you@email.com" />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[13px] font-heading font-semibold tracking-[0.08em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">Phone</label>
                <input type="tel" className="w-full px-4 py-3 border border-[#E2E2E2] dark:border-[#555] text-[15px] text-[#333] dark:text-white dark:bg-[#252528] placeholder-[#8F8F8F] outline-none focus:border-[#DF3131] transition-colors" placeholder="(555) 555-5555" />
              </div>

              {/* Service */}
              <div>
                <label className="block text-[13px] font-heading font-semibold tracking-[0.08em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">Service *</label>
                <select
                  required
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2E2E2] dark:border-[#555] text-[15px] text-[#333] dark:text-white dark:bg-[#252528] outline-none focus:border-[#DF3131] transition-colors"
                >
                  <option value="">Select a service</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>{s} - {PRICING_MAP[s] || "Custom"}</option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-[13px] font-heading font-semibold tracking-[0.08em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">Budget Range</label>
                <select className="w-full px-4 py-3 border border-[#E2E2E2] dark:border-[#555] text-[15px] text-[#333] dark:text-white dark:bg-[#252528] outline-none focus:border-[#DF3131] transition-colors">
                  <option value="">Select a range</option>
                  <option>Under $250</option>
                  <option>$250 - $500</option>
                  <option>$500 - $1,000</option>
                  <option>$1,000 - $2,500</option>
                  <option>$2,500+</option>
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-[13px] font-heading font-semibold tracking-[0.08em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">Preferred Date</label>
                <input type="date" className="w-full px-4 py-3 border border-[#E2E2E2] dark:border-[#555] text-[15px] text-[#333] dark:text-white dark:bg-[#252528] outline-none focus:border-[#DF3131] transition-colors" />
              </div>
            </div>

            {/* Message */}
            <div className="mt-6">
              <label className="block text-[13px] font-heading font-semibold tracking-[0.08em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">Project Details *</label>
              <textarea required rows={5} className="w-full px-4 py-3 border border-[#E2E2E2] dark:border-[#555] text-[15px] text-[#333] dark:text-white dark:bg-[#252528] placeholder-[#8F8F8F] outline-none focus:border-[#DF3131] transition-colors resize-none" placeholder="Tell us about your project, goals, and timeline..." />
            </div>

            {/* How did you hear about us */}
            <div className="mt-6">
              <label className="block text-[13px] font-heading font-semibold tracking-[0.08em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">How did you hear about us?</label>
              <select className="w-full px-4 py-3 border border-[#E2E2E2] dark:border-[#555] text-[15px] text-[#333] dark:text-white dark:bg-[#252528] outline-none focus:border-[#DF3131] transition-colors">
                <option value="">Select one</option>
                <option>Instagram</option>
                <option>TikTok</option>
                <option>Facebook</option>
                <option>Google Search</option>
                <option>Friend / Referral</option>
                <option>Event</option>
                <option>Other</option>
              </select>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button type="submit" disabled={loading} aria-label="Submit booking request" className="flex-1 py-3.5 bg-[#DF3131] text-white font-heading font-bold text-sm tracking-[0.1em] uppercase hover:bg-[#B82020] transition-all disabled:opacity-50">
                {loading ? "Loading..." : "Submit Request"}
              </button>
              {selectedService && SERVICE_PRICES[selectedService] && (
                <button type="button" onClick={payNow} disabled={loading} aria-label={`Pay now for ${selectedService}`} className="flex-1 py-3.5 bg-[#333] text-white font-heading font-bold text-sm tracking-[0.1em] uppercase hover:bg-[#DF3131] transition-all disabled:opacity-50">
                  {loading ? "Loading..." : `Pay Now - $${SERVICE_PRICES[selectedService]}`}
                </button>
              )}
            </div>

            <p className="text-center text-[13px] text-[#8F8F8F] dark:text-[#b0b0b0] mt-4">
              Or contact us directly at <a href="mailto:info@wyzdesign.com" className="text-[#DF3131] hover:underline">info@wyzdesign.com</a> or <a href="tel:2133999610" className="text-[#DF3131] hover:underline">(213) 399-9610</a>
            </p>
          </form>
        )}

        {/* Cal.com Quick Book */}
        {calLink && (
          <div className="mt-16">
            <h2 className="text-center font-heading font-bold text-[18px] tracking-[0.1em] uppercase text-[#333] dark:text-[#e0e0e0] mb-4">Quick Book with Calendar Sync</h2>
            <div className="border border-[#E2E2E2] dark:border-[#333] rounded-lg overflow-hidden">
              <CalBooking calLink={calLink} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function CalBooking({ calLink }: { calLink: string }) {
  useEffect(() => {
    if (!calLink || typeof window === "undefined") return;
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    let cleaned = false;
    script.onload = () => {
      if (cleaned) return;
      try {
        const Cal = (window as Record<string, any>).Cal;
        if (Cal) {
          Cal("init", "booking", { origin: "https://app.cal.com" });
          Cal.ns.booking("inline", { elementOrSelector: "#cal-embed", calLink });
        }
      } catch (e) { console.warn("[booking-page] Cal.com init failed", e); }
    };
    document.body.appendChild(script);
    return () => { cleaned = true; try { script.remove(); } catch {} };
  }, [calLink]);

  if (!calLink) {
    return (
      <div className="text-center p-8 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] rounded-lg">
        <p className="text-[#666] dark:text-[#b0b0b0] text-[14px] mb-4">Calendar booking is being set up.</p>
        <a href="mailto:info@wyzdesign.com" className="inline-block px-8 py-3 bg-[#DF3131] text-white font-heading font-bold tracking-[0.1em] uppercase text-[14px] hover:bg-[#B82020] transition-all">
          Email to Book
        </a>
      </div>
    );
  }

  return <div id="cal-embed" style={{ width: "100%", minHeight: "650px", overflow: "hidden" }} />;
}
