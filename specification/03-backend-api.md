# 03 — Backend / Worker API

All routing lives in `src/index.ts` (Hono). Parts are evaluated in registration order; the
catch-all is last so specific routes win.

## Part 1 — Global security-headers middleware

`app.use('*', …)` runs on **every** request (assets, redirects, 404). After `next()`, it
rebuilds the response with a fresh `Headers` object (required because `ASSETS.fetch()` responses
have immutable headers) and sets:

| Header | Value |
|--------|-------|
| `Content-Security-Policy` | the `CSP` constant (see `07-security.md`) |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |

**Spec rule:** these headers must be present on 100% of responses. Any new route inherits them
automatically because the middleware wraps `next()`.

## Part 2 — Redirects

Registered before the catch-all. All are `GET`.

| Path | Target | Status |
|------|--------|--------|
| `/github` | `https://github.com/takiuddinahmed` | 302 |
| `/linkedin` | `https://www.linkedin.com/in/takiuddin-ahmed-871607b5/` | 302 |
| `/calendly` | `https://calendly.com/takiuddinahmed-ciyp` | 302 |
| `/cv` | `/assets/files/md_takiuddin_resume.pdf` | 301 |
| `/resume` | `/assets/files/md_takiuddin_resume.pdf` | 301 |
| `/image` | `/assets/images/profile.jpg` | 301 |
| `/favicon.ico` | `/assets/favicon/favicon.ico` | 301 |
| `/gameapp.gov.bd` | `/` | 301 |

Rationale: external social links use **302** (temporary — targets may change); internal
canonical asset paths and legacy cleanups use **301** (permanent).

## Part 3 — `POST /hello`

A public JSON "say hello" endpoint. CORS is enabled (`app.use('/hello', cors())`).

### Request

- `Content-Type: application/json`
- Body fields:

| Field | Required | Type | Constraint |
|-------|----------|------|------------|
| `message` | yes | string | non-empty after trim; max 5000 chars |
| `name` | no | string | trimmed; included in echo if present |
| `phone` | no | string | trimmed; included in echo if present |
| `email` | no | string | trimmed; included in echo if present |

### Responses

| Status | Body | When |
|--------|------|------|
| 200 | `{ ok: true, message: "Thanks for reaching out, I'll be in touch soon.", received: {…} }` | valid request |
| 400 | `{ ok: false, error: "Body must be valid JSON." }` | body is not JSON |
| 400 | `{ ok: false, error: 'Field "message" is required.' }` | missing/empty `message` |
| 400 | `{ ok: false, error: 'Field "message" is too long (max 5000 characters).' }` | `message` > 5000 |

`received` echoes back `message` plus any provided optional fields.

### Behavior contract (important)

The endpoint **validates and echoes only**. It does **not** send email, enqueue, or persist —
contact submissions are not delivered anywhere yet. If delivery is added later, the response
contract above should be preserved for backward compatibility.

### Sync requirement

A visible `curl` example in the contact section of `public/index.html` (around the contact form)
documents this endpoint for users. **The curl and the endpoint's request shape must stay in
sync** whenever the endpoint changes.

## Part 4 — Catch-all (`app.all('*')`) — static asset serving

1. **Legacy `?q=` redirect:** if the path is `/` or `/index.html` and the query has `q`,
   respond `301` to `https://takiuddin.me/`. This removes a duplicate that Google filed from an
   old Sitelinks-Searchbox `SearchAction`. Scoped to `q` only — analytics params (`utm_*`,
   `gclid`, `fbclid`) are never stripped.
2. Fetch the asset via `c.env.ASSETS.fetch(c.req.raw)`.
3. Layer `Cache-Control` by path:

   | Path | Cache-Control |
   |------|---------------|
   | `/assets/*` | `public, max-age=31536000, s-maxage=31536000, immutable` |
   | `*.html` or `/` | `public, max-age=300, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=86400` |
   | other top-level | `public, max-age=3600, s-maxage=3600, must-revalidate` |
   | `*.pdf` | `public, max-age=86400, s-maxage=86400, must-revalidate` (overrides above) |

4. Set explicit `Content-Type` for `manifest.json` (`application/manifest+json`), `sitemap.xml`
   (`application/xml`), `robots.txt` / `license.txt` (`text/plain; charset=utf-8`).
5. **SEO tags:**
   - `X-Robots-Tag: noindex` for utility files in `NOINDEX_PATHS` =
     `{ /robots.txt, /sitemap.xml, /manifest.json, /license.txt, /404.html }` (keeps the file
     URLs out of *results*; crawling of robots/sitemap is unaffected).
   - `/llms.txt` and `/llms-full.txt`: `text/plain; charset=utf-8`,
     `Access-Control-Allow-Origin: *`, and `X-Robots-Tag: index, follow`.
   - `*.pdf`: `application/pdf` and `X-Robots-Tag: index, follow, max-snippet:-1`.

ETag/304 and content negotiation are handled by Workers Static Assets — no manual hashing.
