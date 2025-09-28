import { test, expect } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Smoke Tests', () => {
  test('should load marketing pages', async ({ page }) => {
    // Test homepage
    await page.goto(`${baseURL}/`);
    await expect(page).toHaveTitle(/CoinAds/);
    await expect(page.locator('h1')).toBeVisible();

    // Test about page
    await page.goto(`${baseURL}/about`);
    await expect(page).toHaveTitle(/CoinAds/);
    await expect(page.locator('h1')).toBeVisible();

    // Test advertisers page
    await page.goto(`${baseURL}/advertisers`);
    await expect(page).toHaveTitle(/CoinAds/);
    await expect(page.locator('h1')).toBeVisible();

    // Test publishers page
    await page.goto(`${baseURL}/publishers`);
    await expect(page).toHaveTitle(/CoinAds/);
    await expect(page.locator('h1')).toBeVisible();

    // Test contact page
    await page.goto(`${baseURL}/contact`);
    await expect(page).toHaveTitle(/CoinAds/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should load authentication pages', async ({ page }) => {
    // Test sign in page
    await page.goto(`${baseURL}/auth/signin`);
    await expect(page).toHaveTitle(/CoinAds/);
    
    // Check for main sign in elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Test sign up page
    await page.goto(`${baseURL}/auth/signup`);
    await expect(page).toHaveTitle(/CoinAds/);
    
    // Check for main sign up elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should handle navigation', async ({ page }) => {
    await page.goto(`${baseURL}/`);
    
    // Test navigation to about page
    const aboutLink = page.locator('a[href="/about"]').first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page).toHaveURL(/.*\/about/);
    }

    // Test navigation to contact page
    const contactLink = page.locator('a[href="/contact"]').first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await expect(page).toHaveURL(/.*\/contact/);
    }
  });

  test('should handle form interactions', async ({ page }) => {
    await page.goto(`${baseURL}/auth/signin`);
    
    // Test form field interactions
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await emailInput.fill('test@example.com');
    await passwordInput.fill('testpassword');
    
    // Verify values are set
    await expect(emailInput).toHaveValue('test@example.com');
    await expect(passwordInput).toHaveValue('testpassword');
  });

  test('should handle error states', async ({ page }) => {
    // Test 404 page
    await page.goto(`${baseURL}/nonexistent-page`);
    await expect(page.locator('h1')).toContainText('404');
  });

  test('should load legal pages', async ({ page }) => {
    // Test privacy page
    await page.goto(`${baseURL}/legal/privacy`);
    await expect(page).toHaveTitle(/CoinAds/);
    await expect(page.locator('h1')).toBeVisible();

    // Test terms page
    await page.goto(`${baseURL}/legal/advertiser-terms`);
    await expect(page).toHaveTitle(/CoinAds/);
    await expect(page.locator('h1')).toBeVisible();
  });
});
