# Cloudflare Pages Deployment Guide

This guide covers deploying your portfolio website to Cloudflare Pages with the integrated caching system.

## 🚀 Quick Deployment

### 1. Connect Your Repository
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Connect your GitHub repository
4. Select the repository containing this project

### 2. Configure Build Settings
In the Cloudflare Pages build configuration:

**Build command:**
```bash
npm run build
```

**Build output directory:**
```
./
```

**Root directory:**
```
./
```

**Environment variables:**
```
NODE_VERSION=18
```

### 3. Deploy
Click **Save and Deploy** to start the deployment process.

## 🔧 Build Process

### What Happens During Build
1. **CSS Compilation**: Tailwind CSS is compiled to `assets/css/output.css`
2. **Cache Invalidation**: New ETag hashes are generated for all file types
3. **Headers Update**: `_headers` file is updated with new cache invalidation values
4. **Asset Optimization**: Files are prepared for production

### Build Output
The build process creates:
- Optimized CSS files
- Updated `_headers` with new ETag values
- Production-ready static files

## 📋 Cloudflare Pages Features

### Automatic Optimizations
Cloudflare Pages automatically provides:
- **Global CDN**: Content delivered from 200+ locations worldwide
- **Automatic HTTPS**: SSL certificates for all domains
- **Image Optimization**: Automatic WebP conversion and resizing
- **Minification**: Automatic CSS, JS, and HTML minification
- **Compression**: Automatic gzip/brotli compression
- **Cache Optimization**: Intelligent caching at the edge

### Custom Headers
The `_headers` file is automatically processed by Cloudflare Pages:
- Headers are applied at the edge
- Cache invalidation works globally
- Security headers are enforced

## 🌍 Environment Management

### Production Environment
- **Domain**: Your custom domain (e.g., `takiuddin.me`)
- **Build**: `npm run build`
- **Cache**: Full caching with invalidation
- **Optimizations**: All enabled

### Preview Environment
- **Domain**: `*.pages.dev` subdomain
- **Build**: `npm run build`
- **Cache**: Same as production
- **Optimizations**: All enabled

## 🔄 Deployment Workflow

### Automatic Deployments
1. **Push to main branch** → Automatic production deployment
2. **Create pull request** → Automatic preview deployment
3. **Merge pull request** → Automatic production deployment

### Manual Deployments
```bash
# Using Wrangler CLI
wrangler pages deploy . --project-name=takiuddin-portfolio

# Using GitHub Actions (if configured)
git push origin main
```

## 📊 Performance Monitoring

### Cloudflare Analytics
Monitor your site's performance in the Cloudflare dashboard:
- **Web Analytics**: Page views, visitors, performance metrics
- **Core Web Vitals**: LCP, FID, CLS scores
- **Cache Hit Ratio**: Percentage of cached requests
- **Bandwidth Usage**: Data transfer statistics

### Cache Performance
Check cache effectiveness:
```bash
# Check cache headers
curl -I https://your-domain.com/assets/css/output.css

# Look for these headers:
# Cache-Control: public, max-age=31536000, s-maxage=31536000, immutable
# ETag: W/"css-[hash]"
```

## 🛠️ Custom Domain Setup

### 1. Add Custom Domain
1. Go to your Pages project settings
2. Navigate to **Custom domains**
3. Add your domain (e.g., `takiuddin.me`)
4. Configure DNS records as instructed

### 2. DNS Configuration
Add these DNS records to your domain provider:
```
Type: CNAME
Name: @
Value: your-project.pages.dev

Type: CNAME  
Name: www
Value: your-project.pages.dev
```

### 3. SSL Certificate
Cloudflare automatically provisions SSL certificates for custom domains.

## 🔍 Troubleshooting

### Build Failures
1. **Check Node.js version**: Ensure `NODE_VERSION=18` is set
2. **Verify dependencies**: Run `npm install` locally
3. **Check build logs**: Review Cloudflare Pages build output
4. **Test locally**: Run `npm run build` locally first

### Cache Issues
1. **Force cache invalidation**: Run `npm run build:cache`
2. **Check headers**: Verify `_headers` file is updated
3. **Clear browser cache**: Test in incognito mode
4. **Check Cloudflare cache**: Use Cloudflare dashboard to purge cache

### Performance Issues
1. **Monitor Core Web Vitals**: Check Cloudflare Analytics
2. **Review cache hit ratio**: Ensure high cache hit rates
3. **Optimize images**: Use WebP format when possible
4. **Check bundle size**: Monitor CSS/JS file sizes

## 📈 Optimization Tips

### For Better Performance
1. **Use immutable cache**: Static assets use `immutable` flag
2. **Optimize images**: Use appropriate formats and sizes
3. **Minimize CSS/JS**: Build process includes minification
4. **Leverage CDN**: Cloudflare's global network provides fast delivery

### For Better SEO
1. **Fast loading**: Cached assets load instantly
2. **Mobile optimization**: Cloudflare provides automatic optimization
3. **HTTPS**: Automatic SSL certificates
4. **Core Web Vitals**: Monitor and optimize scores

## 🔗 Useful Links

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Analytics](https://developers.cloudflare.com/analytics/)
- [Performance Best Practices](https://developers.cloudflare.com/pages/platform/performance/)

## 📞 Support

For Cloudflare Pages specific issues:
- [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Support](https://support.cloudflare.com/)
- [Pages Status Page](https://www.cloudflarestatus.com/) 