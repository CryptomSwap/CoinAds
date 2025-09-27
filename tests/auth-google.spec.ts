import { test, expect } from '@playwright/test';
import { checkEnvironmentVariables, printEnvMatrix, checkGoogleOAuthConfig } from './helpers/env-check';

test.describe('Google OAuth Authentication', () => {
  test.beforeAll(async () => {
    // Check environment variables
    const envResults = checkEnvironmentVariables();
    printEnvMatrix(envResults);
    
    // Verify Google OAuth is configured
    const hasGoogleConfig = checkGoogleOAuthConfig();
    if (!hasGoogleConfig) {
      console.warn('⚠️ Google OAuth not configured - tests will be limited');
    }
  });

  test('should display sign in page with Google option', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Check if page loads
    await expect(page).toHaveTitle(/Sign In|CoinAds/);
    
    // Look for Google sign in button
    const googleButton = page.locator('text=Google').or(page.locator('text=Continue with Google'));
    await expect(googleButton).toBeVisible();
  });

  test('should redirect to Google OAuth when clicking Google sign in', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Click Google sign in button
    const googleButton = page.locator('text=Google').or(page.locator('text=Continue with Google'));
    await googleButton.click();
    
    // Wait for redirect to Google
    await page.waitForURL(/accounts\.google\.com/, { timeout: 10000 });
    
    // Verify we're on Google's domain
    expect(page.url()).toContain('accounts.google.com');
    
    // Check for required OAuth parameters
    const url = page.url();
    expect(url).toContain('client_id=');
    expect(url).toContain('redirect_uri=');
    expect(url).toContain('response_type=code');
    expect(url).toContain('scope=');
  });

  test('should handle OAuth callback with mock code', async ({ page }) => {
    // Mock OAuth callback
    const mockCallbackUrl = '/api/auth/callback/google?code=mock_code&state=mock_state';
    
    await page.goto(mockCallbackUrl);
    
    // Check response status
    const response = await page.waitForResponse(/callback\/google/);
    expect(response.status()).toBeLessThan(500);
    
    // Should either redirect to success page or show error
    // (We expect 400/401 since we're using a mock code)
    if (response.status() >= 400) {
      // This is expected with mock credentials
      console.log('✅ OAuth callback properly rejects invalid credentials');
    } else {
      // If it succeeds, we should be redirected
      await page.waitForURL(/app|dashboard/, { timeout: 5000 });
    }
  });

  test('should have NextAuth providers endpoint', async ({ page }) => {
    const response = await page.request.get('/api/auth/providers');
    
    expect(response.status()).toBe(200);
    
    const providers = await response.json();
    expect(providers).toBeDefined();
    
    // Check if Google provider is configured
    if (checkGoogleOAuthConfig()) {
      expect(providers.google).toBeDefined();
      expect(providers.google.name).toBe('Google');
    } else {
      console.log('⚠️ Google provider not configured in NextAuth');
    }
  });

  test('should have working sign up page', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Check if page loads
    await expect(page).toHaveTitle(/Sign Up|CoinAds/);
    
    // Look for Google sign up option
    const googleButton = page.locator('text=Google').or(page.locator('text=Continue with Google'));
    await expect(googleButton).toBeVisible();
  });

  test('should redirect to Google OAuth when clicking Google sign up', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Click Google sign up button
    const googleButton = page.locator('text=Google').or(page.locator('text=Continue with Google'));
    await googleButton.click();
    
    // Wait for redirect to Google
    await page.waitForURL(/accounts\.google\.com/, { timeout: 10000 });
    
    // Verify we're on Google's domain
    expect(page.url()).toContain('accounts.google.com');
    
    // Check for required OAuth parameters
    const url = page.url();
    expect(url).toContain('client_id=');
    expect(url).toContain('redirect_uri=');
    expect(url).toContain('response_type=code');
    expect(url).toContain('scope=');
  });
});
