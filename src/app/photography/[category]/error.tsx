"use client";

import { useEffect } from "react";
import { trackError } from "@/lib/errorTracker";

export default function PhotographyCategoryError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { trackError(error, "photography/[category]"); }, [error]);
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-zinc-400 text-lg font-semibold mb-2">Category unavailable</h1>
        <p className="text-zinc-600 text-sm mb-4">This photography category could not be loaded.</p>
        <button onClick={reset} className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">Try again</button>
      </div>
    </div>
  );
}
