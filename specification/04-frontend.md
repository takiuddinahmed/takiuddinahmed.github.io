# 04 — Frontend / Pages

## Files

- `public/index.html` — the portfolio (single page). Fully self-contained: all CSS in an inline
  `<style>` block, all JS in inline `<script>` blocks.
- `public/404.html` — the not-found page, same self-contained style. Served with a 404 status
  by Workers Static Assets for unmatched paths.

There is **no** external CSS/JS bundle and **no** Tailwind build step. To change look or
behavior, edit the inline `<style>` / `<script>` in these files directly.

## External browser resources

Only three external origins are loaded by the page (all whitelisted in the CSP):

1. **Google Fonts** — JetBrains Mono (monospace) + Inter (UI text).
2. **Google Analytics** — gtag, measurement ID `G-D33RZ4BQTD`.
3. **Chat API** (`ask-api.takiuddin.me`) — whitelisted in CSP for a future/optional chat
   widget. Not currently wired into `index.html`.

## Page structure (`index.html`)

The page uses semantic landmarks and an anchored single-page nav. Sections (by `id`):

| Section `id` | Purpose |
|--------------|---------|
| `tldr` | Short "TL;DR" summary of who he is |
| `about` | Longer professional bio |
| `experience` | Work history / roles |
| `projects` | Selected projects with descriptions and imagery |
| `stack` | Technology stack / skills |
| `education` | Academic background |
| `faq` | Frequently asked questions (also feeds FAQ structured data) |
| `contact` | Contact channels + `POST /hello` `curl` example |

Navigation anchors: `#about`, `#experience`, `#projects`, `#stack`, `#education`, `#faq`,
`#contact`, plus a skip-link `#main`. Each section has a matching `*-title` heading id for
accessible labelling (`aria-labelledby`).

## Client behaviors (inline JS)

| Behavior | Element ids | Notes |
|----------|-------------|-------|
| Theme toggle (light/dark) | `themeToggle`, `themeIcon` | Persisted; respects preference |
| Mobile nav menu | `menuBtn`, `mobileMenu` | Hamburger toggle on small screens |
| Footer year | `year` | Set to current year on load |

**Progressive enhancement:** the page must render and be readable with JavaScript disabled;
JS only enhances (theme, menu, dynamic year).

## Accessibility & responsiveness

- Skip-to-content link (`#main`).
- Sections labelled via `aria-labelledby` referencing `*-title` ids.
- Responsive layout with a mobile menu; responsive image variants (`-sm/-md/-lg/-xl`) available.
- Respect user color-scheme preference; provide manual theme toggle.

## Head / metadata

`<head>` contains the SEO and AI surfaces (see `05-seo-and-ai-surfaces.md`): meta/OpenGraph
tags, canonical URL, favicon links, and a single JSON-LD `@graph` block. Keep these consistent
with the visible content whenever facts change.
