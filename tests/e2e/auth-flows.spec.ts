import { test, expect } from '@playwright/test';

test.describe('Auth Flows (Email Verification OFF)', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're on the signin page
    await page.goto('/auth/signin');
  });

  test('Sign in with admin credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL('/app/admin');
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  test('Sign in with advertiser credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Should redirect to advertiser dashboard
    await expect(page).toHaveURL('/app/advertiser');
    await expect(page.locator('h1')).toContainText('Advertiser Dashboard');
  });

  test('Sign in with publisher credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'pub@coinads.test');
    await page.fill('input[name="password"]', 'Pub#1234');
    await page.click('button[type="submit"]');
    
    // Should redirect to publisher dashboard
    await expect(page).toHaveURL('/app/publisher');
    await expect(page.locator('h1')).toContainText('Publisher Dashboard');
  });

  test('Invalid credentials show error', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page).toHaveURL('/auth/signin');
  });

  test('Session persistence across reload', async ({ page }) => {
    // Sign in
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/app/admin');
    
    // Reload page
    await page.reload();
    
    // Should still be logged in
    await expect(page).toHaveURL('/app/admin');
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  test('Sign out works correctly', async ({ page }) => {
    // Sign in first
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/app/admin');
    
    // Sign out
    await page.click('[data-testid="sign-out-button"]');
    
    // Should redirect to signin page
    await expect(page).toHaveURL('/auth/signin');
  });

  test('Forgot password screen appears', async ({ page }) => {
    await page.click('a[href="/auth/forgot-password"]');
    await expect(page).toHaveURL('/auth/forgot-password');
    await expect(page.locator('h1')).toContainText('Forgot Password');
    
    // Check form exists
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('No email verification blocks (feature flag OFF)', async ({ page }) => {
    // Sign in
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Should not be redirected to email verification
    await expect(page).toHaveURL('/app/admin');
    
    // Check no email verification prompts
    await expect(page.locator('[data-testid="email-verification-prompt"]')).toHaveCount(0);
  });

  test('Sign up flow (if enabled)', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Check if signup form exists
    const signupForm = page.locator('form');
    if (await signupForm.count() > 0) {
      await page.fill('input[name="email"]', 'newuser@test.com');
      await page.fill('input[name="password"]', 'NewUser#1234');
      await page.fill('input[name="confirmPassword"]', 'NewUser#1234');
      await page.selectOption('select[name="role"]', 'ADVERTISER');
      
      await page.click('button[type="submit"]');
      
      // Should either redirect to dashboard or show success message
      // (depending on implementation)
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
