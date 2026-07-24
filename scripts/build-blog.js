/**
 * Blog build script
 * -----------------
 * Compiles Markdown posts in `content/blog/*.md` into fully self-contained,
 * static HTML under `public/blog/`, matching the site's dark theme. Syntax
 * highlighting is applied at BUILD TIME with Shiki (no client JS, no CSP change).
 *
 * It also regenerates the managed blog regions of `public/sitemap.xml`,
 * `public/llms.txt`, and `public/llms-full.txt` (delimited by BLOG:START /
 * BLOG:END markers) so SEO/AI surfaces stay consistent with published posts.
 *
 * Output in `public/blog/` is gitignored — the source of truth is the .md files.
 * Run via `npm run build:blog` (also invoked automatically on `predeploy`).
 *
 * Env:
 *   BLOG_DRAFTS=1   include posts with `draft: true` (local preview only)
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');

// ----------------------------------------------------------------------------
// Config
// ----------------------------------------------------------------------------
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const OUT_DIR = path.join(ROOT, 'public', 'blog');
const SITEMAP = path.join(ROOT, 'public', 'sitemap.xml');
const LLMS = path.join(ROOT, 'public', 'llms.txt');
const LLMS_FULL = path.join(ROOT, 'public', 'llms-full.txt');

const SITE = 'https://takiuddin.me';
const AUTHOR = 'Md Takiuddin Ahmed';
const PERSON_ID = 'https://takiuddin.me/#person';
const PROFILE_IMG = 'https://takiuddin.me/assets/images/profile.jpg';
const GA_ID = 'G-D33RZ4BQTD';
const BLOG_TITLE = 'Blog';
const WORDS_PER_MIN = 200;

const INCLUDE_DRAFTS = process.env.BLOG_DRAFTS === '1';

// Languages preloaded into Shiki. Fenced blocks in an unlisted language fall
// back to plaintext rather than failing the build.
const LANGS = [
  'javascript', 'typescript', 'tsx', 'jsx', 'json', 'jsonc', 'bash', 'shell',
  'sh', 'python', 'go', 'rust', 'sql', 'yaml', 'toml', 'html', 'xml', 'css',
  'dockerfile', 'diff', 'markdown', 'c', 'cpp', 'java', 'http', 'ini', 'php',
  'ruby', 'graphql', 'text',
];

// ----------------------------------------------------------------------------
// Small helpers
// ----------------------------------------------------------------------------
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Accepts a JS Date (YAML auto-parses ISO dates) or a YYYY-MM-DD string.
function toISODate(v, field) {
  if (v instanceof Date && !isNaN(v)) return v.toISOString().slice(0, 10);
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  throw new Error(`Invalid ${field}: expected a YYYY-MM-DD date, got ${JSON.stringify(v)}`);
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function readingTime(text) {
  const words = (text.trim().match(/\S+/g) || []).length;
  return Math.max(1, Math.round(words / WORDS_PER_MIN));
}

/**
 * Replace the region between `<!-- BLOG:START -->` and `<!-- BLOG:END -->`.
 * If the markers are absent, insert the block at the fallback location.
 */
function replaceManagedRegion(content, block, { before } = {}) {
  const START = '<!-- BLOG:START -->';
  const END = '<!-- BLOG:END -->';
  const wrapped = `${START}\n${block}\n${END}`;
  const re = new RegExp(`${START}[\\s\\S]*?${END}`);
  if (re.test(content)) return content.replace(re, wrapped);
  if (before && content.includes(before)) {
    return content.replace(before, `${wrapped}\n${before}`);
  }
  return `${content.replace(/\s*$/, '')}\n\n${wrapped}\n`;
}

