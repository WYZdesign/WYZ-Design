# WYZ Design Splash System Handover

**Updated:** 2026-10-07  
**Owner:** Torreé Marcel  
**Integration owner:** WYZMiND  
**Visual and device owner:** Claude Code  
**Codex contribution:** scroll boundary, motion-permission behavior, source audit, and production-set curation.

## Intent

The entry splash is a short brand moment, not a scrollable page and not a generic landing page. It must be visually rich without allowing the Home page to move, show through, receive focus, or react beneath it.

Desktop reacts to the mouse or pointer. Phone scenes react to orientation and tilt. Swipe, drag, and scroll are not scene controls.

## Current implementation

### Entrances

- `/` is the first-visit entry. A session visitor sees a randomized splash until selecting Enter. Returning visitors bypass it through `wyz-splash-seen` session storage.
- `/splash` is the standalone entry route and sends Enter to `/home`.
- `/splash-gallery`, `/splash-showcase`, and `/mobile-splash` are internal concept galleries, not production entry splashes. They intentionally scroll because they contain many concepts. Keep them out of prospect navigation and the public sitemap.

### Scroll and Home boundary

- `src/hooks/useSplashScrollLock.ts` is the only scroll-lock primitive for actual splash routes.
- It locks `html` and `body`, blocks wheel, touch move, and scroll keys, disables overscroll chaining, stops Lenis through `wyz:splash-lock`, and forces scroll position zero on unlock.
- Root Home content is visually and interaction-hidden while a splash is active. It now has `aria-hidden` and `inert`, so assistive technology cannot reach the obscured Home content.

### Motion

- `src/components/SplashVariants.tsx` has a 12-concept production registry: Constellation, Aurora, Depth, Nebula, Orbital, Spotlight, Magnetic, Tilt Glass, Sine Waves, Grid Warp, Mesh Drift, and Vortex.
- Every production selection is inside `TiltMotionFrame`, which responds to device orientation with a restrained 3D movement.
- Pointer interactions remain inside the individual desktop concepts.
- `src/hooks/useGyroPermission.ts` no longer turns a random touch or swipe into sensor permission. Browsers without a permission gate begin listening automatically. iOS visitors must deliberately select `Enable tilt`.
- `prefersReducedMotion()` keeps the first render on the static Brand treatment.

## Source-verified checks

- Scroll behind root splash: repaired.
- Scroll behind `/splash`: repaired.
- Lenis continuation beneath a splash: repaired.
- Home focus/readability beneath root splash: repaired.
- Keyboard path: Enter has initial focus and an accessible label.
- TypeScript: `npx tsc --noEmit --incremental false` exited 0 after the initial lock and motion changes.

## Required visual and device verification

Claude Code should verify these only after the integrated build is deployed or in a stable local production build:

1. Desktop at 1440px and 1024px: pointer motion feels immediate but does not cause layout shift, visible transform seams, or text jitter.
2. Phone at 320px, 390px, and 430px: no horizontal or vertical scroll, including browser overscroll bounce.
3. iOS Safari: Enable tilt prompts once, grants sensor access, and tilt is calm in portrait and landscape. Rejecting permission leaves a complete, intentional static experience.
4. Android Chrome: orientation responds without a permission affordance if the browser exposes the event directly.
5. Keyboard: focus begins on Enter, Enter and Space work, no focus reaches Home underneath, and Escape behavior is deliberately chosen.
6. Reduced motion: static entry has no continuous canvas or strong depth movement.
7. Background tab: canvas loops pause or are throttled enough to avoid needless device work. Add `visibilitychange` handling if profiling shows activity.
8. Lower-end phone: canvas count, particle count, and DPR stay within a smooth frame budget. Cap canvas backing resolution and consider fewer particles below a selected device threshold.

## Remaining engineering work

1. Add a shared canvas utility that uses `devicePixelRatio` with a cap and pauses its animation loop when `document.visibilityState !== "visible"`.
2. Move the 12 production concept metadata into a typed registry separate from the gallery-only experiments. Do not delete experiments until Torreé approves their retirement.
3. Add an automated route check for splash scroll position, locked wheel/touch behavior, initial keyboard focus, and reduced-motion fallback.
4. Verify whether root SEO requires Home markup to remain server-rendered behind the splash before changing render strategy. The current choice preserves existing output while making it inert during the brand moment.
5. Keep catalog routes non-public or turn them into a concise internal preview page. They should not compete with booking routes.

## Coordination rules

- Codex owns shared interaction truth, tests, and handovers.
- Claude Code owns visual composition, physical-device testing, and effect performance.
- WYZMiND reviews the combined diff, runs gates, commits, pushes, and verifies the deployment.
- No one should add a new production splash unless it meets every required visual and device verification item above.
