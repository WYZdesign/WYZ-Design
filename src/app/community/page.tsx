"use client";
import toast from "react-hot-toast";
import { logger } from "@/lib/logger";
import { useState } from "react";
import {
  FiUsers, FiInstagram, FiMail, FiExternalLink, FiCalendar, FiAward,
  FiZap, FiMessageCircle, FiPlus, FiTrendingUp, FiHash, FiThumbsUp,
  FiCornerDownRight, FiStar, FiImage, FiFilm, FiSmile, FiShare2,
  FiChevronUp, FiChevronDown, FiEye, FiSend, FiMessageSquare,
} from "react-icons/fi";
import ScrollReveal from "@/components/ScrollReveal";

const DISCORD_INVITE = "https://discord.gg/RqQngbtXrs";

const CATEGORIES = [
  { id: "general", label: "General", desc: "Hang out, intro yourself, off-topic", color: "#DF3131" },
  { id: "showcase", label: "Showcase", desc: "Drop your best work", color: "#D49341" },
  { id: "critique", label: "Critique", desc: "Get and give feedback", color: "#5865F2" },
  { id: "collab", label: "Collabs", desc: "Find partners for projects", color: "#2ECC71" },
  { id: "nsfw", label: "NSFW", desc: "Adult-industry creatives only", color: "#9B59B6" },
];

const DISCORD_CHANNELS = [
  { name: "welcome", topic: "Read first - rules & roles", members: 0 },
  { name: "general-chat", topic: "Daily creative banter", members: 0 },
  { name: "showcase", topic: "Post your finished work", members: 0 },
  { name: "portfolio-review", topic: "Thurs 7PM CT live reviews", members: 0 },
  { name: "weekly-challenge", topic: "Monday theme drops", members: 0 },
  { name: "collab-board", topic: "Find your next partner", members: 0 },
  { name: "nsfw-creatives", topic: "Private - verified only", members: 0 },
  { name: "event-announcements", topic: "Meetups & showcases", members: 0 },
];

const FLAIRS: Record<string, { label: string; color: string }> = {
  showcase: { label: "Showcase", color: "#D49341" },
  critique: { label: "Critique", color: "#5865F2" },
  collab: { label: "Collab", color: "#2ECC71" },
  general: { label: "Discussion", color: "#DF3131" },
  nsfw: { label: "18+", color: "#9B59B6" },
};

const NEWS_POSTS = [
  {
    id: 1,
    author: "WYZ Design",
    handle: "@wyzdesign",
    avatar: "#DF3131",
    time: "3h",
    body: "Creative Cloud Vol. 3 date dropping soon. Stay locked in. This one's going to be different from anything we've done before.",
    likes: 47,
    comments: 12,
    shares: 8,
    type: "announcement",
    hasImage: false,
  },
  {
    id: 2,
    author: "maya.k",
    handle: "@mayakphoto",
    avatar: "#D49341",
    time: "5h",
    body: "Just wrapped a 12-hour editorial shoot. The golden hour shots came out insane. Full set dropping in Showcase this week.",
    likes: 83,
    comments: 24,
    shares: 15,
    type: "update",
    hasImage: true,
  },
  {
    id: 3,
    author: "WYZ Design",
    handle: "@wyzdesign",
    avatar: "#DF3131",
    time: "1d",
    body: "This month's Featured Artist: Donte 'Danny' Davis. Multi-disciplinary creative from Chicago. Check his page and show love.",
    likes: 112,
    comments: 31,
    shares: 22,
    type: "announcement",
    hasImage: false,
  },
  {
    id: 4,
    author: "devon",
    handle: "@devonmotion",
    avatar: "#5865F2",
    time: "1d",
    body: "Anyone else feel like the best work happens at 2AM? Just finished a motion piece that I've been reworking for 3 weeks.",
    likes: 29,
    comments: 8,
    shares: 3,
    type: "update",
    hasImage: false,
  },
  {
    id: 5,
    author: "robyn",
    handle: "@robynstrat",
    avatar: "#2ECC71",
    time: "2d",
    body: "Brand strategy tip: Stop designing logos first. Start with the story. The visual identity should be a byproduct of the narrative, not the other way around.",
    likes: 156,
    comments: 42,
    shares: 38,
    type: "insight",
    hasImage: false,
  },
];

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
    color: "#D49341",
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

