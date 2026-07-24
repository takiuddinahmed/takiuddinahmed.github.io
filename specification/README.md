# Specification — takiuddin.me

This folder is the specification for the personal portfolio site of **Md Takiuddin Ahmed**
(https://takiuddin.me). It describes *what the system does and why*, independent of the
exact source lines, so the site can be understood, reviewed, or rebuilt from these documents.

For day-to-day contributor guidance (commands, editing gotchas), see the repo-root
`CLAUDE.md`. This folder is the higher-level, durable specification.

## Documents

| # | Document | Scope |
|---|----------|-------|
| 1 | [01-overview.md](01-overview.md) | Purpose, audience, goals, scope, non-goals |
| 2 | [02-architecture.md](02-architecture.md) | Runtime model: Cloudflare Worker + Hono + Static Assets |
| 3 | [03-backend-api.md](03-backend-api.md) | Routes: security middleware, redirects, `POST /hello`, catch-all |
| 4 | [04-frontend.md](04-frontend.md) | Page structure, sections, client behaviors |
| 5 | [05-seo-and-ai-surfaces.md](05-seo-and-ai-surfaces.md) | JSON-LD, sitemap, robots, manifest, `llms*.txt` |
| 6 | [06-assets-and-content.md](06-assets-and-content.md) | Images, favicons, resume/CV, content source of truth |
| 7 | [07-security.md](07-security.md) | CSP, HTTP security headers, threat model |
| 8 | [08-deployment.md](08-deployment.md) | Build, config, deploy, domain, caching |
| 9 | [09-requirements.md](09-requirements.md) | Functional & non-functional requirements checklist |
| 10 | [10-chatbot.md](10-chatbot.md) | "Ask about Taki" chatbot: Workers AI, `POST /api/chat`, grounding, guardrails, bubble UI |

## Quick facts

- **Domain:** takiuddin.me (single-page portfolio)
- **Runtime:** Cloudflare Worker (Hono framework), TypeScript
- **Serving:** Workers Static Assets (`ASSETS` binding) over `public/`
- **Backend surface:** one file — `src/index.ts`
- **Pages:** fully self-contained `public/index.html` + `public/404.html` (inline CSS/JS)
- **No** bundler, no test suite, no server-side templating, no database
