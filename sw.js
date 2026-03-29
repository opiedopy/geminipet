/* SERVICE WORKER: sw.js
  Target Platforms: iPhone 12/15, Recent MacBook/iPad [cite: 4]
*/

const CACHE_VERSION = 'v12'; 
const CACHE_NAME = `mypetshop-cache-${CACHE_VERSION}`;

// [cite: 5, 21-25]
const ASSETS_TO_CACHE = [
    '/mypetshop2/',
    '/mypetshop2/index.html',
    '/mypetshop2/manifest.json',
    '/mypetshop2/images/dog.png',
    '/mypetshop2/images/cat.png',
    '/mypetshop2/images/curler-hamster-icon.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching pet shop assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// [cite: 35, 36]
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        }).then(() => {
            // FOR SAFARI: Force the new SW to take control of all open tabs immediately 
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// [cite: 37]
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
