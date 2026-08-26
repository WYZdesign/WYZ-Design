"use client";

import { useEffect } from "react";
import { trackError } from "@/lib/errorTracker";

export default function ViewPageError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { trackError(error, "view/[page]"); }, [error]);
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-zinc-400 text-lg font-semibold mb-2">Page failed to load</h1>
        <p className="text-zinc-600 text-sm mb-4">The requested content could not be rendered.</p>
        <button onClick={reset} className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">Try again</button>
      </div>
    </div>
  );
}
