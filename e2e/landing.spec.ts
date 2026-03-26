import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("loads and shows site name", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Acme SaaS/);
  });

  test("renders hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Build faster.")).toBeVisible();
  });

  test("has navigation links", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation");
    await expect(nav.getByRole("link", { name: /pricing/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /blog/i })).toBeVisible();
  });

  test("navigates to pricing page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /pricing/i }).first().click();
    await expect(page).toHaveURL(/\/pricing/);
  });
});
