# HANDOVER: FULL VISUAL AUDIT OF wyzdesign.com — 2026-11-05

**Target:** `https://www.wyzdesign.com` (production, SHA `9595981`)

**Context:** Two batches of fixes just deployed (11 items + 9 items). This audit must verify everything works visually, functionally, and professionally. Do not assume anything — test every interaction, every viewport, every state.

---

## AUDIT MANDATE — BE EXHAUSTIVE

**You are the final quality gate.** If you miss something, it ships broken. Be ruthless. Document every issue with: page, component, viewport, steps to reproduce, severity (blocker/major/minor/polish), screenshot reference.

**Time budget:** Take as long as needed. Do not rush. A thorough audit of this scope takes 60-90 minutes minimum.

---

## 1. PREPARATION

### Required tooling
- Playwright MCP (already configured in opencode.json) — use `playwright_browser_navigate`, `playwright_browser_snapshot`, `playwright_browser_click`, `playwright_browser_take_screenshot`, `playwright_browser_eval`, `playwright_browser_wait_for`
- `wyz_web_shoot.py` for quick captures: `python W:\WYZ_Command_Center\_ENGINE\wyz_web_shoot.py <url> --dark --width 1600 --scroll "<text>"`
- Chrome DevTools (manual) for network/console/performance

### Viewports to test (ALL required)
| Device | Width x Height | Notes |
|--------|---------------|-------|
| iPhone SE / small mobile | 375 x 667 | Smallest common breakpoint |
| iPhone 13/14/15 Pro | 390 x 844 | Primary mobile target |
| iPhone Plus / Max | 428 x 926 | Large mobile |
| iPad Portrait | 768 x 1024 | Tablet |
| iPad Landscape | 1024 x 768 | Tablet landscape |
| Laptop / small desktop | 1366 x 768 | Most common laptop |
| Desktop HD | 1440 x 900 | Design reference |
| Desktop large | 1920 x 1080 | Full HD |
| Ultrawide | 2560 x 1440 | Edge case |

**Test EVERY viewport.** Do not skip. Mobile-first issues are the most common regression.

### Browsers
- Chrome (primary)
- Safari (if on Mac) — WebKit rendering differences matter
- Firefox — Gecko differences

### States to test per page
- [ ] Fresh load (cold cache)
- [ ] Cached reload (warm)
- [ ] Dark mode (toggle in navbar)
- [ ] Light mode (default)
- [ ] All 6 color themes (Classic, Ocean, Forest, Sunset, Midnight, Rose) — **both light and dark variants**
- [ ] Signed out (guest)
- [ ] Signed in (create test account if needed)
- [ ] Reduced motion ON (OS setting)
- [ ] High contrast mode (OS setting)
- [ ] JavaScript disabled (graceful degradation check)

---

## 2. PAGE-BY-PAGE AUDIT CHECKLIST

### 2.1 Homepage (`/`)

**Hero section**
- [ ] Video background loads, autoplays, loops, muted
- [ ] Text: "WE" red, "MAKE" white / "WHAT" red, "WORKS" white — **per-word colors correct**
- [ ] `TextSplit` stagger animation fires on load (up direction)
- [ ] Hero dots variant 3 animated
- [ ] CTA buttons: "BOOK NOW" (white bg), "VIEW WORK" (outline) — hover states, focus-visible rings
- [ ] Count-up stats strip: 90+, 45+, 10,000+, 13+ — animate on scroll into view, respect `prefers-reduced-motion`
- [ ] Grayscale-to-color hover on client logo carousel

**Scroll sections**
- [ ] Photography / Designs / Events / Services cards — hover lift, image zoom
- [ ] Testimonials auto-rotate (5 Google reviews) — manual prev/next, pause on hover/interact, resume timer
- [ ] FAQ — live search filters correctly, accordion open/close smooth
- [ ] Footer — newsletter signup, social links, sitemap links all work

