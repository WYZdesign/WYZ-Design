# WYZ DESIGN — AGENT INSTRUCTIONS
**Project:** WYZ Design Next.js Portfolio Site  
**Location:** `V:\wyzdesign`  
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion, Stripe, Printful, Supabase  
**Deploy:** Vercel (auto on push to master)  
**Last Updated:** 2026-09-04  

---

## 🚀 QUICK START (Run These First)

```bash
# 1. Start dev server
cd V:\wyzdesign && npm run dev

# 2. Verify build passes
cd V:\wyzdesign && npm run build

# 3. TypeScript check
cd V:\wyzdesign && npx tsc --noEmit
```

**Expected:** All 3 commands pass with 0 errors. Dev server at `http://localhost:3001` (or 3000).

---

## 📁 KEY FOLDERS & FILES

```
V:\wyzdesign/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── merch/page.tsx            # Merch store (Printful integration) — FIXED R11
│   │   ├── merch/concepts/page.tsx   # Concept gallery
│   │   ├── faq/page.tsx              # FAQ with AI chatbot
│   │   ├── community/page.tsx        # Forum + Zeal loyalty
│   │   ├── photography/page.tsx      # Albums + lightbox
│   │   ├── designs/page.tsx          # Design carousels
│   │   ├── booking/page.tsx          # Calendly + Stripe
│   │   ├── plans/page.tsx            # Subscriptions
│   │   ├── referral/page.tsx         # Referral program
│   │   ├── loyalty/page.tsx          # Zeal tiers + quests
│   │   ├── about/page.tsx            # About page
│   │   ├── contact/page.tsx          # Contact form
│   │   ├── blog/                     # Blog posts
│   │   └── api/                      # API routes
│   ├── components/
│   │   ├── Navbar.tsx                # FIXED: mobile menu scroll isolation
│   │   ├── ScrollToTop.tsx           # FIXED: hides when mobile menu open
│   │   ├── CustomCursor.tsx          # ⚠️ CRITICAL: breaks keyboard nav
│   │   ├── Footer.tsx
│   │   ├── DynamicForm.tsx
│   │   ├── StrategyWizard.tsx
│   │   ├── PageRenderer.tsx
│   │   └── ...50+ other components
│   ├── hooks/
│   │   ├── useNsfwSession.ts
│   │   └── ...
│   ├── lib/
│   └── styles/
├── public/
├── .env.local                        # Local env (NEVER commit)
├── next.config.js
├── package.json
├── tailwind.config.ts
├── WYZ_DESIGN_SITE_AUDIT_REPORT.md   # Full 100-point audit
└── WYZ_DESIGN_NEXT_AGENT_HANDOVER.md # This file's predecessor
```

---

## 🔧 ENVIRONMENT SETUP (Required for Full Functionality)

### `.env.local` (Create if missing)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Printful
PRINTFUL_API_KEY=your-printful-key

# Email (Resend)
RESEND_API_KEY=re_...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# AI/Zeal
OPENAI_API_KEY=sk-...
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=...
```

### Vercel Environment Variables (Production)
All of the above PLUS:
- `NEO4J_URI` — **MISSING** (causes `/api/zeal/status` 500)

---

## ✅ WHAT'S WORKING (As of 2026-09-04)

| Feature | Status | Notes |
|---------|--------|-------|
| Home page hero + marquees | ✅ | Video + scroll animations |
| Services page filtering | ✅ | Tab-based filter |
| Photography albums/lightbox | ✅ | Lazy-loaded images |
| Designs carousels | ✅ | Framer Motion |
| **Merch store (Grid/Explore toggle)** | ✅ | **Round 11 fixed** |
| Merch concepts gallery | ✅ | |
| FAQ with AI chatbot | ✅ | JSON-LD schema |
| Community forum + Zeal | ✅ | WebSocket/polling |
| Referral program | ✅ | Code gen + leaderboard |
| Loyalty/Zeal tiers | ✅ | Quests + rewards |
| Booking + Stripe checkout | ✅ | Calendly embed |
| Subscription plans | ✅ | Stripe Price IDs |
| Blog posts + search | ✅ | BlogPosting schema |
| Contact form + toast | ✅ | Resend email |
| Admin dashboard | ✅ | TransactionTable |
| **Mobile menu scroll isolation** | ✅ | **Fixed today** |
| **Back-to-top hides on menu open** | ✅ | **Fixed today** |

---

## 🚨 CRITICAL BLOCKERS (Must Fix First)

### 1. CustomCursor Breaks Keyboard Navigation (ACCESSIBILITY P0)
**File:** `src/components/CustomCursor.tsx`  
**Issue:** Replaces system cursor, prevents keyboard focus visibility, breaks screen readers  
**Impact:** Site unusable for keyboard-only and assistive tech users  
**Fix:** Remove or add `pointer-events: none`, restore `:focus-visible` styles globally

### 2. `/api/zeal/status` Returns 500 (PRODUCTION)
**Cause:** `NEO4J_URI` missing in Vercel environment variables  
**Fix:** Add `NEO4J_URI` + credentials to Vercel project settings

### 3. Merch Products Show $0.00
**Cause:** Printful API not returning prices or `/api/printful-catalog` transformation issue  
**Debug:** Check `src/app/api/printful-catalog/route.ts` and Printful API key

---

## ⚙️ COMMON COMMANDS

```bash
# Dev server
npm run dev                    # Start on port 3000
npm run dev -- --port 3001    # Start on port 3001

# Build & type-check
npm run build                  # Production build
npx tsc --noEmit              # TypeScript only (fast)

