/* Muts Safaris — Enhanced Service Worker */
var CACHE_NAME = 'muts-safaris-v2';
var OFFLINE_PAGE = '/login.html';

var STATIC_ASSETS = [
    '/',
    '/index.html',
    '/login.html',
    '/css/dashboard-theme.css',
    '/css/login-landing.css',
    '/js/auth.js',
    '/js/dashboard-theme.js',
    '/js/services/destinations-service.js',
    '/js/services/bookings-service.js',
    '/js/services/listings-service.js',
    '/js/services/messages-service.js',
    '/js/services/transactions-service.js',
    '/js/services/africasa-service.js',
    '/assets/favicon/favicon.ico'
];

var CACHE_STRATEGIES = {
    '/pages/dashboard/': 'cache-first',
    '/images/': 'cache-first',
    '/css/': 'cache-first',
    '/js/': 'cache-first',
    '/api/': 'network-first'
};

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('[SW] Pre-caching static assets');
            return cache.addAll(STATIC_ASSETS);
        }).catch(function(err) {
            console.log('[SW] Pre-cache failed:', err);
        })
    );
    self.skipWaiting();
    console.log('[SW] Installed, version:', CACHE_NAME);
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            console.log('[SW] Checking old caches:', keys);
            return Promise.all(
                keys.filter(function(key) {
                    return key !== CACHE_NAME;
                }).map(function(key) {
                    console.log('[SW] Deleting old cache:', key);
                    return caches.delete(key);
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
    console.log('[SW] Activated, claiming clients');
});

self.addEventListener('fetch', function(event) {
    var url = new URL(event.request.url);
    
    if (event.request.method !== 'GET') return;
    
    if (url.origin !== location.origin) return;
    
    var strategy = getStrategy(url.pathname);
    
    if (strategy === 'cache-first') {
        event.respondWith(cacheFirst(event.request));
    } else if (strategy === 'network-first') {
        event.respondWith(networkFirst(event.request));
    } else {
        event.respondWith(staleWhileRevalidate(event.request));
    }
});

function getStrategy(pathname) {
    for (var pattern in CACHE_STRATEGIES) {
        if (pathname.startsWith(pattern)) {
            return CACHE_STRATEGIES[pattern];
        }
    }
    return 'stale-while-revalidate';
}

function cacheFirst(request) {
    return caches.match(request).then(function(response) {
        if (response) {
            return response;
        }
        return fetch(request).then(function(networkResponse) {
            if (networkResponse && networkResponse.status === 200) {
                var cache = caches.open(CACHE_NAME);
                var responseClone = networkResponse.clone();
                cache.then(function(c) {
                    c.put(request, responseClone);
                });
            }
            return networkResponse;
        }).catch(function() {
            return caches.match(OFFLINE_PAGE);
        });
    });
}

function networkFirst(request) {
    return fetch(request).then(function(response) {
        if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
                cache.put(request, clone);
            });
        }
        return response;
    }).catch(function() {
        return caches.match(request).then(function(cached) {
            return cached || new Response('', { status: 503, statusText: 'Offline' });
        });
    });
}

function staleWhileRevalidate(request) {
    var cacheResponse = caches.match(request);
    var fetchPromise = fetch(request).then(function(networkResponse) {
        if (networkResponse && networkResponse.status === 200) {
            var cache = caches.open(CACHE_NAME);
            cache.then(function(c) {
                c.put(request, networkResponse.clone());
            });
        }
        return networkResponse;
    }).catch(function() {
        return new Response('', { status: 503, statusText: 'Service Unavailable' });
    });
    return cacheResponse.then(function(cached) {
        return cached || fetchPromise;
    });
}

self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then(function(keys) {
            return Promise.all(keys.map(function(key) {
                return caches.delete(key);
            }));
        }).then(function() {
            self.clients.matchAll().then(function(clients) {
                clients.forEach(function(client) {
                    client.postMessage({ type: 'CACHE_CLEARED' });
                });
            });
        });
    }
});

self.addEventListener('push', function(event) {
    var data = event.data ? event.data.json() : {};
    var options = {
        body: data.body || 'New update from Muts Safaris',
        icon: '/assets/favicon/favicon.ico',
        badge: '/assets/favicon/favicon.ico',
        vibrate: [100, 50, 100],
        data: data.url || '/'
    };
    event.waitUntil(
        self.registration.showNotification(data.title || 'Muts Safaris', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data)
    );
});
