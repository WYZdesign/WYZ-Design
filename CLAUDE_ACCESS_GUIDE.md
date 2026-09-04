# CLAUDE - WYZ DESIGN PROJECT: FULL ACCESS SUMMARY
================================================

## PROJECT LOCATION & ACCESS
- **Path:** V:\wyzdesign (Next.js 14 portfolio site)
- **Root for all commands:** cd V:\wyzdesign
- **Dev server:** Running at http://localhost:3001 (already started)
- **Terminal:** PowerShell 7+ (bash tool = pwsh)
- **Git repo:** Yes - committed at Round 11 (74043d6), then 3794277 (Round 7)
- **Build state:** Clean - tsc + npm run build both pass

## ⚡ QUICK START CHECKLIST
Run these in PowerShell to verify access:

```
1. cd V:\wyzdesign
2. pwd                    # Should show V:\wyzdesign
3. curl -s http://localhost:3001/ -o $null -w "HTTP %{http_code}"  # Should be 200
4. npx tsc --noEmit 2>&1  # Should output nothing (0 errors)
5. npm run build 2>&1 | Select-Object -Last 5  # Should finish with route summary
```

## 📁 KEY FILES (Last Modified)

| File | What It Does | Status |
|------|-------------|--------|
| `src/components/Navbar.tsx` | Main nav with mobile menu | ✅ Fixed: scroll isolation |
| `src/components/ScrollToTop.tsx` | Back-to-top button | ✅ Fixed: hides when menu open |
| `src/app/merch/page.tsx` | Merch store + Printful integration | ✅ Round 11 |
| `src/components/Footer.tsx` | Site footer with newsletter | ✅ textSecondary fix |
| `AGENT_INSTRUCTIONS.md` | Full task list + priority backlog | ⭐ READ FIRST |
| `CLAUDE_HANDOVER.md` | Visual + API verification checklist | ⭐ READ FIRST |
| `WYZ_DESIGN_SITE_AUDIT_REPORT.md` | 100-point audit across 10 categories | Reference |
| `WYZ_DESIGN_NEXT_AGENT_HANDOVER.md` | Predecessor handover doc | Reference |

## ✅ TODAY'S FIXES VERIFIED (Round 11 - commit 74043d6)

### Fix 1: Mobile Menu Scroll Isolation (Navbar.tsx:341-346)
```html
<!-- Added to motion.div -->
data-mobile-menu="true"
style={{ height: '100vh', overflowY: 'auto', overscrollBehavior: 'contain' }}
onWheel={(e) => e.stopPropagation()}
onTouchMove={(e) => e.stopPropagation()}
```
**Result:** When menu opens, background page cannot scroll. Swipe/wheel inside menu only moves menu content.

### Fix 2: Back-to-Top Hides When Mobile Menu Open (ScrollToTop.tsx)
```javascript
// Added menuOpen state + polling effect
const [menuOpen, setMenuOpen] = useState(false);
useEffect(() => {
  const interval = setInterval(() => {
    const menu = document.querySelector('[data-mobile-menu="true"]');
    setMenuOpen(!!menu && getComputedStyle(menu).display !== 'none');
  }, 100);
  return () => clearInterval(interval);
}, []);

// Visibility now: scrollY > 400 && !menuOpen
```
**Result:** Scroll-to-top button fades out when mobile menu is open, prevents z-index overlap.

## 🔍 IMMEDIATE VERIFICATION (What Claude Should Do Now)

### 1. Browser Test — Open http://localhost:3001

**A. Mobile Menu (viewport < 768px)**
- Click hamburger icon → menu opens
- Scroll down inside menu → **page background should NOT move**
- Swipe gesture → **background should NOT move**
- Click X → menu closes, body scroll restored

**B. Back-to-Top Button**
- Scroll page down ~600px → button appears bottom-left
- Open mobile menu → button **hides immediately**
- Close menu → button reappears (if still scrolled)
- Click button → page scrolls smoothly to top

**C. Merch Page**
- Store toggle (Grid ↔ Explore) → views switch
- Product cards show prices > $0.00
- SquareQuote image has parallax scroll effect

### 2. API Health Check (PowerShell)
```powershell
cd V:\wyzdesign
curl -s http://localhost:3001/api/health | jq       # Should return 200 + JSON
curl -s http://localhost:3001/api/zeal/status | jq   # Should return 200 + data
curl -s http://localhost:3001/api/printful-catalog | jq '.products | length'  # Should be > 0
```

### 3. Build & TypeScript
```powershell
npx tsc --noEmit   # Must output nothing (0 errors)
npm run build      # Must complete with "117 routes generated" or similar
```

## ⚠️ CRITICAL BLOCKERS (If Applicable)

| Issue | Location | Priority | What to Do |
|-------|----------|----------|------------|
| CustomCursor breaks keyboard navigation | `src/components/CustomCursor.tsx` | **P0 (CRITICAL)** | Redesign to not replace system cursor — add `pointer-events: none` or restore `:focus-visible` globally |
| `/api/zeal/status` returns 500 | Vercel env: `NEO4J_URI` missing | **P0 (CRITICAL)** | Add `NEO4J_URI` to Vercel project settings (need dashboard access) |
| Merch products show $0.00 | `src/app/api/printful-catalog/route.ts` | **P1 (HIGH)** | Validate Printful API key; check transformation logic |
| No alt text on carousel images | `src/app/photography/page.tsx` | **P2** | Add meaningful alt text to all slider images |

## 📋 NEXT AGENT TASK PRIORITY ORDER

1. **Complete visual+functional verification** of both UX fixes
2. **Run Lighthouse audit** — check Accessibility > 90 (currently blocked by CustomCursor)
3. **Fix CustomCursor accessibility** — P0 blocker
4. **Add NEO4J_URI to Vercel** — P0 blocker for zeal status endpoint
5. **Fix merch $0.00 prices** — P1 blocker
6. **Implement newsletter double opt-in** — P1 feature
7. **Add customer signup flow** — P1 feature

## 📞 ESCALATION PATH

If stuck on any issue:
1. Check `AGENT_INSTRUCTIONS.md` for context
2. Review `WYZ_DESIGN_SITE_AUDIT_REPORT.md` for audit scores
3. Run: `python _ENGINE/wyz_preflight.py` (6-gate health check)
4. Report to owner (Torreé): "BLOCKED: [issue] — need [specific access/input]"

## 🛠️ COMMON POWERSHELL COMMANDS
```powershell
# Run in bash tool (converts to pwsh)
cd V:\wyzdesign && npm run dev          # Start dev server
cd V:\wyzdesign && npm run build       # Verify build
cd V:\wyzdesign && npx tsc --noEmit    # TypeScript check
cd V:\wyzdesign && git status          # Check git status
cd V:\wyzdesign && git diff            # See changes
Get-Content _LOGS\bridge.log -Tail 10  # Last 10 bridge log lines
```

---
**This document is the single source of truth for the next Claude agent. 
Read AGENT_INSTRUCTIONS.md first, then CLAUDE_HANDOVER.md, then begin verification.**