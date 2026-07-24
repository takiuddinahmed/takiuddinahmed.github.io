# 10 — Blog Feature (Specification)

> Status: **Implemented** (v1). Built per the decisions below.
> This document specifies a blog for takiuddin.me, consistent with the existing
> static-first, Worker-fronted architecture (see `02-architecture.md`).
>
> Resolved defaults from §12: section name = **Blog**; nav placement = between
> `faq` and `contact` (desktop + mobile); raw HTML in Markdown = **disabled**;
> Shiki theme = **github-dark / github-light** (dual, follows the site toggle);
> **no homepage teaser** in v1 (nav link only); tag URLs = `/blog/tag/:tag/`;
> source dir = `content/blog/`. All routes are trailing-slash.

## 1. Goal

Add a personal blog where Md Takiuddin Ahmed publishes technical writing. Posts are
authored in Markdown and compiled to **static, self-contained HTML** at build time, served
by the existing Cloudflare Worker + Workers Static Assets. The blog must feel like a native
part of the site (same dark theme, same performance and SEO posture) and must not compromise
the project's core principles: **static output, no client framework, strong caching, and
first-class SEO/AI surfaces.**

## 2. Decisions (locked from interview)

| Area | Decision |
|------|----------|
| Authoring | Markdown files with YAML frontmatter in `content/blog/` |
| Rendering | **Build step** compiles Markdown → static HTML in `public/blog/` |
| Placement | `/blog` index page + `/blog/:slug` per-post pages + homepage nav link |
| Tags | Dedicated tag pages at `/blog/tag/:tag` + tag labels on posts/index |
| Code highlighting | **Build-time** (pre-colored HTML, no client JS, no CSP change) |
| SEO/AI | Full: per-post `BlogPosting` JSON-LD, `sitemap.xml` entries, `llms.txt` updates |
| Git/deploy | Generated `public/blog/` is **gitignored**; built by a predeploy step |
| Post metadata | title, date, tags, **description/excerpt**, **draft**, **updated**, auto **reading time** |

Deferred to a later version (explicit non-goals for v1): RSS/Atom feed, cover/hero images,
pagination, comments, search, related-posts, series/collections, per-post OG image generation.

## 3. Content model

### 3.1 Source location

```
content/
  blog/
    2026-07-24-hello-world.md
    building-rust-services.md
    ...
```

- One Markdown file per post. Filename is not the URL — the slug is derived (see 3.3).
- `content/` is at the **repo root and is not served** (only `public/` is served).

### 3.2 Frontmatter schema

```yaml
---
title: "Building resilient Rust services"      # required, string
date: 2026-07-24                                 # required, ISO date (publish date)
description: "How I structure fault-tolerant..." # required, used for cards + meta + OG
tags: [rust, backend, reliability]               # optional, array of strings; default []
slug: building-rust-services                     # optional; default = slugified title
draft: false                                     # optional; default false
updated: 2026-08-01                              # optional; ISO date, "last updated"
---
Markdown body follows...
```

Validation rules (build fails loudly on violation):
- `title`, `date`, `description` are **required**.
- `date`/`updated` must parse as valid ISO dates.
- Slugs must be unique across all published posts; kebab-case `[a-z0-9-]`.
- `draft: true` posts are **excluded** from all output (pages, index, tags, sitemap, llms,
  JSON-LD). A local-only flag (e.g. `BLOG_DRAFTS=1`) may render drafts for preview.
- **Reading time** is computed automatically (≈200 wpm over body text) — not authored.

## 4. Build pipeline

### 4.1 New script: `scripts/build-blog.js`

Node script (same style as `scripts/optimize-images.js`) that:

