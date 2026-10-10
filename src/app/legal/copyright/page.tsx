import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copyright Notice",
  description:
    "WYZ Design LLC copyright notice. Ownership of site content, trademarks, permitted use, DMCA takedown and counter-notification, repeat infringer policy, and model and property releases.",
  robots: { index: true, follow: true },
};

const H2 =
  "text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-4";
const BODY = "space-y-8 text-[#666665] dark:text-[#b0b0b0] leading-relaxed";
const HREF = "text-[#DF3131] hover:underline";

export default function CopyrightNotice() {
  return (
    <>
      <main data-legal className="min-h-screen bg-white dark:bg-[#111] pb-20">
        <div className="max-w-4xl mx-auto px-6 pt-28">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-heading font-bold tracking-[0.15em] uppercase text-[#333333] dark:text-[#e0e0e0] mb-6 sm:mb-8">
            Copyright Notice
          </h1>
          <div className={BODY}>
            <p>
              Effective date: October 9, 2026. All content on wyzdesign.com is the property of
              WYZ Design LLC (&quot;WYZ Design,&quot; &quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;) or its content suppliers and is protected by United States and
              international copyright, trademark, and other intellectual property laws. This
              notice explains what you may and may not do with that content, and how to report
              infringement.
            </p>

            <section>
              <h2 className={H2}>Ownership</h2>
              <p>
                All content on this website, including but not limited to text, graphics, logos,
                images, designs, videos, audio, software, the site code itself, and the selection
                and arrangement of content, is the property of WYZ Design or its content
                suppliers and is protected by United States and international copyright laws.
              </p>
            </section>

            <section>
              <h2 className={H2}>Portfolio and Display</h2>
              <p>
                The designs, photographs, and creative works displayed on this website are the
                work product of WYZ Design. Client work is displayed with permission. Portfolio
                images may not be reproduced, copied, or used in any manner without express
                written consent from WYZ Design and, where applicable, the respective client and
                the people depicted in the images.
              </p>
            </section>

            <section>
              <h2 className={H2}>Permitted Use</h2>
              <p>
                You may view and download a single copy of content from this website for personal,
                non-commercial use only, provided you keep all copyright and proprietary notices
                intact. Any other use, including reproduction, modification, distribution,
                transmission, republication, resale, or display, is strictly prohibited without
                prior written permission from WYZ Design. You may not use content from this site
                to train machine learning models, build a competing service, or create derivative
                works for commercial distribution without written permission.
              </p>
            </section>

            <section>
              <h2 className={H2}>Trademarks</h2>
              <p>
                WYZ Design, the WYZ crown logo, and related names, logos, slogans, and taglines
                are trademarks of WYZ Design LLC. You may not use any WYZ Design trademark in a
                way that suggests endorsement, affiliation, or sponsorship without our written
                permission. All other trademarks on this site belong to their respective owners
                and are used for identification purposes.
              </p>
            </section>

            <section>
              <h2 className={H2}>Third-Party Materials</h2>
              <p>
                Some content on this site, including fonts, stock imagery, music, and open-source
                software, is licensed from or belongs to third parties and is used in accordance
                with those licenses. Those materials remain the property of their respective
                owners and are subject to the license terms that accompany them.
              </p>
            </section>

            <section>
              <h2 className={H2}>Model and Property Releases</h2>
              <p>
                Images of identifiable people on this site are displayed with the consent of the
                individuals or their representatives. If you believe an image of you appears on
                this site without your consent, contact us at{" "}
                <a href="mailto:info@wyzdesign.com" className={HREF}>
                  info@wyzdesign.com
                </a>{" "}
                and we will review and remove it promptly.
              </p>
            </section>

            <section>
              <h2 className={H2}>DMCA Takedown Notices</h2>
              <p className="mb-4">
                If you believe content on this site infringes your copyright, send a written
                notice to our designated DMCA agent at{" "}
                <a href="mailto:info@wyzdesign.com" className={HREF}>
                  info@wyzdesign.com
                </a>{" "}
                with the subject line &quot;DMCA Notice,&quot; including all of the following:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  A physical or electronic signature of the copyright owner or a person
                  authorized to act on their behalf.
                </li>
                <li>
                  Identification of the copyrighted work claimed to have been infringed, and if
                  multiple works, a representative list.
                </li>
                <li>
                  Identification of the material that is claimed to be infringing, with
                  information reasonably sufficient for us to locate it, such as the URL.
                </li>
                <li>
                  Your contact information, including your name, mailing address, phone number,
                  and email address.
                </li>
                <li>
                  A statement that you have a good faith belief that use of the material in the
                  manner complained of is not authorized by the copyright owner, its agent, or the
                  law.
                </li>
                <li>
                  A statement that the information in the notice is accurate, and under penalty of
                  perjury, that you are authorized to act on behalf of the owner of an exclusive
                  right that is allegedly infringed.
                </li>
              </ol>
              <p className="mt-4">
                We will respond to complete notices as required by the Digital Millennium
                Copyright Act, including removing or disabling access to the identified material.
                Please note that knowingly making a material misrepresentation in a DMCA notice
                or counter-notification may expose you to liability for damages, including costs
                and attorneys fees, under 17 U.S.C. Section 512(f).
              </p>
            </section>

            <section>
              <h2 className={H2}>Counter-Notification</h2>
              <p className="mb-4">
                If your content was removed as a result of a DMCA notice and you believe the
                removal was a mistake or misidentification, you may send a counter-notification to
                the same email address with the subject line &quot;DMCA Counter-Notification,&quot;
                including:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Your physical or electronic signature.</li>
                <li>
                  Identification of the material that was removed and the location where it
                  appeared before removal.
                </li>
                <li>
                  A statement under penalty of perjury that you have a good faith belief the
                  material was removed as a result of mistake or misidentification.
                </li>
                <li>
                  Your name, address, and phone number, and a statement that you consent to the
                  jurisdiction of the federal court in your district, or if outside the United
                  States, of any judicial district in which we may be found, and that you will
                  accept service of process from the person who filed the original notice.
                </li>
              </ol>
              <p className="mt-4">
                If we receive a valid counter-notification, we will forward it to the original
                complainant, and the material may be restored within 10 to 14 business days unless
                the complainant informs us that they have filed a court action.
              </p>
            </section>

            <section>
              <h2 className={H2}>Repeat Infringers</h2>
              <p>
                In appropriate circumstances, we will terminate the accounts or access of users
                who are found to be repeat infringers, consistent with the requirements of the
                Digital Millennium Copyright Act.
              </p>
            </section>

            <section>
              <h2 className={H2}>Reporting Other Concerns</h2>
              <p>
                To report trademark infringement, privacy concerns, or other unlawful content on
                this site, email{" "}
                <a href="mailto:info@wyzdesign.com" className={HREF}>
                  info@wyzdesign.com
                </a>{" "}
                with a description of the material and its location, and your contact information.
                We take all reports seriously and will respond promptly.
              </p>
            </section>

            <section>
              <h2 className={H2}>Contact</h2>
              <p className="mb-2 font-semibold text-[#333333] dark:text-[#e0e0e0]">
                WYZ Design LLC
              </p>
              <p>1200 S. Wall St., Los Angeles, CA 90015</p>
              <p>
                <a href="mailto:info@wyzdesign.com" className={HREF}>
                  info@wyzdesign.com
                </a>
              </p>
              <p>
                <a href="tel:2133999610" className={HREF}>
                  (213) 399-9610
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
