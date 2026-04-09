import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "node",
    include: [
      "shared/**/__tests__/**/*.test.ts",
      "features/**/__tests__/**/*.test.ts",
      "config/**/__tests__/**/*.test.ts",
    ],
    coverage: {
      provider: "v8",
      include: [
        "features/**/lib/**",
        "features/**/api/**",
        "features/**/config/**",
        "features/**/hooks/**",
        "shared/utils/**",
        "shared/lib/**",
        "shared/hooks/**",
        "lib/**",
        "config/**",
      ],
      exclude: [
        "**/*.d.ts",
        "**/index.ts",
        "**/hooks/**",
        "features/auth/config/auth.ts",
      ],
      reporter: ["text", "text-summary"],
      thresholds: {
        lines: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
