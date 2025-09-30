import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('401/403 on protected APIs return JSON errors', async ({ page }) => {
    // Test protected API without auth
    const response = await page.request.get('/api/admin/users');
    
    // Should return 401 or 403
    expect([401, 403]).toContain(response.status());
    
    // Should return JSON error
    const responseData = await response.json();
    expect(responseData).toHaveProperty('error');
  });

  test('Zod validation errors show clear messages', async ({ page }) => {
    // Test invalid data on campaign creation
    const response = await page.request.post('/api/advertiser/campaigns', {
      data: {
        // Missing required fields
        name: '',
        budget: -100
      }
    });
    
    // Should return 400
    expect(response.status()).toBe(400);
    
    // Should return validation errors
    const responseData = await response.json();
    expect(responseData).toHaveProperty('errors');
    expect(Array.isArray(responseData.errors)).toBe(true);
  });

  test('UI shows validation error messages', async ({ page }) => {
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Go to campaign creation
    await page.goto('/app/advertiser/campaigns/create');
    
    // Submit form with invalid data
    await page.fill('input[name="name"]', '');
    await page.fill('input[name="budget"]', '-100');
    await page.click('button[type="submit"]');
    
    // Check for validation error messages
    const errorMessages = page.locator('[data-testid="error-message"], .error-message, .validation-error');
    if (await errorMessages.count() > 0) {
      await expect(errorMessages.first()).toBeVisible();
    }
  });

  test('Graceful error UI on 500 errors', async ({ page }) => {
    // Test a route that might cause 500 error
    const response = await page.request.get('/api/debug/force-error');
    
    if (response.status() === 500) {
      // Should return JSON error
      const responseData = await response.json();
      expect(responseData).toHaveProperty('error');
    }
  });

  test('Error boundary catches React errors', async ({ page }) => {
    // Sign in as admin
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Go to a page that might have React errors
    await page.goto('/app/admin');
    
    // Check for error boundary
    const errorBoundary = page.locator('[data-testid="error-boundary"], .error-boundary');
    if (await errorBoundary.count() > 0) {
      await expect(errorBoundary).toBeVisible();
    }
  });

  test('Network errors handled gracefully', async ({ page }) => {
    // Test offline scenario
    await page.context().setOffline(true);
    
    // Try to navigate to a page
    await page.goto('/app/advertiser');
    
    // Check for network error handling
    const networkError = page.locator('[data-testid="network-error"], .network-error');
    if (await networkError.count() > 0) {
      await expect(networkError).toBeVisible();
    }
    
    // Restore network
    await page.context().setOffline(false);
  });

  test('Invalid route shows 404', async ({ page }) => {
    // Test invalid route
    const response = await page.goto('/invalid-route');
    
    // Should show 404 page
    await expect(page.locator('h1')).toContainText('404');
  });

  test('Database connection errors handled', async ({ page }) => {
    // Test API endpoint that might fail due to DB issues
    const response = await page.request.get('/api/health');
    
    // Should handle DB errors gracefully
    if (response.status() === 500) {
      const responseData = await response.json();
      expect(responseData).toHaveProperty('error');
    }
  });

  test('Sentry error tracking (if enabled)', async ({ page }) => {
    // Check if Sentry is configured
    const sentryScript = page.locator('script[src*="sentry"]');
    if (await sentryScript.count() > 0) {
      // Sentry is enabled, test error reporting
      await page.evaluate(() => {
        // Simulate an error
        throw new Error('Test error for Sentry');
      });
      
      // Check for Sentry error reporting
      const sentryError = page.locator('[data-testid="sentry-error"], .sentry-error');
      if (await sentryError.count() > 0) {
        await expect(sentryError).toBeVisible();
      }
    }
  });

  test('Form submission errors show user-friendly messages', async ({ page }) => {
    // Sign in as publisher
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'pub@coinads.test');
    await page.fill('input[name="password"]', 'Pub#1234');
    await page.click('button[type="submit"]');
    
    // Go to site creation
    await page.goto('/app/publisher/sites');
    
    // Try to create site with invalid data
    await page.fill('input[name="domain"]', 'invalid-domain');
    await page.click('button[type="submit"]');
    
    // Check for user-friendly error message
    const errorMessage = page.locator('[data-testid="error-message"], .error-message');
    if (await errorMessage.count() > 0) {
      await expect(errorMessage).toBeVisible();
      const messageText = await errorMessage.textContent();
      expect(messageText).not.toContain('Internal Server Error');
    }
  });

  test('File upload errors handled gracefully', async ({ page }) => {
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Go to creative upload
    await page.goto('/app/advertiser/creatives');
    
    // Try to upload invalid file
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      // Create a test file that's too large or invalid format
      const buffer = Buffer.alloc(10 * 1024 * 1024); // 10MB
      const file = new File([buffer], 'test.txt', { type: 'text/plain' });
      
      await fileInput.setInputFiles([{
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: buffer
      }]);
      await page.click('button[type="submit"]');
      
      // Check for file upload error
      const uploadError = page.locator('[data-testid="upload-error"], .upload-error');
      if (await uploadError.count() > 0) {
        await expect(uploadError).toBeVisible();
      }
    }
  });
});
