export default function RouteLoading({
  title,
  variant = "cards",
}: {
  title: string;
  variant?: "calendar" | "form" | "cards";
}) {
  return (
    <div
      className="min-h-screen bg-white dark:bg-[#1C1C1E] pt-20"
      aria-busy="true"
    >
      <div
        className="max-w-7xl mx-auto px-6 py-12"
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Loading {title}...</span>
        <div className="h-10 w-56 bg-gray-200 dark:bg-[#252528] rounded animate-pulse mb-8" />
        {variant === "calendar" && (
          <div className="h-96 w-full bg-gray-200 dark:bg-[#252528] rounded-lg animate-pulse" />
        )}
        {variant === "form" && (
          <div className="max-w-xl space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 w-full bg-gray-200 dark:bg-[#252528] rounded animate-pulse"
              />
            ))}
            <div className="h-12 w-40 bg-gray-200 dark:bg-[#252528] rounded animate-pulse" />
          </div>
        )}
        {variant === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 dark:bg-[#252528] rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