const UPCOMING_EVENTS = [
  { title: "Creative Cloud Vol. 3", date: "TBA", desc: "Live performance showcase featuring local artists and musicians." },
  { title: "Portfolio Review Night", date: "Monthly", desc: "Bring your work. Get feedback. Connect with the community." },
  { title: "Open Mic x Design", date: "Quarterly", desc: "Where music meets visual art. Live creation, live performance." },
];

const SEED_THREADS = [
  {
    id: 1,
    category: "showcase",
    title: "Sunset editorial shot on the rooftop last night",
    author: "maya.k",
    avatar: "#DF3131",
    time: "2h",
    body: "Finally nailed the golden-hour gradient I've been chasing. Shot on 85mm, natural light only. Feedback welcome, especially on the color grade.",
    likes: 24,
    views: 312,
    replies: [
      { author: "devon", avatar: "#5865F2", time: "1h", body: "The grade is unreal. What LUT did you start from?" },
      { author: "robyn", avatar: "#2ECC71", time: "40m", body: "This belongs in the next newsletter. DMing you." },
    ],
  },
  {
    id: 2,
    category: "critique",
    title: "Is my logo too busy? Client says it feels cluttered",
    author: "jin",
    avatar: "#D49341",
    time: "5h",
    body: "Three marks, two typefaces. I think the secondary mark is the problem but the client loves it. Kill it or keep it?",
    likes: 11,
    views: 187,
    replies: [
      { author: "sol", avatar: "#9B59B6", time: "4h", body: "Kill the secondary. One idea, executed clean. Trust me." },
    ],
  },
  {
    id: 3,
    category: "collab",
    title: "Looking for a videographer for a music x design live set",
    author: "kai",
    avatar: "#2ECC71",
    time: "1d",
    body: "Open Mic x Design is back. Need someone to capture the live creation process. Paid, LA based, late July.",
    likes: 8,
    views: 142,
    replies: [],
  },
  {
    id: 4,
    category: "general",
    title: "Best affordable lenses for editorial portraiture?",
    author: "lena.creates",
    avatar: "#E4405F",
    time: "6h",
    body: "I'm shooting on a Sony A7III and looking to upgrade my lens kit for editorial work. Budget is around $800. Sigma 85mm f/1.4 or the Tamron 70-180? Need something that holds up in low light.",
    likes: 15,
    views: 203,
    replies: [
      { author: "maya.k", avatar: "#DF3131", time: "5h", body: "Sigma 85mm all day. The rendering on skin is unmatched at that price." },
      { author: "jin", avatar: "#D49341", time: "4h", body: "Depends on whether you want compression or versatility. For editorial I'd go primes." },
    ],
  },
  {
    id: 5,
    category: "showcase",
    title: "New branding project for a Chicago-based coffee roaster",
    author: "robyn",
    avatar: "#2ECC71",
    time: "8h",
    body: "Just wrapped the identity for Third Coast Roasters. Custom logotype, packaging system, menu design, and a full brand deck. This was a 3-month project and I'm really proud of how it turned out.",
    likes: 42,
    views: 567,
    replies: [
      { author: "devon", avatar: "#5865F2", time: "7h", body: "That logotype is butter. The weight on the serifs is perfect." },
      { author: "kai", avatar: "#2ECC71", time: "6h", body: "Do you have a case study PDF? Would love to reference this for a similar project." },
    ],
  },
  {
    id: 6,
    category: "general",
    title: "Web design trends for 2026 that actually matter",
    author: "devon",
    avatar: "#5865F2",
    time: "10h",
    body: "Stop with the bento grids. Here's what I'm seeing work in real client projects: variable type, micro-interactions over hero animations, 3D elements used sparingly, and actually legible content. What trends are you all adopting?",
    likes: 67,
    views: 891,
    replies: [
      { author: "robyn", avatar: "#2ECC71", time: "9h", body: "The variable type trend is real. Clients are finally understanding that motion in type adds personality." },
      { author: "sol", avatar: "#9B59B6", time: "8h", body: "I'd add accessible color systems to that list. Clients are finally asking for WCAG compliance upfront." },
    ],
  },
  {
    id: 7,
    category: "critique",
    title: "Redesigned my portfolio - roast it",
    author: "sol",
    avatar: "#9B59B6",
    time: "12h",
    body: "Finally migrated from Squarespace to a custom Next.js site. Went for a minimal dark layout with heavy typography. I know the load time could be better but I want honest design feedback first.",
    likes: 33,
    views: 445,
    replies: [
      { author: "maya.k", avatar: "#DF3131", time: "11h", body: "The hierarchy is strong. Your featured work section hits immediately. Minor note: the about page could use a stronger CTA." },
      { author: "jin", avatar: "#D49341", time: "10h", body: "Font pairing is solid. Love the contrast between the display and body type." },
    ],
  },
  {
    id: 8,
    category: "showcase",
    title: "Behind-the-scenes of a 48-hour poster design marathon",
    author: "kai",
    avatar: "#2ECC71",
    time: "14h",
    body: "Did a 48-hour design sprint creating 12 event posters for a local music festival. Used a combination of hand-drawn elements and digital compositing. Exhausting but the client loved every single one.",
    likes: 56,
    views: 723,
    replies: [
      { author: "robyn", avatar: "#2ECC71", time: "13h", body: "12 posters in 48 hours is insane. How did you keep the quality consistent across all of them?" },
    ],
  },
  {
    id: 9,
    category: "collab",
    title: "Need a typographer for a music festival identity",
    author: "devon",
    avatar: "#5865F2",
    time: "16h",
    body: "Looking for someone who specializes in custom lettering or type design. This is for a 3-day outdoor music festival in Nashville. Budget: $2,500-4,000 for the logotype and supporting type system.",
    likes: 19,
    views: 289,
    replies: [
      { author: "sol", avatar: "#9B59B6", time: "15h", body: "Check out @letterformstudio on IG - their festival work is incredible." },
    ],
  },
  {
    id: 10,
    category: "general",
    title: "How do you handle client revisions without losing your mind?",
    author: "jin",
    avatar: "#D49341",
    time: "18h",
    body: "Just got revision round 7 on a project I quoted for 3 rounds. The client keeps saying 'make it pop' without real direction. How do you all set boundaries while keeping the relationship intact?",
    likes: 89,
    views: 1204,
    replies: [
      { author: "robyn", avatar: "#2ECC71", time: "17h", body: "Contract language is everything. State revision rounds upfront, charge for extras. 'Make it pop' = ask for 3 specific references." },
      { author: "maya.k", avatar: "#DF3131", time: "16h", body: "I send a revision questionnaire now. Forces them to articulate what they actually want." },
      { author: "devon", avatar: "#5865F2", time: "15h", body: "Kill the revision round limit mentality. Instead, set a scope. If they want to change scope, the price changes." },
    ],
  },
  {
    id: 11,
    category: "showcase",
    title: "Hand-drawn album art for a jazz collective",
    author: "sol",
    avatar: "#9B59B6",
    time: "1d",
    body: "Spent 3 weeks on this hand-drawn illustration for the Blue Note Collective's debut EP. Ink on paper, then digitized and color-separated for screen printing. The client wanted something that felt analog and alive.",
    likes: 71,
    views: 943,
    replies: [
      { author: "kai", avatar: "#2ECC71", time: "23h", body: "The line work is incredible. Are you doing the print run yourself or outsourcing?" },
    ],
  },
  {
    id: 12,
    category: "critique",
    title: "Is minimalism dead in web design?",
    author: "robyn",
    avatar: "#2ECC71",
    time: "1d",
    body: "Seeing a lot of maximalist designs trending right now. Heavy textures, bold type, loud colors. Are we past the era of clean whitespace and restrained palettes? Or is this just a pendulum swing?",
    likes: 44,
    views: 678,
    replies: [
      { author: "devon", avatar: "#5865F2", time: "23h", body: "Minimalism isn't dead, it's just matured. The new minimalism is about intent, not emptiness." },
      { author: "jin", avatar: "#D49341", time: "22h", body: "I think the pendulum swings but the fundamentals stay. Typography and hierarchy matter regardless of trend." },
    ],
  },
  {
    id: 13,
    category: "general",
    title: "Printing tips: getting accurate color on CMYK transfers",
    author: "maya.k",
    avatar: "#DF3131",
    time: "1d",
    body: "Spent months figuring out why my RGB-to-CMYK conversions kept looking muddy. Here's what finally worked: soft-proof before exporting, use Fogra39 profile, and bump saturation on reds/yellows by 5-8%. This changed everything for my merchandise printing.",
    likes: 38,
    views: 512,
    replies: [
      { author: "robyn", avatar: "#2ECC71", time: "22h", body: "This is gold. Can you do a more detailed write-up? Maybe a tutorial post?" },
    ],
  },
  {
    id: 14,
    category: "collab",
    title: "Photographer needed for underground fashion zine shoot",
    author: "lena.creates",
    avatar: "#E4405F",
    time: "1d",
    body: "Working on a 48-page fashion zine with an underground/streetwear angle. Need a photographer who's comfortable with raw, editorial-style shoots. Paying gig, Chicago area, August dates.",
    likes: 27,
    views: 389,
    replies: [
      { author: "maya.k", avatar: "#DF3131", time: "20h", body: "DMing you - I've been wanting to do something like this for months." },
    ],
  },
  {
    id: 15,
    category: "showcase",
    title: "Motion graphics reel - 1 year of work",
    author: "devon",
    avatar: "#5865F2",
    time: "2d",
    body: "Just finished my annual motion reel. 60 seconds of client work and personal experiments. Every frame is After Effects + Cinema 4D. Link in the thread if you want to watch.",
    likes: 94,
    views: 1456,
    replies: [
      { author: "sol", avatar: "#9B59B6", time: "2d", body: "The transition at 0:34 is butter. What technique did you use for that morph?" },
      { author: "kai", avatar: "#2ECC71", time: "2d", body: "This is reel-level quality. The pacing is chef's kiss." },
    ],
  },
  {
    id: 16,
    category: "general",
    title: "Freelance rate sheet - what are you all charging in 2026?",
    author: "robyn",
    avatar: "#2ECC71",
    time: "2d",
    body: "Trying to benchmark my rates against the market. Brand identity packages, web design, social content creation, and motion graphics. What are you all charging? Let's be transparent about this stuff.",
    likes: 112,
    views: 2034,
    replies: [
      { author: "jin", avatar: "#D49341", time: "2d", body: "Brand identity: $3K-8K depending on scope. Web: $5K-15K. Motion: $150-300/hr. These are mid-market US rates." },
      { author: "devon", avatar: "#5865F2", time: "2d", body: "I've been undercharging for motion. $150/hr minimum. Thanks for this." },
      { author: "robyn", avatar: "#2ECC71", time: "2d", body: "Let's normalize talking about money. The industry benefits from opacity and that hurts all of us." },
    ],
  },
  {
    id: 17,
    category: "critique",
    title: "Client wants me to copy a competitor's brand - ethical dilemma",
    author: "kai",
    avatar: "#2ECC71",
    time: "2d",
    body: "A potential client sent me a competitor's entire brand identity and said 'make ours feel like this but different.' I pushed back but they're offering serious money. Where do you draw the line between inspiration and copying?",
    likes: 58,
    views: 834,
    replies: [
      { author: "robyn", avatar: "#2ECC71", time: "2d", body: "Walk away. If they're asking you to copy now, they'll ask you to copy forever. Protect your portfolio." },
      { author: "sol", avatar: "#9B59B6", time: "2d", body: "Take the reference as a starting point for mood, not execution. Then take the project in your own direction." },
    ],
  },
  {
    id: 18,
    category: "showcase",
    title: "Event recap: Creative Cloud Vol. 2 photo dump",
    author: "maya.k",
    avatar: "#DF3131",
    time: "3d",
    body: "Finally went through the 800+ photos from last month's Creative Cloud. Here are 30 of my favorites. The energy in the room was electric, musicians and designers creating side by side.",
    likes: 76,
    views: 1089,
    replies: [
      { author: "kai", avatar: "#2ECC71", time: "3d", body: "That shot of the DJ and illustrator collaborating in real time is iconic." },
    ],
  },
  {
    id: 19,
    category: "general",
    title: "Best tools for managing freelance finances in 2026?",
    author: "lena.creates",
    avatar: "#E4405F",
    time: "3d",
    body: "I've been using spreadsheets but it's getting unmanageable with 15+ active clients. Anyone have recommendations for invoicing, expense tracking, and quarterly tax prep? Preferably something that doesn't cost a fortune.",
    likes: 34,
    views: 467,
    replies: [
      { author: "robyn", avatar: "#2ECC71", time: "3d", body: "Wave is free for invoicing. For tax prep, Bonsai has a decent all-in-one package." },
    ],
  },
  {
    id: 20,
    category: "collab",
    title: "Album cover designer for indie hip-hop project",
    author: "sol",
    avatar: "#9B59B6",
    time: "3d",
    body: "Working with an indie rapper on his debut album. Looking for a designer who can do mixed-media collage-style cover art. Think Denzel Curry meets Virgil Abloh. Budget: $1,500.",
    likes: 21,
    views: 312,
    replies: [],
  },
  {
    id: 21,
    category: "showcase",
    title: "Custom typeface I designed for a streetwear brand",
    author: "jin",
    avatar: "#D49341",
    time: "3d",
    body: "Spent 6 months designing a custom display typeface for a streetwear client. 26 uppercase, 26 lowercase, numerals, and punctuation. Variable weight from Thin to Black. This is the most ambitious type project I've done.",
    likes: 88,
    views: 1234,
    replies: [
      { author: "devon", avatar: "#5865F2", time: "3d", body: "The ink traps on the lowercase g are gorgeous. What software did you use for interpolation?" },
      { author: "robyn", avatar: "#2ECC71", time: "3d", body: "This is portfolio-worthy for sure. The consistency across weights is impressive." },
    ],
  },
  {
    id: 22,
    category: "general",
    title: "How do you all stay creative when client work gets repetitive?",
    author: "kai",
    avatar: "#2ECC71",
    time: "4d",
    body: "I've been doing the same type of social media content for 3 months and I can feel my creativity dying. How do you keep the spark alive when the work gets formulaic?",
    likes: 63,
    views: 876,
    replies: [
      { author: "maya.k", avatar: "#DF3131", time: "4d", body: "Personal projects. Even 30 minutes a day on something just for you makes a difference." },
      { author: "sol", avatar: "#9B59B6", time: "4d", body: "Take a class in something completely unrelated. I took a ceramics course and it changed my design thinking." },
      { author: "devon", avatar: "#5865F2", time: "3d", body: "Set constraints. Client gives you a boring brief? Add your own creative challenge within it." },
    ],
  },
  {
    id: 23,
    category: "critique",
    title: "Is this type hierarchy working or am I overthinking it?",
    author: "lena.creates",
    avatar: "#E4405F",
    time: "4d",
    body: "Working on a magazine layout and I keep second-guessing my type scale. Using a modular scale based on 1.25 ratio. Headings feel too close to subheadings. Anyone have a system they swear by?",
    likes: 19,
    views: 298,
    replies: [
      { author: "jin", avatar: "#D49341", time: "4d", body: "Try bumping to 1.333 (perfect fourth). Gives more breathing room between levels without feeling disconnected." },
    ],
  },
  {
    id: 24,
    category: "general",
    title: "WYZ community meetup recap - Chicago June 2026",
    author: "robyn",
    avatar: "#2ECC71",
    time: "5d",
    body: "23 people showed up to the Wicker Park cafe meetup last Saturday. We did portfolio shares, talked about pricing, and planned the next collab project. Photos and highlights in the thread.",
    likes: 45,
    views: 634,
    replies: [
      { author: "kai", avatar: "#2ECC71", time: "5d", body: "Great turnout! The portfolio review circle was the highlight for me." },
      { author: "maya.k", avatar: "#DF3131", time: "5d", body: "Can't wait for the next one. I'll bring prints to trade this time." },
    ],
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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: "newsletter", data: { email } }),
      });
      setSubscribed(true);
      setEmail("");
    } catch (e) { logger.warn("community-page", `Newsletter subscribe failed: ${e}`); toast.error("Subscription failed. Please try again."); }
  };

  const catLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

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
  };

  const postThread = () => {
    if (!composer.title.trim() || !composer.body.trim()) return;
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
    <main className="pb-20 bg-white dark:bg-[#232326] min-h-screen">
      <ScrollReveal animation="fadeUp">
        <div className="max-w-6xl mx-auto px-6 pt-32 lg:pt-40">
          <h1 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.08em] text-center mb-6 sm:mb-8" style={{ lineHeight: 1 }}>COMMUNITY</h1>
          <p className="text-[#666] dark:text-[#b0b0b0] text-center mb-8 text-[16px]">Connect with creators, share your work, and grow with the WYZ community.</p>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 mb-12">
            {[
              { v: threads.length, l: "Threads", c: "#DF3131" },
              { v: 23, l: "Members", c: "#D49341" },
              { v: CATEGORIES.length, l: "Channels", c: "#5865F2" },
            ].map((s) => (
              <div key={s.l} className="bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#333] p-5 text-center">
                <p className="font-heading font-black text-[28px] tracking-[0.05em]" style={{ color: s.c }}>{s.v}</p>
                <p className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#999] dark:text-[#b0b0b0] mb-2">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Community Highlights — 3-col grid */}
          <div className="mb-12">
            <h2 className="font-heading font-bold text-[18px] tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] text-center mb-4">WHAT HAPPENS HERE</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COMMUNITY_HIGHLIGHTS.map((h, i) => (
                <div
                  key={h.name}
                  className={`bg-white dark:bg-[#2b2b2e] border transition-all duration-300 overflow-hidden cursor-pointer min-h-[44px] ${
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
                      style={{ backgroundColor: `${h.color}15`, color: h.color }}
                    >
                      {h.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-heading font-bold text-[15px] tracking-[0.05em] text-[#333] dark:text-[#e0e0e0] mb-2">
                          {h.name}
                        </p>
                        <span
                          className={`text-[#999] dark:text-[#b0b0b0] transition-transform duration-300 text-[18px] ${
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

          {/* News Feed — 3-col grid */}
          <div className="mb-12">
            <h2 className="font-heading font-bold text-[18px] tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] text-center mb-4">NEWS FEED</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {feedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#333] hover:border-[#DF3131] transition-all flex flex-col"
                >
                  {/* Post header */}
                  <div className="p-5 pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-heading font-bold shrink-0"
                        style={{ backgroundColor: post.avatar }}
                      >
                        {post.author.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-heading font-bold text-[14px] tracking-[0.03em] text-[#333] dark:text-[#e0e0e0] truncate mb-2">
                            {post.author}
                          </p>
                          {post.type === "announcement" && (
                            <span className="text-[9px] font-bold tracking-[0.1em] uppercase px-1.5 py-0.5 bg-[#DF3131]/10 text-[#DF3131] shrink-0 mb-2">
                              Official
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#999] dark:text-[#b0b0b0]">
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
                    <div className="mx-5 mb-4 bg-[#F7F7F7] dark:bg-[#232326] border border-dashed border-[#CCCCCC] dark:border-[#444] rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                      <FiImage className="w-8 h-8 text-[#999] dark:text-[#666]" />
                      <p className="text-[13px] text-[#999] dark:text-[#666] font-medium">Photo attached</p>
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
                    <div className="border-t border-[#E2E2E2] dark:border-[#333] bg-[#F7F7F7] dark:bg-[#232326] p-5">
                      {post.commentList.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {post.commentList.map((c, i) => (
                            <div key={i} className="flex gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-[12px] font-bold"
                                style={{ backgroundColor: c.avatar }}
                              >
                                {c.author.slice(0, 1).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-[#999] dark:text-[#b0b0b0]">
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
                          className="flex-1 px-4 py-2.5 bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#333] text-[#333] dark:text-[#e0e0e0] text-[14px] outline-none focus:border-[#DF3131] rounded-full"
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

          {/* Forum — Reddit-style discussions */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-[18px] tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] mb-4">DISCUSSIONS</h2>
              <span className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#DF3131] mb-2">{visibleThreads.length} threads</span>
            </div>

            {/* Sorting tabs */}
            <div className="flex gap-1 mb-4 bg-[#F7F7F7] dark:bg-[#232326] border border-[#E2E2E2] dark:border-[#333] p-1 w-fit">
              {(["hot", "new", "top"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSortTab(tab)}
                  className={`px-5 py-2 text-[13px] font-bold tracking-[0.08em] uppercase transition-all ${
                    sortTab === tab
                      ? "bg-[#333] dark:bg-[#e0e0e0] text-white dark:text-[#1C1C1E]"
                      : "text-[#666] dark:text-[#b0b0b0] hover:text-[#333] dark:hover:text-[#e0e0e0]"
                  }`}
                >
                  {tab === "hot" && <FiTrendingUp className="w-3.5 h-3.5 inline mr-1.5" />}
                  {tab === "new" && <FiZap className="w-3.5 h-3.5 inline mr-1.5" />}
                  {tab === "top" && <FiAward className="w-3.5 h-3.5 inline mr-1.5" />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveCat("all")}
                className={`px-4 py-2 text-[13px] font-bold tracking-[0.05em] uppercase transition-all ${
                  activeCat === "all"
                    ? "bg-[#333] dark:bg-[#e0e0e0] text-white dark:text-[#1C1C1E]"
                    : "bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#333] text-[#666] dark:text-[#b0b0b0]"
                }`}
              >
                All
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  className={`px-4 py-2 text-[13px] font-bold tracking-[0.05em] uppercase transition-all ${
                    activeCat === c.id
                      ? "text-white"
                      : "bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#333] text-[#666] dark:text-[#b0b0b0]"
                  }`}
                  style={activeCat === c.id ? { backgroundColor: c.color } : {}}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* New thread composer */}
            <div className="bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#333] p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FiPlus className="w-4 h-4 text-[#DF3131]" />
                <p className="font-heading font-bold text-[14px] tracking-[0.06em] text-[#333] dark:text-[#e0e0e0] mb-2">START A THREAD</p>
              </div>
              <select
                value={composer.category}
                onChange={(e) => setComposer({ ...composer, category: e.target.value })}
                className="w-full mb-3 px-4 py-3 bg-[#F7F7F7] dark:bg-[#232326] border border-[#E2E2E2] dark:border-[#333] text-[#333] dark:text-[#e0e0e0] text-[15px] outline-none focus:border-[#DF3131]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                value={composer.title}
                onChange={(e) => setComposer({ ...composer, title: e.target.value })}
                placeholder="Thread title..."
                className="w-full mb-3 px-4 py-3 bg-[#F7F7F7] dark:bg-[#232326] border border-[#E2E2E2] dark:border-[#333] text-[#333] dark:text-[#e0e0e0] text-[15px] outline-none focus:border-[#DF3131] placeholder:text-[#999]"
              />
              <textarea
                value={composer.body}
                onChange={(e) => setComposer({ ...composer, body: e.target.value })}
                placeholder="What's on your mind?"
                rows={3}
                className="w-full mb-3 px-4 py-3 bg-[#F7F7F7] dark:bg-[#232326] border border-[#E2E2E2] dark:border-[#333] text-[#333] dark:text-[#e0e0e0] text-[15px] outline-none focus:border-[#DF3131] resize-none placeholder:text-[#999]"
              />
              <button
                onClick={postThread}
                className="px-8 py-4 bg-[#333] dark:bg-[#e0e0e0] text-white dark:text-[#1C1C1E] font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-[#DF3131] dark:hover:bg-[#DF3131] dark:hover:text-white transition-colors"
              >
                Post Thread
              </button>
            </div>

            {/* Thread list — 3-col grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleThreads.map((t) => {
                const cat = CATEGORIES.find((c) => c.id === t.category);
                const isOpen = openThread === t.id;
                const flair = FLAIRS[t.category];
                return (
                  <div
                    key={t.id}
                    className="bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#333] overflow-hidden flex flex-col"
                  >
                    {/* Vote bar */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#F7F7F7] dark:bg-[#232326] border-b border-[#E2E2E2] dark:border-[#333]">
                      <button
                        onClick={() => voteThread(t.id, "up")}
                        className={`p-1 rounded transition-colors ${
                          t.voted === "up"
                            ? "text-[#DF3131] bg-[#DF3131]/10"
                            : "text-[#999] hover:text-[#DF3131]"
                        }`}
                      >
                        <FiChevronUp className="w-5 h-5" />
                      </button>
                      <span
                        className={`text-[14px] font-bold ${
                          t.voted === "up"
                            ? "text-[#DF3131]"
                            : t.voted === "down"
                              ? "text-[#5865F2]"
                              : "text-[#333] dark:text-[#e0e0e0]"
                        }`}
                      >
                        {t.likes}
                      </span>
                      <button
                        onClick={() => voteThread(t.id, "down")}
                        className={`p-1 rounded transition-colors ${
                          t.voted === "down"
                            ? "text-[#5865F2] bg-[#5865F2]/10"
                            : "text-[#999] hover:text-[#5865F2]"
                        }`}
                      >
                        <FiChevronDown className="w-5 h-5" />
                      </button>
                      <div className="flex-1" />
                      <span className="flex items-center gap-1.5 text-[12px] text-[#999] dark:text-[#b0b0b0]">
                        <FiEye className="w-3.5 h-3.5" /> {t.views}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {flair && (
                          <span
                            className="text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded mb-2"
                            style={{ backgroundColor: `${flair.color}18`, color: flair.color }}
                          >
                            {flair.label}
                          </span>
                        )}
                        <span className="text-[12px] text-[#999] dark:text-[#b0b0b0]">
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
                      <div className="border-t border-[#E2E2E2] dark:border-[#333] bg-[#F7F7F7] dark:bg-[#232326] p-5">
                        <div className="space-y-3 mb-4">
                          {t.replies.length === 0 && (
                            <p className="text-[14px] text-[#999] dark:text-[#b0b0b0] italic">
                              No replies yet, be the first.
                            </p>
                          )}
                          {t.replies.map((r, i) => (
                            <div key={i} className="flex gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-[12px] font-bold"
                                style={{ backgroundColor: r.avatar }}
                              >
                                {r.author.slice(0, 1).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-[#999] dark:text-[#b0b0b0]">
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
                              className="flex-1 px-4 py-3 bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#333] text-[#333] dark:text-[#e0e0e0] text-[15px] outline-none focus:border-[#DF3131]"
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
          </div>

          {/* Upcoming Events — 3-col grid */}
          <div className="mb-12">
            <h2 className="font-heading font-bold text-[18px] tracking-[0.08em] text-[#333] dark:text-[#e0e0e0] text-center mb-4">UPCOMING</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {UPCOMING_EVENTS.map((ev) => (
                <div
                  key={ev.title}
                  className="flex items-start gap-4 p-5 bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#333] hover:border-[#DF3131] transition-all min-h-[44px]"
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

          {/* Social Links — 3-col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { name: "Instagram", url: "https://instagram.com/wyzdesign", color: "#E4405F", desc: "Behind the scenes and latest work" },
              { name: "Facebook", url: "https://facebook.com/wyzdesign", color: "#1877F2", desc: "Events and community updates" },
              { name: "Email", url: "mailto:info@wyzdesign.com", color: "#DF3131", desc: "Direct inquiries and support" },
            ].map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-white dark:bg-[#2b2b2e] border border-[#E2E2E2] dark:border-[#333] hover:border-[#DF3131] transition-all group min-h-[44px]"
              >
                <p className="font-heading font-bold text-[14px] tracking-[0.08em] mb-2" style={{ color: s.color }}>
                  {s.name}
                </p>
                <p className="text-[16px] text-[#666] dark:text-[#b0b0b0]">{s.desc}</p>
              </a>
            ))}
          </div>

          {/* Discord CTA — full width banner */}
          <div className="rounded-lg overflow-hidden border border-[#E2E2E2] dark:border-[#333] mb-10">
            <div className="bg-[#5865F2] p-8 text-center">
              <FiUsers className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h2 className="font-heading font-bold text-[24px] tracking-[0.06em] text-white mb-4">Join Our Discord</h2>
              <p className="text-white/70 text-[16px] max-w-md mx-auto mb-6">
                Real-time chat, voice channels, event announcements, portfolio reviews, and creative collaborations.
              </p>
              <a
                href={DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#5865F2] font-heading font-bold tracking-[0.12em] uppercase text-[14px] hover:bg-gray-100 transition-colors"
              >
                JOIN THE SERVER <FiExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Discord Channel List — 4-col grid */}
          <div className="rounded-lg overflow-hidden border border-[#E2E2E2] dark:border-[#333] mb-10">
            <div className="bg-[#5865F2] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiHash className="w-5 h-5 text-white/80" />
                <h3 className="font-heading font-bold text-[16px] tracking-[0.06em] text-white mb-3">WYZ DESIGN · CHANNELS</h3>
              </div>
              <span className="text-[12px] font-bold tracking-[0.1em] uppercase text-white/70 mb-2">0 online</span>
            </div>
            <div className="bg-[#2B2D31] p-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              {DISCORD_CHANNELS.map((ch) => (
                <div key={ch.name} className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/5 transition-colors">
                  <FiHash className="w-4 h-4 text-[#80848E] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#DBDEE1] truncate">{ch.name}</p>
                    <p className="text-[11px] text-[#80848E] truncate">{ch.topic}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#5865F2] text-white font-heading font-bold tracking-[0.1em] uppercase text-[13px] hover:bg-[#4752C4] transition-colors"
            >
              Join to chat <FiExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
