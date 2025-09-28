import { Page, expect } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
}

export const TEST_USER: TestUser = {
  email: 'tester@example.com',
  password: 'Password123!'
};

export async function seedTestUser(page: Page): Promise<boolean> {
  try {
    console.log('🌱 Attempting to seed test user...');
    
    // Try the seed-admin endpoint
    const response = await page.request.get('/api/dev/seed-admin');
    
    if (response.ok()) {
      console.log('✅ Test user seeded successfully');
      return true;
    } else {
      console.log(`⚠️ Seed endpoint returned ${response.status()}, trying POST...`);
      
      const postResponse = await page.request.post('/api/dev/seed-admin');
      if (postResponse.ok()) {
        console.log('✅ Test user seeded successfully via POST');
        return true;
      }
    }
  } catch (error) {
    console.log('⚠️ Seed endpoint not available or failed:', error);
  }
  
  console.log('ℹ️ Proceeding without seeding - will attempt signin with existing user');
  return false;
}

export async function signin(page: Page): Promise<boolean> {
  try {
    console.log('🔐 Attempting to sign in...');
    
    await page.goto('/auth/signin');
    await page.waitForLoadState('networkidle');
    
    // Look for email input by various selectors
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i], input[placeholder*="Email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await emailInput.fill(TEST_USER.email);
    
    // Look for password input
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
    await passwordInput.fill(TEST_USER.password);
    
    // Look for submit button
    const submitButton = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Login"), input[type="submit"]').first();
    await expect(submitButton).toBeVisible({ timeout: 10000 });
    await submitButton.click();
    
    // Wait for navigation or success indicator
    await page.waitForLoadState('networkidle');
    
    // Check if we're redirected away from signin page
    const currentUrl = page.url();
    if (!currentUrl.includes('/auth/signin')) {
      console.log('✅ Successfully signed in');
      return true;
    }
    
    // Check for error messages
    const errorMessage = page.locator('.error, .alert-error, [role="alert"]').first();
    if (await errorMessage.isVisible()) {
      const errorText = await errorMessage.textContent();
      console.log(`❌ Sign in failed: ${errorText}`);
      return false;
    }
    
    console.log('⚠️ Sign in status unclear - may need manual verification');
    return false;
    
  } catch (error) {
    console.log('❌ Sign in failed with error:', error);
    return false;
  }
}

export async function assertSession(page: Page): Promise<boolean> {
  try {
    // Try the test-auth endpoint first
    const response = await page.request.get('/test-auth');
    if (response.ok()) {
      const data = await response.json();
      if (data.authenticated) {
        console.log('✅ Session verified via /test-auth');
        return true;
      }
    }
  } catch (error) {
    console.log('⚠️ /test-auth endpoint not available');
  }
  
  // Fallback: check if we can access a protected route
  try {
    await page.goto('/app');
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    if (!currentUrl.includes('/auth/signin')) {
      console.log('✅ Session verified via protected route access');
      return true;
    }
  } catch (error) {
    console.log('❌ Session verification failed');
  }
  
  return false;
}
