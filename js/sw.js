/**
 * Service Worker - Muts Safaris
 * Offline caching and network strategies
 */
var CACHE_NAME = 'muts-safaris-v1';
var STATIC_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/pages/dashboard/index.html',
  '/css/main.css',
  '/css/manager.css',
  '/js/app.js'
];

// Install event - cache static assets
self.addEventListener('install', function(event) {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', function(event) {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // API calls - network only (don't cache API)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(function() {
        return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Network first, then cache
  event.respondWith(
    fetch(request)
      .then(function(response) {
        // Clone and cache the response
        var responseClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(request, responseClone);
        });
        return response;
      })
      .catch(function() {
        // Fallback to cache
        return caches.match(request).then(function(response) {
          return response || caches.match('/offline.html').then(function(offline) {
            return offline || new Response('Offline', { status: 503 });
          });
        });
      })
  );
});
