import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "WYZ Design LLC shipping policy. Processing times, shipping methods, tracking, international orders and duties, address accuracy, lost or damaged packages, and delivery estimates.",
  robots: { index: true, follow: true },
};

const H2 =
  "text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-4";
const BODY = "space-y-8 text-[#666665] dark:text-[#b0b0b0] leading-relaxed";
const HREF = "text-[#DF3131] hover:underline";

export default function ShippingPolicy() {
  return (
    <>
      <main data-legal className="min-h-screen bg-white dark:bg-[#111] pb-20">
        <div className="max-w-4xl mx-auto px-6 pt-28">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-6 sm:mb-8">
            Shipping Policy
          </h1>
          <div className={BODY}>
            <p>
              Effective date: October 9, 2026. This Shipping Policy explains how WYZ Design LLC
              (&quot;WYZ Design,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) handles
              orders for physical merchandise. Digital deliverables such as design files,
              galleries, and gift cards are delivered by email or download and do not ship.
            </p>

            <section>
              <h2 className={H2}>Order Processing</h2>
              <p>
                All physical merchandise orders are fulfilled through Printful. Orders are
                typically processed within 2 to 7 business days, plus transit time. Processing
                times vary by product and current demand, and made-to-order items take longer.
                Orders placed on weekends or holidays begin processing the next business day.
              </p>
            </section>

            <section>
              <h2 className={H2}>Shipping Methods and Times</h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between border-b border-gray-200 dark:border-[#333] pb-3">
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                    Standard Shipping (US)
                  </span>
                  <span>5 to 8 business days</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-[#333] pb-3">
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                    Expedited Shipping (US)
                  </span>
                  <span>3 to 5 business days</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-[#333] pb-3">
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                    International Shipping
                  </span>
                  <span>10 to 21 business days</span>
                </div>
              </div>
              <p className="mt-4">
                Shipping costs are calculated at checkout based on destination, weight, and the
                method you select. Delivery times are estimates, not guarantees, and start after
                processing is complete. Peak seasons and carrier delays can extend them.
              </p>
            </section>

            <section>
              <h2 className={H2}>Order Tracking</h2>
              <p>
                Once your order ships, you will receive a confirmation email with a tracking
                number. You can track your package through the carrier&apos;s website or app.
                Tracking may take up to 48 hours to update after the label is created.
              </p>
            </section>

            <section>
              <h2 className={H2}>Address Accuracy</h2>
              <p>
                Please double-check your shipping address at checkout. Contact us immediately if
                you need to correct an address. If an order is returned to us as undeliverable
                because the address was entered incorrectly or the package was refused, we can
                re-ship it, but additional shipping charges apply. We are not responsible for
                orders shipped to an incorrect address provided by the customer.
              </p>
            </section>

            <section>
              <h2 className={H2}>International Orders</h2>
              <p>
                International orders may be subject to customs duties, taxes, or fees imposed by
                the destination country. These charges are the customer&apos;s responsibility and
                are not included in the shipping cost. Customs processing can add time beyond the
                estimates above. We cannot mark international orders as gifts or declare false
                values.
              </p>
            </section>

            <section>
              <h2 className={H2}>Lost, Damaged, or Incorrect Packages</h2>
              <p className="mb-4">
                If your package is lost, arrives damaged, or contains the wrong item, contact us
                at{" "}
                <a href="mailto:info@wyzdesign.com" className={HREF}>
                  info@wyzdesign.com
                </a>{" "}
                within 30 days of the estimated delivery date with your order number and
                photographs where relevant. We will work with Printful to arrange a replacement or
                full refund, including return shipping costs for defective items.
              </p>
              <p>
                For packages marked delivered but not received, check with household members and
                neighbors first, then contact us. We will file a carrier claim and work toward a
                resolution, which may take a few weeks.
              </p>
            </section>

            <section>
              <h2 className={H2}>Returns and Refunds</h2>
              <p>
                For information about returns and refunds, see our{" "}
                <a href="/legal/refund" className={HREF}>
                  Return &amp; Refund Policy
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className={H2}>Contact</h2>
              <p className="mb-2 font-semibold text-[#333333] dark:text-[#e0e0e0]">
                WYZ Design LLC
              </p>
              <p>1200 S. Wall St., Los Angeles, CA 90015</p>
              <p>
                <a href="tel:2133999610" className={HREF}>
                  (213) 399-9610
                </a>
              </p>
              <p>
                <a href="mailto:info@wyzdesign.com" className={HREF}>
                  info@wyzdesign.com
                </a>
              </p>
            </section>

            <p className="text-sm text-[#666] dark:text-white/40">
              Last updated: October 9, 2026
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
