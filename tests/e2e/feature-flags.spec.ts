import { test, expect } from '@playwright/test';

test.describe('Feature Flag Behavior', () => {
  test('Email verification disabled (NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION=false)', async ({ page }) => {
    // Sign in
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Should not be redirected to email verification
    await expect(page).toHaveURL('/app/admin');
    
    // Check no email verification prompts
    await expect(page.locator('[data-testid="email-verification-prompt"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="verify-email-banner"]')).toHaveCount(0);
    
    // Check no email verification blocks
    await expect(page.locator('[data-testid="email-verification-block"]')).toHaveCount(0);
  });

  test('No email verification gates in signup flow', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Check if signup form exists
    const signupForm = page.locator('form');
    if (await signupForm.count() > 0) {
      // Fill signup form
      await page.fill('input[name="email"]', 'newuser@test.com');
      await page.fill('input[name="password"]', 'NewUser#1234');
      await page.fill('input[name="confirmPassword"]', 'NewUser#1234');
      await page.selectOption('select[name="role"]', 'ADVERTISER');
      
      await page.click('button[type="submit"]');
      
      // Should not be redirected to email verification
      const currentUrl = page.url();
      expect(currentUrl).not.toContain('/verify-email');
      expect(currentUrl).not.toContain('/email-verification');
    }
  });

  test('No email verification required for password reset', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    
    // Fill forgot password form
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.click('button[type="submit"]');
    
    // Should show success message without email verification requirement
    const successMessage = page.locator('[data-testid="success-message"], .success-message');
    if (await successMessage.count() > 0) {
      await expect(successMessage).toBeVisible();
      
      // Message should not mention email verification
      const messageText = await successMessage.textContent();
      expect(messageText).not.toContain('verify your email');
      expect(messageText).not.toContain('email verification');
    }
  });

  test('Dashboard access without email verification', async ({ page }) => {
    // Sign in as different roles
    const roles = [
      { email: 'admin@coinads.test', password: 'Admin#1234', expectedUrl: '/app/admin' },
      { email: 'adv@coinads.test', password: 'Adv#1234', expectedUrl: '/app/advertiser' },
      { email: 'pub@coinads.test', password: 'Pub#1234', expectedUrl: '/app/publisher' }
    ];
    
    for (const role of roles) {
      await page.goto('/auth/signin');
      await page.fill('input[name="email"]', role.email);
      await page.fill('input[name="password"]', role.password);
      await page.click('button[type="submit"]');
      
      // Should redirect directly to dashboard
      await expect(page).toHaveURL(role.expectedUrl);
      
      // Should not show email verification prompts
      await expect(page.locator('[data-testid="email-verification-prompt"]')).toHaveCount(0);
      
      // Sign out for next test
      await page.click('[data-testid="sign-out-button"]');
    }
  });

  test('API endpoints accessible without email verification', async ({ page }) => {
    // Sign in
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Test API endpoints that might be gated by email verification
    const apiEndpoints = [
      '/api/admin/users',
      '/api/admin/approvals',
      '/api/admin/transactions'
    ];
    
    for (const endpoint of apiEndpoints) {
      const response = await page.request.get(endpoint);
      
      // Should not return email verification error
      if (response.status() === 200) {
        const responseData = await response.json();
        expect(responseData.error).not.toContain('email verification');
        expect(responseData.error).not.toContain('verify your email');
      }
    }
  });

  test('Feature flag value in client-side code', async ({ page }) => {
    await page.goto('/');
    
    // Check if feature flag is available in client-side code
    const featureFlagValue = await page.evaluate(() => {
      return (window as any).NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION;
    });
    
    // Should be false or undefined (not true)
    expect(featureFlagValue).not.toBe('true');
  });

  test('No email verification UI elements visible', async ({ page }) => {
    // Sign in
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Check various pages for email verification UI elements
    const pages = [
      '/app/admin',
      '/app/admin/overview',
      '/app/admin/users',
      '/app/profile',
      '/app/settings'
    ];
    
    for (const pageUrl of pages) {
      await page.goto(pageUrl);
      
      // Should not show email verification elements
      await expect(page.locator('[data-testid="email-verification"]')).toHaveCount(0);
      await expect(page.locator('[data-testid="verify-email"]')).toHaveCount(0);
      await expect(page.locator('[data-testid="email-verification-banner"]')).toHaveCount(0);
      await expect(page.locator('[data-testid="email-verification-modal"]')).toHaveCount(0);
    }
  });

  test('User profile shows email without verification status', async ({ page }) => {
    // Sign in
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Go to profile
    await page.goto('/app/profile');
    
    // Check email display
    const emailDisplay = page.locator('[data-testid="email"], .email-display');
    if (await emailDisplay.count() > 0) {
      await expect(emailDisplay).toBeVisible();
      
      // Should not show verification status
      await expect(page.locator('[data-testid="email-verified"], .email-verified')).toHaveCount(0);
      await expect(page.locator('[data-testid="email-unverified"], .email-unverified')).toHaveCount(0);
    }
  });

  test('Settings page without email verification options', async ({ page }) => {
    // Sign in
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Go to settings
    await page.goto('/app/settings');
    
    // Should not show email verification settings
    await expect(page.locator('[data-testid="email-verification-settings"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="verify-email-button"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="resend-verification"]')).toHaveCount(0);
  });

  test('Navigation without email verification restrictions', async ({ page }) => {
    // Sign in
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Test navigation to various pages
    const navigationLinks = [
      '/app/admin',
      '/app/admin/overview',
      '/app/admin/approvals',
      '/app/admin/users',
      '/app/admin/transactions',
      '/app/profile',
      '/app/settings'
    ];
    
    for (const link of navigationLinks) {
      await page.goto(link);
      
      // Should not be redirected due to email verification
      expect(page.url()).toContain(link);
      
      // Should not show email verification prompts
      await expect(page.locator('[data-testid="email-verification-prompt"]')).toHaveCount(0);
    }
  });
});
