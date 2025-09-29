import { test, expect } from '@playwright/test';

test.describe('Public & Legal Pages', () => {
  test('Homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/CoinAds/);
    
    // Check main navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check hero section
    await expect(page.locator('[data-testid="hero"]')).toBeVisible();
    
    // Check no console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('About page loads correctly', async ({ page }) => {
    await page.goto('/about');
    
    await expect(page).toHaveTitle(/About/);
    await expect(page.locator('h1')).toContainText('About');
    
    // Check navigation works
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('Advertisers page loads correctly', async ({ page }) => {
    await page.goto('/advertisers');
    
    await expect(page).toHaveTitle(/Advertisers/);
    await expect(page.locator('h1')).toContainText('Advertisers');
  });

  test('Publishers page loads correctly', async ({ page }) => {
    await page.goto('/publishers');
    
    await expect(page).toHaveTitle(/Publishers/);
    await expect(page.locator('h1')).toContainText('Publishers');
  });

  test('Contact page loads correctly', async ({ page }) => {
    await page.goto('/contact');
    
    await expect(page).toHaveTitle(/Contact/);
    await expect(page.locator('h1')).toContainText('Contact');
  });

  test('Ad formats page loads correctly', async ({ page }) => {
    await page.goto('/ad-formats');
    
    await expect(page).toHaveTitle(/Ad Formats/);
    await expect(page.locator('h1')).toContainText('Ad Formats');
  });

  test('Legal pages load correctly', async ({ page }) => {
    const legalPages = [
      '/legal/privacy',
      '/legal/advertiser-terms',
      '/legal/publisher-terms',
      '/legal/cookies',
      '/legal/cookie-preferences'
    ];

    for (const legalPage of legalPages) {
      await page.goto(legalPage);
      await expect(page).toHaveTitle(/Legal|Privacy|Terms|Cookies/);
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('Cookie preferences are writable', async ({ page }) => {
    await page.goto('/legal/cookie-preferences');
    
    // Check if cookie preferences form exists
    const cookieForm = page.locator('form');
    if (await cookieForm.count() > 0) {
      // Test cookie preference changes
      const analyticsToggle = page.locator('input[name="analytics"]');
      if (await analyticsToggle.count() > 0) {
        await analyticsToggle.click();
        await expect(analyticsToggle).toBeChecked();
      }
    }
  });

  test('Navigation links work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test main navigation
    const navLinks = [
      { href: '/about', text: 'About' },
      { href: '/advertisers', text: 'Advertisers' },
      { href: '/publishers', text: 'Publishers' },
      { href: '/contact', text: 'Contact' }
    ];

    for (const link of navLinks) {
      await page.click(`a[href="${link.href}"]`);
      await expect(page).toHaveURL(link.href);
      await expect(page.locator('h1')).toContainText(link.text);
    }
  });

  test('No 404s on public pages', async ({ page }) => {
    const publicPages = [
      '/',
      '/about',
      '/advertisers',
      '/publishers',
      '/contact',
      '/ad-formats',
      '/legal/privacy',
      '/legal/advertiser-terms',
      '/legal/publisher-terms',
      '/legal/cookies',
      '/legal/cookie-preferences'
    ];

    for (const publicPage of publicPages) {
      const response = await page.goto(publicPage);
      expect(response?.status()).toBe(200);
    }
  });
});
