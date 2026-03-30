#!/usr/bin/env node

/**
 * Production Build Script
 * Runs the standard build with CSS minification, then minifies HTML
 * in-place for deploy and restores the readable source afterwards.
 */

process.env.NODE_ENV = 'production';

const fs = require('fs');
const { minify } = require('html-minifier-terser');

async function buildProduction() {
  // Step 1: Run main build (CSS minified, cache headers updated)
  require('./build.js');

  // Step 2: Minify index.html in-place, restore after deploy
  const htmlPath = './index.html';
  const original = fs.readFileSync(htmlPath, 'utf8');

  console.log('⚡ Minifying HTML for deployment...');
  let minified;
  try {
    minified = await minify(original, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
    });
    const saved = ((original.length - minified.length) / original.length * 100).toFixed(1);
    console.log(`✅ HTML minified — saved ${saved}% (${original.length} → ${minified.length} bytes)`);
  } catch (err) {
    console.warn('⚠️  HTML minification failed (original used):', err.message);
    minified = original;
  }

  // Write minified HTML — wrangler deploy picks this up
  fs.writeFileSync(htmlPath, minified, 'utf8');

  // Register cleanup: restore readable source after process exits
  process.on('exit', () => {
    fs.writeFileSync(htmlPath, original, 'utf8');
    console.log('🔄 Restored readable index.html source');
  });
  process.on('SIGINT', () => process.exit(1));
  process.on('SIGTERM', () => process.exit(1));
}

buildProduction().catch(err => {
  console.error('❌ Production build failed:', err.message);
  process.exit(1);
});
