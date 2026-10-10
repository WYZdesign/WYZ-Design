import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "WYZ Design LLC terms and conditions. Services, subscriptions and auto-renewal, payments, deposits, cancellations, intellectual property, liability, dispute resolution, and California consumer notice.",
  robots: { index: true, follow: true },
};

const H2 =
  "text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-4";
const BODY = "space-y-8 text-[#666665] dark:text-[#b0b0b0] leading-relaxed";
const HREF = "text-[#DF3131] hover:underline";

export default function TermsAndConditions() {
  return (
    <>
      <main data-legal className="min-h-screen bg-white dark:bg-[#111] pb-20">
        <div className="max-w-4xl mx-auto px-6 pt-28">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-6 sm:mb-8">
            Terms &amp; Conditions
          </h1>
          <div className={BODY}>
            <p>
              Effective date: October 9, 2026. These Terms and Conditions (the
              &quot;Terms&quot;) are a legal agreement between you and WYZ Design LLC
              (&quot;WYZ Design,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
              They govern your use of wyzdesign.com (the &quot;Site&quot;) and any service you
              book or purchase from us, including photography, graphic design, web design,
              printing, video, event production, subscription plans, merchandise, gift cards,
              and the referral and rewards programs (together, the &quot;Services&quot;).
            </p>

            <section>
              <h2 className={H2}>Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing the Site, booking a Service, or making a purchase, you agree to
                these Terms and to our Privacy Policy, Refund Policy, Shipping Policy, and
                Copyright Notice, each of which is incorporated by reference. If you do not
                agree, do not use the Site or the Services.
              </p>
              <p>
                You must be at least 18 years old and able to enter into a legally binding
                contract to use the Site or book the Services. If you book on behalf of a
                company or organization, you represent that you have authority to bind it to
                these Terms.
              </p>
            </section>

            <section>
              <h2 className={H2}>Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. The revised version takes effect
                when it is posted on this page with a new effective date. For material changes
                that affect an active booking or subscription, we will also notify you by
                email. Your continued use of the Site or the Services after changes take
                effect constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className={H2}>Our Services</h2>
              <p>
                WYZ Design provides creative services including graphic design, photography,
                web design, video editing, event production, custom printing, subscription
                design plans, merchandise, and gift cards. The specific scope, deliverables,
                timeline, and price for any project are set out in your quote, booking
                confirmation, statement of work, or online order (each a &quot;Project
                Agreement&quot;). If a Project Agreement conflicts with these Terms, the Project
                Agreement controls for that project.
              </p>
            </section>

            <section>
              <h2 className={H2}>Pricing and Subscriptions</h2>
              <p className="mb-4">
                Our current plan pricing and inclusions are published on our Services page at
                wyzdesign.com/services#plans, which is the authoritative source for all pricing.
                Prices for individual projects are quoted per Project Agreement.
              </p>
              <p className="mb-4">
                Subscription plans are billed monthly in advance and renew automatically every
                month until you cancel. By purchasing a plan, you authorize WYZ Design to charge
                your payment method on file for each renewal period at the then-current price.
              </p>
              <p className="mb-4">
                You may cancel a subscription at any time by emailing{" "}
                <a href="mailto:info@wyzdesign.com" className={HREF}>
                  info@wyzdesign.com
                </a>{" "}
                or through your online account, provided we receive the request before your next
                renewal date. Cancellation takes effect at the end of the current billing period.
                Unless required by law, we do not refund partial months or unused time. If you
                cancel in your first 14 days and no work has begun, we will refund the most recent
                monthly charge in full.
              </p>
              <p>
                We may change plan pricing with at least 30 days written notice. A price change
                takes effect at your next renewal date, so you may cancel before then if you do
                not accept the new price. Promotional or discounted pricing is offered at our
                discretion and may be withdrawn. Prices are in U.S. dollars; sales and use taxes
                are added where required by law.
              </p>
            </section>

            <section>
              <h2 className={H2}>Payments, Deposits, and Billing</h2>
              <p className="mb-4">
                A deposit of 50% is required to confirm a booking. The remaining balance is due
                upon project completion, before final files are released unless your Project
                Agreement says otherwise. Deposits are non-refundable once work has commenced,
                except as stated in these Terms or our Refund Policy.
              </p>
              <p className="mb-4">
                Payments are processed by Stripe. By paying, you agree to Stripe&apos;s terms and
                confirm that you are authorized to use the payment method provided. You are
                responsible for any bank, card, or currency conversion fees your provider charges.
              </p>
              <p className="mb-4">
                Invoices are due on receipt. Balances more than 15 days past due may accrue
                interest at 1.5% per month, or the highest rate permitted by law if lower, and we
                may pause work and withhold delivery until the account is current.
              </p>
              <p>
                If you believe a charge is incorrect, contact us before initiating a chargeback.
                Unwarranted or fraudulent chargebacks are a breach of these Terms and may result
                in suspension of your account and recovery of the disputed amount plus reasonable
                collection costs.
              </p>
            </section>

            <section>
              <h2 className={H2}>Client Responsibilities</h2>
              <p>
                You agree to provide accurate information, complete content, and timely feedback
                and approvals. You are responsible for the materials you supply, including text,
                images, brand assets, and access credentials, and for confirming that they are
                accurate and that you have the right to use them. When feedback or approvals are
                delayed, timelines move accordingly, and additional rounds caused by delay may be
                billed as out-of-scope work.
              </p>
            </section>

            <section>
              <h2 className={H2}>Revisions and Scope Changes</h2>
              <p>
                Standard packages include up to 2 rounds of revisions. Additional revisions are
                billed at $50 per hour. Major changes in scope, direction, or deliverables after
                work has begun require a new Project Agreement, and we may adjust price and
                timeline accordingly.
              </p>
            </section>

            <section>
              <h2 className={H2}>Scheduling, Rescheduling, and Cancellation</h2>
              <p>
                Cancellations made 48 or more hours before a scheduled session receive a full
                deposit refund. Cancellations within 48 hours of the session forfeit the deposit.
                No-shows are non-refundable. Rescheduling is free with 24 or more hours notice;
                repeated rescheduling may require a new deposit. If we cancel or postpone a
                session for any reason, you may choose a full refund of amounts paid or a
                rescheduled date at no cost. Events outside reasonable control are handled under
                Force Majeure below.
              </p>
            </section>

            <section>
              <h2 className={H2}>Intellectual Property</h2>
              <p className="mb-4">
                Upon receipt of full payment, WYZ Design grants you a non-exclusive, perpetual
                license to use the final delivered work for the purpose stated in your Project
                Agreement. Unless a separate written agreement expressly assigns copyright to you,
                WYZ Design retains ownership of the work, including all rights not expressly
                granted.
              </p>
              <p className="mb-4">
                WYZ Design retains the right to display and describe completed work in its
                portfolio, website, social media, marketing materials, and competitions, unless
                you opt out in writing before the project begins.
              </p>
              <p className="mb-4">
                Raw or unedited files, layered source files, and working files are not included
                unless your Project Agreement provides for them, and remain the property of WYZ
                Design.
              </p>
              <p>
                Third-party elements incorporated into delivered work, such as fonts, stock
                imagery, music, and software, remain subject to their own license terms. We will
                identify third-party licensing requirements on request so you can use the work
                compliantly.
              </p>
            </section>

            <section>
              <h2 className={H2}>Client Materials, Model and Property Releases</h2>
              <p>
                You represent that you own or have licensed all materials you provide and that
                their use as authorized by you does not infringe anyone&apos;s rights. For
                photography and video, you are responsible for obtaining signed model releases
                from identifiable individuals and property releases for private locations, or for
                confirming in writing that all subjects are you or authorized by you. We may
                decline or remove content that is unlawful, infringing, or harmful. You grant us a
                limited license to use your materials solely to perform the Services.
              </p>
            </section>

            <section>
              <h2 className={H2}>Acceptable Use of the Site</h2>
              <p>
                You agree not to scrape, crawl, or systematically extract content from the Site
                without our written permission; interfere with or disrupt the Site or its
                security; introduce malware; impersonate others; post or transmit unlawful,
                infringing, or deceptive content; or attempt to access non-public areas,
                accounts, or systems. We may investigate suspected misuse and take action,
                including blocking access.
              </p>
            </section>

            <section>
              <h2 className={H2}>AI and Automated Features</h2>
              <p>
                The Site includes AI-assisted chat and automated tools powered by third-party
                providers. Responses are informational and may be inaccurate, and they are not
                legal, financial, medical, or other professional advice. Do not submit
                confidential, sensitive, or regulated personal information through these
                features. Messages you send are processed by our service providers as described in
                our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className={H2}>Third-Party Services and Links</h2>
              <p>
                We rely on third parties to operate parts of the Site, including Stripe for
                payments, Printful for merchandise fulfillment, Cal.com for scheduling, and our
                hosting and infrastructure providers. The Site also links to third-party sites and
                platforms, including social networks. Those providers operate under their own
                terms and privacy policies, and we are not responsible for their content,
                availability, or practices.
              </p>
            </section>

            <section>
              <h2 className={H2}>Disclaimers</h2>
              <p>
                The Site and any free content on it are provided on an &quot;as is&quot; and
                &quot;as available&quot; basis, without warranties of any kind, express or
                implied, including warranties of merchantability, fitness for a particular
                purpose, and non-infringement. We do not warrant that the Site will be
                uninterrupted, error-free, or secure, or that any result, ranking, reach, or
                outcome will be achieved through the Services. Portfolio examples are illustrative
                of past work only.
              </p>
            </section>

            <section>
              <h2 className={H2}>Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, WYZ Design and its members, employees,
                and contractors will not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or for loss of profits, revenue, data, or
                goodwill, arising out of or related to the Site or the Services. Our total
                liability for any claim will not exceed the amount you paid for the specific
                Service or transaction that gave rise to the claim. Nothing in these Terms limits
                or excludes liability that cannot be limited or excluded under applicable law,
                including liability for fraud or willful misconduct.
              </p>
            </section>

            <section>
              <h2 className={H2}>Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless WYZ Design LLC and its members,
                employees, and contractors from and against claims, damages, losses, and expenses,
                including reasonable attorneys fees, arising out of your materials, your content,
                your breach of these Terms, or your violation of law or third-party rights, except
                to the extent caused by our gross negligence or willful misconduct.
              </p>
            </section>

            <section>
              <h2 className={H2}>Force Majeure</h2>
              <p>
                Neither party is liable for delay or failure to perform caused by events beyond
                its reasonable control, including weather, natural disaster, illness, power or
                internet failure, government action, public health orders, labor disputes,
                venue or carrier delays, and equipment failure. The affected party will notify
                the other as soon as reasonably possible. If a force majeure event continues for
                more than 30 days, either party may terminate the affected Project Agreement, and
                we will refund amounts paid for work not performed.
              </p>
            </section>

            <section>
              <h2 className={H2}>Dispute Resolution</h2>
              <p className="mb-4">
                If a dispute arises, contact us first at{" "}
                <a href="mailto:info@wyzdesign.com" className={HREF}>
                  info@wyzdesign.com
                </a>
                . We will try in good faith to resolve it informally within 30 days. Most issues
                are fixed with one email.
              </p>
              <p className="mb-4">
                These Terms are governed by the laws of the State of California, without regard
                to its conflict of laws rules. If we cannot resolve a dispute informally, the
                parties submit to the exclusive jurisdiction of the state and federal courts
                located in Los Angeles County, California, and each waives any objection to
                venue there. Either party may seek injunctive relief in any court of competent
                jurisdiction to protect intellectual property rights without posting a bond.
              </p>
              <p className="mb-4">
                To the extent permitted by law, each party waives the right to a jury trial and
                agrees that claims will be brought individually and not as a plaintiff or class
                member in any purported class, consolidated, or representative proceeding.
              </p>
              <p>
                Any claim under these Terms must be commenced within one year after the event
                giving rise to it, to the extent permitted by law. Nothing in this section
                prevents either party from filing a claim in small claims court if it qualifies.
              </p>
            </section>

            <section>
              <h2 className={H2}>Termination</h2>
              <p>
                You may stop using the Site at any time. We may suspend or terminate your access
                to the Site or refuse Service if you breach these Terms, engage in fraudulent or
                abusive activity, create risk for us or others, or fail to pay amounts due.
                Terminating access does not relieve you of obligations already incurred,
                including payment for work performed. Provisions that by their nature should
                survive termination, including intellectual property, disclaimers, limitation of
                liability, indemnification, and dispute resolution, survive.
              </p>
            </section>

            <section>
              <h2 className={H2}>General Provisions</h2>
              <p className="mb-4">
                If any provision of these Terms is found unenforceable, it will be modified to
                the minimum extent necessary to make it enforceable, and the rest remain in
                effect. Our failure to enforce a provision is not a waiver of it. These Terms,
                together with your Project Agreements and the policies referenced in them, are
                the entire agreement between you and WYZ Design regarding the Site and Services,
                and supersede prior discussions on the same subject.
              </p>
              <p>
                You may not assign these Terms without our written consent; we may assign them in
                connection with a merger, acquisition, or sale of assets. You consent to receive
                notices and communications electronically, including by email. These Terms do not
                create any third-party beneficiary rights.
              </p>
            </section>

            <section>
              <h2 className={H2}>California Consumer Notice</h2>
              <p className="mb-4">
                Under California Civil Code Section 1789.3, California residents are entitled to
                know that they may contact the Complaint Assistance Unit of the Division of
                Consumer Services of the California Department of Consumer Affairs in writing at
                1625 North Market Blvd., Suite N 112, Sacramento, CA 95834, or by telephone at
                (916) 445-1245 or (800) 952-5210, if a complaint is not resolved to their
                satisfaction after contacting us.
              </p>
              <p>
                We are committed to making the Site usable by everyone, including people with
                disabilities. If you encounter an accessibility barrier, email us at{" "}
                <a href="mailto:info@wyzdesign.com" className={HREF}>
                  info@wyzdesign.com
                </a>{" "}
                and we will work with you to provide the information or service you need.
              </p>
            </section>

            <section>
              <h2 className={H2}>Related Policies and Contact</h2>
              <p className="mb-4">
                Please also review our{" "}
                <a href="/legal/privacy" className={HREF}>
                  Privacy Policy
                </a>
                ,{" "}
                <a href="/legal/refund" className={HREF}>
                  Refund Policy
                </a>
                ,{" "}
                <a href="/legal/shipping" className={HREF}>
                  Shipping Policy
                </a>
                , and{" "}
                <a href="/legal/copyright" className={HREF}>
                  Copyright Notice
                </a>
                .
              </p>
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
