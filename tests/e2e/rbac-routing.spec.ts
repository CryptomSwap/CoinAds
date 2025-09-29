import { test, expect } from '@playwright/test';

test.describe('RBAC & Routing', () => {
  test.describe('Admin Access', () => {
    test.beforeEach(async ({ page }) => {
      // Sign in as admin
      await page.goto('/auth/signin');
      await page.fill('input[name="email"]', 'admin@coinads.test');
      await page.fill('input[name="password"]', 'Admin#1234');
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/app/admin');
    });

    test('Admin can access admin dashboard', async ({ page }) => {
      await page.goto('/app/admin');
      await expect(page).toHaveURL('/app/admin');
      await expect(page.locator('h1')).toContainText('Admin Dashboard');
    });

    test('Admin can access admin subroutes', async ({ page }) => {
      const adminRoutes = [
        '/app/admin/overview',
        '/app/admin/approvals',
        '/app/admin/users',
        '/app/admin/transactions',
        '/app/admin/logs'
      ];

      for (const route of adminRoutes) {
        await page.goto(route);
        // Should not be redirected or show 403
        expect(page.url()).toContain('/app/admin');
      }
    });
  });

  test.describe('Advertiser Access', () => {
    test.beforeEach(async ({ page }) => {
      // Sign in as advertiser
      await page.goto('/auth/signin');
      await page.fill('input[name="email"]', 'adv@coinads.test');
      await page.fill('input[name="password"]', 'Adv#1234');
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/app/advertiser');
    });

    test('Advertiser can access advertiser dashboard', async ({ page }) => {
      await page.goto('/app/advertiser');
      await expect(page).toHaveURL('/app/advertiser');
      await expect(page.locator('h1')).toContainText('Advertiser Dashboard');
    });

    test('Advertiser cannot access admin routes', async ({ page }) => {
      await page.goto('/app/admin');
      
      // Should be redirected or show 403
      const currentUrl = page.url();
      const isRedirected = !currentUrl.includes('/app/admin') || currentUrl.includes('/auth/signin');
      const has403 = await page.locator('text=403').count() > 0;
      
      expect(isRedirected || has403).toBeTruthy();
    });

    test('Advertiser cannot access publisher routes', async ({ page }) => {
      await page.goto('/app/publisher');
      
      // Should be redirected or show 403
      const currentUrl = page.url();
      const isRedirected = !currentUrl.includes('/app/publisher') || currentUrl.includes('/auth/signin');
      const has403 = await page.locator('text=403').count() > 0;
      
      expect(isRedirected || has403).toBeTruthy();
    });
  });

  test.describe('Publisher Access', () => {
    test.beforeEach(async ({ page }) => {
      // Sign in as publisher
      await page.goto('/auth/signin');
      await page.fill('input[name="email"]', 'pub@coinads.test');
      await page.fill('input[name="password"]', 'Pub#1234');
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/app/publisher');
    });

    test('Publisher can access publisher dashboard', async ({ page }) => {
      await page.goto('/app/publisher');
      await expect(page).toHaveURL('/app/publisher');
      await expect(page.locator('h1')).toContainText('Publisher Dashboard');
    });

    test('Publisher cannot access admin routes', async ({ page }) => {
      await page.goto('/app/admin');
      
      // Should be redirected or show 403
      const currentUrl = page.url();
      const isRedirected = !currentUrl.includes('/app/admin') || currentUrl.includes('/auth/signin');
      const has403 = await page.locator('text=403').count() > 0;
      
      expect(isRedirected || has403).toBeTruthy();
    });

    test('Publisher cannot access advertiser routes', async ({ page }) => {
      await page.goto('/app/advertiser');
      
      // Should be redirected or show 403
      const currentUrl = page.url();
      const isRedirected = !currentUrl.includes('/app/advertiser') || currentUrl.includes('/auth/signin');
      const has403 = await page.locator('text=403').count() > 0;
      
      expect(isRedirected || has403).toBeTruthy();
    });
  });

  test.describe('Unauthenticated Access', () => {
    test('Unauthenticated user cannot access protected routes', async ({ page }) => {
      const protectedRoutes = [
        '/app/admin',
        '/app/advertiser',
        '/app/publisher',
        '/app/profile',
        '/app/settings'
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);
        
        // Should be redirected to signin
        await expect(page).toHaveURL('/auth/signin');
      }
    });
  });

  test.describe('Cross-Role Portal Protections', () => {
    test('Admin cannot access advertiser-specific features', async ({ page }) => {
      // Sign in as admin
      await page.goto('/auth/signin');
      await page.fill('input[name="email"]', 'admin@coinads.test');
      await page.fill('input[name="password"]', 'Admin#1234');
      await page.click('button[type="submit"]');
      
      // Try to access advertiser campaign creation
      await page.goto('/app/advertiser/campaigns/create');
      
      // Should be redirected or show access denied
      const currentUrl = page.url();
      const isRedirected = !currentUrl.includes('/app/advertiser') || currentUrl.includes('/auth/signin');
      const has403 = await page.locator('text=403').count() > 0;
      
      expect(isRedirected || has403).toBeTruthy();
    });

    test('Advertiser cannot access publisher-specific features', async ({ page }) => {
      // Sign in as advertiser
      await page.goto('/auth/signin');
      await page.fill('input[name="email"]', 'adv@coinads.test');
      await page.fill('input[name="password"]', 'Adv#1234');
      await page.click('button[type="submit"]');
      
      // Try to access publisher site management
      await page.goto('/app/publisher/sites');
      
      // Should be redirected or show access denied
      const currentUrl = page.url();
      const isRedirected = !currentUrl.includes('/app/publisher') || currentUrl.includes('/auth/signin');
      const has403 = await page.locator('text=403').count() > 0;
      
      expect(isRedirected || has403).toBeTruthy();
    });
  });
});
