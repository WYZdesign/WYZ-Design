# HANDOVER: Admin Panel Access for Claude Audit (2026-10-27)

Owner approved giving Claude admin access to audit the /admin panel. This file contains
WHERE the credentials live, not the values. Fetch them at runtime. Never paste the values
into chat, logs, commits, or this file.

## Login surface

- URL: `https://wyzdesign.com/admin` (prod) or `http://localhost:3000/admin` (dev)
- When unauthenticated, `/admin` renders `AccountAuth` (`src/components/admin/AdminShared.tsx`)
- Sign-in method for automation: **email + Admin Key** form (next-auth credentials provider,
  `signIn("credentials", { email, password, redirect: false })` in the same file, line ~52)
- Google button also exists but is not automatable — use the credentials form
- Gate after login: `src/lib/admin-auth.ts` checks the session email against `ADMIN_EMAILS`

## Credential retrieval (vault, on this machine)

```
python W:\WYZ_Command_Center\wyz_vault.py --get wyzdesign_ADMIN_EMAILS
python W:\WYZ_Command_Center\wyz_vault.py --get wyzdesign_ADMIN_PASSWORD
```

- `wyzdesign_ADMIN_EMAILS` may hold one or more comma-separated addresses; use the first one.
- `wyzdesign_ADMIN_PASSWORD` is the "Admin Key" field value.

## Rules for Claude

1. Read creds with the commands above at runtime; do not store them in any file you write.
2. Log in with Playwright MCP (system Chrome) — the browser session persists for the audit.
3. Log out (`signOut`) when the audit is done.
4. Do not create new admin users, change `ADMIN_EMAILS`, or modify `admin-auth.ts`.
5. Audit is read-only: do not place orders, send emails, or edit production data. If a
   write is required to test a form, use dev/local with local env vars instead.
