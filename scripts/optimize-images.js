/**
 * Image Optimization Script
 * Optimizes images for web performance using sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class ImageOptimizer {
  constructor() {
    this.inputDir = 'assets/images';
    this.outputDir = 'assets/images/optimized';
    this.quality = 85;
    this.formats = ['webp', 'avif'];
  }

  async optimizeImages() {
    try {
      // Create output directory if it doesn't exist
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      // Get all image files
      const imageFiles = this.getImageFiles();
      
      console.log(`Found ${imageFiles.length} images to optimize`);

      for (const file of imageFiles) {
        await this.optimizeImage(file);
      }

      console.log('Image optimization completed!');
    } catch (error) {
      console.error('Error optimizing images:', error);
    }
  }

  getImageFiles() {
    const files = [];
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
    
    const readDir = (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          readDir(fullPath);
        } else if (extensions.includes(path.extname(item).toLowerCase())) {
          files.push(fullPath);
        }
      }
    };

    readDir(this.inputDir);
    return files;
  }

  async optimizeImage(filePath) {
    const fileName = path.basename(filePath, path.extname(filePath));
    const ext = path.extname(filePath).toLowerCase();
    
    console.log(`Optimizing: ${fileName}${ext}`);

    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();

      // Create optimized versions
      const promises = [];

      // Original format optimization
      promises.push(this.createOptimizedVersion(image, fileName, ext, metadata));

      // WebP version
      promises.push(this.createWebPVersion(image, fileName, metadata));

      // AVIF version (if supported)
      if (this.formats.includes('avif')) {
        promises.push(this.createAVIFVersion(image, fileName, metadata));
      }

      await Promise.all(promises);
      
      console.log(`✓ Optimized: ${fileName}${ext}`);
    } catch (error) {
      console.error(`✗ Failed to optimize ${fileName}${ext}:`, error.message);
    }
  }

  async createOptimizedVersion(image, fileName, ext, metadata) {
    const outputPath = path.join(this.outputDir, `${fileName}${ext}`);
    
    let optimized = image;
    
    // Resize if too large
    if (metadata.width > 1920 || metadata.height > 1920) {
      optimized = optimized.resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Apply optimization based on format
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        optimized = optimized.jpeg({
          quality: this.quality,
          progressive: true,
          mozjpeg: true
        });
        break;
      case '.png':
        optimized = optimized.png({
          quality: this.quality,
          progressive: true,
          compressionLevel: 9
        });
        break;
      case '.gif':
        optimized = optimized.gif();
        break;
    }

    await optimized.toFile(outputPath);
  }

  async createWebPVersion(image, fileName, metadata) {
    const outputPath = path.join(this.outputDir, `${fileName}.webp`);
    
    let optimized = image;
    
    // Resize if too large
    if (metadata.width > 1920 || metadata.height > 1920) {
      optimized = optimized.resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    await optimized.webp({
      quality: this.quality,
      effort: 6
    }).toFile(outputPath);
  }

  async createAVIFVersion(image, fileName, metadata) {
    const outputPath = path.join(this.outputDir, `${fileName}.avif`);
    
    let optimized = image;
    
    // Resize if too large
    if (metadata.width > 1920 || metadata.height > 1920) {
      optimized = optimized.resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    await optimized.avif({
      quality: this.quality,
      effort: 9
    }).toFile(outputPath);
  }

  // Create responsive image sizes
  async createResponsiveImages() {
    const sizes = [
      { width: 400, suffix: '-sm' },
      { width: 800, suffix: '-md' },
      { width: 1200, suffix: '-lg' },
      { width: 1920, suffix: '-xl' }
    ];

    const imageFiles = this.getImageFiles();
    
    for (const file of imageFiles) {
      const fileName = path.basename(file, path.extname(file));
      const ext = path.extname(file);
      
      for (const size of sizes) {
        await this.createResponsiveVersion(file, fileName, ext, size);
      }
    }
  }

  async createResponsiveVersion(filePath, fileName, ext, size) {
    const outputPath = path.join(this.outputDir, `${fileName}${size.suffix}${ext}`);
    
    try {
      await sharp(filePath)
        .resize(size.width, null, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: this.quality, progressive: true })
        .toFile(outputPath);
        
      console.log(`Created: ${fileName}${size.suffix}${ext}`);
    } catch (error) {
      console.error(`Failed to create ${fileName}${size.suffix}${ext}:`, error.message);
    }
  }
}

// Run optimization if called directly
if (require.main === module) {
  const optimizer = new ImageOptimizer();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--responsive')) {
    optimizer.createResponsiveImages();
  } else {
    optimizer.optimizeImages();
  }
}

module.exports = ImageOptimizer; 