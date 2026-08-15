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
        // Offline: serve a self-contained offline page for navigations
        if (event.request.mode === "navigate") {
          const offlineHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline | WYZ Design</title><style>body{margin:0;background:#111;color:#fff;font-family:Inter,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}px{-webkit-font-smoothing:antialiased}.c{max-width:400px;padding:2rem}.r{background:#DF3131;color:#fff;border:none;padding:1rem 2.5rem;font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;border-radius:8px;cursor:pointer;margin-top:1.5rem}.r:hover{background:#B82020}</style></head><body><div class="c"><p style="color:#DF3131;font-size:11px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;margin-bottom:1rem">You're offline</p><h1 style="font-size:2rem;font-weight:900;letter-spacing:.03em;margin:0 0 1rem">WYZ DESIGN</h1><p style="color:rgba(255,255,255,.6);font-size:15px;line-height:1.6;margin-bottom:2rem">Looks like you lost your connection. Reconnect and we'll get you right back in.</p><button class="r" onclick="location.reload()">Retry Connection</button><p style="margin-top:1.5rem"><a href="/home" style="color:#DF3131;font-size:14px;text-decoration:underline">Try home</a></p></div></body></html>`;
          return new Response(offlineHtml, { headers: { "Content-Type": "text/html" } });
        }
        return new Response("Offline", { status: 503 });
      })
  );
});
