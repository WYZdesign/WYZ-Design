const SW_VERSION = "v1";

self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(`wyzdesign-${SW_VERSION}`).then((cache) => {
      return cache.addAll([
        "/",
        "/home",
        "/photography",
        "/designs",
        "/services",
        "/plans",
        "/offline",
      ]);
    })
  );
});

self.addEventListener("activate", (event: any) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== `wyzdesign-${SW_VERSION}`).map((k) => caches.delete(k))
      );
    })
  );
});

self.addEventListener("fetch", (event: any) => {
  if (event.request.method !== "GET") return;

  if (event.request.url.includes("/api/") || event.request.url.includes("/_next/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(`wyzdesign-${SW_VERSION}`).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
      return cached || fetched;
    })
  );
});