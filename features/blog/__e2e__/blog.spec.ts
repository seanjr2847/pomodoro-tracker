import { test, expect } from "@playwright/test";

test.describe("Blog", () => {
  test("blog list page loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle(/Blog/);
  });

  test("shows hello-world post", async ({ page }) => {
    await page.goto("/blog");
    await expect(
      page.getByText("Hello World: Getting Started with Your SaaS")
    ).toBeVisible();
  });

  test("navigates to blog post detail", async ({ page }) => {
    await page.goto("/blog");
    await page
      .getByRole("link", { name: /Hello World/i })
      .first()
      .click();
    await page.waitForURL(/\/blog\/hello-world/);
    await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();
  });
});
