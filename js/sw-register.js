/**
 * Service Worker Registration - Muts Safaris
 */
(function() {
  'use strict';

  var MutsServiceWorker = {
    _registered: false,

    /**
     * Register the service worker
     */
    register: function() {
      if (this._registered || !('serviceWorker' in navigator)) {
        return Promise.resolve(false);
      }

      return navigator.serviceWorker.register('/js/sw.js')
        .then(function(registration) {
          console.log('[SW] Registered:', registration.scope);
          this._registered = true;
          
          // Check for updates
          registration.addEventListener('updatefound', function() {
            var newWorker = registration.installing;
            newWorker.addEventListener('statechange', function() {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] New version available');
              }
            });
          });

          return registration;
        }.bind(this))
        .catch(function(err) {
          console.warn('[SW] Registration failed:', err);
          return Promise.resolve(false);
        });
    },

    /**
     * Unregister the service worker
     */
    unregister: function() {
      if (!('serviceWorker' in navigator)) {
        return Promise.resolve(false);
      }

      return navigator.serviceWorker.getRegistrations()
        .then(function(registrations) {
          return Promise.all(registrations.map(function(reg) {
            return reg.unregister();
          }));
        })
        .then(function() {
          this._registered = false;
          console.log('[SW] Unregistered');
          return true;
        }.bind(this));
    },

    /**
     * Check if offline
     */
    isOffline: function() {
      return !navigator.onLine;
    },

    /**
     * Send message to SW
     */
    sendMessage: function(message) {
      return navigator.serviceWorker.ready.then(function(registration) {
        return registration.active.postMessage(message);
      });
    }
  };

  // Auto-register on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      MutsServiceWorker.register();
    });
  } else {
    MutsServiceWorker.register();
  }

  window.MutsServiceWorker = MutsServiceWorker;
})();
