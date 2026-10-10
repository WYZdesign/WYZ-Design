import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "WYZ Design LLC privacy policy. What we collect, how we use it, cookies and consent, advertising and analytics vendors, your California (CCPA/CPRA) and GDPR rights, retention, and how to make a request.",
  robots: { index: true, follow: true },
};

const H2 =
  "text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-4";
const BODY = "space-y-8 text-[#666665] dark:text-[#b0b0b0] leading-relaxed";
const HREF = "text-[#DF3131] hover:underline";
const LI = "list-disc pl-6 space-y-2";

export default function PrivacyPolicy() {
  return (
    <>
      <main className="min-h-screen bg-white dark:bg-[#111] pb-20">
        <div className="max-w-4xl mx-auto px-6 pt-28">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-6 sm:mb-8">
            Privacy Policy
          </h1>
          <div className={BODY}>
            <p>
              Effective date: October 9, 2026. This Privacy Policy explains how WYZ Design LLC
              (&quot;WYZ Design,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
              collects, uses, shares, and protects personal information when you visit
              wyzdesign.com, book a service, make a purchase, join our rewards or referral
              programs, use our AI chat, or otherwise interact with us. It also explains the
              choices and rights you have, including rights under the California Consumer Privacy
              Act as amended by the CPRA (CCPA) and, for people in Europe and the UK, the
              General Data Protection Regulation (GDPR).
            </p>

            <section>
              <h2 className={H2}>Who We Are</h2>
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

            <section>
              <h2 className={H2}>Information We Collect</h2>
              <p className="mb-4">We collect the following categories of personal information:</p>
              <ul className={LI}>
                <li>
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                    Identifiers and contact details:
                  </span>{" "}
                  name, email address, phone number, billing and shipping address, and account
                  login (email) when you create an account or book with us.
                </li>
                <li>
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                    Commercial information:
                  </span>{" "}
                  products and services purchased or considered, subscription plan, gift card and
                  rewards activity, referral activity, and order history. Payment card details are
                  collected and processed by Stripe; we do not store full card numbers.
                </li>
                <li>
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                    Communications and project content:
                  </span>{" "}
                  messages you send us, booking details, creative briefs, files you upload, forms
                  you submit, survey responses, and messages you type into our AI chat.
                </li>
                <li>
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                    Internet activity and device data:
                  </span>{" "}
                  IP address, browser and device type, operating system, time zone, pages viewed,
                  referring URL, approximate city-level location derived from IP, general
                  interaction data, and error logs. This data is collected through analytics tools
                  only if you consent, plus basic security and server logs we always need to run
                  the site.
                </li>
                <li>
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                    Account and rewards data:
                  </span>{" "}
                  Zeal points balance, achievements, saved preferences, and loyalty program
                  participation.
                </li>
                <li>
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                    Sensitive information:
                  </span>{" "}
                  we do not intentionally collect social security numbers, driver&apos;s license
                  numbers, financial account numbers, health information, or precise geolocation.
                  Please do not submit that kind of information through forms or AI chat.
                </li>
              </ul>
            </section>

            <section>
              <h2 className={H2}>How We Collect Information</h2>
              <p>
                Directly from you when you fill out forms, book, purchase, subscribe, create an
                account, message us, or talk to the AI chat; automatically from your browser when
                you use the Site; from service providers such as Stripe, Printful, Cal.com, and
                our analytics vendors; and from public professional sources such as your public
                portfolio or social profile when you submit it as part of an inquiry.
              </p>
            </section>

            <section>
              <h2 className={H2}>How We Use Information</h2>
              <p className="mb-4">We use personal information to:</p>
              <ul className={LI}>
                <li>Provide, manage, and deliver the Services you book or buy.</li>
                <li>Process payments, fulfill merchandise orders, and issue refunds.</li>
                <li>Schedule sessions and manage bookings.</li>
                <li>Operate your account, rewards, and referral program.</li>
                <li>Respond to inquiries and send transactional messages such as confirmations, receipts, and project updates.</li>
                <li>Send marketing emails or show campaign measurement only where you have opted in; you can unsubscribe at any time.</li>
                <li>Understand how the Site is used, but only through analytics you consent to.</li>
                <li>Measure advertising performance and show relevant ads on other platforms, only if you consent to marketing cookies.</li>
                <li>Detect, prevent, and investigate fraud, abuse, security incidents, and legal violations.</li>
                <li>Debug, improve, and develop the Site and our Services.</li>
                <li>Comply with tax, accounting, and legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className={H2}>Cookies and Similar Technologies</h2>
              <p className="mb-4">
                We group the technologies we use into three categories. You choose non-essential
                categories through the cookie preference banner shown on your first visit (the
                banner is held back until you enter the site) and can change your choice at any
                time using the &quot;Cookie Preferences&quot; link in the Site footer. You can also
                clear stored data in your browser to reset your choice.
              </p>
              <ul className={LI}>
                <li>
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                    Necessary:
                  </span>{" "}
                  your consent choice, session and security data, shopping cart and checkout
                  state, and core site functionality. These are always on because the Site cannot
                  function without them.
                </li>
                <li>
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                    Analytics:
                  </span>{" "}
                  Google Tag Manager with Google Analytics, Microsoft Clarity, and Vercel Analytics
                  and Speed Insights, used to understand traffic and improve the Site. These load
                  only if you consent.
                </li>
                <li>
                  <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                    Marketing:
                  </span>{" "}
                  Meta Pixel and TikTok Analytics, used to measure and improve ad campaigns on
                  those platforms. These load only if you consent.
                </li>
              </ul>
              <p className="mt-4">
                No advertising or analytics cookies are set before you consent. Most browsers also
                let you block or delete cookies entirely, though parts of the Site may then work
                less well.
              </p>
            </section>

            <section>
              <h2 className={H2}>When and With Whom We Share Information</h2>
              <p className="mb-4">
                We do not sell your personal information for money. We share it only with the
                categories of service providers below, for the business purposes described in
                this policy, under contracts that limit their use of your information to
                providing the service:
              </p>
              <ul className={LI}>
                <li>Stripe for payment processing.</li>
                <li>Printful for merchandise printing and fulfillment.</li>
                <li>Cal.com for appointment scheduling.</li>
                <li>Vercel for hosting and delivery, Cloudinary for image delivery, and Supabase for our database and accounts.</li>
                <li>Resend for transactional and marketing email delivery.</li>
                <li>Sentry for error monitoring.</li>
                <li>OpenRouter for processing the messages you send to our AI chat so it can respond.</li>
                <li>Google (Analytics), Microsoft (Clarity), and Vercel (Analytics), if you consent to analytics.</li>
                <li>Meta and TikTok for ad measurement, if you consent to marketing.</li>
              </ul>
              <p className="mt-4 mb-4">
                We may also share information with professional advisors such as attorneys and
                accountants, when required by law or legal process, to protect rights and safety,
                or in connection with a merger, acquisition, or sale of assets, in which case we
                will require the recipient to honor this policy.
              </p>
              <p>
                Sharing for cross-context behavioral advertising happens only if you consent to
                marketing cookies. If you exercise your opt-out rights below, we will not share
                your information for those purposes. We honor the Global Privacy Control signal
                where required by law.
              </p>
            </section>

            <section>
              <h2 className={H2}>AI Features</h2>
              <p>
                Our AI chat and automated tools are powered by third-party providers that process
                the messages you send in order to generate responses. Those providers may store
                request data per their own privacy policies. Do not send confidential, sensitive,
                or regulated personal information through AI features. Automated responses are
                informational and are not professional advice.
              </p>
            </section>

            <section>
              <h2 className={H2}>Data Retention</h2>
              <p>
                We keep personal information only as long as needed for the purposes described in
                this policy. Booking and client records are generally retained for up to 7 years
                to meet tax and accounting requirements. Account and rewards data are kept while
                your account is active and for a reasonable period afterward. Marketing data is
                kept until you opt out. Analytics data is kept for up to 14 months. Security logs
                are kept for up to 12 months. When data is no longer needed, we delete it or
                de-identify it.
              </p>
            </section>

            <section>
              <h2 className={H2}>Data Security</h2>
              <p>
                We use administrative, technical, and organizational safeguards appropriate to the
                information we handle, including encryption in transit, access controls, and
                limiting internal access to what is needed to do the work. No method of
                transmission or storage is completely secure, so we cannot guarantee absolute
                security. If we learn of a breach affecting your personal information, we will
                notify you and regulators as required by law.
              </p>
            </section>

            <section>
              <h2 className={H2}>Your Privacy Rights</h2>
              <p className="mb-4">
                <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                  If you are a California resident
                </span>{" "}
                under the CCPA and CPRA, you have the right to:
              </p>
              <ul className={LI}>
                <li>Know the categories and specific pieces of personal information we collect, the sources, the business purposes, and the categories we share.</li>
                <li>Request deletion of your personal information, subject to legal exceptions.</li>
                <li>Request correction of inaccurate information.</li>
                <li>Request portability of your information in a portable format.</li>
                <li>Opt out of the sale or sharing of your personal information for cross-context behavioral advertising.</li>
                <li>Limit the use and disclosure of sensitive personal information.</li>
                <li>Withdraw consent where processing is based on consent, without affecting the lawfulness of prior processing.</li>
                <li>Not be discriminated against for exercising these rights, including not being denied goods or services, charged different prices, or given lower quality service, except where permitted for genuinely different value programs.</li>
              </ul>
              <p className="mt-4 mb-4">
                <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                  If you are in Colorado, Connecticut, Virginia, Utah, Texas, Oregon, Montana,
                  Delaware, or another U.S. state with a privacy law,
                </span>{" "}
                you have similar rights to access, delete, correct, and obtain a portable copy of
                your data, and to opt out of sale, targeted advertising, and certain profiling.
                Exercise them the same way.
              </p>
              <p className="mb-4">
                <span className="font-semibold text-[#333333] dark:text-[#e0e0e0]">
                  If you are in the EEA, UK, or Switzerland,
                </span>{" "}
                you have rights under the GDPR to access, rectify, erase, restrict, and object to
                processing, to data portability, and to withdraw consent, and you may lodge a
                complaint with your supervisory authority. We process personal data on the bases
                of performing a contract with you, your consent, our legitimate interests in
                operating and securing the business, and compliance with legal obligations. If you
                are outside the United States and we transfer your data to the United States, we
                use appropriate safeguards such as standard contractual clauses.
              </p>
              <p className="mb-4">
                We do not engage in decisions about people that produce legal or similarly
                significant effects through automated means.
              </p>
              <p>
                To submit a request, email{" "}
                <a href="mailto:info@wyzdesign.com" className={HREF}>
                  info@wyzdesign.com
                </a>{" "}
                with the subject &quot;Privacy Request&quot; and tell us what you want to do. You
                may use an authorized agent by giving them written permission and letting us verify
                them. We will respond within the timeframes required by law, generally within 45
                days, and we may ask you to verify your identity or account before acting. We will
                not use the information you send for verification for any other purpose. If we
                deny a request, you may appeal to us within 60 days and we will explain our
                decision.
              </p>
            </section>

            <section>
              <h2 className={H2}>Do Not Track and Global Privacy Control</h2>
              <p>
                There is no universal standard for Do Not Track signals, so we do not respond to
                them. Where required by law, we treat a valid Global Privacy Control signal sent
                by your browser as a request to opt out of sale and sharing for cross-context
                behavioral advertising, and as a rejection of marketing cookies.
              </p>
            </section>

            <section>
              <h2 className={H2}>Children</h2>
              <p>
                The Site and Services are not directed to children under 13, and we do not
                knowingly collect personal information from them. If you believe a child has
                provided us information, contact us and we will delete it.
              </p>
            </section>

            <section>
              <h2 className={H2}>Third-Party Links</h2>
              <p>
                The Site links to third-party sites and platforms, including social networks and
                scheduling, payment, and fulfillment providers. Their privacy practices are
                governed by their own policies, and we encourage you to read them.
              </p>
            </section>

            <section>
              <h2 className={H2}>Changes to This Policy</h2>
              <p>
                We may update this policy from time to time. The revised version will be posted on
                this page with a new effective date, and for material changes we will provide
                additional notice such as a banner or email where required by law.
              </p>
            </section>

            <section>
              <h2 className={H2}>Contact Us</h2>
              <p>
                For questions or to exercise any right in this policy, contact WYZ Design LLC at{" "}
                <a href="mailto:info@wyzdesign.com" className={HREF}>
                  info@wyzdesign.com
                </a>
                , at (213) 399-9610, or by mail at 1200 S. Wall St., Los Angeles, CA 90015.
                California residents may also contact the California Attorney General or the
                California Privacy Protection Agency with complaints.
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