// ----------------------------------------------------------------------------
// Read + validate posts
// ----------------------------------------------------------------------------
function readPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
  const posts = [];
  const seenSlugs = new Set();

  for (const file of files.sort()) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    const { data, content } = matter(raw);

    if (!data.title) throw new Error(`${file}: missing required "title"`);
    if (!data.date) throw new Error(`${file}: missing required "date"`);
    if (!data.description) throw new Error(`${file}: missing required "description"`);

    const draft = data.draft === true;
    if (draft && !INCLUDE_DRAFTS) {
      console.log(`  · skipping draft: ${file}`);
      continue;
    }

    const slug = data.slug ? slugify(data.slug) : slugify(data.title);
    if (!slug) throw new Error(`${file}: could not derive a slug`);
    if (seenSlugs.has(slug)) throw new Error(`${file}: duplicate slug "${slug}"`);
    seenSlugs.add(slug);

    const date = toISODate(data.date, `${file} date`);
    const updated = data.updated ? toISODate(data.updated, `${file} updated`) : null;
    const tags = Array.isArray(data.tags) ? data.tags.map((t) => String(t).trim()).filter(Boolean) : [];

    posts.push({
      file,
      slug,
      title: String(data.title),
      description: String(data.description),
      date,
      updated,
      tags,
      canonical: data.canonical ? String(data.canonical) : `${SITE}/blog/${slug}/`,
      draft,
      readingTime: readingTime(content),
      markdown: content,
      url: `${SITE}/blog/${slug}/`,
    });
  }

  // Newest first.
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return posts;
}

