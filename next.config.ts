import type { NextConfig } from "next";

// Static export targets GitHub Pages (custom domain at apex → no basePath).
// Export mode is only enabled for production builds: Next 16's dev server can't
// render dynamic SSG routes (e.g. /blog/[slug]) while `output: "export"` is set,
// so we leave it off in `next dev` and turn it on for `next build`.
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isProd ? { output: "export" as const } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true, // GitHub Pages has no Image Optimization server
  },
};

export default nextConfig;
