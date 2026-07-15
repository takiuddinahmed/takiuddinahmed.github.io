import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = { ASSETS: Fetcher }

const app = new Hono<{ Bindings: Bindings }>()

// Content-Security-Policy — kept byte-for-byte from the old Pages `_headers` "/*"
// block. Changing an origin here can break Google Fonts, Analytics, or the chat API.
const CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://ask-api.takiuddin.me https://static.cloudflareinsights.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; img-src 'self' data: https://avatars.githubusercontent.com https://takiuddin.me https://www.google-analytics.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com; connect-src 'self' https://ask-api.takiuddin.me https://static.cloudflareinsights.com https://cdn.jsdelivr.net https://www.google-analytics.com https://region1.google-analytics.com; frame-ancestors 'none'; upgrade-insecure-requests;"

// 1) Global security headers on EVERY response (redirects, static assets, 404).
//    The response is rebuilt because Responses from ASSETS.fetch() have immutable headers.
app.use('*', async (c, next) => {
  await next()
  const r = c.res
  const h = new Headers(r.headers)
  h.set('Content-Security-Policy', CSP)
  h.set('X-Frame-Options', 'SAMEORIGIN')
  h.set('X-Content-Type-Options', 'nosniff')
  h.set('X-XSS-Protection', '1; mode=block')
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  h.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  h.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  c.res = new Response(r.body, { status: r.status, statusText: r.statusText, headers: h })
})

// 2) Redirects (ported from the old `_redirects`). Registered before the catch-all.
app.get('/github', (c) => c.redirect('https://github.com/takiuddinahmed', 302))
app.get('/linkedin', (c) => c.redirect('https://www.linkedin.com/in/takiuddin-ahmed-871607b5/', 302))
app.get('/calendly', (c) => c.redirect('https://calendly.com/takiuddinahmed-ciyp', 302))
app.get('/cv', (c) => c.redirect('/assets/files/md_takiuddin_resume.pdf', 301))
app.get('/resume', (c) => c.redirect('/assets/files/md_takiuddin_resume.pdf', 301))
app.get('/image', (c) => c.redirect('/assets/images/profile.jpg', 301))
app.get('/favicon.ico', (c) => c.redirect('/assets/favicon/favicon.ico', 301))
app.get('/gameapp.gov.bd', (c) => c.redirect('/', 301))

// 3) POST /hello — public "say hello" endpoint. `message` is required; `name`, `phone`, `email` optional.
app.use('/hello', cors())
app.post('/hello', async (c) => {
  let body: Record<string, unknown>
  try {
    body = await c.req.json()
  } catch {
    return c.json({ ok: false, error: 'Body must be valid JSON.' }, 400)
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const message = str(body.message)
  if (!message) return c.json({ ok: false, error: 'Field "message" is required.' }, 400)
  if (message.length > 5000) return c.json({ ok: false, error: 'Field "message" is too long (max 5000 characters).' }, 400)

  const received: Record<string, string> = { message }
  for (const field of ['name', 'phone', 'email'] as const) {
    const value = str(body[field])
    if (value) received[field] = value
  }

  return c.json({ ok: true, message: "Thanks for reaching out, I'll be in touch soon.", received })
})

// 4) Catch-all: serve static assets, layering per-path Cache-Control, Content-Type,
//    and SEO headers (ported from the old `_headers` per-type blocks). ETag/304 handling
//    and content negotiation are provided automatically by Workers Static Assets.
app.all('*', async (c) => {
  const url = new URL(c.req.url)
  const p = url.pathname

  // Legacy Sitelinks-Searchbox artifact: an old SearchAction advertised
  // /?q={search_term_string}. The site has no search, so 301 any ?q= on the
  // homepage to the canonical URL — this removes the duplicate Google filed as
  // "Alternate page with proper canonical tag". Scoped to `q` only so analytics
  // params (utm_*, gclid, fbclid) are never stripped.
  if ((p === '/' || p === '/index.html') && url.searchParams.has('q')) {
    return c.redirect('https://takiuddin.me/', 301)
  }

  const res = await c.env.ASSETS.fetch(c.req.raw)
  const h = new Headers(res.headers)

  if (p.startsWith('/assets/')) {
    h.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable')
  } else if (p.endsWith('.html') || p === '/') {
    // Serve instantly from cache, then refresh in the background — users never block on a
    // revalidation round-trip. Fresh for 5 min; stale is served (and quietly revalidated)
    // for up to a day, and kept as a fallback if the origin errors.
    h.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=86400')
  } else {
    h.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, must-revalidate')
  }

  if (p === '/manifest.json') h.set('Content-Type', 'application/manifest+json')
  if (p === '/sitemap.xml') h.set('Content-Type', 'application/xml')
  if (p === '/robots.txt') {
    h.set('Content-Type', 'text/plain; charset=utf-8')
    h.set('X-Robots-Tag', 'noindex')
  }
  if (p === '/llms.txt' || p === '/llms-full.txt') {
    h.set('Content-Type', 'text/plain; charset=utf-8')
    h.set('Access-Control-Allow-Origin', '*')
    h.set('X-Robots-Tag', 'index, follow')
  }
  if (p.endsWith('.pdf')) {
    h.set('Content-Type', 'application/pdf')
    h.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, must-revalidate')
    h.set('X-Robots-Tag', 'index, follow, max-snippet:-1')
  }

  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h })
})

export default app
