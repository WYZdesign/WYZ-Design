"use client";

import RouteErrorState from "@/components/RouteErrorState";

export default function BookingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorState title="Booking" error={error} reset={reset} />;
}
