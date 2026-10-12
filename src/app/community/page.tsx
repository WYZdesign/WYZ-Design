"use client";

import toast from "react-hot-toast";
import { logger } from "@/lib/logger";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";
import {
  FiUsers, FiInstagram, FiMail, FiExternalLink, FiCalendar, FiAward,
  FiZap, FiMessageCircle, FiPlus, FiTrendingUp, FiHash, FiThumbsUp,
  FiCornerDownRight, FiStar, FiImage, FiFilm, FiSmile, FiShare2,
  FiChevronUp, FiChevronDown, FiEye, FiSend, FiMessageSquare,
  FiX,
} from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";
import { useZeal } from "@/components/ZealProvider";

import { CATEGORIES, DISCORD_CHANNELS, DISCORD_INVITE, FLAIRS, NEWS_POSTS, SEED_THREADS, UPCOMING_EVENTS } from "@/lib/data/community";
const COMMUNITY_HIGHLIGHTS = [
  {
    name: "Weekly Creative Challenge",
    short: "Theme drops every Monday. Best work featured across all WYZ platforms.",
    details: [
      "Every Monday we drop a creative theme, could be a color palette, a concept word, a photo technique, or a design constraint.",
      "You have until Sunday to create something. Post it in Discord with the challenge tag.",
      "Top 3 works get featured on WYZ Instagram (2K+ followers), the website gallery, and our newsletter.",
      "Judged by community vote. No gatekeeping, just raw creativity from anyone who wants to participate.",
    ],
    icon: <FiZap className="w-5 h-5" />,
    color: "#DF3131",
  },
  {
    name: "Portfolio Reviews",
    short: "Post your work in Discord. Get honest critique from working creatives.",
    details: [
      "Drop your portfolio link or work-in-progress in the #portfolio-review channel.",
      "Get detailed feedback from photographers, designers, and brand strategists who do this for a living.",
      "Reviews happen live in voice chat every Thursday at 7PM CT. Listen in or join the mic.",
      "Not a roast session, constructive critique focused on making your work stronger and more hireable.",
    ],
    icon: <FiAward className="w-5 h-5" />,
    color: "#C9A227",
  },
  {
    name: "Event Meetups",
    short: "Monthly IRL and virtual hangouts. Network with photographers, designers, and musicians.",
    details: [
      "First Friday of every month: virtual hangout on Discord voice. Second Saturday: IRL meetup at rotating locations in Chicago and LA.",
      "Past meetups: gallery walks, rooftop shoots, studio takeovers, DIY show collaborations.",
      "Not just networking, these are where real friendships and collabs form. Many WYZ event partnerships started at meetups.",
      "Zero cost to attend. Just show up. Virtual sessions are recorded for members who can't make it live.",
    ],
    icon: <FiCalendar className="w-5 h-5" />,
    color: "#333333",
  },
];

type NewsPost = (typeof NEWS_POSTS)[number];

type FeedPost = NewsPost & {
  liked: boolean;
  showComments: boolean;
  commentText: string;
  commentList: { author: string; avatar: string; time: string; body: string }[];
};

type Thread = (typeof SEED_THREADS)[number] & { voted: "up" | "down" | null };