**Navigation**
- [ ] Navbar fixed, video bg plays, crown logo glow pulse
- [ ] Main links: Home, Photography, Designs, Events, Printing — active state highlight
- [ ] More dropdown: 4 sections (About, Shop & Perks, Community, Support) — hover opens, correct links
- [ ] Search — opens modal, live results, Enter navigates, Escape closes
- [ ] Theme toggle (sun/moon) — toggles dark/light, persists
- [ ] Theme switcher (palette icon) — opens dropdown, 3-col grid, two-tone swatches, checkmark on active, preview vs saved message
- [ ] Profile dropdown (signed in) — Zeal points, cart, quick links, sign out
- [ ] Mobile menu — hamburger opens side drawer, all links work, profile/cart/Zeal widgets, search, theme switcher

### 2.2 Photography (`/photography` + `/photography/[category]`)

**Main page**
- [ ] Hero: split layout (text left, video right) — mobile full video bg
- [ ] Category filter pills — active state red, hover, dark mode variants
- [ ] Model archive grid — 7 models, shuffle on refresh, **GRAYSON label correct (not Sydney)**
- [ ] Model cards — hover: image scale, overlay with name/title, play button
- [ ] Modal on click — lightbox with gallery, prev/next, keyboard nav, close on Escape/click overlay
- [ ] AutoScrollRow (album carousels) — **object-contain** (no crop), fixed height, auto width, preload, pause on hover
- [ ] Dark mode — category titles **no drop-shadow** (was `drop-shadow-lg`, now `dark:drop-shadow-none`)

**Category pages**
- [ ] Gallery grid — images load eager, object-cover, lightbox works
- [ ] Infinite scroll / pagination if applicable

### 2.3 Designs (`/designs`)

**Hero**
- [ ] Split layout (text left, video right) — mobile full video
- [ ] Text: "DESIGNING THE" white, "FUTURE" red

**Carousels (Cover Art, Flyers, Logos)**
- [ ] **object-contain** — no cropping, images at natural aspect ratio
- [ ] Fixed height (`h-[232px] sm:h-[338px] md:h-[423px]`), auto width
- [ ] Preload — images appear instantly, no white boxes mid-scroll
- [ ] Auto-scroll — pause on hover, resume after 3s, touch drag works
- [ ] Direction: Cover Art left, Flyers right, Logos left
- [ ] Lightbox on click — full screen, object-contain

**FAOTM section**
- [ ] Danny Davis image — `/images/danny-davis.png` (same as FAOTM page)
- [ ] ScrollParallaxCard tilt, ImageHoverReveal zoom
- [ ] Links: "MEET DANNY", "VIEW FEATURE"

**Merch strip**
- [ ] **Real Printful products** (not mock archive photos)
- [ ] Hover: "Quick View" overlay, image scale 1.1x
- [ ] Click → QuickViewModal opens with real product data, image, price, description, "Choose options and add to cart" link → `/merch/[id]`
- [ ] Products load eager, no layout shift

**Concept Generator**
- [ ] Textarea, Enter submits, loading state, AI response renders
- [ ] Error handling if API down

