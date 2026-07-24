# 01 — Overview

## Purpose

A single-page personal portfolio for **Md Takiuddin Ahmed**, a senior backend / full-stack
software engineer. The site presents his professional identity, experience, projects, tech
stack, education, and contact information, and exposes machine-readable surfaces (structured
data and `llms.txt`) so search engines and AI assistants can accurately describe him.

## Primary audience

1. **Recruiters and hiring managers** — quickly scan experience, skills, and résumé/CV.
2. **Collaborators and peers** — find GitHub, LinkedIn, and contact channels.
3. **Search engines** — index the page with rich structured data.
4. **AI assistants / LLM crawlers** — read `llms.txt` / `llms-full.txt` and JSON-LD to answer
   questions about the person factually.

## Goals

- Communicate professional identity and value in one fast-loading page.
- Be fully self-contained and trivially cacheable (static HTML, no runtime data fetching
  required to render).
- Rank and present well in search (SEO) and in AI answer surfaces (AEO/GEO).
- Provide frictionless contact paths (email, LinkedIn, Calendly, a JSON "say hello" endpoint).
- Enforce strong, code-owned HTTP security headers on every response.

## Scope

In scope:

- The static portfolio page(s) served from `public/`.
- The Cloudflare Worker (`src/index.ts`) that fronts every request: security headers,
  redirects, cache/SEO headers, 404 handling, and the `POST /hello` endpoint.
- SEO/AI metadata surfaces kept consistent with page content.
- Asset optimization tooling (`scripts/optimize-images.js`) and résumé sources (`resume/`).

## Non-goals

- **No general backend / application server.** `POST /hello` only validates and echoes; it does
  not email, queue, or persist. Contact delivery is out of scope for the Worker today.
- **No database, auth, or user accounts.**
- **No client-side framework or bundler.** No React/Vue, no Tailwind build, no external JS bundle.
- **No CMS.** Content is hand-authored directly in HTML and in the `profile/` source doc.
- The external chat/ask API (`ask-api.takiuddin.me`) is a *separate project*; this repo only
  whitelists it in the CSP. It is not implemented here.

## Success criteria

- Page renders correctly with JavaScript disabled (progressive enhancement).
- Lighthouse-grade performance: immutable-cached assets, `stale-while-revalidate` HTML.
- Security headers present on 100% of responses (assets, redirects, and 404 included).
- Structured data, sitemap, robots, manifest, and `llms*.txt` stay factually consistent with
  the visible page.
