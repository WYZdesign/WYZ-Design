"use client";

import { FiShare2, FiTwitter, FiFacebook, FiLinkedin, FiLink, FiCheck } from "react-icons/fi";
import { useState } from "react";
import { useZeal } from "@/components/ZealProvider";

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
}

export default function SocialShare({ title, url, description }: SocialShareProps) {
  const { earn } = useZeal();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      let ok = false;
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
      if (!ok) {
        setCopyFailed(true);
        setTimeout(() => setCopyFailed(false), 2000);
        return;
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1.5 text-[13px] text-[#666] dark:text-[#e0e0e0]">
        <FiShare2 className="w-3.5 h-3.5" /> Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => void earn("share-social")}
        className="min-w-[44px] min-h-[44px] w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F3] dark:bg-[#252528] text-[#666] dark:text-[#e0e0e0] hover:bg-[#1DA1F2] hover:text-white transition-all"
        aria-label="Share on X"
      >
        <FiTwitter className="w-3.5 h-3.5" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => void earn("share-social")}
        className="min-w-[44px] min-h-[44px] w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F3] dark:bg-[#252528] text-[#666] dark:text-[#e0e0e0] hover:bg-[#1877F2] hover:text-white transition-all"
        aria-label="Share on Facebook"
      >
        <FiFacebook className="w-3.5 h-3.5" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDesc}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => void earn("share-social")}
        className="min-w-[44px] min-h-[44px] w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F3] dark:bg-[#252528] text-[#666] dark:text-[#e0e0e0] hover:bg-[#0A66C2] hover:text-white transition-all"
        aria-label="Share on LinkedIn"
      >
        <FiLinkedin className="w-3.5 h-3.5" />
      </a>
      <button
        onClick={() => { void earn("share-social"); copyLink(); }}
        className="min-w-[44px] min-h-[44px] w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F3] dark:bg-[#252528] text-[#666] dark:text-[#e0e0e0] hover:bg-[#DF3131] hover:text-white transition-all"
        aria-label={copyFailed ? "Copy failed — try again" : copied ? "Link copied" : "Copy link"}
      >
        {copied ? <FiCheck className="w-3.5 h-3.5" /> : <FiLink className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
