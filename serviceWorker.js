let staticCache = "staticrecetas-v1";
let dynamicCache = "dynamicrecetas-v1";
let inmutableCache = "inmutablerecetas-v1";
self.addEventListener("install", (result) => {
  // abrir el cache con base al nombre y si no existe lo crea
  let files_appShell = ["/",
    "/index.html",
    "/css/styles.css"];
  const static_cache = caches.open(staticCache).then((cacheStatic) => {
    cacheStatic.addAll(files_appShell);
  });

  const inmutable_cache_files = [
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
    ];
   const inmutable_cache=caches.open(inmutableCache).then((cacheInmutable) => {
    cacheInmutable.addAll(inmutable_cache_files);
  });
  result.waitUntil(Promise.allSettled([static_cache, inmutable_cache]));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cachesList) =>
        Promise.all(
          cachesList.map((cacheName) => {
            if (staticCache != cacheName && inmutableCache != cacheName) {
              return caches.delete(cacheName);
            }
          })
        )
      )
      .then(() => {
        console.log("V2 now ready to handle fetches!");
      })
  );
});

self.addEventListener('fetch', (event) => {

event.respondWith(caches.match(event.request).then(
  cacheResponse =>{
             return cacheResponse || fetch(event.request).then(
                 networkResponse => {
                    caches.open(dynamicCache).then(cache => {
                        cache.put(event.request, networkResponse.clone())
                        return networkResponse;
                    })
                 }
             )
      }
))
})

self.addEventListener("message", (obj) => {
  //revisar si el msj tiene el mensaje 'skipWaiting'
  if (obj.data.action === "skipWaiting") {
    //ejecutar el skipWaiting
    self.skipWaiting();
  }
});