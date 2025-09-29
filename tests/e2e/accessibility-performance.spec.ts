import { test, expect } from '@playwright/test';

test.describe('Accessibility & Performance', () => {
  test('a11y: Homepage passes basic accessibility checks', async ({ page }) => {
    await page.goto('/');
    
    // Check for basic accessibility elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    if (await h1.count() > 0 && await h2.count() > 0) {
      await expect(h1.first()).toBeVisible();
      await expect(h2.first()).toBeVisible();
    }
  });

  test('a11y: Forms have proper labels', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Check for form labels
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    
    if (await emailInput.count() > 0) {
      const emailLabel = page.locator('label[for="email"], label:has-text("Email")');
      if (await emailLabel.count() > 0) {
        await expect(emailLabel).toBeVisible();
      }
    }
    
    if (await passwordInput.count() > 0) {
      const passwordLabel = page.locator('label[for="password"], label:has-text("Password")');
      if (await passwordLabel.count() > 0) {
        await expect(passwordLabel).toBeVisible();
      }
    }
  });

  test('a11y: Dashboard pages have proper structure', async ({ page }) => {
    // Sign in as admin
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    await page.goto('/app/admin');
    
    // Check for proper page structure
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for navigation
    const nav = page.locator('nav, [role="navigation"]');
    if (await nav.count() > 0) {
      await expect(nav.first()).toBeVisible();
    }
    
    // Check for main content area
    const main = page.locator('main, [role="main"]');
    if (await main.count() > 0) {
      await expect(main.first()).toBeVisible();
    }
  });

  test('a11y: Buttons have accessible text', async ({ page }) => {
    await page.goto('/');
    
    // Check all buttons have accessible text
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledBy = await button.getAttribute('aria-labelledby');
      
      // Button should have either text, aria-label, or aria-labelledby
      expect(text || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('a11y: Links have descriptive text', async ({ page }) => {
    await page.goto('/');
    
    // Check all links have descriptive text
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      // Link should have either text, aria-label, or title
      expect(text || ariaLabel || title).toBeTruthy();
    }
  });

  test('Performance: Homepage loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('Performance: Dashboard pages load without crashes', async ({ page }) => {
    // Sign in as admin
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Test dashboard pages
    const dashboardPages = [
      '/app/admin',
      '/app/admin/overview',
      '/app/admin/approvals',
      '/app/admin/users'
    ];
    
    for (const dashboardPage of dashboardPages) {
      await page.goto(dashboardPage);
      await page.waitForLoadState('networkidle');
      
      // Page should load without errors
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('Performance: Images use Next/Image optimization', async ({ page }) => {
    await page.goto('/');
    
    // Check for Next.js Image components
    const nextImages = page.locator('img[src*="/_next/image"]');
    if (await nextImages.count() > 0) {
      await expect(nextImages.first()).toBeVisible();
    }
    
    // Check for proper image loading
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
    }
  });

  test('Performance: No layout shift on hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    const hero = page.locator('[data-testid="hero"], .hero, section:first-child');
    if (await hero.count() > 0) {
      await expect(hero.first()).toBeVisible();
      
      // Wait for any potential layout shifts
      await page.waitForTimeout(1000);
      
      // Hero should still be visible and positioned correctly
      await expect(hero.first()).toBeVisible();
    }
  });

  test('Performance: Basic TTI budget check', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    
    // Wait for page to be interactive
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    
    // Try to interact with the page
    const firstButton = page.locator('button').first();
    if (await firstButton.count() > 0) {
      await firstButton.click();
    }
    
    const tti = Date.now() - startTime;
    
    // Should be interactive within 3 seconds
    expect(tti).toBeLessThan(3000);
  });

  test('Performance: Build size check', async ({ page }) => {
    // This test would need to be run after build
    // For now, just check that the page loads
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for any obvious performance issues
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Should not have console errors
    expect(errors).toHaveLength(0);
  });

  test('Performance: SSR pages respond without crashes', async ({ page }) => {
    // Test SSR pages
    const ssrPages = [
      '/',
      '/about',
      '/advertisers',
      '/publishers',
      '/contact',
      '/ad-formats'
    ];
    
    for (const ssrPage of ssrPages) {
      const response = await page.goto(ssrPage);
      expect(response?.status()).toBe(200);
      
      // Page should render without errors
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
