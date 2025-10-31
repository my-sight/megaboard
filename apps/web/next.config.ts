import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    serverActions: true
  },
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    dirs: ["app", "src"]
  }
};

export default nextConfig;
