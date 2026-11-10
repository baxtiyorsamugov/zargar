import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Фото товаров отдаются с нашего домена: /media/* проксируется на Django
  async rewrites() {
    return [{ source: "/media/:path*", destination: `${API_URL}/media/:path*` }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [{ pathname: "/media/**" }],
  },
};

export default nextConfig;
