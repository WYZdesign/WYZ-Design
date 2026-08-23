"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { sanitizeHtml } from "@/lib/dompurify";

export default function ViewPage() {
  const params = useParams();
  const pageName = (params?.page as string) || "home";
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/pages?page=${pageName}`)
      .then(r => r.json())
      .then(d => {
        setHtml(d.exists ? d.html : `<h1 style="text-align:center;padding:100px">Page not found</h1>`);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pageName]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
      <div className="fixed bottom-4 right-4 z-50">
        <Link href="/" className="px-4 py-2.5 bg-[#DF3131] text-white text-sm font-semibold rounded-lg shadow-lg hover:bg-[#B82020]">
          ← Back to Home
        </Link>
      </div>
      <div className="fixed bottom-4 left-4 z-50">
        <Link href="/" className="px-4 py-2.5 bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-lg hover:bg-gray-700">
          ← Home
        </Link>
      </div>
    </div>
  );
}
