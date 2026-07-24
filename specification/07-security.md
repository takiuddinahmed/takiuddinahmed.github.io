# 07 — Security

All security controls are code-owned in `src/index.ts` and applied by the global `app.use('*')`
middleware to **every** response (assets, redirects, 404). There are no declarative
`_headers`/`_redirects` files.

## HTTP security headers (every response)

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | see below | Restrict resource origins; mitigate XSS/injection |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Force HTTPS |
| `X-Frame-Options` | `SAMEORIGIN` | Clickjacking protection |
| `X-Content-Type-Options` | `nosniff` | Block MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter opt-in |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Deny sensitive APIs |

## Content-Security-Policy

The `CSP` constant defines allowed origins. It **must** stay consistent with what the pages
actually load, or fonts/analytics/chat break. Current directives (summarized):

| Directive | Allowed origins |
|-----------|-----------------|
| `default-src` | `'self'` |
| `script-src` | `'self' 'unsafe-inline' 'unsafe-eval'`, jsdelivr, cdnjs, ask-api, cloudflareinsights, googletagmanager, google-analytics |
| `style-src` | `'self' 'unsafe-inline'`, cdnjs, fonts.googleapis.com |
| `img-src` | `'self' data:`, avatars.githubusercontent.com, takiuddin.me, google-analytics |
| `font-src` | `'self'`, cdnjs, fonts.gstatic.com |
| `connect-src` | `'self'`, ask-api, cloudflareinsights, jsdelivr, google-analytics, region1.google-analytics |
| `frame-ancestors` | `'none'` |
| — | `upgrade-insecure-requests` |

Notes / known trade-offs:

- `'unsafe-inline'` and `'unsafe-eval'` are permitted because the pages use inline `<style>` and
  inline `<script>` (self-contained design). This is a deliberate trade-off; nonces/hashes are a
  possible future hardening if inline scripts are consolidated.
- `frame-ancestors 'none'` plus `X-Frame-Options: SAMEORIGIN` disallow embedding.

**Editing rule:** changing the CSP or any allowed origin means editing the `CSP` constant in
`src/index.ts`. When adding a new external resource to the page, add its origin to the matching
directive in the same change.

## Endpoint hardening

- `POST /hello` requires valid JSON, requires a non-empty `message`, and caps `message` at 5000
  characters. It does not persist or forward input (no injection sink today).
- CORS is enabled on `/hello` only.

## Transport & domain

- HSTS with `preload` and `includeSubDomains`.
- `upgrade-insecure-requests` in CSP.
- Zone-level "Always Use HTTPS" and www→apex redirect are configured in the Cloudflare
  dashboard (independent of the Worker).

## Threat model (brief)

| Threat | Mitigation |
|--------|-----------|
| XSS via injected content | CSP; no server-side templating of user input; `/hello` echoes JSON only |
| Clickjacking | `X-Frame-Options`, `frame-ancestors 'none'` |
| Protocol downgrade / MITM | HSTS preload, `upgrade-insecure-requests` |
| MIME confusion | `X-Content-Type-Options: nosniff` + explicit content types |
| Abuse of `/hello` | Input validation + size cap; no persistence sink |
| Header stripping by asset layer | Middleware rebuilds every response to force headers |
