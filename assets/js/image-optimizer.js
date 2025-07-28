/**
 * Image Optimization and Lazy Loading Script
 * Handles image loading states, lazy loading, and performance optimization
 */

class ImageOptimizer {
  constructor() {
    this.images = [];
    this.observer = null;
    this.init();
  }

  init() {
    // Initialize intersection observer for lazy loading
    this.setupIntersectionObserver();
    
    // Handle existing images
    this.handleExistingImages();
    
    // Handle dynamically added images
    this.observeDynamicImages();
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '50px 0px', // Start loading 50px before image enters viewport
      threshold: 0.01
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  handleExistingImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      this.setupImage(img);
    });
  }

  observeDynamicImages() {
    // Watch for dynamically added images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const images = node.querySelectorAll ? node.querySelectorAll('img[loading="lazy"]') : [];
            images.forEach(img => this.setupImage(img));
            
            if (node.tagName === 'IMG' && node.getAttribute('loading') === 'lazy') {
              this.setupImage(node);
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupImage(img) {
    // Add loading state classes
    img.classList.add('image-loading');
    
    // Create container if needed
    if (!img.parentElement.classList.contains('image-container')) {
      const container = document.createElement('div');
      container.className = 'image-container';
      img.parentNode.insertBefore(container, img);
      container.appendChild(img);
    }

    // Start observing the image
    this.observer.observe(img);
  }

  loadImage(img) {
    // Check if image is already loaded
    if (img.complete && img.naturalHeight !== 0) {
      this.onImageLoad(img);
      return;
    }

    // Add load event listener
    img.addEventListener('load', () => this.onImageLoad(img));
    img.addEventListener('error', () => this.onImageError(img));

    // Trigger load if src is already set
    if (img.src) {
      // Force reload to trigger load event
      const currentSrc = img.src;
      img.src = '';
      img.src = currentSrc;
    }
  }

  onImageLoad(img) {
    img.classList.remove('image-loading');
    img.classList.add('image-loaded');
    
    // Add loaded class for CSS transitions
    setTimeout(() => {
      img.classList.add('loaded');
    }, 10);

    // Optimize image display
    this.optimizeImageDisplay(img);
  }

  onImageError(img) {
    img.classList.remove('image-loading');
    img.classList.add('image-error');
    
    // Show fallback or placeholder
    this.showImageFallback(img);
  }

  optimizeImageDisplay(img) {
    // Add decoding hint
    if (!img.decoding) {
      img.decoding = 'async';
    }

    // Optimize for different screen sizes
    this.setupResponsiveImage(img);
  }

  setupResponsiveImage(img) {
    const src = img.src;
    const isProfileImage = src.includes('profile.jpg');
    
    if (isProfileImage) {
      // Profile image optimization
      img.sizes = '(max-width: 768px) 100vw, 400px';
    } else {
      // Logo images
      img.sizes = '80px';
    }
  }

  showImageFallback(img) {
    // For logo images, show text fallback
    if (img.src.includes('grype-logo.png')) {
      // The onerror handler already handles this
      return;
    }
    
    // Generic fallback
    img.style.display = 'none';
    const fallback = document.createElement('div');
    fallback.className = 'image-fallback';
    fallback.innerHTML = '<i class="fas fa-image"></i>';
    fallback.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: #f3f4f6;
      color: #9ca3af;
      font-size: 2rem;
    `;
    img.parentNode.appendChild(fallback);
  }

  // Preload critical images
  preloadCriticalImages() {
    const criticalImages = [
      'assets/images/profile.jpg',
      'assets/images/cognitus-logo.svg',
      'assets/images/grype-logo.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Optimize images for different devices
  optimizeForDevice() {
    const isRetina = window.devicePixelRatio > 1;
    const isMobile = window.innerWidth <= 768;
    
    if (isRetina && !isMobile) {
      // Could implement high-DPI image loading here
      console.log('High-DPI display detected');
    }
  }
}

// Initialize image optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.imageOptimizer = new ImageOptimizer();
  
  // Preload critical images
  window.imageOptimizer.preloadCriticalImages();
  
  // Optimize for current device
  window.imageOptimizer.optimizeForDevice();
});

// Handle window resize for responsive optimization
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.imageOptimizer) {
      window.imageOptimizer.optimizeForDevice();
    }
  }, 250);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageOptimizer;
} 