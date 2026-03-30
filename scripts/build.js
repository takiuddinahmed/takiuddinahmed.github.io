#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const { updateHeadersFile } = require('./build-cache');
const config = require('./build-config');

console.log('🚀 Starting build process...');
console.log(`🌍 Environment: ${config.environment}`);

try {
  // Step 1: Build CSS (if input.css exists)
  console.log('📦 Building CSS...');
  const inputCssPath = config.css.input;
  if (fs.existsSync(inputCssPath)) {
    try {
      const minifyFlag = config.css.minify ? ' --minify' : '';
      execSync(`npx tailwindcss -i ${config.css.input} -o ${config.css.output}${minifyFlag}`, { 
        stdio: 'inherit' 
      });
    } catch (error) {
      console.log('⚠️  CSS build skipped (Tailwind not configured or already built)');
    }
  } else {
    console.log('⚠️  CSS input file not found, skipping CSS build');
  }
  
  // Step 2: Image optimization (run manually when needed)
  console.log('⏭️  Image optimization skipped - run "npm run optimize:images" manually');
  
  // Step 3: Update cache invalidation headers (if enabled)
  if (config.features.cacheHeaders) {
    console.log('🔄 Updating cache invalidation headers...');
    updateHeadersFile();
  } else {
    console.log('⏭️  Cache headers disabled in config');
  }
  
  // Step 4: Minify HTML in production
  if (config.features.minification) {
    console.log('⏭️  HTML minification handled by build-production.js (deploy-time only)');
  } else {
    console.log('⏭️  HTML minification skipped (production only)');
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📤 Ready for deployment to Cloudflare Pages');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 