// ----------------------------------------------------------------------------
// HTML shell (self-contained, matches public/index.html theme)
// ----------------------------------------------------------------------------
const STYLE = `
:root{--bg:#0b0f17;--bg-elev:#11161f;--surface:#0e131c;--surface-2:#141b27;--border:#1e2633;--border-strong:#2a3343;--text:#dde3ec;--text-dim:#9aa4b4;--text-muted:#6a7486;--accent:#7ccfff;--accent-2:#7ee787;--accent-3:#ffbe6b;--accent-4:#ff9f73;--accent-5:#d2a8ff;--accent-red:#ff7b72;--mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Monaco,monospace;--sans:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;--radius:10px;--radius-lg:14px;--container:780px}
[data-theme='light']{--bg:#fafbfc;--bg-elev:#fff;--surface:#f4f6f8;--surface-2:#eef1f5;--border:#e2e6ec;--border-strong:#cdd3dc;--text:#1b2330;--text-dim:#4a5364;--text-muted:#6f7a8c;--accent:#0969da;--accent-2:#1a7f37;--accent-3:#9a6700;--accent-4:#bc4c00;--accent-5:#6639ba;--accent-red:#cf222e}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--sans);font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background-image:radial-gradient(ellipse 70% 50% at 50% -10%,rgba(124,207,255,.08),transparent 60%),radial-gradient(ellipse 40% 30% at 100% 20%,rgba(210,168,255,.06),transparent 60%);background-attachment:fixed}
[data-theme='light'] body{background-image:radial-gradient(ellipse 70% 50% at 50% -10%,rgba(9,105,218,.05),transparent 60%),radial-gradient(ellipse 40% 30% at 100% 20%,rgba(102,57,186,.04),transparent 60%)}
a{color:var(--accent);text-decoration:none;transition:color .15s ease,opacity .15s ease}
a:hover{text-decoration:underline;text-underline-offset:3px}
code,kbd,pre,samp{font-family:var(--mono)}
h1,h2,h3,h4{font-family:var(--mono);font-weight:600;letter-spacing:-.01em;color:var(--text)}
::selection{background:rgba(124,207,255,.25)}
.skip-link{position:absolute;left:-9999px;top:8px;background:var(--accent);color:var(--bg);padding:8px 12px;border-radius:6px;z-index:1000}
.skip-link:focus{left:16px}
.container{max-width:var(--container);margin:0 auto;padding:0 24px}
@media (max-width:640px){.container{padding:0 18px}}
/* nav */
.nav{position:sticky;top:0;z-index:50;background:color-mix(in oklab,var(--bg) 88%,transparent);backdrop-filter:saturate(140%) blur(12px);-webkit-backdrop-filter:saturate(140%) blur(12px);border-bottom:1px solid var(--border)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;height:60px;max-width:var(--container);margin:0 auto;padding:0 24px}
.brand{font-family:var(--mono);font-weight:600;color:var(--text);display:inline-flex;align-items:center;gap:8px}
.brand .g{color:var(--accent-2)}.brand .u{color:var(--accent)}.brand .p{color:var(--accent-3)}
.brand:hover{text-decoration:none}
.nav-links{display:flex;align-items:center;gap:4px}
.nav-links a{font-family:var(--mono);font-size:13px;color:var(--text-dim);padding:8px 12px;border-radius:6px}
.nav-links a:hover{color:var(--text);background:var(--surface);text-decoration:none}
.nav-links a.active{color:var(--accent)}
.theme-toggle{width:34px;height:34px;border:1px solid var(--border);background:var(--surface);color:var(--text-dim);border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .15s ease}
.theme-toggle:hover{color:var(--text);border-color:var(--border-strong)}
.theme-toggle svg{width:16px;height:16px}
@media (max-width:640px){.nav-links{display:none}}
/* layout */
main{padding:56px 0 40px}
.page-head{margin-bottom:8px}
.page-head h1{font-size:28px;margin:0}
.page-head p{color:var(--text-dim);margin:8px 0 0}
.back{font-family:var(--mono);font-size:13px;color:var(--text-dim);display:inline-block;margin-bottom:24px}
/* post meta + tags */
.meta{font-family:var(--mono);font-size:13px;color:var(--text-muted);display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin-top:14px}
.meta .dot{color:var(--border-strong)}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.tag{font-family:var(--mono);font-size:12px;color:var(--accent);background:var(--surface);border:1px solid var(--border);padding:3px 10px;border-radius:999px}
.tag:hover{border-color:var(--border-strong);text-decoration:none}
/* post list */
.posts{list-style:none;padding:0;margin:32px 0 0;display:flex;flex-direction:column;gap:8px}
.post-card{display:block;padding:20px;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--surface);transition:border-color .15s ease,transform .15s ease}
.post-card:hover{border-color:var(--border-strong);text-decoration:none}
.post-card h2{font-size:18px;margin:0 0 6px;color:var(--text)}
.post-card .excerpt{color:var(--text-dim);font-size:15px;margin:6px 0 0}
.post-card .meta{margin-top:12px}
/* article prose */
article.prose{margin-top:28px}
.prose h2{font-size:22px;margin:40px 0 12px;padding-top:8px}
.prose h3{font-size:18px;margin:32px 0 10px}
.prose p{margin:0 0 18px}
.prose ul,.prose ol{margin:0 0 18px;padding-left:24px}
.prose li{margin:6px 0}
.prose li>p{margin:0}
.prose blockquote{margin:0 0 18px;padding:2px 18px;border-left:3px solid var(--accent);color:var(--text-dim);background:var(--surface);border-radius:0 var(--radius) var(--radius) 0}
.prose img{max-width:100%;height:auto;border-radius:var(--radius);border:1px solid var(--border)}
.prose hr{border:0;border-top:1px dashed var(--border);margin:32px 0}
.prose a{text-decoration:underline;text-underline-offset:2px;text-decoration-color:color-mix(in oklab,var(--accent) 45%,transparent)}
.prose :not(pre)>code{background:var(--surface-2);border:1px solid var(--border);border-radius:6px;padding:.12em .4em;font-size:.88em;color:var(--accent-3)}
.prose table{width:100%;border-collapse:collapse;margin:0 0 18px;font-size:14px}
.prose th,.prose td{border:1px solid var(--border);padding:8px 12px;text-align:left}
.prose th{background:var(--surface)}
/* shiki code blocks */
.prose pre.shiki{margin:0 0 18px;padding:16px 18px;border-radius:var(--radius);border:1px solid var(--border);overflow-x:auto;font-size:13.5px;line-height:1.6;tab-size:2}
.prose pre.shiki code{display:block;width:fit-content;min-width:100%}
[data-theme='light'] .prose pre.shiki,[data-theme='light'] .prose pre.shiki span{color:var(--shiki-light)!important;background-color:var(--shiki-light-bg)!important}
/* footer */
footer{border-top:1px dashed var(--border);padding:28px 0;margin-top:40px}
.footer-inner{max-width:var(--container);margin:0 auto;padding:0 24px;display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:13px;color:var(--text-dim)}
.social-row{display:inline-flex;gap:14px}
.social-row a{color:var(--text-dim);display:inline-flex}
.social-row a:hover{color:var(--text)}
.social-row svg{width:18px;height:18px}
`.trim();

