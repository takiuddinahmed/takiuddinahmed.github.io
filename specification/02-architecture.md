# 02 — Architecture

## Runtime model

```
                         ┌──────────────────────────────────────────┐
   Request  ───────────► │  Cloudflare Worker  (src/index.ts, Hono)  │
                         │                                            │
                         │  1. Security-headers middleware ('*')      │
                         │  2. Redirect routes (/github, /cv, …)      │
                         │  3. POST /hello  (validate + echo)         │
                         │  4. Catch-all → ASSETS.fetch()             │
                         │     + per-path Cache-Control / SEO headers │
                         └───────────────┬────────────────────────────┘
                                         │
                                         ▼
                         ┌──────────────────────────────────────────┐
                         │  Workers Static Assets  (ASSETS binding)  │
                         │  serves ./public  (ETags + 304 automatic) │
                         └──────────────────────────────────────────┘
```

The Worker runs **in front of every request** because `run_worker_first = true` is set in
`wrangler.toml`. This is the key architectural decision: it lets header/redirect/SEO logic live
in code (`src/index.ts`) and apply uniformly to *all* responses — static assets, redirects, and
the 404 page included — rather than relying on Cloudflare's declarative `_headers`/`_redirects`
files (which are not used here and would be ignored under `run_worker_first`).

## Components

### 1. Cloudflare Worker — `src/index.ts`

The entire backend. A single [Hono](https://hono.dev) app, exported as `default app`. It has
four ordered parts (see `03-backend-api.md` for details):

1. Global `app.use('*')` middleware — sets security headers on every response.
2. Redirect routes — registered before the catch-all so they win over asset serving.
3. `POST /hello` — a public JSON endpoint with `cors()`.
4. `app.all('*')` catch-all — proxies to `c.env.ASSETS.fetch()` and layers cache/SEO headers.

Bindings: `type Bindings = { ASSETS: Fetcher }`.

### 2. Workers Static Assets — `public/`

`public/` is the served web root. Cloudflare serves these files directly through the `ASSETS`
binding and provides, automatically:

- Strong `ETag` generation and `304 Not Modified` handling.
- Content negotiation and correct default content types.
- `not_found_handling = "404-page"` → returns `public/404.html` with a **404 status** for
  unmatched paths.

Because responses from `ASSETS.fetch()` have **immutable headers**, the Worker cannot mutate
them in place; it rebuilds a new `Response` to attach headers.

### 3. Static content — `public/`

Fully self-contained pages. All CSS lives in inline `<style>` and all JS in inline `<script>`
in `index.html` / `404.html`. The only external browser resources are Google Fonts, Google
Analytics, and (whitelisted, not currently wired) the chat API. See `04-frontend.md`.

## What is NOT served

Everything reachable by URL lives under `public/`. Anything at the repo root is **not** served:

- `src/`, `scripts/`, `wrangler.toml`, `package.json`, `tsconfig.json`
- `profile/` (long-form content source), `resume/*.tex` and the working PDFs
- `specification/`, `README.md`, `CLAUDE.md`, docs

Asset paths in the HTML are **relative** (`assets/favicon/…`), which works only because
`index.html` and `assets/` are siblings inside `public/`. They must stay co-located.

## Build & bundling

- Wrangler bundles `src/index.ts` with esbuild automatically — no bundler config to maintain.
- There is **no build step for the pages** — they are shipped as-is from `public/`.
- The only optional pre-processing is image optimization (`scripts/optimize-images.js`, run
  manually; see `06-assets-and-content.md`).

## Technology choices (and rationale)

| Concern | Choice | Why |
|---------|--------|-----|
| Edge runtime | Cloudflare Workers | Global low-latency, generous free tier, static-asset native |
| HTTP framework | Hono | Tiny, fast, first-class on Workers; clean routing/middleware |
| Language | TypeScript | Type-checked Worker (`npm run typecheck`) |
| Static serving | Workers Static Assets | Automatic ETags/304, 404 handling, immutable-header serving |
| Pages | Hand-written HTML w/ inline CSS/JS | Zero build, maximal cacheability, no framework overhead |
| Images | `sharp` (offline script) | Generate AVIF/WebP + responsive variants |
