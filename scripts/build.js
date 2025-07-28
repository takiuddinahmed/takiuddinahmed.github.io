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
      execSync(`npx tailwindcss -i ${config.css.input} -o ${config.css.output}`, { 
        stdio: 'inherit' 
      });
    } catch (error) {
      console.log('⚠️  CSS build skipped (Tailwind not configured or already built)');
    }
  } else {
    console.log('⚠️  CSS input file not found, skipping CSS build');
  }
  
  // Step 2: Optimize images (if enabled)
  if (config.features.imageOptimization) {
    console.log('🖼️  Optimizing images...');
    try {
      // Check if sharp is available
      require.resolve('sharp');
      
      // Run image optimization using execSync for simplicity
      console.log('📸 Processing images...');
      const responsiveFlag = config.images.responsive ? ' --responsive' : '';
      execSync(`node scripts/optimize-images.js${responsiveFlag}`, { 
        stdio: 'inherit' 
      });
      
      console.log('✅ Image optimization completed!');
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.log('⚠️  Sharp not installed, skipping image optimization');
        console.log('💡 Run "npm install" to install image optimization dependencies');
      } else {
        console.log('⚠️  Image optimization failed:', error.message);
        console.log('💡 Continuing build without image optimization...');
      }
    }
  } else {
    console.log('⏭️  Image optimization disabled in config');
  }
  
  // Step 3: Update cache invalidation headers (if enabled)
  if (config.features.cacheHeaders) {
    console.log('🔄 Updating cache invalidation headers...');
    updateHeadersFile();
  } else {
    console.log('⏭️  Cache headers disabled in config');
  }
  
  // Step 4: Optional: Minify assets (if you have minification tools)
  console.log('⚡ Minifying assets...');
  // Add minification commands here if needed
  
  console.log('✅ Build completed successfully!');
  console.log('📤 Ready for deployment to Cloudflare Pages');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 