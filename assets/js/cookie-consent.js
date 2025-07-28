/**
 * Cookie Consent Management System
 * Handles third-party cookies and user consent
 */

class CookieConsent {
  constructor() {
    this.consentKey = 'cookie-consent';
    this.consentVersion = '1.0';
    this.requiredCookies = ['functional', 'analytics'];
    this.init();
  }

  init() {
    // Check if consent is already given
    const consent = this.getConsent();
    
    if (!consent) {
      this.showConsentBanner();
    } else {
      this.loadThirdPartyResources(consent);
    }

    // Handle consent changes
    this.handleConsentChanges();
  }

  showConsentBanner() {
    // Create consent banner
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.className = 'fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 z-50 shadow-lg';
    banner.innerHTML = `
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold mb-2">Cookie Preferences</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              We use cookies to enhance your experience. Some cookies are necessary for the website to function properly, while others help us improve our services.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-2">
            <button id="accept-all-cookies" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
              Accept All
            </button>
            <button id="accept-essential-cookies" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
              Essential Only
            </button>
            <button id="customize-cookies" class="px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
              Customize
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Add event listeners
    document.getElementById('accept-all-cookies').addEventListener('click', () => {
      this.setConsent({
        functional: true,
        analytics: true,
        marketing: true,
        version: this.consentVersion,
        timestamp: Date.now()
      });
      this.hideBanner();
      this.loadThirdPartyResources({ functional: true, analytics: true, marketing: true });
    });

    document.getElementById('accept-essential-cookies').addEventListener('click', () => {
      this.setConsent({
        functional: true,
        analytics: false,
        marketing: false,
        version: this.consentVersion,
        timestamp: Date.now()
      });
      this.hideBanner();
      this.loadThirdPartyResources({ functional: true, analytics: false, marketing: false });
    });

    document.getElementById('customize-cookies').addEventListener('click', () => {
      this.showCustomizeModal();
    });
  }

  showCustomizeModal() {
    const modal = document.createElement('div');
    modal.id = 'cookie-customize-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6">
        <h3 class="text-xl font-semibold mb-4">Cookie Preferences</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium">Essential Cookies</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Required for the website to function</p>
            </div>
            <input type="checkbox" checked disabled class="rounded border-gray-300">
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium">Analytics Cookies</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Help us understand how visitors use our site</p>
            </div>
            <input type="checkbox" id="analytics-consent" class="rounded border-gray-300">
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium">Marketing Cookies</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Used for personalized advertising</p>
            </div>
            <input type="checkbox" id="marketing-consent" class="rounded border-gray-300">
          </div>
        </div>
        
        <div class="flex gap-2 mt-6">
          <button id="save-preferences" class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Save Preferences
          </button>
          <button id="cancel-preferences" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    document.getElementById('save-preferences').addEventListener('click', () => {
      const analytics = document.getElementById('analytics-consent').checked;
      const marketing = document.getElementById('marketing-consent').checked;
      
      this.setConsent({
        functional: true,
        analytics,
        marketing,
        version: this.consentVersion,
        timestamp: Date.now()
      });
      
      this.hideModal();
      this.hideBanner();
      this.loadThirdPartyResources({ functional: true, analytics, marketing });
    });

    document.getElementById('cancel-preferences').addEventListener('click', () => {
      this.hideModal();
    });

    // Close modal on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideModal();
      }
    });
  }

  hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.remove();
    }
  }

  hideModal() {
    const modal = document.getElementById('cookie-customize-modal');
    if (modal) {
      modal.remove();
    }
  }

  loadThirdPartyResources(consent) {
    // Load resources based on consent
    if (consent.analytics) {
      this.loadAnalytics();
    }
    
    if (consent.marketing) {
      this.loadMarketing();
    }

    // Always load functional resources
    this.loadFunctional();
  }

  loadAnalytics() {
    // Load analytics scripts only if consent is given
    console.log('Loading analytics resources...');
    // Add your analytics code here
  }

  loadMarketing() {
    // Load marketing scripts only if consent is given
    console.log('Loading marketing resources...');
    // Add your marketing code here
  }

  loadFunctional() {
    // Load functional resources (always needed)
    console.log('Loading functional resources...');
    
    // Load third-party resources with consent
    const resources = document.querySelectorAll('[data-cookie-consent="required"]');
    resources.forEach(resource => {
      if (resource.tagName === 'LINK') {
        // Already loaded, just ensure it's enabled
        resource.disabled = false;
      } else if (resource.tagName === 'SCRIPT') {
        // Load script if not already loaded
        if (!resource.src || !document.querySelector(`script[src="${resource.src}"]`)) {
          const script = document.createElement('script');
          script.src = resource.src;
          script.async = resource.async;
          script.defer = resource.defer;
          document.head.appendChild(script);
        }
      }
    });
  }

  setConsent(consent) {
    localStorage.setItem(this.consentKey, JSON.stringify(consent));
  }

  getConsent() {
    const stored = localStorage.getItem(this.consentKey);
    if (!stored) return null;
    
    try {
      const consent = JSON.parse(stored);
      // Check if consent version is current
      if (consent.version !== this.consentVersion) {
        return null;
      }
      return consent;
    } catch (e) {
      return null;
    }
  }

  handleConsentChanges() {
    // Listen for consent changes from other parts of the app
    window.addEventListener('cookie-consent-change', (e) => {
      this.loadThirdPartyResources(e.detail);
    });

    // Handle cookie preferences button in footer
    document.addEventListener('click', (e) => {
      if (e.target.id === 'cookie-preferences-btn') {
        this.showCustomizeModal();
      }
    });

    // Handle privacy policy modal
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href="#privacy-policy"]')) {
        e.preventDefault();
        document.getElementById('privacy-policy-modal').classList.remove('hidden');
      }
      
      if (e.target.id === 'close-privacy-modal' || e.target.closest('#close-privacy-modal')) {
        document.getElementById('privacy-policy-modal').classList.add('hidden');
      }
    });

    // Close privacy modal on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.id === 'privacy-policy-modal') {
        e.target.classList.add('hidden');
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('privacy-policy-modal');
        if (modal && !modal.classList.contains('hidden')) {
          modal.classList.add('hidden');
        }
      }
    });
  }

  // Public method to update consent
  updateConsent(newConsent) {
    this.setConsent(newConsent);
    this.loadThirdPartyResources(newConsent);
  }

  // Public method to revoke consent
  revokeConsent() {
    localStorage.removeItem(this.consentKey);
    // Reload page to reset all third-party resources
    window.location.reload();
  }
}

// Initialize cookie consent when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.cookieConsent = new CookieConsent();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CookieConsent;
} 