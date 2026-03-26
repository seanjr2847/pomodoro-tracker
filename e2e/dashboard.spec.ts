import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("dashboard page loads (mock session in dev)", async ({ page }) => {
    await page.goto("/dashboard");
    // Dev mode without GOOGLE_CLIENT_ID → mock session active → dashboard renders
    await expect(page.locator("main")).toBeVisible();
  });
});
