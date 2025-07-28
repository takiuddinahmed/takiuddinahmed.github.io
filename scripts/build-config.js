/**
 * Build Configuration
 * Centralized configuration for the build process
 */

module.exports = {
  // Image optimization settings
  images: {
    enabled: true,
    quality: 85,
    formats: ['webp', 'avif'],
    responsive: process.env.NODE_ENV === 'production', // Enable responsive images in production
    maxWidth: 1920,
    maxHeight: 1920
  },

  // CSS build settings
  css: {
    input: './assets/css/input.css',
    output: './assets/css/output.css',
    minify: process.env.NODE_ENV === 'production' // Enable minification in production
  },

  // Build environment
  environment: process.env.NODE_ENV || 'development',
  
  // Feature flags
  features: {
    imageOptimization: false, // Disabled - run manually
    cacheHeaders: true,
    minification: process.env.NODE_ENV === 'production'
  },

  // Paths
  paths: {
    images: './assets/images',
    optimizedImages: './assets/images/optimized',
    css: './assets/css',
    js: './assets/js'
  },

  // Performance settings
  performance: {
    preloadCriticalImages: true,
    lazyLoadNonCritical: true,
    optimizeForRetina: true
  }
}; 