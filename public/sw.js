const CACHE_NAME = 'bounce-hunter-v1';

// On install, cache the app shell and critical assets.
self.addEventListener('install', event => {
  // Service worker is installed.
  // We don't pre-cache anything here, we'll cache on-the-fly.
  // This makes the install faster.
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

// On fetch, use a network-first strategy for navigation, and cache-first for other assets.
self.addEventListener('fetch', event => {
  // We only care about GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For navigation requests (e.g., loading the page), try the network first.
  // This ensures users always get the latest version of the main page.
  // Fallback to cache if offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('index.html'))
    );
    return;
  }
  
  // For all other requests (assets like scripts, styles, etc.), use a cache-first strategy.
  // This makes the app load instantly from the cache.
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // If the response is in the cache, return it.
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // If not in cache, fetch it from the network.
      return fetch(event.request).then(networkResponse => {
        // Check for a valid response to cache.
        if (networkResponse && networkResponse.status === 200) {
            // We can't cache 'opaque' responses (from no-cors requests like to a CDN without proper headers)
            // But for this use case, we will try to cache what we can.
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
            });
        }
        return networkResponse;
      });
    })
  );
});

// On activate, clean up old caches to save space.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all clients
  );
});
