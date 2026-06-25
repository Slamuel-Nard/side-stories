import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/artifacts/**",
        search: "?v=20260625-edge-fix",
      },
    ],
  },
};

export default nextConfig;
