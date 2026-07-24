# 06 — Assets & Content

## Served assets (`public/assets/`)

```
public/assets/
├── favicon/          android-chrome-192/512, apple-touch-icon, favicon-16/32, favicon.ico
├── files/            md_takiuddin_resume.pdf      (served CV; /cv and /resume redirect here)
└── images/
    ├── profile.jpg, cognitus-logo.(png|svg), grype-logo.png, project-*.png
    └── optimized/    AVIF + WebP + responsive -sm/-md/-lg/-xl variants
```

- **Favicons/manifest icons** are referenced from `<head>` and `manifest.json`.
- **Résumé PDF** at `public/assets/files/md_takiuddin_resume.pdf` is the public download,
  reachable via `/cv` and `/resume` (301 redirects) — served as `application/pdf`, cached 1 day,
  and indexable.
- Asset URLs in HTML are **relative** and rely on `index.html` + `assets/` being siblings.

## Image optimization pipeline

Offline, manual (not part of deploy). Uses `sharp` (an `optionalDependency`).

```bash
npm run optimize:images             # regenerate public/assets/images/optimized/ (AVIF + WebP)
npm run optimize:images:responsive  # additionally emit -sm / -md / -lg / -xl responsive variants
```

- Script: `scripts/optimize-images.js`.
- Output: `public/assets/images/optimized/` containing `.avif`, `.webp`, and (with
  `--responsive`) size-suffixed variants for `<picture>`/`srcset` usage.
- Optimized assets are cached 1 year immutable (they live under `/assets/`).

## Résumé sources (`resume/` — not served)

| File | Role |
|------|------|
| `resume/md_takiuddin_resume.tex` | LaTeX source for the primary (ATS-friendly) résumé |
| `resume/md_takiuddin_resume.pdf` | Compiled working PDF (copied into `public/assets/files/` for serving) |
| `resume/md_takiuddin_resume_fullstack.tex` | LaTeX source, full-stack-oriented variant |
| `resume/md_takiuddin_resume_fullstack.pdf` | Compiled full-stack variant |

**Rule:** when experience/skills change, regenerate the PDF and copy the public one to
`public/assets/files/md_takiuddin_resume.pdf` so `/cv` and `/resume` stay current. Keep the
résumé consistent with the site sections and SEO surfaces.

## Content source of truth

- `profile/taki_details.md` — long-form profile (not served). The authoritative source for the
  page copy, JSON-LD, and `llms*.txt`. See `05-seo-and-ai-surfaces.md` for the propagation
  checklist.
- The visible page copy lives directly in `public/index.html`; there is no CMS or templating.

## Legal

- `LICENSE` (repo root) and `public/license.txt` (served, `text/plain`, noindexed).
