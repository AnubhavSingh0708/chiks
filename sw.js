self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open('chicks-store').then((cache) => cache.addAll([
        '/chiks/',
        '/chiks/offline.html',
        '/chiks/favicon.ico',
        '/chiks/favicon.png',
        '/chiks/favicon1.png',
        '/chiks/favicon.svg',
      ])),
    );
  });
  /*
  self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request)),
    );
  });*/
  self.addEventListener("fetch", (event) => {
    // Only call event.respondWith() if this is a navigation request
    // for an HTML page.
    if (event.request.mode === "navigate") {
      event.respondWith(
        (async () => {
          try {
            // First, try to use the navigation preload response if it's
            // supported.
            const preloadResponse = await event.preloadResponse;
            if (preloadResponse) {
              return preloadResponse;
            }
  
            // Always try the network first.
            const networkResponse = await fetch(event.request);
            return networkResponse;
          } catch (error) {
            // catch is only triggered if an exception is thrown, which is
            // likely due to a network error.
            // If fetch() returns a valid HTTP response with a response code in
            // the 4xx or 5xx range, the catch() will NOT be called.
            console.log("Fetch failed; returning offline page instead.", error);
  
            const cache = await caches.open("chicks-store");
            const cachedResponse = await cache.match("/chiks/offline.html");
            return cachedResponse;
          }
        })()
      );
    }
  
  });
  