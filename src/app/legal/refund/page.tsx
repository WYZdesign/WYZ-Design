import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description:
    "WYZ Design LLC return and refund policy. Deposits and cancellations, subscriptions, digital services, physical merchandise, event photography, gift cards, and the refund process.",
  robots: { index: true, follow: true },
};

const H2 =
  "text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-4";
const BODY = "space-y-8 text-[#666665] dark:text-[#b0b0b0] leading-relaxed";
const HREF = "text-[#DF3131] hover:underline";

export default function RefundReturnPolicy() {
  return (
    <>
      <main className="min-h-screen bg-white dark:bg-[#111] pb-20">
        <div className="max-w-4xl mx-auto px-6 pt-28">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-6 sm:mb-8">
            Return &amp; Refund Policy
          </h1>
          <div className={BODY}>
            <p>
              Effective date: October 9, 2026. This Return and Refund Policy explains when WYZ
              Design LLC (&quot;WYZ Design,&quot; &quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;) issues refunds for services, subscriptions, merchandise, and gift
              cards, and how to request one. It should be read together with our{" "}
              <a href="/legal/terms" className={HREF}>
                Terms &amp; Conditions
              </a>
              . Nothing in this policy limits rights you have under applicable consumer law.
            </p>

            <section>
              <h2 className={H2}>Deposits and Cancellations</h2>
              <p className="mb-4">
                Bookings are confirmed with a 50% deposit. Cancellations made 48 or more hours
                before a scheduled session receive a full deposit refund. Cancellations within 48
                hours of the session forfeit the deposit, and no-shows are non-refundable.
                Rescheduling is free with 24 or more hours notice.
              </p>
              <p>
                If we cancel or postpone a session for any reason, you choose either a full refund
                of amounts paid or a rescheduled date at no cost.
              </p>
            </section>

            <section>
              <h2 className={H2}>Subscription Plans</h2>
              <p className="mb-4">
                Subscription plans renew monthly until you cancel. You may cancel at any time by
                emailing{" "}
                <a href="mailto:info@wyzdesign.com" className={HREF}>
                  info@wyzdesign.com
                </a>{" "}
                or through your online account. Cancellation takes effect at the end of your
                current billing period, and your plan stays active until then.
              </p>
              <p>
                Unless required by law, we do not refund partial months. If you cancel within the
                first 14 days of your first subscription month and no work has begun, we refund
                that first monthly charge in full.
              </p>
            </section>

            <section>
              <h2 className={H2}>Digital Services</h2>
              <p>
                Due to the nature of creative work, refunds for completed services are handled
                case by case. If you are unsatisfied with delivered work, contact us within 7 days
                of receiving the final deliverables and we will make reasonable revisions or
                adjustments to meet the agreed scope. If the work does not meet the scope defined
                in your booking agreement and we cannot fix it, we will refund the portion of the
                fee corresponding to the undelivered scope.
              </p>
            </section>

            <section>
              <h2 className={H2}>Event Photography</h2>
              <p>
                If event photography does not meet the scope defined in the booking agreement, we
                will reshoot at no additional cost or provide a partial refund proportional to the
                undelivered portion of the agreed scope. Refund requests for events must be made
                within 14 days of delivery of the gallery.
              </p>
            </section>

            <section>
              <h2 className={H2}>Physical Merchandise</h2>
              <p className="mb-4">
                Physical merchandise is fulfilled through Printful. If your item arrives damaged,
                defective, or incorrect, contact us within 30 days of delivery with photographic
                evidence, and we will arrange a replacement or full refund at no cost to you.
              </p>
              <p>
                Items that are not defective but that you wish to return for personal preference
                may be returned within 30 days of delivery in original condition. Return shipping
                is the customer&apos;s responsibility, and the refund is issued after we receive
                the returned item. Because items are made to order, we cannot accept returns of
                personalized or custom items unless they arrive damaged or defective.
              </p>
            </section>

            <section>
              <h2 className={H2}>Gift Cards</h2>
              <p className="mb-4">
                Gift cards do not expire and carry no dormancy, inactivity, or maintenance fees.
                They are non-refundable except where required by law. Gift cards cannot be
                redeemed for cash, except for any remaining balance where required by California
                law.
              </p>
              <p>
                Gift cards may be applied to any service or merchandise. If the value of your
                purchase is less than the balance, the difference stays on the card. If it is
                more, you pay the difference. We will never charge a fee to issue or maintain a
                gift card.
              </p>
            </section>

            <section>
              <h2 className={H2}>Refund Process</h2>
              <p className="mb-4">
                To request a refund, email{" "}
                <a href="mailto:info@wyzdesign.com" className={HREF}>
                  info@wyzdesign.com
                </a>{" "}
                with your order or booking number and the reason for the request. We respond to
                all refund requests within 2 business days and decide within 10 business days.
                Approved refunds are issued to the original payment method through Stripe, and
                usually appear on your statement within 5 to 10 business days, depending on your
                bank. Sales tax is included in refund calculations where applicable.
              </p>
              <p>
                Please contact us before initiating a chargeback so we can resolve the issue
                quickly. Chargebacks filed in bad faith are a breach of our Terms.
              </p>
            </section>

            <section>
              <h2 className={H2}>California Consumer Rights</h2>
              <p>
                If you are a California resident, you may have additional rights under California
                consumer protection laws, including rights to cancel certain contracts. Nothing in
                this policy limits those rights. See our{" "}
                <a href="/legal/terms" className={HREF}>
                  Terms &amp; Conditions
                </a>{" "}
                for details on how to contact us and how to exercise your rights.
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

            <p className="text-sm text-[#666] dark:text-[#b0b0b0]">
              Last updated: October 9, 2026
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
