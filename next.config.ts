import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "freewebnovel.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
