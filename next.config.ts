import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/artifacts/**",
        search: "?v=20260714-rounded-cards",
      },
    ],
  },
};

export default nextConfig;
