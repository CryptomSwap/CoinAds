import { test, expect } from "@playwright/test";

test("Advertiser How It Works appears on homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "How It Works" })).toBeVisible();
  await expect(page.locator("article")).toHaveCount(4);
});

test("Publisher How It Works appears on publishers page", async ({ page }) => {
  await page.goto("/publishers");
  await expect(page.getByRole("heading", { name: "How It Works for Publishers" })).toBeVisible();
  await expect(page.locator("article")).toHaveCount(4);
});
