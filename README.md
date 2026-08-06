# WYZ DESIGN

Official website for **WYZ DESIGN** — a full-spectrum creative agency in Chicago, IL (photography, graphic design, videography, web design, printing, and creative consulting). Founded and operated by Torre Harris.

**Live:** https://www.wyzdesign.com

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + Lightning CSS |
| UI | React 19, Framer Motion, react-icons |
| Auth | NextAuth v5 (Google OAuth + admin credentials) |
| Database | Supabase (Postgres, service-role + publishable keys) |
| Payments | Stripe (checkout, subscriptions, gift cards, webhooks) |
| Email | Resend + Nodemailer |
| AI | OpenRouter (cloud LLMs) + local Ollama fallback |
| Search | Local Qdrant vector search; static index on Vercel |
| Monitoring | Umami analytics, Vercel Analytics, Sentry-compatible telemetry sink (`/api/telemetry`) |
| Rate limiting | Upstash Redis (edge + server) with in-memory fallback |
| Deploy | Vercel (cron jobs, edge proxy, CI via GitHub Actions) |

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
```

Production-grade verification before any deploy:

```bash
npm run lint       # ESLint — must be 0 errors
npx tsc --noEmit   # TypeScript — must be 0 errors
npm run test:run   # Vitest — must pass
npm run build      # Next production build
```

## Environment Variables

Create `.env.local` (never commit it). All variables are read from `process.env`:

### Core
| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXTAUTH_SECRET` | Yes | NextAuth JWT signing secret |
| `NEXT_PUBLIC_URL` | Yes | Canonical site URL (sitemap/robots/emails) |
| `ADMIN_EMAILS` | Yes | Comma-separated emails allowed admin sign-in |
| `ADMIN_PASSWORD` | Yes | Credentials-provider admin password |

### Supabase
| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Client (anon) key |
| `SUPABASE_URL` | Yes | Service-side URL |
| `SUPABASE_SECRET_KEY` | Yes | Service-role key (server only) |

### Stripe
| Variable | Required | Purpose |
|----------|----------|---------|
| `STRIPE_SECRET_KEY` | Yes | Server-side Stripe key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Webhook signature verification |
| `STRIPE_STARTER_PRICE_ID` | No | Starter plan price |
| `STRIPE_PRO_PRICE_ID` | No | Pro plan price |
| `STRIPE_BUSINESS_PRICE_ID` | No | Business plan price |
| `STRIPE_ULTIMATE_PRICE_ID` | No | Ultimate plan price |
| `STRIPE_MUSE_SPARK_PRICE_ID` | No | Muse Spark plan price |
| `STRIPE_MUSE_MUSE_PRICE_ID` | No | Muse plan price |
| `STRIPE_MUSE_SOVEREIGN_PRICE_ID` | No | Muse Sovereign plan price |
| `NEXT_PUBLIC_STRIPE_PORTAL_URL` | No | Customer portal URL |

### Auth / OAuth
| Variable | Required | Purpose |
|----------|----------|---------|
| `GOOGLE_CLIENT_ID` | No | Google OAuth app ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth app secret |
| `FACEBOOK_CLIENT_ID` | No | Facebook OAuth (disabled — app ID invalid) |
| `FACEBOOK_CLIENT_SECRET` | No | Facebook OAuth secret |

### AI
| Variable | Required | Purpose |
|----------|----------|---------|
| `OPENROUTER_API_KEY` | Yes | Cloud LLM access for chat / concept generator |
| `OLLAMA_URL` | No | Local Ollama fallback (default `http://localhost:11434`) |

### Email / Notifications
| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | Yes | Transactional email (newsletter welcome) |
| `DISCORD_WEBHOOK_URL` | No | Discord notifications |
| `NOVU_API_KEY` | No | Novu notifications |
| `N8N_WEBHOOK_URL` | No | n8n workflow trigger on Stripe events |

### Rate limiting
| Variable | Required | Purpose |
|----------|----------|---------|
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis URL (falls back to in-memory) |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis token |

### Media / Storage
| Variable | Required | Purpose |
|----------|----------|---------|
| `CLOUDINARY_API_KEY` | No | Cloudinary uploads |
| `CLOUDINARY_API_SECRET` | No | Cloudinary secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name |
| `MINIO_URL` | No | MinIO object storage |
| `GOOGLE_DRIVE_API_KEY` | No | Google Drive gallery index |
| `PRINTFUL_API_KEY` | No | Printful catalog |

