import { test, expect } from '@playwright/test';

const ROOT_DOMAIN = process.env.TEST_ROOT_DOMAIN || 'http://localhost:3000';
const APP_DOMAIN = process.env.TEST_APP_DOMAIN || 'http://localhost:3000';

test.describe('Split-Domain Configuration', () => {
  test('Homepage loads on root domain without errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(ROOT_DOMAIN);
    await page.waitForLoadState('networkidle');

    // Check for essential elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Verify no console errors
    expect(consoleErrors.length).toBe(0);
  });

  test('Marketing CTAs point to app subdomain', async ({ page }) => {
    await page.goto(ROOT_DOMAIN);
    await page.waitForLoadState('networkidle');

    // Check sign-in link in navigation
    const signInLink = page.locator('text=Sign In').first();
    await expect(signInLink).toBeVisible();
    
    const href = await signInLink.getAttribute('href');
    expect(href).toContain('/auth/signin');
    expect(href).toContain('app.coinads.com');
  });

  test('/app/* on root domain redirects to app subdomain', async ({ page, context }) => {
    // Only test this if we're actually testing against split domains
    if (ROOT_DOMAIN === APP_DOMAIN) {
      test.skip();
      return;
    }

    const response = await page.goto(`${ROOT_DOMAIN}/app/advertiser/overview`);
    
    // Should redirect to app subdomain
    expect(page.url()).toContain('app.coinads.com');
    expect(page.url()).toContain('/app/advertiser/overview');
  });

  test('Auth pages load on app subdomain', async ({ page }) => {
    await page.goto(`${APP_DOMAIN}/auth/signin`);
    await page.waitForLoadState('networkidle');

    // Check for sign-in form
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('Dashboard requires authentication', async ({ page }) => {
    await page.goto(`${APP_DOMAIN}/app/advertiser/overview`);
    await page.waitForLoadState('networkidle');

    // Should redirect to sign-in
    expect(page.url()).toContain('/auth/signin');
  });

  test('Marketing pages have proper link structure', async ({ page }) => {
    const pages = ['/', '/advertisers', '/publishers', '/contact'];

    for (const pagePath of pages) {
      await page.goto(`${ROOT_DOMAIN}${pagePath}`);
      await page.waitForLoadState('networkidle');

      // Get all links
      const links = await page.locator('a').all();
      
      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && href.startsWith('/app')) {
          // Relative /app links should not exist on marketing pages
          // They should be absolute URLs to app subdomain
          throw new Error(`Found relative /app link on marketing page ${pagePath}: ${href}`);
        }
      }
    }
  });

  test('Security headers present on root domain', async ({ page }) => {
    const response = await page.goto(ROOT_DOMAIN);
    const headers = response?.headers() || {};

    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    
    // HSTS should be present in production
    if (ROOT_DOMAIN.startsWith('https://')) {
      expect(headers['strict-transport-security']).toContain('max-age=31536000');
    }
  });

  test('Security headers present on app domain', async ({ page }) => {
    const response = await page.goto(`${APP_DOMAIN}/auth/signin`);
    const headers = response?.headers() || {};

    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    
    // HSTS should be present in production
    if (APP_DOMAIN.startsWith('https://')) {
      expect(headers['strict-transport-security']).toContain('max-age=31536000');
    }
  });
});

test.describe('Split-Domain Link Audit', () => {
  test('Collect and verify all marketing CTA links', async ({ page }) => {
    const linkAudit: Array<{ page: string; element: string; href: string; valid: boolean }> = [];
    
    const pages = [
      { path: '/', name: 'Homepage' },
      { path: '/advertisers', name: 'Advertisers' },
      { path: '/publishers', name: 'Publishers' },
      { path: '/about', name: 'About' },
      { path: '/contact', name: 'Contact' },
    ];

    for (const pageInfo of pages) {
      await page.goto(`${ROOT_DOMAIN}${pageInfo.path}`);
      await page.waitForLoadState('networkidle');

      // Find all buttons and links that might be CTAs
      const ctaSelectors = [
        'button:has-text("Sign In")',
        'button:has-text("Sign Up")',
        'button:has-text("Start")',
        'button:has-text("Dashboard")',
        'a:has-text("Sign In")',
        'a:has-text("Sign Up")',
        'a:has-text("Start")',
        'a:has-text("Dashboard")',
      ];

      for (const selector of ctaSelectors) {
        const elements = await page.locator(selector).all();
        
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const href = await element.getAttribute('href');
          const text = await element.textContent();
          
          if (href) {
            const valid = href.includes('app.coinads.com') || !href.startsWith('/app');
            
            linkAudit.push({
              page: pageInfo.name,
              element: text?.trim() || selector,
              href,
              valid,
            });
          }
        }
      }
    }

    // Save audit results
    const fs = require('fs');
    const path = require('path');
    
    const artifactsDir = path.join(process.cwd(), 'artifacts', 'split-domain');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }
    
    const auditFile = path.join(artifactsDir, 'link-audit.json');
    fs.writeFileSync(auditFile, JSON.stringify(linkAudit, null, 2));
    
    console.log(`📄 Link audit saved to: ${auditFile}`);
    
    // Verify all links are valid
    const invalidLinks = linkAudit.filter(link => !link.valid);
    if (invalidLinks.length > 0) {
      console.error('❌ Invalid links found:', invalidLinks);
      throw new Error(`Found ${invalidLinks.length} invalid links`);
    }
  });
});
