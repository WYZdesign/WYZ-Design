"use client";

import RouteErrorState from "@/components/RouteErrorState";

export default function PlansError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorState title="Plans" error={error} reset={reset} />;
}