**Case Studies**
- [ ] 4 cards (Artfinix, Kid Bode, Dawneeah's Glow, GFT Foods) — hover lift, accent glow, stats, arrow

### 2.4 Events (`/events`)

**Hero**
- [ ] Random DIY video on each load — **starts at 6s** (not 0, not 10s — verify current is 6s)
- [ ] Preload link injected — video plays instantly
- [ ] Loop restarts at 6s (check `onTimeUpdate` handler)
- [ ] Overlay: black base + **75% opacity** (`bg-black/75`)
- [ ] Text: "SIMPLIFY" red, "YOUR" white / "EVENT" white, "PLANNING" red
- [ ] CTAs: "BOOK NOW", "PHOTO GALLERIES"

**Marquee**
- [ ] EnhancedMarquee — words scroll, gradient fade edges **transparent in dark mode** (no `dark:from-[#1C1C1E]`)
- [ ] Pause on hover

**Sign-up section**
- [ ] Concert crowd bg, dark overlay, YouTube icon pulse/float
- [ ] Counter: 90+ Client Events, 12+ DIY Shows, 600+ Live Shows — AnimatedCounter

**DIY Shows carousel**
- [ ] VideoCarousel — **object-contain** (no crop), fixed height, auto width
- [ ] Hover: play from 6s, mute toggle, volume 0.3
- [ ] Tripled track for seamless loop
- [ ] Click → VideoModal (full screen, controls, mute toggle)

**Client Events carousel**
- [ ] Same as DIY Shows — verify both carousels work identically
- [ ] **Gap to YouTube section: `mt-10 sm:mt-16`** — visible breathing room

**YouTube section**
- [ ] YouTube logo grid — spotlight follows mouse, hover opacity
- [ ] Subscribe CTAs work (external links)
- [ ] Animated counters

**Previous Events**
- [ ] CSS columns grid (2/3/4/5 cols responsive) — images object-cover, hover scale/overlay

### 2.5 Merch (`/merch` + `/merch/[id]`)

**Hero**
- [ ] Accordion gallery (6 images) — hover expands panel
- [ ] "WORN" white, "DIFFERENT" red
- [ ] Typewriter text animates
- [ ] Shop Now anchor scroll

**Why DBC Merch**
- [ ] 3 feature cards — icons, hover shadow/glow

**Shop grid**
- [ ] Category filter pills (All, Apparel, Headwear, Accessories)
- [ ] Sort dropdown (Featured, Price ASC/DESC)
- [ ] ProductGrid — **object-contain**, aspect-square, hover lift + scale + Quick View overlay
- [ ] Badge rendering (if any)
- [ ] "Printed to order" label dark mode contrast (`#6B6B6B` / `#A8A8A8`)
- [ ] QuickViewModal — image, name, price, description, category, "Choose options and add to cart" → PDP

**Bundle Sets**
- [ ] 6 sets rendered: Top+Cap, Top+Carry, Full Fit, **Cap+Carry**, **Double Top**, **The Alt Fit**
- [ ] De-dupe: no duplicate combos even if catalog small
- [ ] Each set: image grid (2x2), name, item list, total price, item links → PDP
- [ ] Bundle discount note: "Buy 2+ pieces, 10% off at checkout"

**Lookbook**
- [ ] Archive images swipeable (snap-x), hover zoom, "DBC Archive" label

**PDP (`/merch/[id]`)**
- [ ] Image gallery (thumbnails + main)
- [ ] Variant selectors (size, color) — price updates
- [ ] Add to cart → cart drawer opens
- [ ] Related products strip (4 items, same category first)

### 2.6 Printing (`/printing`)

**Flip cards (3: Prints+Posters, Vinyl Stickers, Business Cards)**
- [ ] Front: image, title, subtitle
- [ ] Hover/click → flip to back
- [ ] **Prints+Posters front: rave flyers wallpaper** (`/images/printing/rave-flyers-wallpapers.webp`)
- [ ] Back: pricing grid with **size labels**
  - Prints: Letter (8.5x11), Tabloid (11x17), Medium (18x24), Large (24x36)
  - Stickers: Small (2x2), Medium (3x3), Large (4x4), XL (5x5)
- [ ] "ORDER NOW" → `/booking`

### 2.7 Other pages (spot check)

- [ ] `/about` — hero, mission, founder, brands
- [ ] `/services` — accordion cards, pricing, booking CTAs
- [ ] `/booking` — form submits, validation, calendar integration
- [ ] `/loyalty` / `/rewards` — Zeal dashboard, referral, gift cards
- [ ] `/featured-artist` — Danny Davis full page
- [ ] `/wyzmind` — embed/iframe works
- [ ] `/community`, `/blog` — content renders
- [ ] `/contact`, `/faq` — forms, search
- [ ] `/account/my-account` — profile, orders, **Appearance section with theme picker**
- [ ] `/admin` — **only if you have valid admin creds** (vault `wyzdesign_ADMIN_PASSWORD` is stale — may not work)

---

## 3. GLOBAL SYSTEM VERIFICATION

### 3.1 Dark Mode
- [ ] Navbar toggle (sun/moon) — adds/removes `.dark` on `<html>`
- [ ] Persists in localStorage (`wyz-theme`)
- [ ] All pages: backgrounds, text, borders, cards, buttons, inputs, modals, dropdowns — correct dark colors
- [ ] **No hardcoded light colors bleeding through** (search for `#FFFFFF`, `#F5F5F3`, `#111`, `#333` in computed styles on dark)
- [ ] Red contrast boost: `#DF3131` → `#FF5252` on dark (WCAG AA)
- [ ] Small red text: `#C00000` on light, `#FF5252` on dark
- [ ] `.wz-on-dark` opt-out works (merch hero label)

### 3.2 Color Themes (6 themes × 2 modes = 12 combinations)
For EACH theme (Classic, Ocean, Forest, Sunset, Midnight, Rose) in BOTH light and dark:
- [ ] Primary buttons (`bg-[#DF3131]` → theme primary)
- [ ] Primary hover (`hover:bg-[#B82020]` → theme primaryHover)
- [ ] Text links (`text-[#DF3131]`)
- [ ] Borders (`border-[#DF3131]`)
- [ ] Badges, pills, focus rings, group-hover states
- [ ] **Scope check:** opacity utilities (`bg-[#DF3131]/20`), gradients (`from-[#DF3131]`), shadows (`shadow-[#DF3131]`) — **these should NOT retheme** (known limitation, document any that accidentally do)
- [ ] YouTube red (`#FF0000`/`#CC0000`) on Events page — **must NOT retheme**

### 3.3 Theme Switcher UX
- [ ] Guest: clicks theme → site recolors instantly → **reload → back to Classic** (no storage write)
- [ ] Signed in: clicks theme → saves to `localStorage` (`wyz-color-theme-account`) → reload → theme persists
- [ ] Dropdown: 3-col grid, two-tone diagonal swatches, checkmark on active, header shows "Light variant" / "Dark variant", bottom line says "Just previewing..." (guest) or "Saved as your default..." (signed in)
- [ ] Account page Appearance section — same picker, same behavior

### 3.4 Animations & Motion
- [ ] `prefers-reduced-motion` respected — all transitions/animations disabled, count-up instant, confetti no-op, typewriter instant
- [ ] Framer Motion components — smooth, no jank
- [ ] CSS animations (marquee, hero gradients, dots) — performant, no layout thrashing
- [ ] Mobile heat guard: hero gradient animations disabled < 640px

### 3.5 Performance
- [ ] LCP < 2.5s on 3G throttling (Chrome DevTools)
- [ ] CLS < 0.1 — no layout shifts on load
- [ ] Images: eager loading above fold, lazy below, proper `sizes` attributes
- [ ] Video: `preload="metadata"` or `preload="auto"` only where needed, no double-download
- [ ] No console errors (except known: CSP report-only, font preload warnings)

### 3.6 Accessibility
- [ ] Skip-to-content link works (Tab first)
- [ ] Focus-visible rings on all interactive elements (2px `#DF3131` light, `#FF5252` dark)
- [ ] ARIA labels on icon-only buttons, modals, carousels
- [ ] Modal trap focus, Escape closes, background scroll locked
- [ ] Carousels: pause on hover, keyboard nav (arrows), ARIA live regions
- [ ] Color contrast: all text ≥ 4.5:1 (AA), large text ≥ 3:1
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] Form inputs: labels, autocomplete, error states, 44px min height

