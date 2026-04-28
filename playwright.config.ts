import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: [
    "tests/e2e/**/*.spec.ts",
    "features/**/__e2e__/**/*.spec.ts",
  ],
  testIgnore: ["**/node_modules/**"],
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
  webServer: {
    command: "pnpm dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      DATABASE_URL: process.env.DATABASE_URL || "postgresql://fake:fake@localhost:5432/fake",
      NEXTAUTH_URL: "http://localhost:3000",
      NEXTAUTH_SECRET: "e2e-test-secret-not-for-production",
    },
  },
});
