# WYZ Design — Current State (Session 36)

## All Sessions Summary (30-36)

### Session 30-31 (Prior)
- Splash scroll lock, hero H1 formatting, button positioning
- Photography & services hero formatting
- Magnetic → glow hover transitions

### Session 32
- Carousel speeds +10% (0.55/0.88/0.33-0.66)
- Blog badge moved inside card image
- Sticker cards 25% shorter (67vh)
- FAOTM H1 fit one line + H2 tracking narrowed
- Services page: 15→27 services across 6 categories
- All hero banners full viewport height
- Photography marquee moved under hero
- Events dark overlay + red-white hover spotlight
- Popular services expanded to 6 cards

### Session 33
- About values: "Show Up and Do the Work" → "We Do The Work Ourselves"
- Merch text rewrite (less AI tone)
- Star rating → lightning icon
- Sort label "Top Rated" → "Highest Rated"
- Admin unicode icons + label fixes ("Zeal Rewards" → "Rewards")
- Rewards page: "ZEAL" H1 title
- Gift cards: "How It Works" moved above amount cards
- FAQ hero stats 50% larger + "Ask WYZ AI" removed
- Community real member/online numbers
- Flip card price centering across ALL pages
- Admin overview bar charts (forms by type, income/expense)
- Admin engagement metrics + recent submissions table
- Plans flip card layout fixed
- Comparison table grid lines + text-center alignment
- Photography carousel consistent heights
- Services page hero restored + marquee positioned
- Dark mode marquee stroke: transparent → #111
- About page: 75% overlay + "BUILT DIFFERENT" + social links
- NSFW constants extraction (nsfw-constants.ts)
- NEXTAUTH_SECRET placeholder for local build
- TypeScript clean, build passes

### Session 34
- Lenis smooth scroll: wheelMultiplier 1.0→1.3
- Merch store expand/collapse animation (portal effect)
- Merch auto-scroll gallery with black-to-red gradient
- Pricing calculator FAQ/chatbot widget (6 FAQ items)
- Home hero buttons: same size px-8 py-4, white button glows white on hover
- Splash proper scroll lock

### Session 35
- Community page: unified dynamic filter bar (sort + category in 2 compact dropdowns)
- Community page: collapsible composer with Framer Motion animation
- Full SEO metadata for ALL 40 pages with metadata.ts files
- Pages with metadata: home, about, services, photography, events, blog, designs, gallery, case-studies (4), web-design, printing, plans, merch (2), featured-artist, model-archive, community, loyalty, FAQ, gift-card, contact, brands, booking, 3-pointprogram, partnerships, referral, match, wyzmind, FD, search, secret, splash (2), clear-cache, admin, offline, policy pages
- Dynamic routes: photography/[category], merch/[id], view/[page] (blog/[slug] uses generateMetadata)

### Session 36 (Hero Video Posters + Marketing Enhancements)

#### Performance Optimizations
- **Hero video posters**: Created 7 optimized JPEG posters (1280px wide)
  - `hero-about.jpg`, `hero-designs.jpg`, `hero-photography.jpg`, `hero-printing.jpg`, `hero-web-design.jpg`
  - `hero-diy-shows.jpg`, `hero-diy-shows-2.jpg` (for random events hero)
- **ParallaxVideo.tsx**: Added `poster` prop, removed broken IntersectionObserver that paused autoplay
- **SafeImage.tsx**: Complete rewrite with WebP/AVIF fallback, blur placeholder support, priority/sizes props
- **TextSplit.tsx**: Added `will-change: "transform, opacity"` for animation perf

#### Events Page Fixes
- Fixed hero centering (removed `pt-24 lg:pt-32` padding pushing content up)
- Video now randomizes from 12 healthy DIY recap videos on each refresh
- Removed broken C.O. Reloaded Vol. 1 from rotation

