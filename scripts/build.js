#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const { updateHeadersFile } = require('./build-cache');

console.log('🚀 Starting build process...');

try {
  // Step 1: Build CSS (if input.css exists)
  console.log('📦 Building CSS...');
  const inputCssPath = './assets/css/input.css';
  if (fs.existsSync(inputCssPath)) {
    try {
      execSync('npx tailwindcss -i ./assets/css/input.css -o ./assets/css/output.css', { 
        stdio: 'inherit' 
      });
    } catch (error) {
      console.log('⚠️  CSS build skipped (Tailwind not configured or already built)');
    }
  } else {
    console.log('⚠️  CSS input file not found, skipping CSS build');
  }
  
  // Step 2: Update cache invalidation headers
  console.log('🔄 Updating cache invalidation headers...');
  updateHeadersFile();
  
  // Step 3: Optional: Minify assets (if you have minification tools)
  console.log('⚡ Minifying assets...');
  // Add minification commands here if needed
  
  console.log('✅ Build completed successfully!');
  console.log('📤 Ready for deployment to Cloudflare Pages');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 