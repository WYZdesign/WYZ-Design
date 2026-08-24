"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiArrowRight, FiCheck } from "react-icons/fi";

export default function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Subscription failed");
      toast.success("You're on the list!");
      setDone(true);
    } catch {
      toast.error("Something went wrong. Try again.");
    }
  };

  if (done) {
    return (
      <section className="py-12 bg-[#DF3131]">
        <div className="max-w-2xl mx-auto px-6 text-center text-white">
          <FiCheck className="w-10 h-10 mx-auto mb-3" />
          <h3 className="text-2xl font-heading font-bold mb-2">You're on the list</h3>
          <p className="text-white/80 text-sm">Check your inbox for your free brand audit guide.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-[#DF3131]">
      <div className="max-w-2xl mx-auto px-6 text-center text-white">
        <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2">Free Brand Audit Guide</h3>
        <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
          7 questions to diagnose what your brand is missing, plus what to do about it.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="flex-1 px-4 py-3 text-sm text-zinc-900 bg-white rounded-lg outline-none"
          />
          <button type="submit" className="px-4 py-3 bg-zinc-900 hover:bg-black text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-1">
            Send <FiArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
}
