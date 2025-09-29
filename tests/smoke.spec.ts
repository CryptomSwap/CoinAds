import { test, expect } from '@playwright/test';

test.describe('CoinAds MVP Smoke Tests', () => {
  test('Marketing pages load and have titles', async ({ page }) => {
    // Test homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/CoinAds/);
    
    // Test advertisers page
    await page.goto('/advertisers');
    await expect(page).toHaveTitle(/CoinAds/);
    await expect(page.locator('h1')).toContainText('Reach Crypto Audiences');
    
    // Test publishers page
    await page.goto('/publishers');
    await expect(page).toHaveTitle(/CoinAds/);
    await expect(page.locator('h1')).toContainText('Earn More From Your Crypto Traffic');
  });

  test('Auth pages are accessible', async ({ page }) => {
    // Test sign in page
    await page.goto('/auth/signin');
    await expect(page).toHaveTitle(/CoinAds/);
    await expect(page.locator('h1')).toContainText('Sign in');
    
    // Test sign up page
    await page.goto('/auth/signup');
    await expect(page).toHaveTitle(/CoinAds/);
    await expect(page.locator('h1')).toContainText('Create account');
  });

  test('Email verification flow works', async ({ page }) => {
    // Go to sign in page
    await page.goto('/auth/signin');
    
    // Test that unverified users are blocked
    await page.fill('input[name="email"]', 'unverified@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show verification error
    await expect(page.locator('text=verify your email')).toBeVisible();
    
    // Should show resend button
    await expect(page.locator('button:has-text("Resend verification")')).toBeVisible();
  });

  test('Unauthenticated users are redirected from protected routes', async ({ page }) => {
    // Try to access protected route
    await page.goto('/app');
    
    // Should redirect to sign in
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('Marketing CTAs work correctly', async ({ page }) => {
    // Test homepage CTA
    await page.goto('/');
    const heroCta = page.locator('[data-testid="start-advertising"]').first();
    await expect(heroCta).toBeVisible();
    await heroCta.click();
    await expect(page).toHaveURL(/\/auth\/signup\?role=advertiser/);
    
    // Test publishers page CTA
    await page.goto('/publishers');
    const publisherCta = page.locator('[data-testid="start-monetizing"]').first();
    await expect(publisherCta).toBeVisible();
    await publisherCta.click();
    await expect(page).toHaveURL(/\/auth\/signup\?role=publisher/);
  });

  test('Navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links using data-testid
    await page.click('[data-testid="nav-advertisers"]');
    await expect(page).toHaveURL('/advertisers');
    
    await page.goto('/');
    await page.click('[data-testid="nav-publishers"]');
    await expect(page).toHaveURL('/publishers');
    
    // Test sign in button
    await page.goto('/');
    await page.click('[data-testid="sign-in"]');
    await expect(page).toHaveURL('/auth/signin');
  });

  test('Error boundaries work', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page');
    await expect(page.locator('h1')).toContainText('404');
  });

  test('API endpoints respond correctly', async ({ page }) => {
    // Test health endpoint (should require auth)
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(401);
    
    // Test CORS headers
    const corsResponse = await page.request.fetch('/api/track/imp', { method: 'OPTIONS' });
    const headers = corsResponse.headers();
    expect(headers['access-control-allow-origin']).toBeDefined();
  });
});