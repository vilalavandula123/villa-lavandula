import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: { globalNotFound: true, inlineCss: true },
  images: {
    // Снимките са предварително оптимизирани (npm run images); виж src/lib/image-loader.ts
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [96, 160, 240, 320],
    qualities: [70, 75, 80],
  },
  async redirects() {
    return [
      // www.villa-lavandula.com → villa-lavandula.com
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.villa-lavandula.com" }],
        destination: "https://villa-lavandula.com/:path*",
        permanent: true,
      },
      { source: "/", destination: "/bg", permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

// Позволява на `next dev` да използва Cloudflare настройките локално.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
