// CoinAds Ad Tag
// Version 1.0.0
(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    apiUrl: 'https://fuseads.com/api/delivery',
    trackUrl: 'https://fuseads.com/api/track/imp',
    version: '1.0.0'
  };

  // Utility functions
  function getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  function getCountry() {
    // In production, this would use IP geolocation
    // For MVP, default to US
    return 'US';
  }

  function createAdContainer(placementId, width, height) {
    const container = document.createElement('div');
    container.id = `coinads-${placementId}`;
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    container.style.margin = '0 auto';
    container.style.display = 'block';
    return container;
  }

  function loadAd(placementId, width, height) {
    const container = document.getElementById(`coinads-${placementId}`);
    if (!container) {
      console.warn('CoinAds: Container not found for placement', placementId);
      return;
    }

    // Build delivery URL
    const params = new URLSearchParams({
      placementId: placementId,
      w: width.toString(),
      h: height.toString(),
      country: getCountry(),
      device: getDeviceType(),
      url: window.location.href
    });

    const deliveryUrl = `${CONFIG.apiUrl}?${params.toString()}`;

    // Fetch ad content
    fetch(deliveryUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.html) {
          container.innerHTML = data.html;
          
          // Track impression if trackImpUrl is provided
          if (data.trackImpUrl) {
            fetch(data.trackImpUrl, { method: 'POST' })
              .catch(error => {
                console.warn('CoinAds: Failed to track impression', error);
              });
          }
        } else {
          // No fill - show placeholder or hide container
          container.style.display = 'none';
        }
      })
      .catch(error => {
        console.warn('CoinAds: Failed to load ad', error);
        // Hide container on error
        container.style.display = 'none';
      });
  }

  // Public API
  window.CoinAds = {
    version: CONFIG.version,
    
    // Initialize ad placement
    init: function(placementId, width, height) {
      if (!placementId || !width || !height) {
        console.error('CoinAds: Missing required parameters');
        return;
      }

      // Create container if it doesn't exist
      let container = document.getElementById(`coinads-${placementId}`);
      if (!container) {
        container = createAdContainer(placementId, width, height);
        document.body.appendChild(container);
      }

      // Load ad
      loadAd(placementId, width, height);
    },

    // Refresh ad placement
    refresh: function(placementId) {
      const container = document.getElementById(`coinads-${placementId}`);
      if (container) {
        const width = container.style.width.replace('px', '');
        const height = container.style.height.replace('px', '');
        loadAd(placementId, parseInt(width), parseInt(height));
      }
    },

    // Get version info
    getVersion: function() {
      return CONFIG.version;
    }
  };

  // Auto-initialize if data attributes are present
  document.addEventListener('DOMContentLoaded', function() {
    const autoContainers = document.querySelectorAll('[data-coinads-placement]');
    autoContainers.forEach(function(container) {
      const placementId = container.getAttribute('data-coinads-placement');
      const width = container.getAttribute('data-coinads-width') || '728';
      const height = container.getAttribute('data-coinads-height') || '90';
      
      if (placementId) {
        window.CoinAds.init(placementId, parseInt(width), parseInt(height));
      }
    });
  });

})();