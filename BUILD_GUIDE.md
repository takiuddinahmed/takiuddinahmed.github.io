# Build Process Guide

This guide explains the build process and how image optimization is integrated into the build pipeline.

## 🚀 Build Commands

### Development Build
```bash
npm run build
```
- Builds CSS with Tailwind
- Updates cache headers
- **Fast build** (no image optimization)

### Production Build
```bash
npm run build:production
```
- Sets `NODE_ENV=production`
- Builds CSS with Tailwind
- Updates cache headers
- **Optimized for production** (minification enabled)

### Manual Image Optimization
```bash
# Basic optimization (run when needed)
npm run optimize:images

# Responsive optimization (run when needed)
npm run optimize:images:responsive
```



## 📁 Build Process Steps

### 1. **CSS Build**
- Compiles Tailwind CSS from `input.css` to `output.css`
- Uses configuration from `build-config.js`

### 2. **Image Optimization** (manual)
- Run `npm run optimize:images` when needed
- Converts images to AVIF and WebP formats
- Optimizes original formats (JPEG, PNG)
- Creates responsive versions with `--responsive` flag
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
    responsive: false, // Set manually when needed
    maxWidth: 1920,
    maxHeight: 1920
  },
  features: {
    imageOptimization: false, // Disabled - run manually
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
└── _headers (updated)
```

### Production Build
```
assets/
├── css/
│   └── output.css (minified)
└── _headers (updated)
```

### After Manual Image Optimization
```
assets/
├── css/
│   └── output.css
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

## 🔧 Customization

### Enable Image Optimization in Build (if needed)
```javascript
// In build-config.js
features: {
  imageOptimization: true
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
- **Build time**: ~2-5 seconds
- **Image optimization**: None (manual)
- **File sizes**: Original sizes

### Production Build
- **Build time**: ~3-8 seconds
- **Image optimization**: None (manual)
- **File sizes**: Original sizes

### Manual Image Optimization
- **Optimization time**: ~10-20 seconds
- **Image optimization**: Full (AVIF + WebP + Responsive)
- **File sizes**: 40-60% smaller
- **Performance gain**: Significant when optimized

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
      - run: npm run optimize:images:responsive  # Manual optimization
      - run: npm run build:production
      - run: npm run deploy:production
```

## 📝 Best Practices

1. **Use production build for deployment**
2. **Run image optimization manually** when adding new images
3. **Commit optimized images** to version control
4. **Monitor build times** and optimize if needed
5. **Test builds locally** before deployment
6. **Keep Sharp version updated** for best performance

---

**Note**: The build process is now optimized for speed. Image optimization is run manually when needed, allowing for faster builds during development. 