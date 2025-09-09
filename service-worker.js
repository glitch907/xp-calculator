// service-worker.js
const VERSION = new URL(location).searchParams.get("v") || "v2";
const CACHE_NAME = `clan-castle-xp-cache-${VERSION}`;

const ASSETS_TO_CACHE = [
  "./index.html",
  "./elixir-calculator.html",
  "./manifest.json?v=" + VERSION,
  "./icons/icon-192.png?v=" + VERSION,
  "./icons/icon-512.png?v=" + VERSION,
  "./service-worker.js?v=" + VERSION,
  // Add any other local CSS or JS files your app needs
];

self.addEventListener("install", event => {
  console.log(`[ServiceWorker] Installing version ${VERSION}`);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[ServiceWorker] Caching app assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log(`[ServiceWorker] Activating version ${VERSION}`);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log(`[ServiceWorker] Deleting old cache: ${name}`);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request)
        .then(response => {
          // Only cache successful requests
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Optionally return a fallback page/image here if offline
        });
    })
  );
});
