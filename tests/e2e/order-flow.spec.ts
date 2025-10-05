import { test, expect } from '@playwright/test';

test.describe('Order Flow E2E Tests', () => {
  test('Advertiser creates order and Admin sees it', async ({ page }) => {
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to advertiser dashboard
    await page.waitForURL('/app/advertiser');
    
    // Navigate to orders page
    await page.goto('/app/advertiser/orders');
    await expect(page.getByText('Orders')).toBeVisible();
    
    // Click "New Order" button
    await page.click('text=New Order');
    await page.waitForURL('/app/advertiser/orders/new');
    
    // Fill out the order form
    await page.fill('input[placeholder*="Q4 Banner Campaign"]', 'E2E Test Order');
    await page.fill('textarea', 'This is a test order created via E2E testing');
    await page.fill('input[type="number"]', '150');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should redirect back to orders list
    await page.waitForURL('/app/advertiser/orders');
    await expect(page.getByText('E2E Test Order')).toBeVisible();
    await expect(page.getByText('$150 USD')).toBeVisible();
    await expect(page.getByText('PENDING')).toBeVisible();
  });

  test('Admin can view and manage orders', async ({ page }) => {
    // Sign in as admin
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to admin dashboard
    await page.waitForURL('/app/admin');
    
    // Navigate to orders management page
    await page.goto('/app/admin/orders');
    await expect(page.getByText('Orders Management')).toBeVisible();
    
    // Should see existing orders from seed data
    await expect(page.getByText('Launch Q4 banners')).toBeVisible();
    await expect(page.getByText('Native placements Jan')).toBeVisible();
    await expect(page.getByText('Video campaign Feb')).toBeVisible();
    
    // Should see advertiser information
    await expect(page.getByText('Advertiser User')).toBeVisible();
    await expect(page.getByText('adv@coinads.test')).toBeVisible();
  });

  test('Advertiser can view existing orders', async ({ page }) => {
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to advertiser dashboard
    await page.waitForURL('/app/advertiser');
    
    // Navigate to orders page
    await page.goto('/app/advertiser/orders');
    await expect(page.getByText('Orders')).toBeVisible();
    
    // Should see existing orders from seed data
    await expect(page.getByText('Launch Q4 banners')).toBeVisible();
    await expect(page.getByText('Native placements Jan')).toBeVisible();
    await expect(page.getByText('Video campaign Feb')).toBeVisible();
    
    // Should see different status badges
    await expect(page.getByText('PENDING')).toBeVisible();
    await expect(page.getByText('APPROVED')).toBeVisible();
    await expect(page.getByText('REJECTED')).toBeVisible();
    
    // Should see amounts
    await expect(page.getByText('$500 USD')).toBeVisible();
    await expect(page.getByText('$300 USD')).toBeVisible();
    await expect(page.getByText('$750 USD')).toBeVisible();
  });

  test('Order form validation works', async ({ page }) => {
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to advertiser dashboard
    await page.waitForURL('/app/advertiser');
    
    // Navigate to new order page
    await page.goto('/app/advertiser/orders/new');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.getByText('Orders')).toBeVisible(); // Still on new order page
    
    // Fill required fields
    await page.fill('input[placeholder*="Q4 Banner Campaign"]', 'Test Order');
    await page.fill('input[type="number"]', '100');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should redirect to orders list
    await page.waitForURL('/app/advertiser/orders');
    await expect(page.getByText('Test Order')).toBeVisible();
  });

  test('RBAC enforcement - unauthorized access', async ({ page }) => {
    // Try to access advertiser orders without authentication
    await page.goto('/app/advertiser/orders');
    
    // Should redirect to sign in
    await page.waitForURL('/auth/signin');
    
    // Sign in as publisher (should not have access to advertiser orders)
    await page.fill('input[name="email"]', 'pub@coinads.test');
    await page.fill('input[name="password"]', 'Pub#1234');
    await page.click('button[type="submit"]');
    
    // Should redirect to publisher dashboard
    await page.waitForURL('/app/publisher');
    
    // Try to access advertiser orders
    await page.goto('/app/advertiser/orders');
    
    // Should redirect to sign in (unauthorized)
    await page.waitForURL('/auth/signin');
  });
});
