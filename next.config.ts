import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // disable for debugging only
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
