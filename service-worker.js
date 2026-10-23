const CACHE_PREFIX = 'repzena-static-';
const CACHE_NAME = `${CACHE_PREFIX}v11`;
const CORE_FILES = [
  './',
  './index.html',
  './favicon.svg',
  './styles.css',
  './app.js',
  './theme.js',
  './data/exercises.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_FILES).then(() => cache))
      .then(async (cache) => {
        const scopeUrl = new URL(self.registration.scope);
        const catalogResponse = await cache.match(new URL('./data/exercises.json', scopeUrl).href);
        const catalog = await catalogResponse.json();
        const imageUrls = [
          ...new Set(
            catalog
              .flatMap((exercise) => (Array.isArray(exercise.images) ? exercise.images : []))
              .map((image) => new URL(image.src, scopeUrl))
              .filter(
                (url) =>
                  url.origin === scopeUrl.origin && url.pathname.startsWith(scopeUrl.pathname),
              )
              .map((url) => url.href),
          ),
        ];
        await cache.addAll(imageUrls);
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);
  if (request.method !== 'GET' || requestUrl.origin !== scopeUrl.origin) return;

  const isInScope = requestUrl.pathname.startsWith(scopeUrl.pathname);
  if (!isInScope) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
          return (await caches.match(new URL('./index.html', scopeUrl).href)) || Response.error();
        }
        return Response.error();
      }),
  );
});
