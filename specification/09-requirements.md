# 09 — Requirements

A checklist-style consolidation of the behavior the system must satisfy. Each item is testable.

## Functional requirements

### FR-1 — Portfolio page
- FR-1.1 Serve a single self-contained portfolio page at `/` (and `/index.html`).
- FR-1.2 Present sections: TL;DR, About, Experience, Projects, Stack, Education, FAQ, Contact.
- FR-1.3 Render and remain readable with JavaScript disabled.
- FR-1.4 Provide theme toggle (light/dark), mobile nav menu, and dynamic footer year when JS runs.

### FR-2 — Redirects
- FR-2.1 `/github`, `/linkedin`, `/calendly` → external profiles (302).
- FR-2.2 `/cv`, `/resume` → résumé PDF (301); `/image` → profile image (301);
  `/favicon.ico` → favicon (301); `/gameapp.gov.bd` → `/` (301).

### FR-3 — `POST /hello`
- FR-3.1 Accept JSON with required `message` (≤ 5000 chars) and optional `name`/`phone`/`email`.
- FR-3.2 Return 400 on invalid JSON, missing `message`, or oversized `message`.
- FR-3.3 Return 200 with `{ ok, message, received }` echoing provided fields.
- FR-3.4 Enable CORS on `/hello`.
- FR-3.5 Keep the visible `curl` in the contact section in sync with the request shape.

### FR-4 — Static serving & 404
- FR-4.1 Serve everything under `public/` via the `ASSETS` binding.
- FR-4.2 Return `public/404.html` with a 404 status for unmatched paths.
- FR-4.3 301 homepage requests carrying `?q=` to `https://takiuddin.me/`.

### FR-5 — SEO & AI surfaces
- FR-5.1 Provide JSON-LD `@graph`, `sitemap.xml`, `robots.txt`, `manifest.json`,
  `llms.txt`, `llms-full.txt`.
- FR-5.2 Noindex utility files; keep the page, `llms*.txt`, and the résumé PDF indexable.
- FR-5.3 All surfaces stay factually consistent with the page and `profile/taki_details.md`.

## Non-functional requirements

### NFR-1 — Security
- NFR-1.1 Set CSP, HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection,
  Referrer-Policy, Permissions-Policy on **every** response.
- NFR-1.2 CSP origins match exactly what the page loads.

### NFR-2 — Performance / caching
- NFR-2.1 `/assets/*` cached 1 year immutable.
- NFR-2.2 HTML uses `stale-while-revalidate` (5 min fresh, served instantly).
- NFR-2.3 Rely on automatic ETag/304 from Workers Static Assets.

### NFR-3 — Maintainability
- NFR-3.1 Backend logic confined to `src/index.ts`.
- NFR-3.2 No bundler/test config to maintain; no external JS/CSS bundle.
- NFR-3.3 Regenerate and commit `worker-configuration.d.ts` after `wrangler.toml` edits.

### NFR-4 — Portability / ops
- NFR-4.1 Deployable via `npm run deploy` (Cloudflare Workers).
- NFR-4.2 Custom-domain attach procedure documented (`08-deployment.md`).

## Out of scope (explicit non-requirements)
- Contact delivery (email/persistence) for `POST /hello`.
- Any database, auth, user accounts, or admin surface.
- Client-side framework, bundler, or CMS.
- The external chat/ask API implementation (separate project; only CSP-whitelisted here).

## Verification matrix (suggested manual checks)

| Requirement | How to verify |
|-------------|---------------|
| Security headers | `curl -I https://takiuddin.me/` — assert all 7 headers present; repeat on an asset and a 404 |
| Redirects | `curl -I https://takiuddin.me/cv` → 301 to PDF; `/github` → 302 |
| `POST /hello` | `curl -X POST .../hello -d '{"message":"hi"}'` → 200; empty body → 400 |
| 404 | request a random path → `404.html` body with 404 status |
| Caching | inspect `Cache-Control` on `/assets/...`, `/`, a `.pdf` |
| SEO | fetch `llms.txt` (200, `text/plain`, CORS `*`); `robots.txt` has `X-Robots-Tag: noindex` |
| No-JS | load page with JS disabled; content readable |
