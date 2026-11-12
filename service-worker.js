const CACHE_PREFIX = 'repzena-static-';
const CACHE_NAME = `${CACHE_PREFIX}v14`;
const OFFLINE_CACHE_NAME = 'repzena-offline-v1';
const OFFLINE_METADATA_URL = './__repzena_offline_metadata__.json';
const CORE_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './styles.css',
  './app.js',
  './theme.js',
  './data/exercises.json',
  './data/offline-assets.json',
  './assets/icons/app-icon-192.png',
  './assets/icons/app-icon-512.png',
  './assets/icons/apple-touch-icon.png',
];
let offlineMutationQueue = Promise.resolve();

async function preservePreviousImages(cacheNames) {
  const offlineCache = await caches.open(OFFLINE_CACHE_NAME);
  for (const name of cacheNames) {
    const previousCache = await caches.open(name);
    for (const request of await previousCache.keys()) {
      const url = new URL(request.url);
      if (!url.pathname.includes('/assets/') || url.pathname.includes('/assets/icons/')) continue;
      const response = await previousCache.match(request);
      if (response) await offlineCache.put(request, response);
    }
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then(async (keys) => {
        const oldCaches = keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME);
        await preservePreviousImages(oldCaches);
        await Promise.all(oldCaches.map((key) => caches.delete(key)));
      })
      .then(() => self.clients.claim()),
  );
});

function post(port, message) {
  try {
    port?.postMessage(message);
  } catch {
    // The page may have closed while a background cache operation was running.
    return false;
  }
  return true;
}

async function getOfflineAssets() {
  const scopeUrl = new URL(self.registration.scope);
  const manifestUrl = new URL('./data/offline-assets.json', scopeUrl);
  let response;
  try {
    response = await fetch(manifestUrl, { cache: 'no-cache' });
    if (response.ok) {
      const staticCache = await caches.open(CACHE_NAME);
      await staticCache.put(manifestUrl.href, response.clone());
    } else response = await caches.match(manifestUrl.href);
  } catch {
    response = await caches.match(manifestUrl.href);
  }
  if (!response?.ok) throw new Error('Offline asset manifest is unavailable');
  const manifest = await response.json();
  if (!Array.isArray(manifest.assets) || !manifest.assets.length) {
    throw new Error('Offline asset manifest is invalid');
  }
  const assets = manifest.assets.map(({ url, sha256 }) => {
    const assetUrl = new URL(url, scopeUrl);
    if (
      assetUrl.origin !== scopeUrl.origin ||
      !assetUrl.pathname.startsWith(scopeUrl.pathname) ||
      !/^[a-f0-9]{64}$/.test(sha256)
    ) {
      throw new Error('Offline asset manifest contains an invalid entry');
    }
    return { url: assetUrl.href, sha256 };
  });
  return { version: manifest.version, assets };
}

async function offlineStatus(port) {
  const { assets } = await getOfflineAssets();
  const cache = await caches.open(OFFLINE_CACHE_NAME);
  const storedMetadata = await cache.match(new URL(OFFLINE_METADATA_URL, self.registration.scope));
  let savedHashes = {};
  if (storedMetadata) {
    try {
      const metadata = await storedMetadata.json();
      if (metadata.assets && typeof metadata.assets === 'object') {
        const currentUrls = new Set(assets.map((asset) => asset.url));
        savedHashes = Object.fromEntries(
          Object.entries(metadata.assets).filter(([url]) => currentUrls.has(url)),
        );
      }
    } catch {
      savedHashes = {};
    }
  }
  let saved = 0;
  for (const asset of assets) {
    if (savedHashes[asset.url] === asset.sha256 && (await cache.match(asset.url))) saved += 1;
  }
  post(port, { type: 'STATUS', saved, total: assets.length, ready: saved === assets.length });
}