### 3.7 Analytics & Consent
- [ ] Cookie banner appears first visit
- [ ] Accept → pageviews recorded, consent cookie set
- [ ] Reject → no analytics, banner dismissed
- [ ] `/api/health` → `redis: ok`, cron status
- [ ] Admin Automations tab (if accessible) — cron statuses, integration booleans

### 3.8 Error States
- [ ] 404 page — branded, search link, home link
- [ ] 500 page — friendly, contact link
- [ ] Network offline — graceful degradation (if SW registered)
- [ ] Form validation — inline errors, accessible

---

## 4. REGRESSION HUNT — SPECIFIC TO RECENT CHANGES

### From 11-item batch (SHA `c2526b4`)
- [ ] Events hero video starts at 6s, loops at 6s, preload works
- [ ] Events marquee gradient fade transparent in dark
- [ ] VideoCarousel `object-contain` (no black bars)
- [ ] Photography: Grayson label, dark mode no shadow on category titles
- [ ] Designs carousels: `object-contain`, preload
- [ ] Home hero: "WE MAKE" / "WHAT WORKS" two lines
- [ ] Merch FAOTM: Danny image
- [ ] Printing: rave flyers image, size labels
- [ ] Theme switcher: 6 themes, CSS variables, guest preview, signed-in save

