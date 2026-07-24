# 08 — Build, Config & Deployment

## Configuration — `wrangler.toml`

```toml
name = "takiuddin-portfolio"        # must match the Worker connected to Workers Builds
main = "src/index.ts"
compatibility_date = "2026-07-15"

[assets]
directory = "./public"
binding = "ASSETS"
run_worker_first = true             # Worker runs on every request (headers apply site-wide)
not_found_handling = "404-page"     # serve public/404.html with a 404 status

# routes = [{ pattern = "takiuddin.me", custom_domain = true }]   # attach after Pages removal
```

Key settings:

- `run_worker_first = true` — the reason header/redirect/SEO logic can live in code and apply to
  all responses including static assets. (See `02-architecture.md`.)
- `not_found_handling = "404-page"` — unmatched paths return `public/404.html` with status 404.
- `binding = "ASSETS"` — accessed as `c.env.ASSETS.fetch()` in the Worker.

## Commands

```bash
npm run dev          # wrangler dev — local Worker + assets at http://127.0.0.1:8787
npm run deploy       # wrangler deploy — publish the Worker
npm run types        # wrangler types — regenerate worker-configuration.d.ts (after wrangler.toml edits)
npm run typecheck    # tsc --noEmit
npm run optimize:images[:responsive]   # sharp image optimization (offline)
```

- There is **no test suite** and **no separate page build**. Wrangler bundles `src/index.ts`
  via esbuild automatically.
- After editing `wrangler.toml`, run `npm run types` and commit the regenerated
  `worker-configuration.d.ts`.

## Dependencies

| Package | Role |
|---------|------|
| `hono` | Worker HTTP framework (runtime dependency) |
| `wrangler` | Build/dev/deploy tooling (dev) |
| `typescript` | Type checking (dev) |
| `sharp` | Image optimization (optional dependency; only for the offline script) |

## Deployment target

- `npm run deploy` publishes to `takiuddinahmed-github-io.<subdomain>.workers.dev`.
- The `name` in `wrangler.toml` must match the Worker connected to Workers Builds.

## Serving the custom domain (`takiuddin.me`)

Migration from the old Cloudflare **Pages** project to the Worker:

1. Remove `takiuddin.me` (custom domain) from the old **Pages** project first — otherwise the
   deploy conflicts with the live domain.
2. Uncomment the `routes` line in `wrangler.toml`.
3. Redeploy.

Zone-level rules — **Always Use HTTPS** and **www → apex redirect** — are configured in the
Cloudflare dashboard and are independent of the Pages→Workers switch.

## Caching summary (set by the Worker; see `03-backend-api.md`)

| Content | Freshness |
|---------|-----------|
| `/assets/*` | 1 year, `immutable` |
| HTML / `/` | 5 min fresh + `stale-while-revalidate` (1 day) + `stale-if-error` |
| PDFs | 1 day |
| Other top-level files | 1 hour, `must-revalidate` |

ETags and 304 responses are generated automatically by Workers Static Assets — no manual
hashing or cache-busting build step.

## Release checklist

1. Content/facts changed? Follow the SEO consistency checklist (`05-seo-and-ai-surfaces.md`).
2. Résumé changed? Recompile and copy the public PDF (`06-assets-and-content.md`).
3. `wrangler.toml` changed? `npm run types` + commit `worker-configuration.d.ts`.
4. `npm run typecheck`.
5. `npm run dev` — smoke-test locally (page, redirects, `POST /hello`, headers).
6. `npm run deploy`.
