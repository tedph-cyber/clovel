import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS?.split(',') || ["freewebnovel.com"],
  },
};

export default nextConfig;
