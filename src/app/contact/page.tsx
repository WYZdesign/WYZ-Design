"use client";
import ScrollReveal from "@/components/ScrollReveal";
import DynamicForm from "@/components/DynamicForm";
import TextMaskReveal from "@/components/TextMaskReveal";
import ParticleBackground from "@/components/ParticleBackground";

const CONTACT_FIELDS = [
  { name: "name", label: "NAME", type: "text" as const, placeholder: "Your name" },
  { name: "email", label: "EMAIL", type: "email" as const, required: true, placeholder: "you@example.com" },
  { name: "message", label: "MESSAGE", type: "textarea" as const, required: true, placeholder: "Tell us about your project or question..." },
];

export default function ContactPage() {
  return (
    <main className="pb-10 sm:pb-16 lg:pb-20 bg-white dark:bg-[#1C1C1E] min-h-screen">
      <ScrollReveal animation="fadeUp">
        <div className="relative max-w-2xl mx-auto px-6">
          <ParticleBackground count={15} color="#DF3131" maxSize={2} speed={0.2} className="z-0 opacity-40" />
          <div className="relative z-10">
          <TextMaskReveal direction="up">
          <h1 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.08em] text-center mb-6 sm:mb-8" style={{ lineHeight: 0 }}>CONTACT US</h1>
          </TextMaskReveal>
          </div>
          <p className="text-[#666] dark:text-[#999] text-center mb-10 text-[15px] leading-relaxed">
            Have a question, project idea, or just want to say hello? Drop us a message and we&apos;ll get back to you within 24 hours.
          </p>

          <DynamicForm
            fields={CONTACT_FIELDS}
            formType="contact"
            endpoint="/api/forms"
            submitLabel="SEND MESSAGE"
            className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] p-4 sm:p-6 lg:p-8"
          />

          <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="p-6 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333]">
              <p className="text-[13px] font-bold tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] mb-2">EMAIL</p>
              <a href="mailto:info@wyzdesign.com" className="text-[#DF3131] text-[14px] hover:underline">info@wyzdesign.com</a>
            </div>
            <div className="p-6 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333]">
              <p className="text-[13px] font-bold tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] mb-2">PHONE</p>
              <a href="tel:+12133999610" className="text-[#DF3131] text-[14px] hover:underline">(213) 399-9610</a>
            </div>
            <div className="p-6 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333]">
              <p className="text-[13px] font-bold tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] mb-2">LOCATION</p>
              <p className="text-[#666] dark:text-[#999] text-[14px]">Chicago + Los Angeles</p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
