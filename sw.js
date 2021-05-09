const CACHE_STATIC_NAME = "static-v1";
const CACHE_DYNAMIC_NAME = "dynamic-v1";

self.addEventListener("install", (event) => {
  console.log("[Installing Service Worker]");
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then((cache) => {
      // cache.add("/index.html");
      // cache.add("/css/style.css");
      cache.addAll(["/", "/index.html", "/js/app.js", "/css/style.css"]);
    })
  );
});

self.addEventListener(`activate`, (event) => {
  console.log(`[Activating Service Worker]`);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME)
            console.log("[Service Worker deleting]", key);
          return caches.delete(key);
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("update", (event) => {
  console.log("[Updating Service Worker]");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) return response;
        else {
          return fetch(event.request);
          // .then((res) => {
          //   return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
          //     cache.put(event.request.url, res.clone());
          //     return res;
          //   });
          // });
        }
      })
      .catch((err) => {
        return caches.match("/offline.html");
      })

    // fetch(event.request)
    //   .then((res) => {
    //     return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
    //       cache.put(event.request.url, res.clone());
    //       return res;
    //     });
    //   })
    //   .catch((err) => {
    //     caches.match(event.request).then((response) => {
    //       if (response) return response;
    //       else return caches.match("/offline.html");
    //     });
    //   })
  );
});
