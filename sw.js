/* SERVICE WORKER: sw.js
  Target Platforms: iPhone 12/15, Recent MacBook/iPad [cite: 4]
*/

// [STEP 1] Update Workflow: Change 'v1' to 'v2', 'v3', etc. to trigger the banner 
const CACHE_VERSION = 'v9'; 
const CACHE_NAME = `mypetshop-cache-${CACHE_VERSION}`;

// [STEP 2] Define Assets to Cache [cite: 5, 13-25]
const ASSETS_TO_CACHE = [
    '/mypetshop2/',
    '/mypetshop2/index.html',
    '/mypetshop2/manifest.json',
    '/mypetshop2/images/dog.png',
    '/mypetshop2/images/cat.png',
    '/mypetshop2/images/curler-hamster-icon.png'
];

// Installation: Pre-cache all essential files 
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching pet shop assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activation: Clean up old versions of the cache 
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Cache-First Strategy: Serve from cache, fallback to network 
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached version if found, otherwise fetch from internet
            return response || fetch(event.request);
        })
    );
});

// Handle the "Tap to Update" message from index.html [cite: 8, 31-32]
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
