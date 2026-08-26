"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

interface NsfwSessionState {
  /** Whether the user is authenticated. */
  authenticated: boolean;
  /** Whether the user has confirmed 18+ age verification. */
  ageVerified: boolean;
  /** Loading state while checking. */
  loading: boolean;
  /** Show the age gate modal. */
  showModal: boolean;
  /** Request age verification (opens modal). */
  requestVerification: () => void;
  /** Close the modal. */
  closeModal: () => void;
  /** Callback after successful verification. */
  onVerified: () => void;
}

/**
 * Hook that manages NSFW age verification state for the current user.
 * Checks Redis-backed age verification via API, shows modal when needed.
 */
export function useNsfwSession(): NsfwSessionState {
  const { data: session, status } = useSession();
  const [ageVerified, setAgeVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const checkedRef = useRef(false);

  const authenticated = status === "authenticated";

  // Check age verification status when session loads
  useEffect(() => {
    if (status === "loading") return;
    if (!authenticated) {
      setLoading(false);
      return;
    }
    if (checkedRef.current) return;
    checkedRef.current = true;

    const checkAge = async () => {
      try {
        const res = await fetch("/api/nsfw/verify");
        if (res.ok) {
          const data = await res.json();
          setAgeVerified(data.verified === true);
        }
      } catch {
        setAgeVerified(false);
      } finally {
        setLoading(false);
      }
    };
    void checkAge();
  }, [authenticated, status]);

  const requestVerification = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const onVerified = useCallback(() => {
    setAgeVerified(true);
    setShowModal(false);
  }, []);

  return {
    authenticated,
    ageVerified,
    loading,
    showModal,
    requestVerification,
    closeModal,
    onVerified,
  };
}