# Linting
npm run lint                   # ESLint

# Database
npx supabase db push          # Push migrations
npx supabase gen types        # Regenerate types

# Testing
npm run test                  # Jest (if configured)
npm run test:e2e              # Playwright (if configured)
```

---

## 🧪 TESTING CHECKLIST (Before Every Deploy)

### Visual/Functional
- [ ] All 15 key pages load without console errors
- [ ] Mobile hamburger menu scrolls independently (no background scroll)
- [ ] Back-to-top button hides when mobile menu open
- [ ] Merch store toggle works (Grid ↔ Explore)
- [ ] Merch products render with real prices (> $0)
- [ ] Zeal status endpoint returns 200
- [ ] Newsletter signup works (shows "THANKS!")
- [ ] Referral code generates and copies
- [ ] Community threads load and vote
- [ ] Booking calendar selects slots → Stripe checkout
- [ ] Contact form submits → email sent
- [ ] Lightbox/carousel navigation works

### Accessibility (Run with NVDA/VoiceOver)
- [ ] Tab through entire homepage — focus visible everywhere
- [ ] No CustomCursor interference with keyboard nav
- [ ] Color contrast passes WCAG AA on all text
- [ ] Alt text meaningful on all images

### Performance (Lighthouse)
- [ ] Performance > 85
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90
- [ ] No `@tensorflow/tfjs` in bundle
- [ ] Analytics scripts consolidated

---

## 🎯 PRIORITY BACKLOG (Next Agent Tasks)

| Priority | Task | Files | Est. Effort |
|----------|------|-------|-------------|
| **P0** | Fix CustomCursor accessibility | `CustomCursor.tsx`, `globals.css`, `layout.tsx` | 2-4 hrs |
| **P0** | Add NEO4J_URI to Vercel env | Vercel dashboard | 5 min |
| **P1** | Fix merch $0.00 prices | `api/printful-catalog`, Printful API key | 1-2 hrs |
| **P1** | Newsletter double opt-in | `Footer.tsx`, `api/newsletter` | 2-3 hrs |
| **P1** | Customer signup flow | `account/my-account/page.tsx` | 3-5 hrs |
| **P2** | Alt text on carousel/lightbox images | `photography/page.tsx`, `designs/page.tsx` | 2 hrs |
| **P2** | Remove @tensorflow/tfjs | `package.json`, `AnalyticsProvider.tsx` | 1 hr |
| **P2** | Consolidate analytics | `AnalyticsProvider.tsx`, `layout.tsx` | 1 hr |
| **P2** | Add structured data (Review, Product) | All page components | 2-3 hrs |
| **P3** | Cookie consent banner | New component + layout | 2 hrs |
| **P3** | Trust badges/certifications | Footer, checkout pages | 1 hr |

---

## 🛡️ SAFETY RULES (Non-Negotiable)

1. **NEVER** commit `.env.local` or any secrets
2. **NEVER** delete `public/`, `src/app/`, `src/components/` folders
3. **NEVER** modify `next.config.js` without testing build
4. **ALWAYS** run `npm run build` + `tsc --noEmit` before declaring done
5. **ALWAYS** test mobile viewport (375px) for hamburger menu
6. **ALWAYS** verify Stripe webhooks work in Vercel preview deployments

---

## 📊 MONITORING & DEBUGGING

```bash
# View build output
npm run build 2>&1 | tee build.log

# Check API health
curl http://localhost:3001/api/health | jq
curl http://localhost:3001/api/zeal/status | jq
curl http://localhost:3001/api/printful-catalog | jq '.products | length'

# Vercel deploy status
vercel logs <deployment-url>

# Supabase logs
npx supabase logs --project-ref <ref>
```

---

## 🤝 HANDOFF NOTES FOR NEXT AGENT

1. **Start with visual audit** — open `http://localhost:3001` and test every page
2. **Run the verification script:** `node verify_ux_fixes.js` — confirms today's fixes
3. **Check Lighthouse** — especially Accessibility score (currently blocked by CustomCursor)
4. **Read full audit:** `WYZ_DESIGN_SITE_AUDIT_REPORT.md` — 100-point breakdown
5. **Read handover:** `WYZ_DESIGN_NEXT_AGENT_HANDOVER.md` — detailed task list

### Today's Fixes Applied (Commit `74043d6`):
- ✅ `Navbar.tsx` — Mobile menu: `data-mobile-menu="true"`, `height: 100vh`, `overflowY: auto`, `overscrollBehavior: contain`, `onWheel`/`onTouchMove` stopPropagation
- ✅ `ScrollToTop.tsx` — Adds `menuOpen` state, interval check for menu DOM, hides button when `menuOpen === true`
- ✅ `merch/page.tsx` — Store toggle, Grid/Explore, parallax, SquareQuote
- ✅ `Footer.tsx` — Newsletter textSecondary
- ✅ `StrategyWizard.tsx` — Rush timeline note
- ✅ `admin/page.tsx` — Removed dead editing state
- ✅ `PageRenderer.tsx` — Removed dead page state
- ✅ `useNsfwSession.ts` — Removed dead session destructure

---

## 📞 ESCALATION

If any P0 blocker cannot be resolved:
1. Document exact error with logs/screenshots
2. Note which files were modified
3. Report to owner with: "BLOCKED: [issue] — need [specific input/access]"

**Owner:** Torreé  
**Comm Style:** Asshole Efficiency — complete fixes, no fluff, no placeholders

---

*This file is the single source of truth for any agent working on WYZ Design. Update it after every session.*