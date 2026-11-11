import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Django ждёт адреса со слешем на конце (/api/v1/cart/) — Next.js не должен его срезать.
  // Для страниц сайта слеш убирает middleware.
  skipTrailingSlashRedirect: true,
  // Один домен для сайта и API (ADR-0010): /api и /media проксируются на Django
  async rewrites() {
    return [
      // Next.js отрезает слеш у :path*, а Django без него не принимает POST — возвращаем
      { source: "/api/:path*", destination: `${API_URL}/api/:path*/` },
      { source: "/media/:path*", destination: `${API_URL}/media/:path*` },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [{ pathname: "/media/**" }, { pathname: "/img/**" }],
  },
};

export default nextConfig;
