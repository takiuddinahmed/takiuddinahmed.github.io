#!/usr/bin/env node

const { spawn } = require('child_process');
const { updateHeadersFile } = require('./build-cache');

console.log('🛠️  Starting development mode...');

// Start CSS watcher
const cssWatcher = spawn('npx', ['tailwindcss', '-i', './assets/css/input.css', '-o', './assets/css/output.css', '--watch'], {
  stdio: 'inherit'
});

// Start cache invalidation watcher
const cacheWatcher = spawn('node', ['scripts/build-cache.js', '--watch'], {
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping development mode...');
  cssWatcher.kill();
  cacheWatcher.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping development mode...');
  cssWatcher.kill();
  cacheWatcher.kill();
  process.exit(0);
});

console.log('👀 Watching for changes...');
console.log('   - CSS changes will auto-rebuild');
console.log('   - Cache headers will auto-update');
console.log('   - Press Ctrl+C to stop'); 