const THEME_SVG = '<svg id="themeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>';

const SCRIPTS = `
(function(){var root=document.documentElement,btn=document.getElementById('themeToggle'),ic=document.getElementById('themeIcon');
var sun='<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>';
var moon='<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
function apply(t){if(t==='light'){root.setAttribute('data-theme','light');if(ic)ic.innerHTML=moon;}else{root.removeAttribute('data-theme');if(ic)ic.innerHTML=sun;}}
var saved=localStorage.getItem('theme');var pl=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches;
apply(saved?saved:(pl?'light':'dark'));
if(btn)btn.addEventListener('click',function(){var n=root.getAttribute('data-theme')==='light'?'dark':'light';localStorage.setItem('theme',n);apply(n);});})();
var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
`.trim();

function navHtml() {
  return `<header class="nav"><div class="nav-inner">
<a href="/" class="brand" aria-label="Home"><span class="u">taki</span><span>@</span><span class="u">dev</span><span>:</span><span class="p">~</span><span class="g">$</span></a>
<nav class="nav-links" aria-label="Primary">
<a href="/#about">about</a>
<a href="/#experience">experience</a>
<a href="/#projects">projects</a>
<a href="/#stack">stack</a>
<a href="/blog/" class="active">blog</a>
<a href="/#contact">contact</a>
</nav>
<button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" title="Toggle theme">${THEME_SVG}</button>
</div></header>`;
}

function footerHtml() {
  return `<footer><div class="footer-inner">
<div><span style="color:var(--accent-2)">$</span> echo &ldquo;built by ${AUTHOR}&rdquo; <span style="color:var(--text-muted)">·</span> <span id="year"></span></div>
<div class="social-row" aria-label="Social links">
<a href="https://github.com/takiuddinahmed" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.5A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z"/></svg></a>
<a href="https://www.linkedin.com/in/takiuddin-ahmed-871607b5/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.67H9.34V9h3.41v1.56h.05c.47-.9 1.63-1.86 3.36-1.86 3.6 0 4.27 2.37 4.27 5.45v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg></a>
<a href="mailto:takiuddinahmed@gmail.com" aria-label="Email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M22 6L12 13 2 6"></path></svg></a>
</div></div></footer>`;
}

function layout({ title, description, canonical, ogType, jsonLd, body }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${t}</title>
<meta name="description" content="${d}" />
<meta name="author" content="${escapeHtml(AUTHOR)}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
<meta name="theme-color" content="#0b0f17" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#fafbfc" media="(prefers-color-scheme: light)" />
<meta name="color-scheme" content="dark light" />
<link rel="canonical" href="${escapeHtml(canonical)}" />
<meta property="og:type" content="${ogType}" />
<meta property="og:url" content="${escapeHtml(canonical)}" />
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${d}" />
<meta property="og:image" content="${PROFILE_IMG}" />
<meta property="og:site_name" content="takiuddin.me" />
<meta property="og:locale" content="en_US" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${d}" />
<meta name="twitter:image" content="${PROFILE_IMG}" />
<link rel="icon" href="/assets/favicon/favicon.ico" sizes="any" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'" />
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" /></noscript>
<script type="application/ld+json">
${JSON.stringify(jsonLd)}
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
<style>${STYLE}</style>
</head>
<body>
<a href="#main" class="skip-link">Skip to content</a>
${navHtml()}
<main id="main"><div class="container">
${body}
</div></main>
${footerHtml()}
<script>${SCRIPTS}</script>
</body>
</html>
`;
}

// ----------------------------------------------------------------------------
// Page renderers
// ----------------------------------------------------------------------------
function tagChip(tag) {
  return `<a class="tag" href="/blog/tag/${slugify(tag)}/">#${escapeHtml(tag)}</a>`;
}

