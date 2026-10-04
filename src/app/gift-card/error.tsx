"use client";

import RouteErrorState from "@/components/RouteErrorState";

export default function GiftCardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorState title="Gift Card" error={error} reset={reset} />;
}
