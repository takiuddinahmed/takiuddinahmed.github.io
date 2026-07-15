# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page personal portfolio for Md Takiuddin Ahmed (takiuddin.me), served by a **Cloudflare Worker** running the **Hono** framework. The static files live in `public/` and are served through Cloudflare **Workers Static Assets** (the `ASSETS` binding); the Worker (`src/index.ts`) sits in front of every request and applies security headers, redirects, cache/SEO headers, and 404 handling in code. The chat widget talks to an external API (`https://ask-api.takiuddin.me`) that lives elsewhere.

## Commands

```bash
npm run dev          # wrangler dev — local Worker + assets at http://127.0.0.1:8787
npm run deploy       # wrangler deploy — publish the Worker
npm run types        # wrangler types — regenerate worker-configuration.d.ts (run after editing wrangler.toml)
npm run typecheck    # tsc --noEmit
npm run optimize:images            # sharp: regenerate public/assets/images/optimized/ (AVIF+WebP)
npm run optimize:images:responsive # also emit -sm/-md/-lg/-xl variants
```

There is no test suite or bundler config to maintain — Wrangler bundles `src/index.ts` (esbuild) automatically. There is no separate "build" step for the pages; they are static files served as-is.

## Architecture

**`src/index.ts` is the whole backend.** A Hono app with four parts, in order:
1. A global `app.use('*')` middleware that sets the security headers (CSP, HSTS, X-Frame-Options, etc.) on **every** response. Because `run_worker_first = true` in `wrangler.toml`, the Worker runs for every request — including static assets — so these headers apply site-wide. Responses from `ASSETS.fetch()` have **immutable headers**, so the middleware rebuilds the `Response` rather than mutating headers in place.
2. Redirect routes (`/github`, `/linkedin`, `/calendly`, `/cv`, `/resume`, `/image`, `/favicon.ico`, `/gameapp.gov.bd`) registered **before** the catch-all.
3. `POST /hello` — a public JSON "say hello" endpoint (`message` required; `name`, `phone`, `email` optional; `cors()` enabled). It currently validates and echoes the payload back — it does **not** email or persist anything, so submissions aren't delivered anywhere yet.
4. A catch-all `app.all('*')` that proxies to `c.env.ASSETS.fetch()` and layers per-path `Cache-Control`, `Content-Type`, and SEO headers (`X-Robots-Tag`, CORS on `llms*.txt`).

**`public/` is the served root.** Everything reachable by URL lives here (`index.html`, `404.html`, `manifest.json`, `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `license.txt`, and `assets/`). Anything at the repo root (`src/`, `scripts/`, `wrangler.toml`, `package.json`, `profile/`, `resume/*.tex`, docs) is **not** served. Asset paths in the HTML are **relative** (`assets/favicon/…`), which only works because `index.html` and `assets/` are siblings inside `public/` — keep them together.

**Caching / ETags are automatic.** Workers Static Assets generates strong `ETag`s and serves 304s on its own; there is no manual ETag/hashing step (the old `build-cache.js` scheme is gone). `Cache-Control` is set explicitly in the `src/index.ts` catch-all: `/assets/*` → 1-year immutable, `*.html`/`/` → 5 min fresh + `stale-while-revalidate` (served instantly, revalidated in the background), other top-level files → 1 hour, PDFs → 1 day.

**No more declarative config files.** `_headers` and `_redirects` were deleted; their logic is reimplemented in `src/index.ts`. With `run_worker_first = true`, Cloudflare would ignore those files anyway. `not_found_handling = "404-page"` makes `ASSETS.fetch()` return `public/404.html` with a 404 status for unmatched paths.

## The pages are self-contained

`public/index.html` and `public/404.html` are **fully self-contained** — all CSS is in an inline `<style>` block and all JS in inline `<script>` blocks. The only external resources are Google Fonts (JetBrains Mono + Inter), Google Analytics, and the chat API. **To change the site's look or behavior, edit the inline `<style>`/`<script>` in those files directly.** There is no Tailwind step or external JS bundle (the old `assets/css`/`assets/js` pipeline was removed in the Workers migration).

## Editing gotchas

- Changing the **CSP** or any allowed origin means editing the `CSP` constant in `src/index.ts`. Keep it consistent with what the pages actually load (fonts, analytics, `ask-api.takiuddin.me`) or you'll break them.
- After editing `wrangler.toml`, run `npm run types` and commit the regenerated `worker-configuration.d.ts`.
- The `POST /hello` request shape is mirrored by a visible `curl` in the contact section of `public/index.html` — keep the two in sync when the endpoint changes.
- SEO/AI surfaces are first-class and must stay consistent with page content when facts change: JSON-LD `@graph` in `public/index.html` `<head>`, `public/sitemap.xml`, `public/robots.txt`, `public/manifest.json`, and the hand-maintained `public/llms.txt` / `public/llms-full.txt`. `profile/taki_details.md` (not served) is the long-form source used to author these.

## Deployment

`npm run deploy` publishes to `takiuddinahmed-github-io.<subdomain>.workers.dev`. To serve `takiuddin.me` from the Worker: remove the custom domain from the old Cloudflare **Pages** project first, then uncomment the `routes` line in `wrangler.toml` and redeploy. Zone-level rules (Always Use HTTPS, www→apex redirect) are configured in the Cloudflare dashboard and are independent of the Pages→Workers switch.
