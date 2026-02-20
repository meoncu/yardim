import type { NextConfig } from "next";
// PWA temporarily removed to avoid Turbopack crash until production

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
};

export default nextConfig;
