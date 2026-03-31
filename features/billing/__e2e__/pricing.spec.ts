import { test, expect } from "@playwright/test";

test.describe("Pricing Page", () => {
  test("loads and shows pricing heading", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { name: /pricing/i })).toBeVisible();
  });

  test("renders free tier card", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText("Free")).toBeVisible();
    await expect(page.getByText("$0")).toBeVisible();
  });

  test("renders pro tier card", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText("Pro", { exact: true })).toBeVisible();
    await expect(page.getByText("$19/mo")).toBeVisible();
  });

  test("shows feature lists", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText("Basic analytics")).toBeVisible();
    await expect(page.getByText("Advanced analytics")).toBeVisible();
  });
});
