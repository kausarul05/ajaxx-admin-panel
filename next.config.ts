import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/4/44/Plain_Yellow_Star.png",
      },
      {
        protocol: 'http',
        hostname: '10.10.10.46',
        port: '8000',
        pathname: '/media/**',
      },
      // If you need to support localhost too
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
