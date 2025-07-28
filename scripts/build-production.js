#!/usr/bin/env node

/**
 * Production Build Script
 * Sets NODE_ENV to production and runs optimized build
 */

// Set production environment
process.env.NODE_ENV = 'production';

// Import and run the main build script
require('./build.js'); 