// Version (matches your HTML VERSION)
const VERSION = new URL(location).searchParams.get("v") || "v2";
const CACHE_NAME = "elixir-cache-" + VERSION;

const ASSETS_TO_CACHE = [
  "./elixir-calculator.html",
  "./index.html",
  "./manifestE.json",
  "./icons/iconE-192.png",
  "./icons/iconE-512.png"
];

// Install → cache core assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate → cleanup old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key.startsWith("elixir-cache-") && key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch → try cache first, then network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
