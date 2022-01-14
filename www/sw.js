/*
Copyright 2015, 2019, 2020, 2021 Google LLC. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
// This variable is intentionally declared and unused.
// Add a comment for your linter if you want:
// eslint-disable-next-line no-unused-vars
const CACHE_NAME = "offline";
const OFFLINE_URL = "offline.html";

const waitUntilInstallationPromise = () =>
  new Promise((resolve) => {
    caches.open(CACHE_NAME).then((cache) => {
      cache.add(new Request(OFFLINE_URL, { cache: "reload" })).then(resolve);
    });
  });

self.addEventListener("install", (event) => {
  event.waitUntil(waitUntilInstallationPromise());
  self.skipWaiting();
});

const waitUntilActivatePromise = () =>
  new Promise((resolve) => {
    if ("navigationPreload" in self.registration) {
      self.registration.navigationPreload.enable().finally(resolve);
    }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(waitUntilActivatePromise());
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(respondWithFetchPromiseNavigate(event));
  }
});

const respondWithFetchPromiseNavigate = (event) =>
  new Promise((resolve) => {
    event.preloadResponse
      .then((preloadResponse) => {
        if (preloadResponse) {
          resolve(preloadResponse);
        }
        fetch(event.request)
          .then((networkResponse) => {
            resolve(networkResponse);
          })
          .catch(() => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.match(OFFLINE_URL).then((cachedResponse) => {
                resolve(cachedResponse);
              });
            });
          });
      })
      .catch(() => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.match(OFFLINE_URL).then((cachedResponse) => {
            resolve(cachedResponse);
          });
        });
      });
  });