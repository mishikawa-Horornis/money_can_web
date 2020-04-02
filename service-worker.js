let PRECACHE = 'moneycounter-horornis-v3_0_3';
let RUNTIME = 'runtime';
let version = '1.0.7';

// A list of local resources we always want to be cached.
let PRECACHE_URLS = [
    'index.html',
    'css/main.css',
    'images/ic_money_can_round_192.png',
    'images/ic_money_can_round_144.png',
    'images/ic_money_can_round_128.png',
    'images/ic_money_can_round_152.png',
    'images/icon-512x512.png',
    'images/moneycounter-logo.png',
    'images/site-logo.png',
    'images/logo.png',
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
    'images/eraser.png',
    'js/clipboard.min.js',
    'js/jquery-3.4.1.min.js',
    'js/popper.min.js',
    'js/store2.min.js',
    'js/vue.min.js',
    'bootstrap/css/bootstrap.min.css',
    'bootstrap/js/bootstrap.min.js',
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
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;
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