export default function ForumPage() {
  const { earn } = useZeal();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState<string>("all");
  const [sortTab, setSortTab] = useState<"hot" | "new" | "top">("hot");
  const [threads, setThreads] = useState<Thread[]>(
    SEED_THREADS.map((t) => ({ ...t, voted: null }))
  );
  const [openThread, setOpenThread] = useState<number | null>(null);
  const [composer, setComposer] = useState({ title: "", body: "", category: "general" });
  const [composerError, setComposerError] = useState("");
  const [replyBox, setReplyBox] = useState<{ id: number; text: string } | null>(null);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(
    NEWS_POSTS.map((p) => ({
      ...p,
      liked: false,
      showComments: false,
      commentText: "",
      commentList: [],
    }))
  );

  const [nsfwVerified, setNsfwVerified] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [visibleThreadCount, setVisibleThreadCount] = useState(3);

  useEffect(() => {
    try {
      setNsfwVerified(localStorage.getItem("nsfwAgeVerified") === "1");
    } catch {}
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Subscription failed. Please try again.");
        return;
      }
      setSubscribed(true);
      setEmail("");
    } catch (e) { logger.warn("community-page", `Newsletter subscribe failed: ${e}`); toast.error("Subscription failed. Please try again."); }
  };

  const handleNsfwClick = () => {
    if (!session) {
      setShowAgeGate(true);
      return;
    }
    if (nsfwVerified) {
      setActiveCat("nsfw");
    } else {
      setShowAgeGate(true);
    }
  };

  const confirmAge = () => {
    if (!session) {
      signIn(undefined, { callbackUrl: "/community" });
      return;
    }
    try { localStorage.setItem("nsfwAgeVerified", "1"); } catch {}
    setNsfwVerified(true);
    setShowAgeGate(false);
    setActiveCat("nsfw");
  };

  const toggleFeedLike = (id: number) => {
    setFeedPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const toggleFeedComments = (id: number) => {
    setFeedPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, showComments: !p.showComments } : p))
    );
  };

  const postFeedComment = (id: number) => {
    const target = feedPosts.find((p) => p.id === id);
    if (!target || !target.commentText.trim()) return;
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id || !p.commentText.trim()) return p;
        return {
          ...p,
          commentList: [
            ...p.commentList,
            { author: "you", avatar: "#333333", time: "now", body: p.commentText.trim() },
          ],
          commentText: "",
          comments: p.comments + 1,
        };
      })
    );
    void earn("community-comment");
  };

  const postThread = () => {
    if (!composer.title.trim() || !composer.body.trim()) { setComposerError("Title and body are both required."); return; }
    setComposerError("");
    const newThread: Thread = {
      id: Date.now(),
      category: composer.category,
      title: composer.title.trim(),
      author: "you",
      avatar: "#333333",
      time: "now",
      body: composer.body.trim(),
      likes: 0,
      views: 1,
      replies: [],
      voted: null,
    };
    setThreads([newThread, ...threads]);
    setComposer({ title: "", body: "", category: "general" });
  };

  const postReply = (id: number) => {
    if (!replyBox || !replyBox.text.trim()) return;
    setThreads(
      threads.map((t) =>
        t.id === id
          ? {
              ...t,
              replies: [
                ...t.replies,
                { author: "you", avatar: "#333333", time: "now", body: replyBox.text.trim() },
              ],
            }
          : t
      )
    );
    setReplyBox(null);
    void earn("community-comment");
  };

  const voteThread = (id: number, dir: "up" | "down") => {
    setThreads(
      threads.map((t) => {
        if (t.id !== id) return t;
        const wasUp = t.voted === "up";
        const wasDown = t.voted === "down";
        let delta = 0;
        if (dir === "up") {
          delta = wasUp ? -1 : wasDown ? 2 : 1;
        } else {
          delta = wasDown ? -1 : wasUp ? -2 : 1;
        }
        return {
          ...t,
          likes: t.likes + delta,
          voted: t.voted === dir ? null : dir,
        };
      })
    );
  };

  const sortedThreads = [...threads].sort((a, b) => {
    if (sortTab === "top") return b.likes - a.likes;
    if (sortTab === "new") return b.id - a.id;
    const aHot = a.likes * 1.5 + a.replies.length * 2;
    const bHot = b.likes * 1.5 + b.replies.length * 2;
    return bHot - aHot;
  });

  const visibleThreads =
    activeCat === "all" ? sortedThreads : sortedThreads.filter((t) => t.category === activeCat);

  return (
    <main className="pb-20 bg-white dark:bg-[#1C1C1E] min-h-screen">
      <div className="bg-[#DF3131]/10 border-b-2 border-[#DF3131] px-6 py-3 text-center">
        <p className="text-[13px] font-heading font-bold tracking-[0.1em] uppercase text-[#DF3131]">Community Preview</p>
        <p className="text-[12px] text-[#666] dark:text-[#b0b0b0] mt-0.5">Votes, posts, and threads live on <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer" className="text-[#C41C1C] underline">Discord</a> - this page is a demo with local state only.</p>
      </div>
      <ScrollReveal animation="fadeUp">
        <div className="max-w-6xl mx-auto px-6 pt-32 lg:pt-40">
          <h1 className="wz-stack text-[2.25rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.08em] text-center mb-6 sm:mb-8" style={{ lineHeight: 0.9 }}>COMMUNITY</h1>
          <p className="text-[#666] dark:text-[#b0b0b0] text-center mb-8 text-[16px]">Connect with creators, share your work, and grow with the WYZ community.</p>

          {/* Stats strip. 2026-10-10 (Claude, full-site audit): at this grid's
              narrowest (3 cols, 390px and below), p-5 left too little width
              per cell for the single unbreakable word "Programs" at the
              original text-[11px]/tracking-[0.12em] -- it rendered past its
              own cell border and off the right edge of the viewport
              ("DISCORD CHANNELS" and "POST CATEGORIES" survived because each
              is two shorter words that wrap onto two lines; "Programs" has
              no second word to wrap to). Tightened padding + label
              size/tracking below sm so every label now fits inside its cell;
              unchanged at sm and up. */}
<div className="grid grid-cols-3 gap-2 sm:gap-3 mb-14">
             <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] p-3 sm:p-5 text-center">
               <AnimatedCounter end={DISCORD_CHANNELS.length} label="Discord channels" className="font-heading font-black text-[30px] tracking-[0.05em] text-[#DF3131]" labelClassName="text-[9px] sm:text-[11px] font-bold tracking-[0.04em] sm:tracking-[0.12em] uppercase text-[#666] dark:text-[#b0b0b0] mb-2" />
             </div>
             <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] p-3 sm:p-5 text-center">
                <AnimatedCounter end={CATEGORIES.length} label="Post categories" className="font-heading font-black text-[30px] tracking-[0.05em] text-[#8C6A1D] dark:text-[#C9A227]" labelClassName="text-[9px] sm:text-[11px] font-bold tracking-[0.04em] sm:tracking-[0.12em] uppercase text-[#666] dark:text-[#b0b0b0] mb-2" />
             </div>
             <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] p-3 sm:p-5 text-center">
               <AnimatedCounter end={COMMUNITY_HIGHLIGHTS.length} label="Programs" className="font-heading font-black text-[30px] tracking-[0.05em] text-[#C9A227]" labelClassName="text-[9px] sm:text-[11px] font-bold tracking-[0.04em] sm:tracking-[0.12em] uppercase text-[#666] dark:text-[#b0b0b0] mb-2" />
             </div>
           </div>

          {/* Community Highlights - 3-col grid */}
