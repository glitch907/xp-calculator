// Extract VERSION from query string (default fallback)
const VERSION = new URL(location).searchParams.get("v") || "v1";
const CACHE_NAME = "elixir-cache-" + VERSION;

const ASSETS_TO_CACHE = [
  "./elixir-calculator.html",
  "./manifestE.json?v=" + VERSION,
  "./icons/iconE-192.png?v=" + VERSION,
  "./icons/iconE-512.png?v=" + VERSION
];

// Install: cache essential files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate: remove old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// Fetch: try network first, fallback to cache
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
