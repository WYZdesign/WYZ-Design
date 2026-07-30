"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-2xl font-bold text-[#333] mb-4">
          Admin Error
        </h1>
        <p className="text-gray-600 mb-6">
          {error.message || "An error occurred in the admin panel."}
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#DF3131] text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
