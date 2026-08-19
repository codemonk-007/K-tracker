// Basic Service Worker to pass PWA requirements
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // We don't intercept fetch because GistSync handles our cloud logic
  // and GH pages caches our static files natively.
});
