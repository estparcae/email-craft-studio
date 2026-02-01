import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable image optimization for email generation use case
  images: {
    unoptimized: true,
  },
  // Output as standalone for easier deployment
  output: "standalone",
};

export default nextConfig;
