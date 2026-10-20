import type { NextConfig } from "next";

// GitHub Pages build (GITHUB_PAGES=true): a static export served from
// https://nivetha115.github.io/SDinnovations/, so every path lives under /SDinnovations.
// Local dev and other builds are unchanged.
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? "/SDinnovations" : "";

const nextConfig: NextConfig = {
  // partial prerendering needs a server, so the static Pages build turns it off
  cacheComponents: !pages,
  partialPrefetching: !pages,
  ...(pages && {
    output: "export",
    basePath,
    trailingSlash: true, // folder/index.html, which GitHub Pages serves without rewrites
    images: { unoptimized: true }, // no image optimiser on a static host
  }),
  env: {
    // next/image needs the base path written into `src` (see src/lib/asset.ts)
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
