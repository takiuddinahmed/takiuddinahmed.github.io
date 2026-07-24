# 05 — SEO & AI Surfaces

SEO and AI discoverability are first-class in this project. The following surfaces must stay
factually consistent with the visible page content whenever facts change.

## Source of truth

`profile/taki_details.md` (not served) is the long-form, hand-maintained source used to author
every surface below. When a fact changes, update `profile/taki_details.md` first, then propagate.

## Surfaces to keep consistent

| Surface | File / location | Purpose |
|---------|-----------------|---------|
| Structured data (JSON-LD) | `<head>` of `public/index.html` | Rich results; `Person`, `Occupation`, `Organization`, projects, FAQ, etc. |
| Sitemap | `public/sitemap.xml` | Crawl discovery |
| Robots | `public/robots.txt` | Crawl directives |
| Web app manifest | `public/manifest.json` | PWA metadata (name, icons, colors) |
| LLM summary | `public/llms.txt` | Concise machine-readable profile for AI assistants |
| LLM full | `public/llms-full.txt` | Long-form machine-readable profile |

## JSON-LD (`@graph`)

A single `<script type="application/ld+json">` in `<head>` holds one `@graph` array so entities
stay cross-linked by `@id`. It includes (at least):

- `Person` (Md Takiuddin Ahmed) — name, image, nationality (Bangladesh), links, occupation.
- `Occupation` — current role.
- `Organization` — current employer (Cognitus, an IBM Company).
- Project entries and an FAQ block mirroring the `#faq` section.

**Rule:** the `@graph` facts must match the visible sections (experience, projects, FAQ). Update
together.

## `llms.txt` / `llms-full.txt`

Hand-maintained plain-text profiles aimed at LLM crawlers. Served with:

- `Content-Type: text/plain; charset=utf-8`
- `Access-Control-Allow-Origin: *`
- `X-Robots-Tag: index, follow` (explicitly indexable, unlike the noindex utility files)

`llms.txt` is the concise version; `llms-full.txt` is the expanded version. Keep both aligned
with `profile/taki_details.md` and the page.

## Indexing policy (enforced by the Worker)

- **Noindex (kept out of results):** `robots.txt`, `sitemap.xml`, `manifest.json`,
  `license.txt`, `404.html` — via `X-Robots-Tag: noindex`.
- **Indexable:** the page itself, `llms.txt`, `llms-full.txt`, and the résumé PDF
  (`index, follow, max-snippet:-1`).
- **Canonical:** the homepage canonical is `https://takiuddin.me/`. The Worker 301s any
  homepage request carrying a `?q=` param to the canonical URL (legacy search-action cleanup).

## Consistency checklist (run when any fact changes)

1. Update `profile/taki_details.md`.
2. Update visible sections in `public/index.html`.
3. Update the JSON-LD `@graph` in `<head>`.
4. Update `llms.txt` and `llms-full.txt`.
5. Update `sitemap.xml` / `robots.txt` / `manifest.json` if URLs or metadata changed.
6. Keep the résumé PDF (`/cv`, `/resume`) current if experience changed.
