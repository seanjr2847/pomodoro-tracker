import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { buildCsp } from "./config/csp";

// ── Feature plugins (삭제 시 import + chain에서 제거) ──
import { withSerwist } from "./features/pwa/lib/withSerwist";
import bundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// ── Security Headers ──

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "Content-Security-Policy", value: buildCsp() },
];

// ── Config ──

const nextConfig: NextConfig = {
  turbopack: {},
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: process.env.CORS_ORIGIN ?? "http://localhost:3000" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type,Authorization,X-API-Key" },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
    ];
  },

  // ── monitoring: Sentry sourcemap upload (삭제 시 이 블록 제거) ──
  webpack(config, { isServer }) {
    if (
      process.env.SENTRY_AUTH_TOKEN &&
      process.env.NEXT_PUBLIC_SENTRY_DSN &&
      process.env.NODE_ENV === "production"
    ) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");
      config.plugins.push(
        sentryWebpackPlugin({
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN,
          sourcemaps: {
            assets: isServer
              ? [".next/server/**/*.js", ".next/server/**/*.js.map"]
              : [".next/static/**/*.js", ".next/static/**/*.js.map"],
          },
          telemetry: false,
        }),
      );
    }
    return config;
  },
};

// ── Plugin chain (삭제 시 해당 wrapper 제거) ──

export default withBundleAnalyzer(withSerwist(withNextIntl(nextConfig)));
