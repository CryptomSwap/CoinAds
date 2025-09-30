import { test, expect } from "@playwright/test";

test("marketing + app live on same preview host", async ({ page }) => {
  // baseURL should point to your preview *.vercel.app or localhost
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /How It Works/i })).toBeVisible();

  // Hero CTAs link to relative auth paths
  const start = page.getByRole("link", { name: /Start Advertising/i });
  await expect(start).toHaveAttribute("href", /\/auth\/signin/);

  // App route redirects to auth (expected behavior)
  await page.goto("/app/advertiser/overview");
  // Wait for client-side redirect to sign-in page
  await page.waitForURL(/\/auth\/signin/, { timeout: 10000 });
  await expect(page).toHaveURL(/\/auth\/signin/);
});

test("navigation links use relative paths in preview", async ({ page }) => {
  await page.goto("/");
  
  // Check that auth links are relative
  const signInLink = page.getByRole("link", { name: /Sign In/i });
  await expect(signInLink).toHaveAttribute("href", /^\/auth\/signin/);
  
  const signUpLink = page.getByRole("link", { name: /Sign Up/i });
  await expect(signUpLink).toHaveAttribute("href", /^\/auth\/signup/);
});

test("app routes accessible on same host in preview", async ({ page }) => {
  // Test that app routes work without cross-domain redirects
  await page.goto("/app/advertiser/overview");
  
  // Wait for client-side redirect to auth page
  await page.waitForURL(/\/auth\/signin/, { timeout: 10000 });
  await expect(page).toHaveURL(/\/auth\/signin/);
  
  // Should not contain app.coinads.com in preview mode
  expect(page.url()).not.toContain("app.coinads.com");
});
