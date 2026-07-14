const CACHE_NAME = "shellcompare-v1";
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png"
];

// Install event - Pre-cache essential files for immediate offline shell availability
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Pre-caching offline shell...");
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Cleanup old cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("[Service Worker] Cleaning up old cache:", cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - Handle caching strategies (Network-First for HTML/Nav, Stale-While-Revalidate/Cache-First for static assets)
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Exclude non-GET requests (e.g. POST /api/evaluate-challenge, which has local code fallbacks)
  if (request.method !== "GET") {
    return;
  }

  // Handle only HTTP/HTTPS protocols (avoiding chrome-extension://, etc)
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return;
  }

  // Skip Vite dev-server HMR websocket files and hot module updates to avoid caching noise in development
  if (url.pathname.includes("@vite") || url.pathname.includes("node_modules") || url.pathname.includes("hot-update.json")) {
    return;
  }

  // 1. Navigation requests & HTML files: Network-First falling back to Cache
  if (request.mode === "navigate" || url.pathname === "/" || url.pathname.endsWith(".html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If offline, serve the main cached index.html
          return caches.match("./index.html") || caches.match("/");
        })
    );
    return;
  }

  // 2. Static Assets (JS, CSS, SVGs, images, Google Fonts): Stale-While-Revalidate
  const isAsset =
    url.pathname.includes("/assets/") ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".woff2");

  if (isAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch new version in background to refresh the cache for the next reload
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, networkResponse);
                });
              }
            })
            .catch(() => {
              // Ignore background fetch error when offline
            });
          return cachedResponse;
        }

        // Cache miss: Fetch and cache
        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Default fallback: Network-first
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});