1. Reads every `*.md` under `content/blog/`.
2. Parses frontmatter with **gray-matter**; validates against the schema (4.2 above).
3. Filters out drafts (unless preview flag set).
4. Renders Markdown → HTML with **markdown-it** (GFM-ish: tables, autolinks, fenced code).
5. Highlights fenced code blocks at build time with **Shiki** (theme chosen to match the
   site's dark palette), emitting inline-styled/pre-colored `<pre><code>` — **no client JS**.
6. Wraps each post in the **post template** (§5.2) and writes
   `public/blog/<slug>/index.html`.
7. Generates the **index page** `public/blog/index.html` (all published posts, newest-first).
8. Generates **tag pages** `public/blog/tag/<tag>/index.html` for every tag in use.
9. Emits SEO artifacts (§7): updates `sitemap.xml`, regenerates the blog section of
   `llms.txt` / `llms-full.txt` (via clearly delimited managed markers).
10. Prints a build summary (posts published, drafts skipped, tags, warnings).

The script is **idempotent** and **deterministic** (stable ordering, no timestamps in output)
so repeated builds produce identical bytes — friendly to caching and diffing.

### 4.2 Dependencies (build-time only, `devDependencies`)

- `gray-matter` — frontmatter parsing
- `markdown-it` — Markdown → HTML
- `shiki` — build-time syntax highlighting

These run only during the build; **nothing is added to the Worker runtime bundle** and the
served pages ship **zero blog JavaScript** (tag filtering on pages uses static links, not JS).

### 4.3 npm scripts (`package.json`)

```jsonc
"build:blog": "node scripts/build-blog.js",
"predeploy":  "npm run build:blog",   // ensures deploy always ships fresh output
"dev":        "npm run build:blog && wrangler dev",  // build once before local dev
```

`deploy` stays `wrangler deploy`; the `predeploy` hook runs the blog build first.

### 4.4 Git

`.gitignore` gets `public/blog/`. The **source of truth is `content/blog/*.md`**; generated
HTML is never committed. (Consequence: a clean checkout must run `build:blog` before the blog
renders — documented in README and CLAUDE.md.)

## 5. Rendering & templates

Generated pages are **fully self-contained**, mirroring `public/index.html`: all CSS inlined
in a `<style>` block, no external JS. A single shared stylesheet template (dark theme, reading
column ~70ch, existing fonts JetBrains Mono + Inter) is injected into every generated page so
the build stays the single source of styling.

### 5.1 Index page (`/blog`)

- Site header/nav consistent with homepage; heading "Blog" (or "Writing").
- List of posts newest-first: title (link), date, reading time, tag chips (link to tag pages),
  and description/excerpt.
- Tag chips are plain `<a>` links to `/blog/tag/:tag` (no JS filtering needed).

### 5.2 Post page (`/blog/:slug`)

- Header/nav; article with title, publish date, "updated" date if present, reading time, tags.
- Rendered body with pre-highlighted code blocks.
- Per-post `BlogPosting` JSON-LD in `<head>` (§7).
- Canonical URL, OG/Twitter meta from title + description.
- "Back to blog" link.

### 5.3 Tag page (`/blog/tag/:tag`)

- Same list layout as the index, filtered to one tag; heading "Posts tagged: <tag>".

### 5.4 404s

Unknown `/blog/*` paths fall through to the existing `not_found_handling = "404-page"`
behavior (`public/404.html`, 404 status). No new handling required.

## 6. Worker / routing changes (`src/index.ts`)

Minimal. The catch-all already proxies to `ASSETS.fetch()`; generated blog files are just more
static assets. Required change: **cache/SEO headers** for blog paths in the catch-all.

- `/blog`, `/blog/:slug`, `/blog/tag/:tag` are `*.html`-class responses →
  `5 min fresh + stale-while-revalidate` (same policy as other HTML).
- Blog pages are indexable (no `X-Robots-Tag: noindex`).
- **No CSP change** (highlighting is build-time; no new script/style origins, no new JS).
- Optional niceties (call out in review): pretty-URL normalization (`/blog/slug` ↔
  `/blog/slug/`) if Static Assets doesn't already resolve directory `index.html` as desired.

No new runtime dependencies are added to the Worker.

## 7. SEO / AI surfaces (full integration)

Keep parity with the project's first-class SEO posture (`05-seo-and-ai-surfaces.md`):

- **JSON-LD:** each post emits `BlogPosting` (`headline`, `description`, `datePublished`,
  `dateModified`, `author` → the existing Person, `keywords` from tags, `mainEntityOfPage`).
  The `/blog` index may emit a `Blog` / `CollectionPage` node.
- **sitemap.xml:** build adds `<url>` entries for `/blog`, every published post, and every tag
  page, with `lastmod` from `updated`/`date`. Managed region delimited by markers so the build
  can rewrite it without touching hand-authored entries.
- **llms.txt / llms-full.txt:** build regenerates a delimited "Blog" section listing published
  posts (title, URL, date, description). Hand-authored content outside the markers is preserved.
- **robots.txt:** `/blog*` allowed (verify no disallow rule blocks it).
- Per-post `<title>`, meta description, canonical, OpenGraph, Twitter card.

## 8. Styling & accessibility

- Reuse the homepage's CSS variables/tokens; dark theme; readable measure; responsive.
- Code blocks: horizontal scroll on overflow, monospace, Shiki dark theme matching palette.
- Semantic HTML (`<article>`, `<time datetime>`, headings in order); sufficient contrast;
  focus-visible states on links/chips. Pages render fully with JS disabled.

## 9. Security

- No new CSP origins; highlighting and layout are build-time/static.
- Markdown is **authored by the site owner only** (not user input), but the renderer still runs
  with HTML disabled / sanitized by default in markdown-it to avoid accidental injection;
  raw-HTML-in-Markdown policy decided in review (default: **disabled**).
- Existing security-headers middleware applies to blog responses automatically.

## 10. Documentation updates

- **CLAUDE.md:** add a "Blog" section — content lives in `content/blog/*.md`, `npm run
  build:blog` generates `public/blog/` (gitignored), build runs on `predeploy`, SEO artifacts
  are regenerated, self-contained output.
- **README.md:** how to write a post (create `.md`, frontmatter, `npm run dev`).
- **specification/**: fold this into the numbered spec (e.g. as `10-blog.md`) and cross-link
  from `09-requirements.md` once shipped.

## 11. Acceptance criteria

1. `npm run build:blog` compiles `content/blog/*.md` into `public/blog/` with index, post, and
   tag pages; drafts excluded; build fails clearly on invalid frontmatter/duplicate slugs.
2. `/blog`, `/blog/:slug`, `/blog/tag/:tag` render correctly, dark-themed, JS-disabled-safe.
3. Code blocks are syntax-highlighted with **no client JS** and no CSP change.
4. Each post has valid `BlogPosting` JSON-LD; posts + tags appear in `sitemap.xml`; blog
   section present in `llms.txt`/`llms-full.txt`.
5. HTML responses carry the correct `Cache-Control` (5 min + SWR) via the Worker.
6. `public/blog/` is gitignored; `predeploy` builds it; a fresh clone renders after one build.
7. `npm run typecheck` passes; no new Worker runtime dependencies.

## 12. Open questions for review

1. **Section name:** "Blog" vs "Writing" vs "Notes"?
2. **Nav placement:** where in the homepage nav (and add to footer?).
3. **Raw HTML in Markdown:** keep disabled (recommended) or allow for embeds?
4. **Shiki theme:** pick a specific dark theme to match the palette, or hand-tune?
5. **Homepage teaser:** you chose "no homepage change" beyond a nav link — confirm we should
   *not* surface latest posts on the homepage in v1.
6. **URL for tags:** `/blog/tag/:tag` confirmed (vs `/blog/tags/:tag`)?
7. Is `content/` the preferred source dir name (vs `posts/` or `blog/` at root)?

## 13. Rough implementation plan (post-approval)

1. Add devDeps; scaffold `scripts/build-blog.js` (parse → validate → render → template → write).
2. Build shared style/template; generate post pages.
3. Generate index + tag pages.
4. Wire SEO artifacts (JSON-LD, sitemap markers, llms markers).
5. `src/index.ts` cache/SEO headers for `/blog*`; verify 404 + pretty URLs.
6. npm scripts (`build:blog`, `predeploy`, `dev`), `.gitignore`, docs.
7. Add one seed post; verify acceptance criteria locally (`npm run dev`, `typecheck`).
