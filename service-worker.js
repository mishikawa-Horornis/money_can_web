let PRECACHE = 'moneycounter-horornis-v3_0_2';
let RUNTIME = 'runtime';
let version = '3.0.153';

// A list of local resources we always want to be cached.
let PRECACHE_URLS = [
    'index.html',
    'js/Sortable.min.js',
    'style/main.css',
    'images/apple-touch-icon.png',
    'images/chrome-touch-icon-192x192.png',
    'images/icon-128x128.png',
    'images/icon-192x192.png',
    'images/icon-512x512.png',
    'images/ms-touch-icon-144x144-precomposed.png',
    'images/logo.png',
    'images/moneycounter-logo.png',
    'images/site-logo.png',
    'images/coin-1.png',
    'images/coin-5.png',
    'images/coin-10.png',
    'images/coin-50.png',
    'images/coin-100.png',
    'images/coin-500.png',
    'images/coin-1000.png',
    'images/coin-2000.png',
    'images/coin-5000.png',
    'images/coin-10000.png',
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(self.skipWaiting())
    );
});

// The activate handler takes care of cleaning up old caches.

self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
    // Skip cross-origin requests, like those for Google Analytics.
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.open(RUNTIME).then(cache => {
                    return fetch(event.request).then(response => {
                        // Put a copy of the response in the runtime cache.
                        return cache.put(event.request, response.clone()).then(() => {
                            return response;
                        });
                    });
                });
            })
        );
    }
});
