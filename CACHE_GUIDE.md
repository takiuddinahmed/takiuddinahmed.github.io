# Caching System Guide

This project implements a sophisticated caching system with automatic cache invalidation for optimal performance on Cloudflare Pages.

## 🚀 Quick Start

### Development Mode
```bash
npm run dev
```
This starts the development server with:
- CSS auto-rebuilding
- Automatic cache header updates
- File change watching

### Production Build
```bash
npm run build
```
This performs a complete build with:
- CSS compilation
- Cache invalidation header updates
- Asset optimization

### Cache Invalidation Only
```bash
npm run build:cache
```
Updates only the cache invalidation headers.

## 📋 Caching Strategy

### File Type Caching Rules

| File Type | Cache Duration | Invalidation Method | Use Case |
|-----------|----------------|-------------------|----------|
| **HTML** | 5 minutes | ETag + Short TTL | Quick content updates |
| **CSS/JS** | 1 year | ETag + Immutable | Long-term caching |
| **Images** | 1 year | ETag + Immutable | Static assets |
| **Favicons** | 1 year | ETag + Immutable | Brand assets |
| **PDFs** | 1 day | ETag + Medium TTL | Document updates |
| **Manifest** | 1 hour | ETag + Short TTL | PWA updates |
| **Sitemap** | 1 hour | ETag + Short TTL | SEO updates |
| **Robots.txt** | 1 hour | ETag + Short TTL | SEO updates |
| **API** | No cache | Always fresh | Dynamic content |

### Cache Invalidation Methods

1. **ETag Headers**: Unique hash-based identifiers that change when content changes
2. **Cache-Control**: Explicit cache duration and behavior directives
3. **Version Hashes**: MD5-based content hashing for automatic invalidation

## 🔧 How It Works

### Automatic Cache Invalidation
The build system automatically:
1. Scans all files in your project
2. Generates unique MD5 hashes for each file type
3. Updates the `_headers` file with new ETag values
4. Ensures browsers fetch new versions when content changes

### Hash Generation
- **Single files**: Content-based MD5 hash
- **Directories**: Combined hash of all files in directory
- **Hash length**: 8 characters for readability

### Cloudflare Integration
The `_headers` file is automatically processed by Cloudflare Pages:
- Headers are applied at the edge
- Global CDN caching is optimized
- Cache invalidation happens instantly

## 📁 File Structure

```
scripts/
├── build.js          # Main build script
├── build-cache.js    # Cache invalidation logic
└── dev.js           # Development watcher

_headers              # Cloudflare headers configuration
CACHE_GUIDE.md       # This documentation
```

## 🛠️ Customization

### Adding New File Types
1. Add the file pattern to `_headers`
2. Update `build-cache.js` to generate hash for the new type
3. Set appropriate cache duration

### Modifying Cache Durations
Edit the `Cache-Control` headers in `_headers`:
- `max-age=300` = 5 minutes
- `max-age=3600` = 1 hour
- `max-age=86400` = 1 day
- `max-age=31536000` = 1 year

### Development vs Production
- **Development**: Use `npm run dev` for live updates
- **Production**: Use `npm run build` before deployment

## 🔍 Monitoring

### Check Cache Headers
```bash
curl -I https://your-domain.com/assets/css/output.css
```

### Verify ETag Updates
After making changes, check that ETag values change in `_headers`.

### Browser DevTools
- Network tab shows cache status
- Look for `304 Not Modified` responses
- Check `ETag` and `Cache-Control` headers

## 🚨 Troubleshooting

### Cache Not Updating
1. Run `npm run build:cache` to force update
2. Check file permissions
3. Verify Cloudflare deployment

### Build Errors
1. Ensure Node.js is installed
2. Check file paths in scripts
3. Verify `_headers` syntax

### Performance Issues
1. Review cache durations
2. Check for unnecessary cache invalidation
3. Monitor Cloudflare analytics

## 📈 Performance Benefits

- **Faster Loading**: Static assets cached for 1 year
- **Reduced Bandwidth**: 304 responses for unchanged content
- **Better SEO**: Faster page loads improve rankings
- **User Experience**: Instant loading for returning visitors
- **Cost Savings**: Reduced server load and bandwidth usage

## 🔗 Related Files

- `_headers`: Cloudflare Pages headers configuration
- `package.json`: Build scripts and dependencies
- `wrangler.toml`: Cloudflare Pages configuration
- `CLOUDFLARE_SEO_GUIDE.md`: SEO optimization guide 