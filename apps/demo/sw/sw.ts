/*
  Service Worker (Serwist) - strict TypeScript, minimal size, fast activation
  Notes:
  - English comments for maintainability
  - Persian error messages for user-facing error logs
*/

/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim, setCacheNameDetails } from "@serwist/core";
import { enable as enableNavigationPreload } from "@serwist/navigation-preload";
import { precacheAndRoute, cleanupOutdatedCaches } from "@serwist/precaching";
import { registerRoute, setCatchHandler } from "@serwist/routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "@serwist/strategies";
import { ExpirationPlugin } from "@serwist/expiration";

declare const self: ServiceWorkerGlobalScope & typeof globalThis & {
  __SW_MANIFEST: readonly { url: string; revision?: string }[] | undefined;
};

// Naming caches to avoid collisions and allow versioning
setCacheNameDetails({ prefix: "demo-pwa", suffix: "v1" });

// Take control faster on activate
self.addEventListener("install", () => {
  // No-op; precache below
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    try {
      clientsClaim();
      enableNavigationPreload();
      await cleanupOutdatedCaches();
    } catch (err) {
      // Persian message with concise info
      // English: Activation failed
      console.error("فعال‌سازی سرویس‌ورکر با خطا مواجه شد.", err);
    }
  })());
});

// Allow window to trigger immediate activation
self.addEventListener("message", (event) => {
  try {
    if ((event as ExtendableMessageEvent).data?.type === "SKIP_WAITING") {
      // Persian: اعمال نسخه جدید سرویس‌ورکر
      self.skipWaiting();
    }
  } catch (err) {
    console.error("اعمال به‌روزرسانی سرویس‌ورکر با خطا مواجه شد.", err);
  }
});

// Precache build assets and selected public files
try {
  // The plugin injects a manifest at build time
  // If undefined in dev, pass empty array
  const manifest = (self as any).__SW_MANIFEST ?? [];
  precacheAndRoute(manifest, {});
} catch (err) {
  console.error("پیش‌بارگذاری منابع با خطا مواجه شد.", err);
}

// Runtime caching strategies (lean, production-safe)
// 1) Static images and assets - StaleWhileRevalidate for freshness + speed
registerRoute(
  ({ request }) => request.destination === "image",
  new StaleWhileRevalidate({
    cacheName: "static-image-assets",
    plugins: [
      new ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

// 2) Google fonts
registerRoute(
  ({ url }) => /fonts\.gstatic\.com/i.test(url.host),
  new CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 }),
    ],
  })
);
registerRoute(
  ({ url }) => /fonts\.googleapis\.com/i.test(url.host),
  new StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
    plugins: [
      new ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 7 * 24 * 60 * 60 }),
    ],
  })
);

// 3) Next.js data and HTML navigations - NetworkFirst for freshness with offline fallback
registerRoute(
  ({ sameOrigin, url, request }) => sameOrigin && (request.destination === "document" || url.pathname.startsWith("/_next/data")),
  new NetworkFirst({
    cacheName: "pages",
    networkTimeoutSeconds: 10,
    plugins: [new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 })],
  })
);

// 4) Scripts and styles - SWR
registerRoute(
  ({ request }) => request.destination === "script" || request.destination === "style",
  new StaleWhileRevalidate({
    cacheName: "static-assets",
    plugins: [new ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 24 * 60 * 60 })],
  })
);

// 5) API requests - NetworkFirst for GETs, bypass auth endpoints
registerRoute(
  ({ sameOrigin, url, request }) => sameOrigin && request.method === "GET" && url.pathname.startsWith("/api/") && !url.pathname.startsWith("/api/auth/"),
  new NetworkFirst({
    cacheName: "apis",
    networkTimeoutSeconds: 10,
    plugins: [new ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 24 * 60 * 60 })],
  })
);

// Offline catch-all for documents
setCatchHandler(async ({ event, request }) => {
  const dest = (request as Request | undefined)?.destination;
  if (dest === "document") {
    try {
      const cached = await caches.match("/offline.html");
      if (cached) return cached;
    } catch (err) {
      console.error("واکشی آفلاین با خطا مواجه شد.", err);
    }
  }
  return Response.error();
});