function postMeta(post) {
  const parts = [`<time datetime="${post.date}">${formatDate(post.date)}</time>`];
  if (post.updated && post.updated !== post.date) {
    parts.push(`<span>updated ${formatDate(post.updated)}</span>`);
  }
  parts.push(`<span>${post.readingTime} min read</span>`);
  return `<div class="meta">${parts.join('<span class="dot">•</span>')}</div>`;
}

function postCard(post) {
  return `<li><a class="post-card" href="/blog/${post.slug}/">
<h2>${escapeHtml(post.title)}</h2>
<p class="excerpt">${escapeHtml(post.description)}</p>
${postMeta(post)}
</a></li>`;
}

function renderPostPage(post, html) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    inLanguage: 'en',
    url: post.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': post.url },
    author: { '@type': 'Person', '@id': PERSON_ID, name: AUTHOR },
    publisher: { '@type': 'Person', '@id': PERSON_ID, name: AUTHOR },
    image: PROFILE_IMG,
    keywords: post.tags.join(', ') || undefined,
  };
  const body = `<a class="back" href="/blog/">&larr; all posts</a>
<div class="page-head"><h1>${escapeHtml(post.title)}</h1></div>
${postMeta(post)}
${post.tags.length ? `<div class="tags">${post.tags.map(tagChip).join('')}</div>` : ''}
<article class="prose">
${html}
</article>`;
  return layout({
    title: `${post.title} — ${AUTHOR}`,
    description: post.description,
    canonical: post.canonical,
    ogType: 'article',
    jsonLd,
    body,
  });
}

function renderIndexPage(posts) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${AUTHOR} — ${BLOG_TITLE}`,
    description: `Writing on backend engineering, systems, and tooling by ${AUTHOR}.`,
    url: `${SITE}/blog/`,
    inLanguage: 'en',
    author: { '@type': 'Person', '@id': PERSON_ID, name: AUTHOR },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: p.url,
    })),
  };
  const body = `<div class="page-head"><h1>${BLOG_TITLE}</h1><p>Notes on backend engineering, systems, and the tools I build.</p></div>
${posts.length ? `<ul class="posts">${posts.map(postCard).join('')}</ul>` : '<p>No posts yet.</p>'}`;
  return layout({
    title: `${BLOG_TITLE} — ${AUTHOR}`,
    description: `Writing on backend engineering, systems, and tooling by ${AUTHOR}.`,
    canonical: `${SITE}/blog/`,
    ogType: 'website',
    jsonLd,
    body,
  });
}

function renderTagPage(tag, posts) {
  const tagSlug = slugify(tag);
  const url = `${SITE}/blog/tag/${tagSlug}/`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Posts tagged “${tag}” — ${AUTHOR}`,
    url,
    inLanguage: 'en',
    isPartOf: { '@type': 'Blog', '@id': `${SITE}/blog/` },
  };
  const body = `<a class="back" href="/blog/">&larr; all posts</a>
<div class="page-head"><h1>#${escapeHtml(tag)}</h1><p>${posts.length} post${posts.length === 1 ? '' : 's'} tagged &ldquo;${escapeHtml(tag)}&rdquo;.</p></div>
<ul class="posts">${posts.map(postCard).join('')}</ul>`;
  return layout({
    title: `Posts tagged “${tag}” — ${AUTHOR}`,
    description: `Posts tagged “${tag}” by ${AUTHOR}.`,
    canonical: url,
    ogType: 'website',
    jsonLd,
    body,
  });
}

