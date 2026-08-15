/* WYZ Design Service Worker — Network-First Self-Healing */
const SW_VERSION = "v2-2026";
const CACHE_NAME = `wyzdesign-${SW_VERSION}`;

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = event.request.url;
  if (url.includes("/api/") || url.includes("/_next/webpack-hmr")) {
    return;
  }

  // Network-first strategy: Always fetch fresh HTML & assets first.
  // Fall back to cache ONLY if offline / network error.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        // Fallback for navigation requests when offline
        if (event.request.mode === "navigate") {
          return (await caches.match("/")) || (await caches.match("/home")) || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
        }
        return new Response("", { status: 503 });
      })
  );
});
