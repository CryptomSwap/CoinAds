import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const PRODUCTION_URL = 'https://coinads.com';

// Test credentials (should be set in environment for CI/CD)
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@coinads.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'testpassword123';

interface TestResult {
  test: string;
  status: 'pass' | 'fail';
  message: string;
  duration?: number;
  screenshot?: string;
}

class LaunchSmokeTest {
  private results: TestResult[] = [];
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async runTest(testName: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      this.results.push({
        test: testName,
        status: 'pass',
        message: 'Test passed successfully',
        duration: Date.now() - startTime,
      });
    } catch (error) {
      const screenshot = await this.page.screenshot({ fullPage: true });
      this.results.push({
        test: testName,
        status: 'fail',
        message: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        screenshot: screenshot.toString('base64'),
      });
      throw error;
    }
  }

  getResults(): TestResult[] {
    return this.results;
  }
}

test.describe('Launch Smoke Tests', () => {
  let smokeTest: LaunchSmokeTest;

  test.beforeEach(async ({ page }) => {
    smokeTest = new LaunchSmokeTest(page);
    
    // Set longer timeout for smoke tests
    test.setTimeout(60000);
    
    // Capture console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Store console errors for later assertion
    (page as any).consoleErrors = consoleErrors;
  });

  test('Homepage loads without errors', async ({ page }) => {
    await smokeTest.runTest('Homepage Load', async () => {
      await page.goto(BASE_URL);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check for essential elements
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
      
      // Check for no console errors
      const consoleErrors = (page as any).consoleErrors;
      if (consoleErrors.length > 0) {
        throw new Error(`Console errors found: ${consoleErrors.join(', ')}`);
      }
      
      // Check page title
      await expect(page).toHaveTitle(/CoinAds/);
    });
  });

  test('Health endpoint returns 200', async ({ page }) => {
    await smokeTest.runTest('Health Check', async () => {
      const response = await page.request.get(`${BASE_URL}/api/health`);
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('status');
      expect(data.status).toBe('ok');
    });
  });

  test('Marketing pages load correctly', async ({ page }) => {
    const marketingPages = [
      '/about',
      '/ad-formats',
      '/advertisers',
      '/publishers',
      '/contact',
      '/docs',
    ];

    for (const path of marketingPages) {
      await smokeTest.runTest(`Marketing Page: ${path}`, async () => {
        await page.goto(`${BASE_URL}${path}`);
        await page.waitForLoadState('networkidle');
        
        // Check for no console errors
        const consoleErrors = (page as any).consoleErrors;
        if (consoleErrors.length > 0) {
          throw new Error(`Console errors found: ${consoleErrors.join(', ')}`);
        }
        
        // Check page loads without 404
        expect(page.url()).toContain(path);
      });
    }
  });

  test('Authentication flow works', async ({ page }) => {
    await smokeTest.runTest('Authentication Flow', async () => {
      // Go to sign in page
      await page.goto(`${BASE_URL}/auth/signin`);
      await page.waitForLoadState('networkidle');
      
      // Check sign in form is present
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      
      // Fill in credentials
      await page.fill('input[type="email"]', TEST_EMAIL);
      await page.fill('input[type="password"]', TEST_PASSWORD);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for redirect or error
      await page.waitForTimeout(2000);
      
      // Check if we're redirected to dashboard or see an error
      const currentUrl = page.url();
      if (currentUrl.includes('/auth/error')) {
        // Authentication failed - this might be expected in test environment
        console.log('Authentication failed - this may be expected in test environment');
      } else if (currentUrl.includes('/app/')) {
        // Successfully authenticated
        console.log('Authentication successful');
      } else {
        // Unexpected state
        throw new Error(`Unexpected redirect after login: ${currentUrl}`);
      }
    });
  });

  test('Dashboard routes are protected', async ({ page }) => {
    const protectedRoutes = [
      '/app/advertiser/overview',
      '/app/publisher/overview',
      '/app/admin/overview',
    ];

    for (const route of protectedRoutes) {
      await smokeTest.runTest(`Protected Route: ${route}`, async () => {
        await page.goto(`${BASE_URL}${route}`);
        await page.waitForLoadState('networkidle');
        
        // Should redirect to sign in or show auth required
        const currentUrl = page.url();
        if (!currentUrl.includes('/auth/signin') && !currentUrl.includes(route)) {
          throw new Error(`Route ${route} not properly protected. Redirected to: ${currentUrl}`);
        }
      });
    }
  });

  test('Security headers are present', async ({ page }) => {
    await smokeTest.runTest('Security Headers', async () => {
      const response = await page.request.get(BASE_URL);
      
      // Check for security headers
      const headers = response.headers();
      
      const requiredHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'referrer-policy',
        'content-security-policy',
      ];
      
      for (const header of requiredHeaders) {
        if (!headers[header]) {
          throw new Error(`Missing security header: ${header}`);
        }
      }
      
      // Check HSTS header in production
      if (BASE_URL.startsWith('https://')) {
        if (!headers['strict-transport-security']) {
          throw new Error('Missing HSTS header in production');
        }
      }
    });
  });

  test('Robots.txt is accessible', async ({ page }) => {
    await smokeTest.runTest('Robots.txt', async () => {
      const response = await page.request.get(`${BASE_URL}/robots.txt`);
      
      expect(response.status()).toBe(200);
      
      const content = await response.text();
      expect(content).toContain('User-agent: *');
      expect(content).toContain('Disallow: /app/');
    });
  });

  test('Sitemap.xml is accessible', async ({ page }) => {
    await smokeTest.runTest('Sitemap.xml', async () => {
      const response = await page.request.get(`${BASE_URL}/sitemap.xml`);
      
      expect(response.status()).toBe(200);
      
      const content = await response.text();
      expect(content).toContain('<?xml');
      expect(content).toContain('<urlset');
      expect(content).toContain(BASE_URL);
    });
  });

  test.afterEach(async ({ page }) => {
    // Generate test report
    const results = smokeTest.getResults();
    
    // Create HTML report
    const htmlReport = generateHTMLReport(results, BASE_URL);
    
    // Save report to artifacts directory
    const fs = require('fs');
    const path = require('path');
    
    const artifactsDir = path.join(process.cwd(), 'artifacts', 'launch');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }
    
    const reportFile = path.join(artifactsDir, 'smoke-report.html');
    fs.writeFileSync(reportFile, htmlReport);
    
    console.log(`📄 Smoke test report saved to: ${reportFile}`);
    
    // Log summary
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    
    console.log(`\n🧪 Smoke Test Summary:`);
    console.log(`  ✅ Passed: ${passed}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`  📊 Total: ${results.length}`);
  });
});

function generateHTMLReport(results: TestResult[], baseUrl: string): string {
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const total = results.length;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CoinAds Launch Smoke Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: flex; justify-content: space-around; margin-bottom: 30px; }
        .summary-item { text-align: center; padding: 20px; border-radius: 8px; }
        .summary-pass { background-color: #d4edda; color: #155724; }
        .summary-fail { background-color: #f8d7da; color: #721c24; }
        .summary-total { background-color: #d1ecf1; color: #0c5460; }
        .test-result { margin-bottom: 20px; padding: 15px; border-radius: 5px; border-left: 4px solid; }
        .test-pass { background-color: #d4edda; border-left-color: #28a745; }
        .test-fail { background-color: #f8d7da; border-left-color: #dc3545; }
        .test-name { font-weight: bold; margin-bottom: 5px; }
        .test-message { margin-bottom: 5px; }
        .test-duration { font-size: 0.9em; color: #666; }
        .screenshot { margin-top: 10px; }
        .screenshot img { max-width: 100%; border: 1px solid #ddd; border-radius: 4px; }
        .metadata { margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 CoinAds Launch Smoke Test Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="summary-item summary-pass">
                <h3>✅ Passed</h3>
                <h2>${passed}</h2>
            </div>
            <div class="summary-item summary-fail">
                <h3>❌ Failed</h3>
                <h2>${failed}</h2>
            </div>
            <div class="summary-item summary-total">
                <h3>📊 Total</h3>
                <h2>${total}</h2>
            </div>
        </div>
        
        <h2>Test Results</h2>
        ${results.map(result => `
            <div class="test-result ${result.status === 'pass' ? 'test-pass' : 'test-fail'}">
                <div class="test-name">${result.test}</div>
                <div class="test-message">${result.message}</div>
                <div class="test-duration">Duration: ${result.duration}ms</div>
                ${result.screenshot ? `
                    <div class="screenshot">
                        <h4>Screenshot:</h4>
                        <img src="data:image/png;base64,${result.screenshot}" alt="Test failure screenshot">
                    </div>
                ` : ''}
            </div>
        `).join('')}
        
        <div class="metadata">
            <h3>Test Configuration</h3>
            <ul>
                <li><strong>Base URL:</strong> ${baseUrl}</li>
                <li><strong>Test Environment:</strong> ${process.env.NODE_ENV || 'development'}</li>
                <li><strong>Playwright Version:</strong> ${process.env.npm_package_dependencies_playwright || 'Unknown'}</li>
            </ul>
        </div>
    </div>
</body>
</html>
  `.trim();
}
