import type { NextConfig } from "next";
import { isPwaEnabled } from "./config";

export function withSerwist(config: NextConfig): NextConfig {
  if (!isPwaEnabled) return config;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const withSerwistInit = require("@serwist/next").default;
  const initSerwist = withSerwistInit({
    swSrc: "features/pwa/sw.ts",
    swDest: "public/sw.js",
    reloadOnOnline: false,
  });

  return initSerwist(config);
}
