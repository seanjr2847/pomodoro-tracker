import { test, expect } from "@playwright/test";

test.describe("Auth Flow", () => {
  test("dashboard loads with mock session in dev", async ({ page }) => {
    await page.goto("/dashboard");
    // Dev mode without GOOGLE_CLIENT_ID → mock session active → dashboard renders
    await expect(page.locator("main")).toBeVisible();
  });
});
