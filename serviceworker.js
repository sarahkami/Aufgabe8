// source: https://github.com/lewiscowper/serviceworker-demo/blob/master/public/sw.js

var CACHE_NAME = 'exchange_rates';
// The files we want to cache
var urlsToCache = [
  '.',
  'index.html',
  'css/normalize.css',
  'css/style.css',
  'manifest.json',
  'js/currencies.json.js',
  'js/jquery-2.1.4.min.js',
  'js/script.js',
  'api/data.json',
  'api/index.php',
  'img/change.png',
  'img/piggy_bank-precomposed.png'
];


// Set the callback for the install step
this.oninstall = function (event) {
  console.log(event.type);

  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
};

this.onactivate = function (event) {
  console.log('SW activated');
};

this.onfetch = function (event) {
  event.respondWith(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(function (response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseToCache).then(function () {
                  console.log('successfully cached response!');
                });
              });

            return response;
          }
        )
      })
};



// self.addEventListener('install', (event) => {
//    event.waitUntil(
//       caches.open(CACHE_NAME)
//       .then((cache) => {
//          console.log('[install] Caches opened, adding all core components to cache');
//          return cache.addAll(REQUIRED_FILES);
//       })
//       .then(() => {
//          console.log('[install] All required resources have been cached, we\'re good!');
//          return self.skipWaiting();
//       })
//    );
// });

// self.addEventListener('activate', (event) => {
//    event.waitUntil(self.clients.claim());
// });

// self.addEventListener('fetch', (event) => {
//    console.log('[fetch] Handling fetch event for:', event.request.url);
//    event.respondWith(
//       caches.match(event.request).then((response) => {
//          if (response) {
//             console.log('[fetch] Returning from ServiceWorker cache: ', event.request.url);
//             return response;
//          }
//          console.log('[fetch] Returning from server: ', event.request.url);
//          return fetch(event.request);
//       })
//    );
// });

