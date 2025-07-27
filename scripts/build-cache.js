#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Function to generate hash for a file or directory
function generateHash(filePath) {
  if (fs.existsSync(filePath)) {
    if (fs.statSync(filePath).isDirectory()) {
      // For directories, hash all files recursively
      const files = getAllFiles(filePath);
      const content = files.map(file => fs.readFileSync(file)).join('');
      return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
    } else {
      // For single files, hash the file content
      const content = fs.readFileSync(filePath);
      return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
    }
  }
  return 'default';
}

// Function to get all files in a directory recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  
  return arrayOfFiles;
}

// Function to update _headers file with new version hashes
function updateHeadersFile() {
  const headersPath = path.join(__dirname, '..', '_headers');
  let headersContent = fs.readFileSync(headersPath, 'utf8');
  
  // Generate hashes for different file types
  const htmlHash = generateHash(path.join(__dirname, '..', 'index.html'));
  const cssHash = generateHash(path.join(__dirname, '..', 'assets', 'css'));
  const jsHash = generateHash(path.join(__dirname, '..', 'assets', 'js'));
  const imgHash = generateHash(path.join(__dirname, '..', 'assets', 'images'));
  const faviconHash = generateHash(path.join(__dirname, '..', 'assets', 'favicon'));
  const pdfHash = generateHash(path.join(__dirname, '..', 'assets', 'files'));
  const manifestHash = generateHash(path.join(__dirname, '..', 'manifest.json'));
  const sitemapHash = generateHash(path.join(__dirname, '..', 'sitemap.xml'));
  const robotsHash = generateHash(path.join(__dirname, '..', 'robots.txt'));
  
  // Update ETag values in headers content
  headersContent = headersContent.replace(/ETag: W\/"html-version[^"]*"/g, `ETag: W/"html-${htmlHash}"`);
  headersContent = headersContent.replace(/ETag: W\/"css-version[^"]*"/g, `ETag: W/"css-${cssHash}"`);
  headersContent = headersContent.replace(/ETag: W\/"js-version[^"]*"/g, `ETag: W/"js-${jsHash}"`);
  headersContent = headersContent.replace(/ETag: W\/"img-version[^"]*"/g, `ETag: W/"img-${imgHash}"`);
  headersContent = headersContent.replace(/ETag: W\/"favicon-version[^"]*"/g, `ETag: W/"favicon-${faviconHash}"`);
  headersContent = headersContent.replace(/ETag: W\/"pdf-version[^"]*"/g, `ETag: W/"pdf-${pdfHash}"`);
  headersContent = headersContent.replace(/ETag: W\/"manifest-version[^"]*"/g, `ETag: W/"manifest-${manifestHash}"`);
  headersContent = headersContent.replace(/ETag: W\/"sitemap-version[^"]*"/g, `ETag: W/"sitemap-${sitemapHash}"`);
  headersContent = headersContent.replace(/ETag: W\/"robots-version[^"]*"/g, `ETag: W/"robots-${robotsHash}"`);
  
  // Write updated headers file
  fs.writeFileSync(headersPath, headersContent);
  
  console.log('✅ Cache invalidation headers updated with new version hashes:');
  console.log(`   HTML: ${htmlHash}`);
  console.log(`   CSS: ${cssHash}`);
  console.log(`   JS: ${jsHash}`);
  console.log(`   Images: ${imgHash}`);
  console.log(`   Favicon: ${faviconHash}`);
  console.log(`   PDF: ${pdfHash}`);
  console.log(`   Manifest: ${manifestHash}`);
  console.log(`   Sitemap: ${sitemapHash}`);
  console.log(`   Robots: ${robotsHash}`);
}

// Function to watch for file changes and update cache
function watchAndUpdate() {
  const watchPaths = [
    path.join(__dirname, '..', 'index.html'),
    path.join(__dirname, '..', 'assets'),
    path.join(__dirname, '..', 'manifest.json'),
    path.join(__dirname, '..', 'sitemap.xml'),
    path.join(__dirname, '..', 'robots.txt')
  ];
  
  console.log('👀 Watching for file changes...');
  
  watchPaths.forEach(watchPath => {
    if (fs.existsSync(watchPath)) {
      fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
        if (filename) {
          console.log(`📝 File changed: ${filename}`);
          updateHeadersFile();
        }
      });
    }
  });
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--watch')) {
    updateHeadersFile();
    watchAndUpdate();
  } else {
    updateHeadersFile();
  }
}

module.exports = { updateHeadersFile, generateHash }; 