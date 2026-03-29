/* SERVICE WORKER: sw.js (v1.0.2) */

const CACHE_VERSION = 'v1.0.2'; 
const CACHE_NAME = `mypetshop-cache-${CACHE_VERSION}`;

const ASSETS = [
    '/mypetshop2/',
    '/mypetshop2/index.html',
    '/mypetshop2/manifest.json',
    '/mypetshop2/images/dog.png',
    '/mypetshop2/images/cat.png',
    '/mypetshop2/images/curler-hamster-icon.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((k) => {
                if (k !== CACHE_NAME) return caches.delete(k);
            }));
        }).then(() => self.clients.claim()) // Immediate takeover [text2.txt]
    );
});

self.addEventListener('fetch', (e) => {
    // SPECIAL RULE: For index.html, try network first to bypass iOS home screen stuckness
    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request).catch(() => caches.match(e.request))
        );
        return;
    }

    // Default Cache-First for images and other assets
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});

self.addEventListener('message', (e) => {
    if (e.data && e.data.action === 'skipWaiting') self.skipWaiting();
});