async function downloadOfflineAssets(port) {
  const { version, assets } = await getOfflineAssets();
  const cache = await caches.open(OFFLINE_CACHE_NAME);
  const metadataRequest = new URL(OFFLINE_METADATA_URL, self.registration.scope);
  const storedMetadata = await cache.match(metadataRequest);
  let savedHashes = {};
  if (storedMetadata) {
    try {
      const metadata = await storedMetadata.json();
      if (metadata.assets && typeof metadata.assets === 'object') {
        const currentUrls = new Set(assets.map((asset) => asset.url));
        savedHashes = Object.fromEntries(
          Object.entries(metadata.assets).filter(([url]) => currentUrls.has(url)),
        );
      }
    } catch {
      savedHashes = {};
    }
  }
  let completed = 0;
  let failed = 0;
  const updatedHashes = { ...savedHashes };
  post(port, { type: 'START', completed, total: assets.length });

  for (const asset of assets) {
    try {
      if (savedHashes[asset.url] !== asset.sha256 || !(await cache.match(asset.url))) {
        const response = await fetch(asset.url, { cache: 'reload' });
        if (!response.ok) throw new Error(`Could not download ${asset.url}`);
        const digest = await crypto.subtle.digest('SHA-256', await response.clone().arrayBuffer());
        const actualHash = [...new Uint8Array(digest)]
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('');
        if (actualHash !== asset.sha256) throw new Error(`Stale offline asset: ${asset.url}`);
        await cache.put(asset.url, response);
      }
      updatedHashes[asset.url] = asset.sha256;
    } catch {
      failed += 1;
    }
    completed += 1;
    post(port, { type: 'PROGRESS', completed, total: assets.length, failed });
  }

  const currentUrls = new Set(assets.map((asset) => asset.url));
  for (const request of await cache.keys()) {
    const url = new URL(request.url);
    if (url.pathname.includes('/assets/') && !currentUrls.has(url.href)) {
      await cache.delete(request);
    }
  }

  await cache.put(
    metadataRequest,
    new Response(JSON.stringify({ version, assets: updatedHashes }), {
      headers: { 'Content-Type': 'application/json' },
    }),
  );
  post(port, {
    type: 'COMPLETE',
    completed,
    total: assets.length,
    failed,
    ready: failed === 0 && Object.keys(updatedHashes).length === assets.length,
  });
}

async function notifyOfflineCacheChanged(exceptClientId) {
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of clients) {
    if (client.id !== exceptClientId) client.postMessage({ type: 'OFFLINE_CACHE_CHANGED' });
  }
}

function serializeOfflineMutation(operation) {
  const result = offlineMutationQueue.then(operation, operation);
  offlineMutationQueue = result.catch(() => {});
  return result;
}

self.addEventListener('message', (event) => {
  const { type } = event.data || {};
  const port = event.ports?.[0];
  if (type === 'OFFLINE_STATUS') {
    event.waitUntil(offlineStatus(port).catch(() => post(port, { type: 'ERROR' })));
  } else if (type === 'DOWNLOAD_OFFLINE') {
    event.waitUntil(
      serializeOfflineMutation(async () => {
        try {
          await downloadOfflineAssets(port);
        } catch {
          post(port, { type: 'ERROR' });
        }
        await notifyOfflineCacheChanged(event.source?.id);
      }),
    );
  } else if (type === 'REMOVE_OFFLINE') {
    event.waitUntil(
      serializeOfflineMutation(async () => {
        try {
          await caches.delete(OFFLINE_CACHE_NAME);
          post(port, { type: 'REMOVED' });
        } catch {
          post(port, { type: 'ERROR' });
        }
        await notifyOfflineCacheChanged(event.source?.id);
      }),
    );
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);
  if (request.method !== 'GET' || requestUrl.origin !== scopeUrl.origin) return;

  const isInScope = requestUrl.pathname.startsWith(scopeUrl.pathname);
  if (!isInScope) return;

  event.respondWith(
    (async () => {
      if (request.destination === 'image') {
        const offlineCache = await caches.open(OFFLINE_CACHE_NAME);
        const offlineImage = await offlineCache.match(request);
        if (offlineImage) return offlineImage;
        const coreCache = await caches.open(CACHE_NAME);
        const coreImage = await coreCache.match(request);
        if (coreImage) return coreImage;
        return fetch(request);
      }

      const staticCache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.ok) await staticCache.put(request, response.clone());
        return response;
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
          return (
            (await staticCache.match(new URL('./index.html', scopeUrl).href)) || Response.error()
          );
        }
        return Response.error();
      }
    })(),
  );
});