#### Marketing Enhancements
- **Loyalty page**: Replaced cryptic "Couldn't load your Zeal" with friendly "Sign in to see your Zeal" CTA
- **LeadMagnet component**: Added to **about**, **plans**, **contact** pages (was home only)
  - Free Brand Audit Guide (7 questions + action items)
- **Newsletter**: Double opt-in via `/api/newsletter`, Resend integration, welcome email

#### Video Fixes by Page
- `/about` - poster added, preload="metadata" confirmed
- `/photography` - swapped layout: text-left/video-right desktop, mobile overlay
- `/events` - centering fixed, random video from 12 healthy recaps
- `/web-design` - poster on both desktop/mobile variants
- `/printing` - poster added to both ParallaxVideo and direct video
- `/services` - photography.mp4 uses hero-photography.jpg
- `/designs` - uses hero-designs.jpg
- `/events` - uses hero-diy-shows.jpg (works for all 12 videos)

#### Footer Video
- `/videos/wyz-nav-bg-new.mp4` still missing poster - needs frame extracted

## Current State

**Latest commit**: `HEAD = 4626b7e`  
**Total commits**: 20+ (sessions 30-36)  
**Build**: ✅ 112/112 pages passing  
**Preflight**: ✅ 29 PASS / 0 FAIL / 2 WARN  

### File Changes Summary
**Modified (performance/SEO):**
- `src/app/events/page.tsx` - centering, video randomization, broken video removed
- `src/app/photography/page.tsx` - layout swapped (text-left/video-right)
- `src/app/about/page.tsx` - poster added
- `src/app/web-design/page.tsx` - posters on desktop/mobile
- `src/app/printing/page.tsx` - poster added
- `src/app/loyalty/page.tsx` - friendly sign-in message
- `src/layout.tsx` - preload hints for hero images
- `src/components/ParallaxVideo.tsx` - autoplay fix, poster prop
- `src/components/SafeImage.tsx` - WebP/AVIF, blur placeholder
- `src/components/TextSplit.tsx` - will-change optimization
- `src/components/LeadMagnet.tsx` - lead magnet component
- `src/app/about/page.tsx`, `src/app/plans/page.tsx`, `src/app/contact/page.tsx` - LeadMagnet added
- `public/images/hero-*.jpg` - 7 new poster images (created via ffmpeg)

## Systems Status

| System | Status | Notes |
|--------|--------|-------|
| Newsletter | ✅ Active | Double opt-in, Resend welcome email |
| Referral | ✅ Active | `/referral` + leaderboard, 10% commissions |
| Loyalty/Zeal | ✅ Active | 4 tiers, quests, achievements |
| Forms | ✅ Active | Contact, booking, consultation, custom plan |
| Community | ✅ Active | Forum + Discord integration |
| Gift Cards | ✅ Active | 5 tiers via Stripe |
| SEO | ✅ Complete | 40 pages with metadata, sitemap, robots.txt |
| Social Proof | ✅ Active | Testimonials, case studies, reviews |

## Remaining Tasks (Optional)

1. **Video Posters** - Extract frames for `/videos/wyz-nav-bg-new.mp4` and footer video
2. **Social Sharing** - Add share buttons to case studies and testimonials
3. **Analytics Review** - Verify newsletter signup tracking in GA
4. **Mobile Verification** - Visual confirmation of hero changes
5. **Google Business Profile** - Update address from Chicago to Los Angeles

## Key URLs to Verify
- https://wyzdesign.com/photography (text-left/video-right layout)
- https://wyzdesign.com/events (centering + random video)
- https://wyzdesign.com/loyalty (friendly sign-in message)
- https://wyzdesign.com/ (LeadMagnet appears)

## API Endpoints
- `POST /api/newsletter` - Subscribe (double opt-in)
- `GET/POST /api/referral` - Referral code management
- `GET/POST /api/referral/leaderboard` - Public leaderboard
- `GET/POST/GET /api/zeal/*` - Loyalty points system
- `POST /api/forms` - Contact/booking forms