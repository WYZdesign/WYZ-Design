# WYZ Design — Agent Rules

## Workflow (Every Session)

1. Make changes
2. `npx tsc --noEmit` — verify clean build
3. Update `HANDOVER.md` — add session entry with date, fixes, commits
4. `git add -A && git commit -m "..." && git push origin master` — Vercel auto-deploys from master
5. **Never skip steps.** Every commit = HANDOVER updated + build clean + pushed.

## Code Rules

- **Text:** No em dashes, no AI jargon, contractions encouraged, personable tone
- **Emojis:** Never in code files
- **PowerShell:** No bash, no heredoc — this is a Windows host
- **Security:** Never hardcode secrets. Use `getSiteUrl()` for URLs. Use DOMPurify for HTML sanitization (not regex).
- **TypeScript:** No `any` types. Use proper interfaces.
- **HTML output:** Always use `sanitizeHtml` from `@/lib/dompurify` — never regex alternatives.
- **Toast:** Use `react-hot-toast` for all user-facing success/error feedback. No `alert()`. No silent catch blocks.

## File Conventions

- **HANDOVER.md:** One running file, chronological sessions, overwritten each round
- **src/lib/dompurify.ts:** DOMPurify allowlist sanitizer — the only HTML sanitizer to use
- **src/lib/utils.tsx:** Shared utilities (shuffleArray, etc.) — import from here, don't duplicate
- **src/lib/logger.ts:** Dev-only logging — use `logger.warn/error` instead of console
- **src/lib/site-url.ts:** Shared `getSiteUrl()` — strips BOM from NEXT_PUBLIC_URL
