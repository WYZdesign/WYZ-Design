"use client";

import RouteErrorState from "@/components/RouteErrorState";

export default function ContactError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorState title="Contact" error={error} reset={reset} />;
}