### From 9-item batch (SHA `9595981`)
- [ ] Home hero per-word colors
- [ ] Nav restructure: 5 main, 4 grouped More
- [ ] Theme switcher full UI + persistence
- [ ] Events spacing gap
- [ ] Designs merch strip: real Printful + QuickView
- [ ] Bundle sets: 6 combos, de-dupe

### Provider order fix
- [ ] No SSR errors on pages using `useSession()` (was failing on `/events/gallery/[event]`, `/model-archive/gallery/[model]`, `/_not-found`)

---

## 5. REPORTING FORMAT

For EVERY issue found, create an entry:

```
## [SEVERITY] Page / Component — Brief Title

**Viewport:** 390x844 (iPhone 13 Pro) / 1440x900 (Desktop) / etc.
**Mode:** Dark / Light / Theme: Ocean (dark)
**State:** Signed out / Signed in / Reduced motion

**Steps:**
1. Go to /events
2. Hover Client Events carousel video
3. Observe...

**Expected:** Video plays from 6s, muted, volume 0.3
**Actual:** Video plays from 0s, unmuted

**Screenshot:** wyz_web_shoot.py capture or Playwright screenshot path
**Console/Network:** Any errors?
**Severity rationale:** Blocker — core feature broken / Major — visible regression / Minor — polish / Polish — nitpick
```

**Severity definitions:**
- **Blocker:** Core user flow broken (booking, cart, navigation, hero video, dark mode)
- **Major:** Visible regression, feature partially works, accessibility violation
- **Minor:** Visual inconsistency, missing hover state, slight layout shift
- **Polish:** Nitpick, could be better, not user-facing broken

---

## 6. SCREENSHOT PROTOCOL

Use `wyz_web_shoot.py` for consistent captures:
```bash
python W:\WYZ_Command_Center\_ENGINE\wyz_web_shoot.py "https://www.wyzdesign.com/events" --dark --width 1600 --scroll "CLIENT EVENTS"
python W:\WYZ_Command_Center\_ENGINE\wyz_web_shoot.py "https://www.wyzdesign.com/designs" --dark --width 390 --scroll "MERCH SHOP"
```

Name format: `audit_<page>_<viewport>_<mode>_<theme>.png`
Save to `W:\WYZ_Command_Center\_STATE\web_shots\audit_2026-11-05\`

---

## 7. SIGN-OFF

Only mark audit complete when:
- [ ] All 9 pages tested at all 9 viewports × 2 modes × 6 themes × 2 auth states = **1,944 combinations** (sample strategically but cover all critical paths)
- [ ] All 11 + 9 + 1 fix items verified
- [ ] Zero Blockers, zero Majors
- [ ] Documented Minors/Polish ≤ 10 total
- [ ] Screenshots captured for all critical paths
- [ ] Report written to `W:\WYZ_Command_Center\_STATE\AUDIT_REPORT_2026-11-05.md`

---

## 8. ESCALATION

If you find a **Blocker** or **Major**:
1. Document immediately
2. Stop audit on that feature
3. Report to Torreé with reproduction steps
4. Do NOT continue testing downstream dependent features until fixed

**You have full authority to block deploy.** If the site isn't 10/10, it doesn't ship.

---

**Remember:** This is a production creative agency site. "Good enough" is not the standard. Every pixel, every interaction, every state must be intentional and polished. If you wouldn't show it to a client paying $10k+, it's not done.

**Go be ruthless.**