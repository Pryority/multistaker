import path, { dirname } from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://repo.sourcify.dev/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: {
    alias: {
      jotai: path.resolve(dirname("node_modules/jotai")),
    },
  },
};

export default nextConfig;