### Knowledge graph (local only)
| Variable | Required | Purpose |
|----------|----------|---------|
| `NEO4J_URI` | No | Neo4j graph brain URI |
| `NEO4J_USER` | No | Neo4j user |
| `NEO4J_PASSWORD` | No | Neo4j password |
| `REDIS_HOST` / `REDIS_PORT` | No | Redis queue (local) |

> Do not include `NODE_ENV` or `VERCEL` — Vercel injects those.

## API Reference

All endpoints live under `src/app/api/`. Responses are JSON. Mutating endpoints enforce CSRF origin validation and rate limits (edge proxy + route-level).

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/health` | GET | No | Uptime, memory, uploads integrity |
| `/api/search` | GET/POST | No | Static (prod) or Qdrant (local) search |
| `/api/contact` | POST | No | Contact form (5/min, CSRF) |
| `/api/newsletter` | GET/POST | No | Subscribe/unsubscribe (CSRF) |
| `/api/checkout` | POST | No | Stripe checkout sessions (30/min, CSRF) |
| `/api/webhook` | POST | No | Stripe webhook (signature-verified) |
| `/api/chat` | POST | No | WYZi AI assistant (15/min) |
| `/api/concept-generate` | POST | No | AI design concept generator (10/min) |
| `/api/forms` | POST | Session | Authenticated form persistence |
| `/api/upload` | POST | Session | Image/video upload (CSRF, 10MB) |
| `/api/bugs` | POST | Session | Bug reporting (5/min, CSRF) |
| `/api/loyalty` | GET | Session | Loyalty points + history |
| `/api/profile` | GET | Session | User profile |
| `/api/admin` | GET | Admin | Admin data endpoints |
| `/api/blog`, `/api/models`, `/api/events`, `/api/gdrive-*`, `/api/model-photos`, `/api/album-images`, `/api/printful-catalog`, `/api/geocode`, `/api/telemetry`, `/api/csp-report`, `/api/fd`, `/api/pages` | varies | — | Content + utility routes |

### Error format

Standardized error responses use the shape:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please slow down and try again shortly."
  }
}
```

HTTP status codes are meaningful: `400` bad request, `401` unauthenticated, `403` forbidden/CSRF, `404` not found, `413` payload too large, `415` unsupported media, `429` rate limited, `500` server error, `503` service not configured.

## Edge Security (src/proxy.ts)

The edge proxy runs before every API and page request:

- Blocks known malicious user agents (sqlmap, nikto, wpscan, scanners)
- Blocks sensitive path probes (`/.env`, `/.git`, `/wp-admin`, etc.)
- Enforces per-IP API rate limits (admin 30/min, GET 120/min, POST 20/min)
- Emits `X-Request-Id` and rate-limit headers on all responses
- Fail-open: rate limiter outages never take the site down

Security headers (CSP, HSTS, frame-ancestors DENY, Permissions-Policy) are applied in `next.config.ts` and `vercel.json`.

## Deployment

### CI

GitHub Actions (`.github/workflows/ci-cd.yml`) runs lint + typecheck + tests on push to `main`/`develop`.

### Vercel

```bash
vercel deploy --prod --yes
```

Cron jobs (defined in `vercel.json`): `/api/health` every 5 min, `/api/backup` daily at 6:00 UTC.

### Domain

`wyzdesign.com` → `https://www.wyzdesign.com` (301 redirect). `https://muse.wyzdesign.com/muse` is a separate deployed app.

## Project Structure

```
src/
  app/            # App Router pages + API routes
    api/          # All backend endpoints (see API Reference)
    home/         # Main home page
    photography/  # Photography portfolio
    ...           # remaining pages
  components/     # React components (Navbar, Footer, ChatWidget, ...)
  hooks/          # Custom React hooks
  lib/            # Server/client libraries
    rate-limit.ts           # Rate limiter (Upstash + fallback)
    csrf.ts                 # CSRF origin validation
    supabase.ts             # Supabase clients
    stripe.ts               # Stripe helpers
    openrouter.ts           # Cloud LLM
    wyzmind.ts              # Qdrant + knowledge brain integration
    logger.ts               # Dev logging
    errorTracker.ts         # Client telemetry
  proxy.ts        # Edge security middleware
  types/          # Shared TypeScript types
```

## Backend Dependencies

WYZMIND services (used in local development and wired for production extension): Qdrant vector search (`wyzmind_v3`, 768-dim embeddings via nomic-embed-text), Neo4j knowledge graph, Redis queue, Ollama local LLMs, n8n workflow automation.

---

*WYZ DESIGN — signal, signature, silent broadcast.*
