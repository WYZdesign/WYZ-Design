"use client";

import { useState } from "react";

export type FieldType = "text" | "email" | "tel" | "select" | "textarea" | "date" | "checkbox" | "number";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  halfWidth?: boolean;
}

export interface DynamicFormProps {
  fields: FormField[];
  formType: string;
  endpoint?: string;
  submitLabel?: string;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
  className?: string;
  initialData?: Record<string, string>;
}

export default function DynamicForm({
  fields,
  formType,
  endpoint = "/api/forms",
  submitLabel = "SUBMIT",
  onSuccess,
  onError,
  className = "",
  initialData = {},
}: DynamicFormProps) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach((f) => { init[f.name] = initialData[f.name] || ""; });
    return init;
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const update = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = fields.filter((f) => f.required);
    for (const f of required) {
      if (!form[f.name]?.trim()) {
        setErrorMsg(`${f.label} is required`);
        return;
      }
    }
    const emailField = fields.find((f) => f.type === "email");
    if (emailField && form[emailField.name]?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form[emailField.name].trim())) {
        setErrorMsg("Please enter a valid email address");
        return;
      }
    }
    const telField = fields.find((f) => f.type === "tel");
    if (telField && form[telField.name]?.trim()) {
      const phoneRegex = /^[\d\s\-\+\(\)\.]{7,}$/;
      if (!phoneRegex.test(form[telField.name].trim())) {
        setErrorMsg("Please enter a valid phone number");
        return;
      }
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType, data: form }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
      onSuccess?.();
    } catch (err: any) {
      const msg = err.message || "Something went wrong";
      setErrorMsg(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-14 h-14 bg-[#DF3131] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-[18px] font-heading font-bold text-[#333] dark:text-[#e0e0e0] mb-2">Submitted!</h3>
        <p className="text-[15px] text-[#666] dark:text-[#999]">We&apos;ll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => {
          const inputClasses = "w-full px-4 py-3 border border-[#E2E2E2] dark:border-[#555] text-[14px] placeholder:text-[#8F8F8F] text-[#333] dark:text-white dark:bg-[#252528] focus:border-[#DF3131] focus:ring-1 focus:ring-[#DF3131]/20 outline-none transition-all";
          const wrapperClass = field.halfWidth ? "" : "sm:col-span-2";

          return (
            <div key={field.name} className={wrapperClass}>
              <label htmlFor={field.name} className="block text-[13px] font-heading font-semibold tracking-[0.08em] uppercase text-[#333] dark:text-[#e0e0e0] mb-2">
                {field.label}{field.required && " *"}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  value={form[field.name] || ""}
                  onChange={(e) => update(field.name, e.target.value)}
                  required={field.required}
                  rows={4}
                  placeholder={field.placeholder}
                  className={`${inputClasses} resize-none`}
                />
              ) : field.type === "select" ? (
                <select
                  value={form[field.name] || ""}
                  onChange={(e) => update(field.name, e.target.value)}
                  required={field.required}
                  className={inputClasses}
                >
                  <option value="">{field.placeholder || "Select..."}</option>
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[field.name] === "true"}
                    onChange={(e) => update(field.name, e.target.checked ? "true" : "")}
                    className="w-4 h-4 accent-[#DF3131] cursor-pointer"
                  />
                  <span className="text-[13px] text-[#666]">{field.label}</span>
                </label>
              ) : (
                <input
                  type={field.type}
                  value={form[field.name] || ""}
                  onChange={(e) => update(field.name, e.target.value)}
                  required={field.required}
                  placeholder={field.placeholder}
                  className={inputClasses}
                />
              )}
            </div>
          );
        })}
      </div>

      {errorMsg && <p className="text-[#DF3131] text-[13px] mt-3">{errorMsg}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full py-3.5 bg-[#DF3131] text-white font-heading font-bold text-sm tracking-[0.1em] uppercase hover:bg-[#B82020] transition-all disabled:opacity-50"
      >
        {loading ? "SENDING..." : submitLabel}
      </button>
    </form>
  );
}
