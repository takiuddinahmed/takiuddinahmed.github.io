# Build Process Guide

This guide explains the build process and how image optimization is integrated into the build pipeline.

## 🚀 Build Commands

### Development Build
```bash
npm run build
```
- Builds CSS with Tailwind
- Optimizes images (basic optimization)
- Updates cache headers
- **No responsive images** (faster build)

### Production Build
```bash
npm run build:production
```
- Sets `NODE_ENV=production`
- Builds CSS with Tailwind
- Optimizes images with responsive versions
- Updates cache headers
- **Includes responsive images** (slower but optimized)

### Manual Image Optimization
```bash
# Basic optimization
npm run optimize:images

# Responsive optimization
npm run optimize:images:responsive
```

## 📁 Build Process Steps

### 1. **CSS Build**
- Compiles Tailwind CSS from `input.css` to `output.css`
- Uses configuration from `build-config.js`

### 2. **Image Optimization** (if enabled)
- Converts images to AVIF and WebP formats
- Optimizes original formats (JPEG, PNG)
- Creates responsive versions in production
- Uses Sharp library for high-quality optimization

### 3. **Cache Headers** (if enabled)
- Updates `_headers` file with cache invalidation
- Ensures proper caching for optimized assets

### 4. **Minification** (production only)
- Minifies CSS and JavaScript
- Reduces file sizes for faster loading

## ⚙️ Configuration

### Build Configuration (`scripts/build-config.js`)
```javascript
module.exports = {
  images: {
    enabled: true,
    quality: 85,
    formats: ['webp', 'avif'],
    responsive: process.env.NODE_ENV === 'production',
    maxWidth: 1920,
    maxHeight: 1920
  },
  features: {
    imageOptimization: true,
    cacheHeaders: true,
    minification: process.env.NODE_ENV === 'production'
  }
};
```

### Environment Variables
- `NODE_ENV=development` (default)
- `NODE_ENV=production` (enables all optimizations)

## 🎯 Build Outputs

### Development Build
```
assets/
├── css/
│   └── output.css (unminified)
├── images/
│   └── optimized/
│       ├── profile.avif
│       ├── profile.webp
│       ├── cognitus-logo.avif
│       ├── cognitus-logo.webp
│       ├── grype-logo.avif
│       └── grype-logo.webp
└── _headers (updated)
```

### Production Build
```
assets/
├── css/
│   └── output.css (minified)
├── images/
│   └── optimized/
│       ├── profile.avif
│       ├── profile.webp
│       ├── profile-sm.jpg
│       ├── profile-md.jpg
│       ├── profile-lg.jpg
│       ├── profile-xl.jpg
│       └── ... (responsive versions)
└── _headers (updated)
```

## 🔧 Customization

### Disable Image Optimization
```javascript
// In build-config.js
features: {
  imageOptimization: false
}
```

### Change Image Quality
```javascript
// In build-config.js
images: {
  quality: 90 // Higher quality, larger files
}
```

### Add Custom Build Steps
```javascript
// In build.js
// Add your custom build steps here
console.log('🔧 Custom build step...');
```

## 🚨 Troubleshooting

### Sharp Not Installed
```bash
npm install
# or
npm install sharp
```

### Build Fails
1. Check if all dependencies are installed
2. Verify file paths in configuration
3. Check console output for specific errors

### Images Not Optimizing
1. Ensure Sharp is installed
2. Check if image files exist in `assets/images/`
3. Verify file permissions

## 📊 Performance Impact

### Development Build
- **Build time**: ~5-10 seconds
- **Image optimization**: Basic (AVIF + WebP)
- **File sizes**: Optimized but not minimal

### Production Build
- **Build time**: ~15-30 seconds
- **Image optimization**: Full (AVIF + WebP + Responsive)
- **File sizes**: Highly optimized
- **Performance gain**: 40-60% smaller images

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build:production
      - run: npm run deploy:production
```

## 📝 Best Practices

1. **Use production build for deployment**
2. **Commit optimized images** to version control
3. **Monitor build times** and optimize if needed
4. **Test builds locally** before deployment
5. **Keep Sharp version updated** for best performance

---

**Note**: The build process is designed to be fast for development and comprehensive for production. Adjust the configuration based on your specific needs. 