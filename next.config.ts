import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        protocol: 'https', // Make sure to use the correct protocol
        hostname: 'freewebnovel.com',
        port: '',
        pathname: '/files/article/image/**', // Adjust the pathname if necessary to be more specific
      },
    ],
  },
};

export default nextConfig;
