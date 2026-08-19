export interface BlogSection {
  heading?: string;
  paragraphs: string[];
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateISO: string;
  cat: string;
  img: string;
  featured: boolean;
  readTime: string;
  content: BlogSection[];
}

export const BLOG_AUTHOR = {
  name: "Torreé Marcel Harris",
  url: "https://www.wyzdesign.com/about",
};

export const POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "behind-the-scenes-fd-mixer-vol-6",
    title: "Behind the Scenes: FD Mixer Vol. 6",
    excerpt: "An inside look at our latest event photography session, from setup to the final shots.",
    date: "May 15, 2026",
    dateISO: "2026-05-15",
    cat: "Events",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    featured: true,
    readTime: "5 min",
    content: [
      {
        heading: "The calm before the doors open",
        paragraphs: [
          "Every event we shoot starts the same way, with an empty room and a to-do list. For FD Mixer Vol. 6, that meant arriving three hours early, walking every corner of the venue, and figuring out where the light actually falls once the house lights drop.",
          "We don't show up and hope for the best. We map the room first. Where's the stage, where are the bar lines, which wall gets the neon spill. That pre-work is the difference between getting lucky and getting the shot every time.",
        ],
      },
      {
        heading: "Lights, crowd, action",
        paragraphs: [
          "Once the doors open, the room changes by the minute. A pocket of people laughing near the DJ, a quiet moment between two friends at the back, the first big reaction when a track drops. Those are the frames people remember.",
          "We work low and close, so the camera feels like part of the crowd instead of a press pit. That's where the honest shots live, the ones that don't look posed because they weren't.",
        ],
      },
      {
        heading: "What happens after",
        paragraphs: [
          "The shoot doesn't end when the lights come up. We go home with hundreds of frames, cull them down to the ones that tell the story, and edit for color and mood. The goal isn't 500 photos. It's a set that makes whoever wasn't there wish they were.",
          "Want your next event captured like this? Let's talk before you lock the date.",
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "logo-design-trends-2026",
    title: "Logo Design Trends for 2026",
    excerpt: "The top logo styles dominating this year and how WYZ Design stays ahead of the curve.",
    date: "Apr 28, 2026",
    dateISO: "2026-04-28",
    cat: "Design",
    img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop",
    featured: false,
    readTime: "4 min",
    content: [
      {
        paragraphs: [
          "Logo trends come and go, but a few things never change. A good logo is simple, it reads clearly at any size, and it looks like it belongs to your brand and nobody else's. Here's what's working in 2026.",
        ],
      },
      {
        heading: "Bold type is back",
        paragraphs: [
          "Wordmarks are having a moment. Big, confident type with tight spacing, the kind that works on a cap or a billboard. If your name carries weight, let the letters do the talking.",
          "That doesn't mean skip the symbol. It means the type has to hold up on its own first, then the mark adds the layer of personality.",
        ],
      },
      {
        heading: "Color that commits",
        paragraphs: [
          "We're seeing fewer safe palettes and more brands picking one strong color and owning it. Think a single red, a single electric blue. One color done well beats five colors that blend into the noise.",
          "The best logos we've made this year share the same DNA: they're built to last, not to chase a trend. Trends fade. A mark that fits your brand doesn't.",
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "how-to-prepare-for-your-photoshoot",
    title: "How to Prepare for Your Photoshoot",
    excerpt: "A complete guide to getting camera-ready, wardrobe, lighting preferences, and posing tips.",
    date: "Apr 10, 2026",
    dateISO: "2026-04-10",
    cat: "Photography",
    img: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=600&fit=crop",
    featured: false,
    readTime: "6 min",
    content: [
      {
        paragraphs: [
          "The best photoshoots don't happen by accident. They happen when you show up prepared and relaxed. Here's the rundown we give every client before a session.",
        ],
      },
      {
        heading: "Wardrobe first",
        paragraphs: [
          "Bring options, not an entire closet. Three to five outfits max, and steer clear of loud logos and busy patterns unless they're part of the concept. Solid colors photograph clean and keep the focus on you.",
          "Iron or steam everything the night before. Wrinkles are the one thing that's hard to fix in editing without looking fake.",
        ],
      },
      {
        heading: "Rest, water, and trust",
        paragraphs: [
          "Sleep well the night before and drink water. Puffy eyes and dry skin show up on camera. And the biggest one: trust your photographer. The more you relax and stop worrying about how you look, the better you'll look.",
          "We'll direct you through every pose, so you don't have to figure it out on the spot. Your job is to show up. Ours is to make you look like the best version of yourself.",
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "why-your-brand-needs-a-style-guide",
    title: "Why Your Brand Needs a Style Guide",
    excerpt: "Consistency is king. Here is why every business needs a cohesive visual identity.",
    date: "Mar 22, 2026",
    dateISO: "2026-03-22",
    cat: "Branding",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    featured: false,
    readTime: "3 min",
    content: [
      {
        paragraphs: [
          "A brand isn't a logo. A brand is how people feel every time they run into you, online or off. And the only way that feeling stays consistent is with a style guide.",
        ],
      },
      {
        heading: "What a style guide actually does",
        paragraphs: [
          "It's a single source of truth. Your logo rules, your colors, your fonts, how much white space to use, how your photos should look. When everyone pulls from the same page, your brand starts to feel intentional instead of scattered.",
          "Without one, you get what we see all the time: a flyer that uses one red, a website that uses a different one, and a logo stretched in ways it was never meant to be.",
        ],
      },
      {
        heading: "It pays for itself",
        paragraphs: [
          "A style guide saves you money on every future project, because a designer can pick it up and work without a hundred questions. And it builds the kind of trust that turns a first-time buyer into a repeat customer.",
          "If your brand doesn't have one yet, start here. It's the cheapest piece of infrastructure you'll ever buy and the one that compounds the most.",
        ],
      },
    ],
  },
  {
    id: 5,
    slug: "event-photography-capturing-the-moment",
    title: "Event Photography: Capturing the Moment",
    excerpt: "Techniques we use to freeze authentic moments at live events and concerts.",
    date: "Mar 5, 2026",
    dateISO: "2026-03-05",
    cat: "Events",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
    featured: false,
    readTime: "5 min",
    content: [
      {
        paragraphs: [
          "Event photography is a different beast from a portrait session. You don't get to control the light, the timing, or the crowd. You get one shot at a moment, and then it's gone.",
        ],
      },
      {
        heading: "Read the room, not just the stage",
        paragraphs: [
          "The headline act isn't the only story. The best event photos come from the edges: the friends laughing at the back, the bartender mid-pour, the kid seeing their favorite artist for the first time.",
          "We keep the camera ready and the settings dialed before anything happens, so when a moment lands, we're already there. Reaction shots are everything.",
        ],
      },
      {
        heading: "Anticipate, don't react",
        paragraphs: [
          "Good event photographers shoot half a second ahead of the crowd. You watch the performer's hands, the crowd's energy, the lighting cue, and you press the shutter before the peak, not after.",
          "That's the skill you can't fake. It's reps, and it's why we shoot so many events. By the time your night starts, we've done this a hundred times.",
        ],
      },
    ],
  },
  {
    id: 6,
    slug: "the-power-of-retouching",
    title: "The Power of Retouching",
    excerpt: "Why professional retouching matters and how it makes your portfolio better.",
    date: "Feb 18, 2026",
    dateISO: "2026-02-18",
    cat: "Photography",
    img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
    featured: false,
    readTime: "4 min",
    content: [
      {
        paragraphs: [
          "A good photo gets you most of the way there. Retouching closes the gap between 'nice shot' and 'that's the one they remember.'",
        ],
      },
      {
        heading: "It's about control, not fakery",
        paragraphs: [
          "The best retouching is invisible. It evens the skin without erasing it, cleans a stray hair without making the face look plastic, and fixes the color so the image matches what your eye actually saw.",
          "We don't turn people into someone else. We make the photo look the way the moment felt, which is usually better than the camera managed on its own.",
        ],
      },
      {
        heading: "Why it's worth it",
        paragraphs: [
          "Your headshot, your album art, your product shots, those are the first impression. Retouching is the difference between looking amateur and looking like you take your work seriously.",
          "It's the cheapest upgrade in photography. Don't skip it.",
        ],
      },
    ],
  },
  {
    id: 7,
    slug: "top-10-branding-trends-2026",
    title: "Top 10 Branding Trends for 2026",
    excerpt: "From kinetic logos to AI-generated palettes, these emerging brand design trends are reshaping how businesses present themselves. Stay ahead of the curve with what is defining visual identity this year.",
    date: "July 10, 2026",
    dateISO: "2026-07-10",
    cat: "Branding",
    img: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop",
    featured: false,
    readTime: "7 min",
    content: [
      {
        paragraphs: [
          "Every year brings a fresh batch of branding trends, and most of them fade. The ones worth paying attention to are the ones that solve a real problem. Here are the trends we're actually using with clients this year.",
        ],
      },
      {
        heading: "Motion is now a default",
        paragraphs: [
          "Kinetic logos, animated wordmarks, subtle motion in the identity itself. Static is still the foundation, but a brand that moves a little reads as alive. You don't need a full animation team, just a few seconds of thoughtful motion.",
          "The trick is restraint. Motion should feel intentional, not like a loading screen.",
        ],
      },
      {
        heading: "Real photography over stock",
        paragraphs: [
          "Stock photos have a look, and people can feel it. Brands are swinging back toward real, imperfect photography that shows actual people and actual work. It costs more up front and builds way more trust.",
        ],
      },
      {
        heading: "The rest of the list",
        paragraphs: [
          "A few more worth noting: monochrome palettes with one accent, oversized typography, textured backgrounds instead of flat color, hand-drawn elements that add warmth, and packaging that's built to be photographed.",
          "Here's the honest version though. Trends are useful signals, not rules. The brands that win aren't the ones chasing everything on this list. They're the ones who know who they are and use trends as seasoning, not the main course.",
        ],
      },
    ],
  },
  {
    id: 8,
    slug: "why-your-business-needs-a-professional-website",
    title: "Why Your Business Needs a Professional Website",
    excerpt: "Your website is your digital storefront and first impressions happen in milliseconds. A professional web presence builds trust, drives conversions, and keeps you competitive in an online-first world.",
    date: "July 8, 2026",
    dateISO: "2026-07-08",
    cat: "Web Design",
    img: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop",
    featured: false,
    readTime: "5 min",
    content: [
      {
        paragraphs: [
          "When someone hears about your business, the first thing they do is look you up. If your website looks old, slow, or confusing, that's the impression they walk away with. You don't get a second first click.",
        ],
      },
      {
        heading: "It's your only asset you fully control",
        paragraphs: [
          "Social media algorithms change on a whim. Your website is yours. It's the one place where you decide exactly what people see, in what order, with no feed fighting for their attention.",
          "That's why a website isn't a brochure anymore. It's your best salesperson, working 24/7, answering questions and moving people toward booking.",
        ],
      },
      {
        heading: "What a good one actually does",
        paragraphs: [
          "It loads fast, it's clear within seconds what you do and who it's for, and it makes the next step obvious. That's it. You don't need every animation or widget. You need clarity and speed.",
          "We build sites starting at $500 flat for up to five pages. If yours isn't pulling its weight, that's the highest-leverage fix you can make this quarter.",
        ],
      },
    ],
  },
  {
    id: 9,
    slug: "the-art-of-event-photography",
    title: "The Art of Event Photography: Capturing Moments",
    excerpt: "Great event photography goes beyond pointing and shooting, it is about reading the room, anticipating emotion, and telling a story through frames. Here are the techniques that separate snapshots from art.",
    date: "July 5, 2026",
    dateISO: "2026-07-05",
    cat: "Photography",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
    featured: false,
    readTime: "6 min",
    content: [
      {
        paragraphs: [
          "Anyone can hold up a phone and press record. Event photography is about making someone who wasn't there feel like they were. That's a craft, and it starts long before the event does.",
        ],
      },
      {
        heading: "Story before shots",
        paragraphs: [
          "A set of event photos should read like a story. You need the wide shot that sets the scene, the medium shots that show the crowd and the energy, and the tight shots that capture the emotion on a face.",
          "We shoot all three on purpose. If all your photos look the same, you've missed the point.",
        ],
      },
      {
        heading: "Emotion is the whole job",
        paragraphs: [
          "The technical stuff, exposure, focus, composition, that's table stakes. The real job is anticipating emotion and catching it before it disappears. A laugh, a hug, a moment of pure joy. Those frames are worth more than any posed group shot.",
          "That's what separates a snapshot from a photograph, and it's the thing you can't get from a phone in someone's back pocket.",
        ],
      },
    ],
  },
  {
    id: 10,
    slug: "custom-printing-from-concept-to-creation",
    title: "Custom Printing: From Concept to Creation",
    excerpt: "Taking a design from screen to physical product involves color profiles, material selection, and finishing techniques. This walkthrough covers the full custom printing pipeline.",
    date: "July 2, 2026",
    dateISO: "2026-07-02",
    cat: "Printing",
    img: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&h=600&fit=crop",
    featured: false,
    readTime: "5 min",
    content: [
      {
        paragraphs: [
          "A design looks one way on a screen and another way on paper, vinyl, or fabric. The gap between the two is where custom printing lives, and getting it right takes knowing the pipeline end to end.",
        ],
      },
      {
        heading: "Color is the first hurdle",
        paragraphs: [
          "Your screen uses light to show color. Print uses ink. The same red can look completely different printed. That's why we work in the right color profile from the start and proof everything before it goes to production.",
          "Skip this step and you end up with a flyer that looked fire on your phone and flat in your hand.",
        ],
      },
      {
        heading: "Material changes everything",
        paragraphs: [
          "Stickers aren't flyers. A matte finish absorbs light, a gloss finish reflects it. The stock you choose changes how the color lands and how the piece feels. We help you pick the right paper, vinyl, or fabric for the job.",
          "From concept to the finished piece in your hand, we handle the whole thing so you don't have to guess at any step.",
        ],
      },
    ],
  },
  {
    id: 11,
    slug: "how-to-build-a-strong-social-media-presence",
    title: "How to Build a Strong Social Media Presence",
    excerpt: "Consistency, authenticity, and strategy are the pillars of a social media presence that actually converts. Learn the frameworks that turn followers into loyal customers.",
    date: "June 28, 2026",
    dateISO: "2026-06-28",
    cat: "Marketing",
    img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    featured: false,
    readTime: "4 min",
    content: [
      {
        paragraphs: [
          "You don't need to post every day or dance on every trend. You need to show up consistently and sound like yourself. Here's the framework we give clients who want a presence that actually converts.",
        ],
      },
      {
        heading: "Pick your lane and stay in it",
        paragraphs: [
          "One platform done well beats five platforms done halfway. If your customers live on Instagram, go deep there before you split your energy. Post the kind of content that makes someone stop scrolling because it's genuinely useful or interesting.",
          "Consistency isn't about frequency. It's about showing up with the same voice and the same quality every time.",
        ],
      },
      {
        heading: "Sell the outcome, not the service",
        paragraphs: [
          "People don't follow you because you offer photography. They follow you because your work makes them feel something. Show the before and after, tell the story behind the shot, give them a reason to come back.",
          "Followers are nice. Customers are better. A small audience that trusts you will out-perform a big one that just scrolls past.",
        ],
      },
    ],
  },
  {
    id: 12,
    slug: "freelance-designers-guide-to-client-management",
    title: "Freelance Designer's Guide to Client Management",
    excerpt: "Managing expectations, scope, and communication is what separates thriving freelancers from burning out. These battle-tested strategies will keep your clients happy and your boundaries intact.",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    cat: "Business",
    img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
    featured: false,
    readTime: "6 min",
    content: [
      {
        paragraphs: [
          "Being a good designer isn't enough to stay afloat as a freelancer. The work that makes or breaks you is the stuff around the work, the scope, the communication, the boundaries.",
        ],
      },
      {
        heading: "Set scope before you start",
        paragraphs: [
          "Every project should start with a written scope. What's included, what's not, how many revisions, and what happens when they want more. It feels awkward the first time. It saves you ten times over.",
          "Clients don't get upset about boundaries. They get upset about surprises. A clear scope means no surprises.",
        ],
      },
      {
        heading: "Over-communicate, briefly",
        paragraphs: [
          "The best client relationships are built on short, regular updates. A quick message every few days that says where things stand beats a wall of silence and a big reveal. People trust a process they can see.",
          "And the golden rule: get everything in writing. A two-sentence email summary after every call will save you from more disputes than any contract ever will.",
        ],
      },
      {
        heading: "Know when to say no",
        paragraphs: [
          "The fastest way to burn out is taking every job that comes your way. If the budget, the timeline, or the vibe is wrong, walk. A quiet month is better than a nightmare client who eats your weekends and still doesn't pay on time.",
          "Protect your craft and your sanity. The right clients will respect you more for it.",
        ],
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return POSTS;
}
