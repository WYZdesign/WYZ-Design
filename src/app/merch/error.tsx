"use client";

import RouteErrorState from "@/components/RouteErrorState";

export default function MerchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorState title="Merch" error={error} reset={reset} />;
}
