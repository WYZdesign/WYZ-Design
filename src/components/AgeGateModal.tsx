"use client";

import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { FiX, FiAlertTriangle, FiLock } from "react-icons/fi";

interface AgeGateModalProps {
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
  categoryLabel?: string;
}

/**
 * 18+ age verification modal shown when accessing NSFW content.
 * Requires explicit confirmation + login. Records verification in Redis
 * via the /api/nsfw/verify endpoint.
 */
export default function AgeGateModal({ open, onClose, onVerified, categoryLabel }: AgeGateModalProps) {
  const [step, setStep] = useState<"confirm" | "login">("confirm");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirmAge = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/nsfw/verify", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.verified) {
          onVerified();
          setStep("confirm");
          return;
        }
      }
      // Not authenticated yet, go to login step
      setStep("login");
    } catch {
      setStep("login");
    } finally {
      setLoading(false);
    }
  }, [onVerified]);

  const handleLogin = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Sign in with Google (primary method)
      const result = await signIn("google", { redirect: false });
      if (result?.error) {
        setError("Login failed. Please try again.");
      } else {
        // After login, record age verification
        const res = await fetch("/api/nsfw/verify", { method: "POST" });
        if (res.ok) {
          onVerified();
          setStep("confirm");
        }
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [onVerified]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      style={{ animation: "wzFadeIn 0.2s ease-out both" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Age verification required"
    >
      <div
        className="bg-[#1a1a1a] border border-white/10 max-w-md w-full p-8 relative"
        style={{ animation: "wzScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          aria-label="Close"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#DF3131]/10 flex items-center justify-center">
            <FiAlertTriangle className="w-7 h-7 text-[#DF3131]" />
          </div>
          <p className="text-[#DF3131] text-[11px] font-heading font-bold tracking-[0.3em] uppercase mb-3">
            18+ Content
          </p>
          <h2 className="text-white font-heading font-black text-[1.25rem] tracking-[0.03em] mb-3">
            {step === "confirm"
              ? "Age Verification Required"
              : "Sign In Required"}
          </h2>
          <p className="text-white/50 text-[14px] leading-relaxed">
            {step === "confirm" ? (
              <>
                This section contains adult content
                {categoryLabel ? ` (${categoryLabel})` : ""} that is not suitable for minors.
                You must be <strong className="text-white/80">18 years or older</strong> to view it.
              </>
            ) : (
              <>
                Please sign in to confirm you are 18 or older
                {categoryLabel ? ` and view ${categoryLabel} content` : ""}.
              </>
            )}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#DF3131]/10 border border-[#DF3131]/20 text-[#DF3131] text-[13px] text-center">
            {error}
          </div>
        )}

        {step === "confirm" ? (
          <div className="space-y-3">
            <button
              onClick={handleConfirmAge}
              disabled={loading}
              className="w-full py-3.5 bg-[#DF3131] text-white font-heading font-bold text-[13px] tracking-[0.1em] uppercase hover:bg-[#B82020] transition-all disabled:opacity-50"
            >
              {loading ? "VERIFYING..." : "YES, I AM 18+ - CONTINUE"}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 border border-white/10 text-white/40 font-heading font-bold text-[12px] tracking-[0.1em] uppercase hover:text-white/60 hover:border-white/20 transition-all"
            >
              GO BACK
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 bg-[#DF3131] text-white font-heading font-bold text-[13px] tracking-[0.1em] uppercase hover:bg-[#B82020] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiLock className="w-4 h-4" />
              {loading ? "SIGNING IN..." : "SIGN IN WITH GOOGLE"}
            </button>
            <button
              onClick={() => { setStep("confirm"); setError(""); }}
              className="w-full py-3 border border-white/10 text-white/40 font-heading font-bold text-[12px] tracking-[0.1em] uppercase hover:text-white/60 hover:border-white/20 transition-all"
            >
              BACK
            </button>
          </div>
        )}

        <p className="text-white/20 text-[11px] text-center mt-6 leading-relaxed">
          By continuing you confirm you are at least 18 years old and wish to view adult content.
          Verification is stored for 30 days.
        </p>
      </div>
    </div>
  );
}
