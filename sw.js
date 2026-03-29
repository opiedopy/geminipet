const CACHE_NAME = 'petshop-v1.0.48';
const ASSETS = [
    '/mypetshop2/',
    '/mypetshop2/index.html',
    '/mypetshop2/manifest.json',
    '/mypetshop2/images/dog.png',
    '/mypetshop2/images/cat.png',
    '/mypetshop2/images/curler-hamster-icon.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.map((k) => { if (k !== CACHE_NAME) return caches.delete(k); })
        )).then(() => self.clients.claim())
    );
});

// NETWORK-FIRST for the HTML page to prevent the iPhone from getting "stuck"
self.addEventListener('fetch', (e) => {
    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request).catch(() => caches.match(e.request))
        );
        return;
    }
    e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});

self.addEventListener('message', (e) => {
    if (e.data.action === 'skipWaiting') self.skipWaiting();
});
