"use client";

import DynamicForm, { type FormField } from "@/components/DynamicForm";

type Props = {
  title?: string;
  subtitle?: string;
  services: string[];
  formType: string;
  submitLabel?: string;
};

/**
 * Adaptive inquiry form: one component, one backend form type, with a service
 * select populated by the page. Every service on the site can point at the same
 * endpoint instead of shipping a bespoke form per offering.
 */
export default function ServiceForm({
  title = "Start a Project",
  subtitle = "Tell us what you need and we will come back with a clear plan and a price.",
  services,
  formType,
  submitLabel = "SEND REQUEST",
}: Props) {
  const fields: FormField[] = [
    {
      name: "service",
      label: "What do you need?",
      type: "select",
      required: true,
      options: services.map((s) => ({ value: s, label: s })),
    },
    { name: "name", label: "Name", type: "text", required: true, placeholder: "Your name", halfWidth: true },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "you@email.com", halfWidth: true },
    { name: "phone", label: "Phone", type: "tel", placeholder: "(optional)", halfWidth: true },
    {
      name: "timeline",
      label: "Timeline",
      type: "select",
      halfWidth: true,
      options: [
        { value: "asap", label: "As soon as possible" },
        { value: "2-weeks", label: "Within 2 weeks" },
        { value: "1-month", label: "Within a month" },
        { value: "flexible", label: "Flexible" },
      ],
    },
    { name: "budget", label: "Budget", type: "text", placeholder: "A range is fine", halfWidth: true },
    { name: "details", label: "Project details", type: "textarea", required: true, placeholder: "What are you making, who is it for, and when do you need it?" },
  ];

  return (
    <section className="section-gap bg-white dark:bg-[#1C1C1E]">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-heading font-black text-[#333] dark:text-white tracking-[0.08em] uppercase text-center mb-4">
          {title}
        </h2>
        <p className="text-[#666] dark:text-[#b0b0b0] text-center mb-8 max-w-xl mx-auto">{subtitle}</p>
        <div className="border border-[#E2E2E2] dark:border-[#444] rounded-2xl p-6 sm:p-8">
          <DynamicForm fields={fields} formType={formType} submitLabel={submitLabel} />
        </div>
      </div>
    </section>
  );
}