// ----------------------------------------------------------------------------
// SEO surface updates
// ----------------------------------------------------------------------------
function sitemapEntries(posts, tags) {
  const entry = (loc, lastmod, priority, changefreq) =>
    `    <url>\n        <loc>${escapeXml(loc)}</loc>\n        <lastmod>${lastmod}</lastmod>\n        <changefreq>${changefreq}</changefreq>\n        <priority>${priority}</priority>\n    </url>`;
  const latest = posts.length ? posts[0].updated || posts[0].date : new Date().toISOString().slice(0, 10);
  const lines = [entry(`${SITE}/blog/`, latest, '0.80', 'weekly')];
  for (const p of posts) lines.push(entry(p.url, p.updated || p.date, '0.70', 'monthly'));
  for (const t of tags) lines.push(entry(`${SITE}/blog/tag/${slugify(t)}/`, latest, '0.50', 'monthly'));
  return lines.join('\n');
}

function updateSitemap(posts, tags) {
  if (!fs.existsSync(SITEMAP)) return;
  const content = fs.readFileSync(SITEMAP, 'utf8');
  const block = sitemapEntries(posts, tags);
  const next = replaceManagedRegion(content, block, { before: '</urlset>' });
  fs.writeFileSync(SITEMAP, next);
}

function updateLlms(file, posts) {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const lines = ['## Blog', ''];
  if (posts.length) {
    for (const p of posts) lines.push(`- [${p.title}](${p.url}) — ${p.date} — ${p.description}`);
  } else {
    lines.push('- No posts published yet.');
  }
  const next = replaceManagedRegion(content, lines.join('\n'));
  fs.writeFileSync(file, next);
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
async function main() {
  console.log('Building blog…');
  const posts = readPosts();

  // Set up Shiki (dynamic import — shiki is ESM-only).
  const { createHighlighter } = await import('shiki');
  const highlighter = await createHighlighter({
    themes: ['github-dark', 'github-light'],
    langs: LANGS,
  });
  const loaded = new Set(highlighter.getLoadedLanguages());

  const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    highlight(code, lang) {
      const language = lang && loaded.has(lang) ? lang : 'text';
      try {
        return highlighter.codeToHtml(code, {
          lang: language,
          themes: { light: 'github-light', dark: 'github-dark' },
          defaultColor: 'dark',
        });
      } catch {
        return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
      }
    },
  });

  // Fresh output dir (removes orphaned pages from deleted/renamed posts).
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Post pages.
  for (const post of posts) {
    const html = md.render(post.markdown);
    const dir = path.join(OUT_DIR, post.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderPostPage(post, html));
  }

  // Index page.
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), renderIndexPage(posts));

  // Tag pages.
  const tagMap = new Map(); // slug -> { label, posts }
  for (const post of posts) {
    for (const tag of post.tags) {
      const s = slugify(tag);
      if (!tagMap.has(s)) tagMap.set(s, { label: tag, posts: [] });
      tagMap.get(s).posts.push(post);
    }
  }
  for (const [s, { label, posts: tagPosts }] of tagMap) {
    const dir = path.join(OUT_DIR, 'tag', s);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderTagPage(label, tagPosts));
  }

  // SEO surfaces.
  const tagLabels = [...tagMap.values()].map((t) => t.label).sort();
  updateSitemap(posts, tagLabels);
  updateLlms(LLMS, posts);
  updateLlms(LLMS_FULL, posts);

  console.log(
    `Done: ${posts.length} post(s), ${tagMap.size} tag(s). ` +
      `Output → public/blog/  (sitemap + llms updated)`
  );
}

main().catch((err) => {
  console.error('\nBlog build failed:', err.message);
  process.exit(1);
});