<div className="mb-14">
             <h2 className="font-heading font-bold text-[19px] tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] text-center mb-6">WHAT HAPPENS HERE</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COMMUNITY_HIGHLIGHTS.map((h, i) => (
                <div
                  key={h.name}
                  className={`bg-white dark:bg-[#252528] border transition-all duration-300 overflow-hidden cursor-pointer min-h-[44px] ${
                    expandedCard === i
                      ? "border-[#DF3131] shadow-lg"
                      : "border-[#E2E2E2] dark:border-[#333] hover:border-[#DF3131] hover:shadow-sm"
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedCard === i}
                  aria-label={`${h.name} - ${h.short}`}
                  onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setExpandedCard(expandedCard === i ? null : i);
                    }
                  }}
                >
                  <div className="p-5 sm:p-6 flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                      style={{ backgroundColor: `${h.color}15`, color: h.color === "#C9A227" ? "#8C6A1D" : h.color }}
                    >
                      {h.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-heading font-bold text-[15px] tracking-[0.05em] text-[#333] dark:text-[#e0e0e0] mb-2">
                          {h.name}
                        </p>
                        <span
                          className={`text-[#666] dark:text-[#b0b0b0] transition-transform duration-300 text-[18px] ${
                            expandedCard === i ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </div>
                      <p className="text-[16px] text-[#666] dark:text-[#b0b0b0] leading-relaxed mt-1">{h.short}</p>
                    </div>
                  </div>
                  {expandedCard === i && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-[#E2E2E2] dark:border-[#333] pt-4">
                      <ul className="space-y-2.5">
                        {h.details.map((d, j) => (
                          <li key={j} className="flex gap-3 text-[16px] text-[#666] dark:text-[#b0b0b0] leading-relaxed">
                            <span className="text-[#DF3131] mt-0.5 shrink-0">&#8226;</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* News Feed - 3-col grid */}
          <div className="mb-12">
            <h2 className="font-heading font-bold text-[18px] tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] text-center mb-4">NEWS FEED</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {feedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] hover:border-[#DF3131] transition-all flex flex-col"
                >
                  {/* Post header */}
                  <div className="p-5 pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-heading font-bold shrink-0"
                        style={{ backgroundColor: post.avatar, color: post.avatar === "#C9A227" ? "#1C1408" : undefined }}
                      >
                        {post.author.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-heading font-bold text-[14px] tracking-[0.03em] text-[#333] dark:text-[#e0e0e0] truncate mb-2">
                            {post.author}
                          </p>
                          {post.type === "announcement" && (
                            <span className="text-[11px] font-bold tracking-[0.1em] uppercase px-1.5 py-0.5 bg-[#DF3131]/10 text-[#C41C1C] shrink-0 mb-2">
                              Official
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#666] dark:text-[#b0b0b0]">
                          {post.handle} · {post.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Post body */}
                  <div className="px-5 pb-4 flex-1">
                    <p className="text-[15px] text-[#333] dark:text-[#e0e0e0] leading-relaxed line-clamp-4">{post.body}</p>
                  </div>

                  {/* Image attachment placeholder */}
                  {post.hasImage && (
                    <div className="mx-5 mb-4 bg-[#F7F7F7] dark:bg-[#1C1C1E] border border-dashed border-[#CCCCCC] dark:border-[#444] rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                      <FiImage className="w-8 h-8 text-[#666] dark:text-[#666]" />
                      <p className="text-[13px] text-[#666] dark:text-[#666] font-medium">Photo attached</p>
                    </div>
                  )}

                  {/* Action bar */}
                  <div className="px-5 py-3 border-t border-[#E2E2E2] dark:border-[#333] flex items-center gap-1">
                    <button
                      onClick={() => toggleFeedLike(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded text-[13px] font-medium transition-colors ${
                        post.liked
                          ? "text-[#DF3131] bg-[#DF3131]/10"
                          : "text-[#666] dark:text-[#b0b0b0] hover:text-[#DF3131] hover:bg-[#DF3131]/5"
                      }`}
                    >
                      <FiThumbsUp className="w-4 h-4" /> {post.likes}
                    </button>
                    <button
                      onClick={() => toggleFeedComments(post.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded text-[13px] font-medium text-[#666] dark:text-[#b0b0b0] hover:text-[#DF3131] hover:bg-[#DF3131]/5 transition-colors"
                    >
                      <FiMessageCircle className="w-4 h-4" /> {post.comments}
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded text-[13px] font-medium text-[#666] dark:text-[#b0b0b0] hover:text-[#DF3131] hover:bg-[#DF3131]/5 transition-colors">
                      <FiShare2 className="w-4 h-4" /> {post.shares}
                    </button>
                  </div>

                  {/* Comment section */}
                  {post.showComments && (
                    <div className="border-t border-[#E2E2E2] dark:border-[#333] bg-[#F7F7F7] dark:bg-[#1C1C1E] p-5">
                      {post.commentList.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {post.commentList.map((c, i) => (
                            <div key={i} className="flex gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-[12px] font-bold"
                                style={{ backgroundColor: c.avatar, color: c.avatar === "#C9A227" ? "#1C1408" : undefined }}
                              >
                                {c.author.slice(0, 1).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-[#666] dark:text-[#b0b0b0]">
                                  @{c.author} · {c.time}
                                </p>
                                <p className="text-[15px] text-[#333] dark:text-[#e0e0e0] leading-relaxed">
                                  {c.body}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center shrink-0 text-white text-[12px] font-bold">
                          Y
                        </div>
                        <input
                          value={post.commentText}
                          onChange={(e) =>
                            setFeedPosts((prev) =>
                              prev.map((p) =>
                                p.id === post.id ? { ...p, commentText: e.target.value } : p
                              )
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              postFeedComment(post.id);
                            }
                          }}
                          placeholder="Write a comment..."
                          aria-label="Write a comment"
                          className="flex-1 px-4 py-2.5 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] text-[#333] dark:text-[#e0e0e0] text-[14px] outline-none focus:border-[#DF3131] rounded-full"
                        />
                        <button
                          onClick={() => postFeedComment(post.id)}
                          className="p-2.5 bg-[#DF3131] text-white rounded-full hover:bg-[#c02a2a] transition-colors"
                        >
                          <FiSend className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Forum - Reddit-style discussions */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-[18px] tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] mb-4">DISCUSSIONS</h2>
              <span className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#DF3131] mb-2">{visibleThreads.length} threads</span>
            </div>

            {/* Unified Dynamic Filter Bar */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {/* Sort Dropdown */}
                <div className="relative flex-1 sm:flex-[0_0_160px]">
                  <select
                    aria-label="Sort posts"
                    value={sortTab}
                    onChange={(e) => setSortTab(e.target.value as "hot" | "new" | "top")}
                    className="w-full appearance-none px-4 py-3 pr-10 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] text-[#333] dark:text-[#e0e0e0] text-[13px] font-bold tracking-[0.05em] uppercase outline-none focus:border-[#DF3131] focus:ring-1 focus:ring-[#DF3131] rounded-lg cursor-pointer"
                  >
                    <option value="hot">🔥 Hot</option>
                    <option value="new">⚡ New</option>
                    <option value="top">🏆 Top</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#666]">
                    <FiChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Category Filter - Single Dynamic Dropdown */}
                <div className="relative flex-1">
                  <select
                    aria-label="Filter by category"
                    value={activeCat}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "nsfw" && !nsfwVerified) {
                        handleNsfwClick();
                      } else {
                        setActiveCat(val);
                      }
                    }}
                    className="w-full appearance-none px-4 py-3 pr-10 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] text-[#333] dark:text-[#e0e0e0] text-[13px] font-bold tracking-[0.05em] uppercase outline-none focus:border-[#DF3131] focus:ring-1 focus:ring-[#DF3131] rounded-lg cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id} disabled={c.id === "nsfw" && !nsfwVerified}>
                        {c.label}{c.id === "nsfw" && !nsfwVerified ? " 🔞" : ""}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#666]">
                    <FiChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Quick Actions - Mobile Stack */}
                <div className="flex gap-2 sm:hidden">
                  <button
                    onClick={() => setShowComposer(!showComposer)}
                    className="flex-1 px-4 py-3 bg-[#DF3131] text-white text-[12px] font-bold tracking-[0.08em] uppercase rounded-lg hover:bg-[#B82020] transition-all"
                  >
                    + Thread
                  </button>
                </div>
              </div>

              {/* Desktop: Inline Composer Toggle + Quick Stats */}
              <div className="hidden sm:flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-[12px] text-[#666] dark:text-[#b0b0b0]">
                  <span>{visibleThreads.length} threads</span>
                  <span className="px-2 py-1 bg-[#DF3131]/10 text-[#C41C1C] rounded-full font-bold tracking-[0.05em] uppercase">
                    {activeCat === "all" ? "All" : CATEGORIES.find(c => c.id === activeCat)?.label}
                  </span>
                  <span className="px-2 py-1 bg-[#333]/10 text-[#333] dark:bg-white/10 dark:text-white rounded-full font-bold tracking-[0.05em] uppercase">
                    {sortTab}
                  </span>
                </div>
                <button
                  onClick={() => setShowComposer(!showComposer)}
                  className="px-6 py-2.5 bg-[#DF3131] text-white text-[12px] font-bold tracking-[0.08em] uppercase rounded-lg hover:bg-[#B82020] transition-all flex items-center gap-2"
                >
                  <FiPlus className="w-4 h-4" /> Start Thread
                </button>
              </div>
</div>

            {/* Dynamic Composer - Slide Down */}
            <AnimatePresence>
              {showComposer && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] p-5 mb-6"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <FiPlus className="w-4 h-4 text-[#DF3131]" />
                      <p className="font-heading font-bold text-[14px] tracking-[0.06em] text-[#333] dark:text-[#e0e0e0] mb-2">START A THREAD</p>
                    </div>
                    <button
                      onClick={() => setShowComposer(false)}
                      className="ml-auto p-1 text-[#666] dark:text-[#b0b0b0] hover:text-[#DF3131] transition-colors"
                      aria-label="Close composer"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  <select
                    aria-label="Post category"
                    value={composer.category}
                    onChange={(e) => setComposer({ ...composer, category: e.target.value })}
                    className="w-full mb-3 px-4 py-3 bg-[#F7F7F7] dark:bg-[#1C1C1E] border border-[#E2E2E2] dark:border-[#333] text-[#333] dark:text-[#e0e0e0] text-[15px] outline-none focus:border-[#DF3131]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id} disabled={c.id === "nsfw" && !nsfwVerified}>
                        {c.label}{c.id === "nsfw" && !nsfwVerified ? " (verify age first)" : ""}
                      </option>
                    ))}
                  </select>
                  <input
                    value={composer.title}
                    onChange={(e) => setComposer({ ...composer, title: e.target.value })}
                    placeholder="Thread title..."
                    aria-label="Post title"
                    className="w-full mb-3 px-4 py-3 bg-[#F7F7F7] dark:bg-[#1C1C1E] border border-[#E2E2E2] dark:border-[#333] text-[#333] dark:text-[#e0e0e0] text-[15px] outline-none focus:border-[#DF3131] placeholder:text-[#757575]"
                  />
                  <textarea
                    value={composer.body}
                    onChange={(e) => setComposer({ ...composer, body: e.target.value })}
                    placeholder="What's on your mind?"
                    aria-label="Post content"
                    rows={3}
                    className="w-full mb-3 px-4 py-3 bg-[#F7F7F7] dark:bg-[#1C1C1E] border border-[#E2E2E2] dark:border-[#333] text-[#333] dark:text-[#e0e0e0] text-[15px] outline-none focus:border-[#DF3131] resize-none placeholder:text-[#757575]"
                  />
                  <button
                    onClick={postThread}
                    className="w-full px-8 py-4 bg-[#333] dark:bg-[#e0e0e0] text-white dark:text-[#1C1C1E] font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-[#DF3131] dark:hover:bg-[#DF3131] dark:hover:text-white transition-colors"
                  >
                    Post Thread
                  </button>
                  {composerError && <p className="text-[#DF3131] text-[13px] mt-2 text-center">{composerError}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Thread list - 3-col grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleThreads.slice(0, visibleThreadCount).map((t) => {
                const isOpen = openThread === t.id;
                const flair = FLAIRS[t.category];
                return (
                  <div
                    key={t.id}
                    className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] overflow-hidden flex flex-col"
                  >
                    {/* Vote bar */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#F7F7F7] dark:bg-[#1C1C1E] border-b border-[#E2E2E2] dark:border-[#333]">
                      <button
                        onClick={() => voteThread(t.id, "up")}
                        aria-label={t.voted === "up" ? "Remove upvote" : "Upvote thread"}
                        className={`p-1 rounded transition-colors ${
                          t.voted === "up"
                            ? "text-[#DF3131] bg-[#DF3131]/10"
                            : "text-[#666] hover:text-[#DF3131]"
                        }`}
                      >
                        <FiChevronUp className="w-5 h-5" />
                      </button>
                      <span
                        className={`text-[14px] font-bold ${
                          t.voted === "up"
                            ? "text-[#DF3131]"
                            : t.voted === "down"
                              ? "text-[#C9A227]"
                              : "text-[#333] dark:text-[#e0e0e0]"
                        }`}
                      >
                        {t.likes}
                      </span>
                      <button
                        onClick={() => voteThread(t.id, "down")}
                        aria-label={t.voted === "down" ? "Remove downvote" : "Downvote thread"}
                        className={`p-1 rounded transition-colors ${
                          t.voted === "down"
                            ? "text-[#C9A227] bg-[#C9A227]/10"
                            : "text-[#666] hover:text-[#C9A227]"
                        }`}
                      >
                        <FiChevronDown className="w-5 h-5" />
                      </button>
                      <div className="flex-1" />
                      <span className="flex items-center gap-1.5 text-[12px] text-[#666] dark:text-[#b0b0b0]">
                        <FiEye className="w-3.5 h-3.5" /> {t.views}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {flair && (
                          <span
                            className="text-[11px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded mb-2"
                            style={{ backgroundColor: `${flair.color}18`, color: flair.color === "#C9A227" ? "#8C6A1D" : flair.color === "#DF3131" ? "#C41C1C" : flair.color }}
                          >
                            {flair.label}
                          </span>
                        )}
                        <span className="text-[12px] text-[#666] dark:text-[#b0b0b0]">
                          @{t.author} · {t.time}
                        </span>
                      </div>
                      <button
                        onClick={() => setOpenThread(isOpen ? null : t.id)}
                        className="text-left w-full"
                      >
                        <p className="font-heading font-bold text-[15px] tracking-[0.03em] text-[#333] dark:text-[#e0e0e0] hover:text-[#DF3131] transition-colors line-clamp-2 mb-2">
                          {t.title}
                        </p>
                      </button>
                      <p className="text-[14px] text-[#666] dark:text-[#b0b0b0] leading-relaxed mt-2 line-clamp-3">
                        {t.body}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-[13px] text-[#666] dark:text-[#b0b0b0]">
                        <button
                          onClick={() => setOpenThread(isOpen ? null : t.id)}
                          className="flex items-center gap-1.5 hover:text-[#DF3131] transition-colors"
                        >
                          <FiMessageSquare className="w-4 h-4" /> {t.replies.length}
                        </button>
                      </div>
                    </div>

                    {/* Expanded thread with replies */}
                    {isOpen && (
                      <div className="border-t border-[#E2E2E2] dark:border-[#333] bg-[#F7F7F7] dark:bg-[#1C1C1E] p-5">
                        <div className="space-y-3 mb-4">
                          {t.replies.length === 0 && (
                            <p className="text-[14px] text-[#666] dark:text-[#b0b0b0] italic">
                              No replies yet, be the first.
                            </p>
                          )}
                          {t.replies.map((r, i) => (
                            <div key={i} className="flex gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-[12px] font-bold"
                                style={{ backgroundColor: r.avatar, color: r.avatar === "#C9A227" ? "#1C1408" : undefined }}
                              >
                                {r.author.slice(0, 1).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-[#666] dark:text-[#b0b0b0]">
                                  @{r.author} · {r.time}
                                </p>
                                <p className="text-[15px] text-[#333] dark:text-[#e0e0e0] leading-relaxed">
                                  {r.body}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {replyBox && replyBox.id === t.id ? (
                          <div className="flex gap-2">
                            <input
                              autoFocus
                              value={replyBox.text}
                              onChange={(e) => setReplyBox({ id: t.id, text: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  postReply(t.id);
                                }
                              }}
                              placeholder="Write a reply..."
                              aria-label="Write a reply"
                              className="flex-1 px-4 py-3 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] text-[#333] dark:text-[#e0e0e0] text-[15px] outline-none focus:border-[#DF3131]"
                            />
                            <button
                              onClick={() => postReply(t.id)}
                              className="px-6 py-3 bg-[#DF3131] text-white font-heading font-bold tracking-[0.08em] uppercase text-[13px]"
                            >
                              Send
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyBox({ id: t.id, text: "" })}
                            className="flex items-center gap-1.5 text-[14px] text-[#666] dark:text-[#b0b0b0] hover:text-[#DF3131] transition-colors"
                          >
                            <FiCornerDownRight className="w-4 h-4" /> Reply
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {visibleThreadCount < visibleThreads.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleThreadCount(prev => prev + 3)}
                  className="px-6 py-3 bg-[#DF3131] text-white text-[13px] font-bold tracking-[0.08em] uppercase rounded-lg hover:bg-[#B82020] transition-all"
                >
                  LOAD MORE
                </button>
              </div>
            )}
          </div>

          {/* Upcoming Events - 3-col grid */}
          <div className="mb-12">
            <h2 className="font-heading font-bold text-[19px] tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] text-center mb-6">UPCOMING</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {UPCOMING_EVENTS.map((ev) => (
                <div
                  key={ev.title}
                  className="flex items-start gap-4 p-5 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] hover:border-[#DF3131] transition-all min-h-[44px]"
                >
                  <div className="w-10 h-10 rounded-full bg-[#DF3131]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <FiCalendar className="w-4 h-4 text-[#DF3131]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <p className="font-heading font-bold text-[14px] tracking-[0.05em] text-[#333] dark:text-[#e0e0e0] mb-2">
                        {ev.title}
                      </p>
                      <span className="text-[11px] font-bold tracking-[0.1em] text-[#DF3131] uppercase mb-2">
                        {ev.date}
                      </span>
                    </div>
                    <p className="text-[16px] text-[#666] dark:text-[#b0b0b0] leading-relaxed">{ev.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links - 3-col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { name: "Instagram", url: "https://instagram.com/wyzdesign", color: "#C22E4E", desc: "Behind the scenes and latest work" },
              { name: "Facebook", url: "https://facebook.com/wyzdesign", color: "#145DBF", desc: "Events and community updates" },
              { name: "Email", url: "mailto:info@wyzdesign.com", color: "#DF3131", desc: "Direct inquiries and support" },
            ].map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] hover:border-[#DF3131] transition-all group min-h-[44px]"
              >
                <p className="font-heading font-bold text-[14px] tracking-[0.08em] mb-2" style={{ color: s.color }}>
                  {s.name}
                </p>
                <p className="text-[16px] text-[#666] dark:text-[#b0b0b0]">{s.desc}</p>
              </a>
            ))}
          </div>

          {/* Newsletter Card */}
          <div className="rounded-lg overflow-hidden border border-[#E2E2E2] dark:border-[#333] bg-white dark:bg-[#252528] mb-10">
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-[#DF3131]/10 flex items-center justify-center shrink-0">
                <FiMail className="w-6 h-6 text-[#DF3131]" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-heading font-bold text-[18px] tracking-[0.06em] text-[#333] dark:text-[#e0e0e0] mb-1">JOIN THE NEWSLETTER</h3>
                <p className="text-[14px] text-[#666] dark:text-[#b0b0b0]">Weekly drops, opportunities, and featured work. No spam.</p>
              </div>
              {subscribed ? (
                <p className="text-[14px] font-bold tracking-[0.08em] text-[#2ECC71] uppercase">Subscribed ✓</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex w-full sm:w-auto gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="flex-1 min-w-0 sm:w-56 px-4 py-3 border-2 border-[#E2E2E2] dark:border-[#444] bg-white dark:bg-[#1C1C1E] text-[14px] text-[#333] dark:text-[#e0e0e0] outline-none focus:border-[#DF3131] rounded-lg"
                  />
                  <button
                    type="submit"
                    className="shrink-0 px-5 py-3 bg-[#DF3131] text-white text-[12px] font-bold tracking-[0.08em] uppercase rounded-lg hover:bg-[#B82020] transition-colors"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Discord CTA - full width banner */}
          <div className="rounded-lg overflow-hidden border border-[#E2E2E2] dark:border-[#333] mb-10">
            <div className="bg-[#C9A227] p-8 text-center">
              <FiUsers className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h2 className="font-heading font-bold text-[24px] tracking-[0.06em] text-white mb-4">Join Our Discord</h2>
              <p className="text-white text-[16px] max-w-md mx-auto mb-6">
                Real-time chat, voice channels, event announcements, portfolio reviews, and creative collaborations.
              </p>
              <a
                href={DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#C9A227] font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-gray-100 transition-colors"
              >
                JOIN THE SERVER <FiExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Discord Channel List - 4-col grid */}
          <div className="rounded-lg overflow-hidden border border-[#E2E2E2] dark:border-[#333] mb-10">
            <div className="bg-[#C9A227] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <FiHash className="w-5 h-5 text-white/80 shrink-0" />
                <h3 className="font-heading font-bold text-[16px] leading-tight tracking-[0.06em] text-white break-normal">WYZ DESIGN · CHANNELS</h3>
              </div>
            </div>
            <div className="bg-[#2B2D31] p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {DISCORD_CHANNELS.map((ch) => (
                <div key={ch.name} className="flex items-center gap-2 px-3 py-2.5 rounded hover:bg-white/5 transition-colors">
                  <FiHash className="w-4 h-4 text-[#80848E] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#DBDEE1] truncate">{ch.name}</p>
                    <p className="text-[11px] text-[#949BA4] truncate">{ch.topic}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#C9A227] text-white font-heading font-bold tracking-[0.1em] uppercase text-[13px] hover:bg-[#4752C4] transition-colors"
            >
              Join to chat <FiExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* NSFW Age Gate Modal */}
      {showAgeGate && (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-6" role="dialog" aria-modal="true" aria-label="Age verification">
          <div className="bg-white dark:bg-[#252528] border border-[#E2E2E2] dark:border-[#333] max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#9B59B6]/10 flex items-center justify-center mx-auto mb-6">
              <FiEye className="w-8 h-8 text-[#9B59B6]" />
            </div>
            <h2 className="font-heading font-black text-[1.5rem] text-[#333] dark:text-[#e0e0e0] tracking-[0.05em] mb-3">
              {session ? "AGE VERIFICATION" : "SIGN IN REQUIRED"}
            </h2>
            <p className="text-[15px] text-[#666] dark:text-[#b0b0b0] leading-relaxed mb-8">
              {session
                ? "The NSFW category contains adult-industry creative content. You must be 18 years or older to access this section."
                : "You need to sign in to access the NSFW category. Sign in with your account, then confirm you are 18 or older."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={confirmAge}
                className="flex-1 px-6 py-3 bg-[#9B59B6] text-white font-heading font-bold tracking-[0.1em] uppercase text-[13px] hover:bg-[#8E44AD] transition-colors"
              >
                {session ? "I am 18 or older" : "Sign in to continue"}
              </button>
              <button
                onClick={() => setShowAgeGate(false)}
                className="flex-1 px-6 py-3 bg-[#F7F7F7] dark:bg-[#1C1C1E] border border-[#E2E2E2] dark:border-[#333] text-[#666] dark:text-[#b0b0b0] font-heading font-bold tracking-[0.1em] uppercase text-[13px] hover:border-[#DF3131] transition-colors"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
