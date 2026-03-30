const CACHE_NAME = 'gempet-ver 41';
const ASSETS = [
'/geminipet/',
'/geminipet/index.html',
'/geminipet/manifest.json',
'/geminipet/images/dog.png',
'/geminipet/images/cat.png',
'/geminipet/images/curler-hamster-icon.png'
];
// Install: precache assets (no skipWaiting – update waits for close/reopen)
self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll(ASSETS))
.then(() => console.log('All assets cached'))
);
});
// Activate: claim clients immediately (new SW only becomes active after full close/reopen)
self.addEventListener('activate', event => {
event.waitUntil(
self.clients.claim().then(() => console.log('Service Worker claimed clients'))
);

});
// Fetch: Network-First ONLY for HTML (critical for iOS Home Screen), Cache-First for
everything else
self.addEventListener('fetch', event => {
const isNavigation = event.request.mode === 'navigate' ||
event.request.destination === 'document';

if (isNavigation) {
// NETWORK-FIRST for HTML
event.respondWith(
fetch(event.request)
.catch(() => caches.match(event.request))
);
} else {
// CACHE-FIRST for images, manifest, etc.
event.respondWith(
caches.match(event.request)
.then(cached => cached || fetch(event.request))
);
}
});
