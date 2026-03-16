import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ideal-erkek",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
