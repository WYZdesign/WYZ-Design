# WYZ DESIGN — HANDOVER FOR CLAUDE/Opencode

## Project Context & Access

**Location:** `V:\wyzdesign` (Next.js 14 Application)  
**Working Directory:** `W:\WYZ_Command_Center` (if different from project root)  
**Terminal:** PowerShell 7+ (Bash tool runs pwsh)  
**Port:** Dev server at `http://localhost:3001`

## ⚠️ CRITICAL: Environment Constraints

1. **Bash tool IS PowerShell** — Use PowerShell syntax:
   - Chain commands: `&&` (not `;`)
   - Quote paths: `"path with spaces\file.txt"`
   - `$LASTEXITCODE` for exit codes
   - All commands have timeout (default 30s, 120s for big ops)

2. **File operations** — Use dedicated tools, NOT bash cmdlets:
   - `Read` tool for reading files
   - `Write` tool for creating files  
   - `Edit` tool for editing files
   - Bash only for running builds, git, npm

3. **Build server** — Already running in background at port 3001

## 🎯 Current Status (2026-09-04)

### Recent Commits (Checked via git)
- **Round 11** just applied: `74043d6` — includes merch fixes, navbar, scroll-to-top
- `3794277` — Round 7 (last from master branch)
- **No conflicts** — local changes built successfully

### Build Status
- TypeScript: ✅ `tsc --noEmit` passes (0 errors)
- Production build: ✅ Running/passing (117 routes)
- Dev server: ✅ Running at port 3001

### Two UX Fixes Just Applied
1. **Mobile menu scroll isolation** (Navbar.tsx lines 341-346)
   - Added `data-mobile-menu="true"` attribute
   - Added inline style: `height: 100vh, overflowY: auto, overscrollBehavior: contain`
   - Added `onWheel` and `onTouchMove` with `stopPropagation()`

2. **Back-to-top hides when mobile menu open** (ScrollToTop.tsx)
   - Added `menuOpen` state variable
   - Added `checkMenu` effect that polls for `[data-mobile-menu="true"]`
   - Visibility logic now: `visible = scrollY > 400 && !menuOpen`
   - Button hidden via CSS when menu open

## 📋 Tasks to Cross-Check

### 1. Visual Verification (Do This First)
Open `http://localhost:3001` in browser and test:

| Feature | Test Action | Expected Result |
|---------|-------------|-----------------|
| Mobile hamburger | Click menu icon (< 768px) | Menu opens, body scroll locked |
| Menu scrolling | Scroll inside menu | **Background page does NOT move** |
| Close menu | Click X or outside | Menu closes, body scroll restored |
| Back-to-top | Scroll down 500px+ | Button appears bottom-left |
| Back-to-top + menu | Open menu | **Button HIDES** |
| Merch store toggle | Click toggle on merch page | Grid ↔ Explore views switch |
| Merch products | View products | Prices > $0.00 (check Printful) |

### 2. API Health Check
```bash
# Run these in PowerShell (Bash tool)
curl -s http://localhost:3001/api/health | jq
curl -s http://localhost:3001/api/zeal/status | jq
curl -s http://localhost:3001/api/printful-catalog | jq '.products | length'
```

### 3. Verify Build Still Passes
```bash
cd V:\wyzdesign && npm run build 2>&1
cd V:\wyzdesign && npx tsc --noEmit 2>&1
```

## 🔧 Quick File Reference

Key files with actual component paths (NOT virtual):

```
V:\wyzdesign\src\components\Navbar.tsx        ← Line 341-346 (mobile menu fix)
V:\wyzdesign\src\components\ScrollToTop.tsx  ← Lines 6-37 (back-to-top fix)
V:\wyzdesign\src\app\merch\page.tsx          ← Round 11 merch fixes
V:\wyzdesign\src\app\merch\concepts\page.tsx
V:\wyzdesign\src\app\api\printful-catalog\route.ts
V:\wyzdesign\src\components\CustomCursor.tsx  ← CRITICAL: breaks keyboard nav
```

## 🚫 What NOT to Touch

1. **Do NOT** modify `V:\wyzdesign\.env.local` without access to secrets
2. **Do NOT** delete `src/` folder or its contents
3. **Do NOT** modify `CustomCursor.tsx` to just remove it — must properly fix accessibility
4. **Do NOT** commit any local build output

## ✅ What You CAN Do

1. **Test** the two fixes with browser automation
2. **Verify** API endpoints respond with expected data
3. **Fix** accessibility issues (starting with CustomCursor)
4. **Add** environment variables to Vercel (if you have access)
5. **Deploy** or merge to master after verification

## 📞 If Blocked

1. **CustomCursor issue:** Need to redesign, not delete — breaks keyboard nav for all users
2. **`/api/zeal/status` 500:** Missing `NEO4J_URI` in Vercel env — can't fix without Vercel dashboard access
3. **Merch $0.00 prices:** Need Printful API key validation — check with owner

---

## Next Steps for Claude:

1. **Open browser** and manually test the two fixes
2. **Run verification script** at `verify_ux_fixes.js` if available
3. **Check for console errors** on each major page
4. **Document findings** — add to this handover if issues found
5. **Prioritize** accessibility fixes (CustomCursor break)

**Note:** This handover assumes you can run builds and tests. If you need access to Vercel/Supabase/Printful dashboards, request from owner.