/// <reference types="@sveltejs/kit" />

import {
  build as appSrcFiles,
  files as staticFiles,
  version as deploymentVersion,
} from "$service-worker";

// unique cache for each deployment
const CACHE = `rep-counter-cache-${deploymentVersion}`;
const ASSETS = [...appSrcFiles, ...staticFiles];

self.addEventListener("install", (event) => {
  self.console.log("installed service worker", { appSrcFiles, staticFiles });

  // Create a new cache and add all files to it
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());
});

self.addEventListener("activate", (event) => {
  self.console.log("activated service worker");

  // Remove previous cached data from disk
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }

  event.waitUntil(deleteOldCaches());
});

self.addEventListener("fetch", (event) => {
  // ignore POST requests etc
  if (event.request.method !== "GET") return;

  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    // sveltekit files can always be served from the cache
    if (ASSETS.includes(url.pathname)) {
      return cache.match(url.pathname);
    }

    // for everything else, try the network first, but
    // fall back to the cache if we're offline
    try {
      const response = await fetch(event.request);

      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch (e) {
      console.log(
        "couldn't use network so will used cached content",
        e.message
      );
      return cache.match(event.request);
    }
  }

  event.respondWith(respond());
});
