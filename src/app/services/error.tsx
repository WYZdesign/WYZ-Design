"use client";

import RouteErrorState from "@/components/RouteErrorState";

export default function ServicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorState title="Services" error={error} reset={reset} />;
}
