import type { MetadataRoute } from "next";

// Minimal, progressive web app manifest for installability
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next.js + HeroUI PWA",
    short_name: "DemoPWA",
    description: "Installable PWA demo with Serwist + Next.js + HeroUI",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    lang: "en",
    icons: [
      // Prefer PNG 192/512. Fallback to favicon for now.
      { src: "/favicon.ico", sizes: "64x64", type: "image/x-icon", purpose: "any" },
    ],
  };
}

