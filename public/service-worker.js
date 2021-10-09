const VERSION = 'v1';
const RESOURCES = ['/', './'];

self.addEventListener('install', event => {
  console.log('WORKER: install event in progress.');
  event.waitUntil(
    caches.open(`${VERSION}::fundamental`)
      .then(cache => cache.addAll(RESOURCES))
      .then(() => console.log(`WORKER: install completed`))
      .catch(console.error)
  );
});

self.addEventListener('activate', event => {
  console.log('WORKER: activate event in progress.');
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => !key.startsWith(version))
        .map(key => caches.delete(key))
      ))
      .then(() => console.log('WORKER: activate completed.'))
      .catch(console.error);
  );
});

self.addEventListener('fetch', event => {
  console.log('WORKER: fetch event in progress.');
  if (event.request.method !== 'GET') {
    console.log(`WORKER: fetch event ignored. (NOT GET)`, event.request.method, event.request.url);
    return;
  }

  const fetchedFromNetwork = (response) => {
    const cacheCopy = response.clone();
    console.log(`WORKER: fetch response from network.`, event.request.url);
    caches.open(`${VERSION}::pages`)
      .then((cache) => cache.put(event.request, cacheCopy))
      .then(() => console.log('WORKER: fetch response stored in cache.', event.request.url))
      .catch(console.error);

    return response;
  }

  const unableToResolve = () => {
    console.log('WORKER: fetch request failed in both cache and network.');
    return new Response('<h1>Service Unavailable</h1>', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/html'
      })
    });
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        const networked = fetch(event.request)
          .then(fetchedFromNetwork, unableToResolve)
          .catch(unableToResolve);
        console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
        return cached || networked;
      })
      .catch(console.error);
  );
});
