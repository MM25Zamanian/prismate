/** @type {import('next').NextConfig} */
import withSerwist from "@serwist/next";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Resolve absolute paths for sw source/dest
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withSW = withSerwist({
  // Build a TypeScript SW and output to public/sw.js
  swSrc: path.join(__dirname, "sw", "sw.ts"),
  swDest: path.join(__dirname, "public", "sw.js"),

  // Enable default Next.js runtime caching tuned by Serwist
  additionalPrecacheEntries: [],
  exclude: [],

  // Register automatically and reload on reconnect
  register: true,
  reloadOnOnline: true,

  // Scope and URL
  scope: "/",
  swUrl: "/sw.js",

  // Include all files from public except the generated worker
  globPublicPatterns: ["**/*"],
});

const nextConfig = withSW({
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  // Security headers for SW and PWA
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
});

export default nextConfig;
