const CACHE_NAME = 'petshop-v1.0.49754';
const ASSETS = [
  '/mypetshop2/',
  '/mypetshop2/index.html',
  '/mypetshop2/manifest.json',
  '/mypetshop2/images/dog.png',
  '/mypetshop2/images/cat.png',
  '/mypetshop2/images/curler-hamster-icon.png'
];

// Install: precache assets + skipWaiting is handled only after user approval
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => console.log('All assets cached'))
  );
});

// Activate: claim clients immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    self.clients.claim().then(() => console.log('Service Worker claimed clients'))
  );
});

// Message from index.html to skip waiting
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch: Network-First ONLY for HTML (critical for iOS Home Screen)
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
