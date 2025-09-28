import { test, expect } from '@playwright/test';
import { seedTestUser, signin } from './helpers/auth';
import { attachLogCollectors, getConsoleErrors, getConsoleWarnings, getFailedRequests } from './helpers/logs';
import { discoverControls, safeClick, fillFormFields } from './helpers/dom';
import fs from 'fs';
import path from 'path';

interface RouteInfo {
  path: string;
  type: 'page' | 'api';
  isDynamic: boolean;
  isAuthGated: boolean;
  filePath: string;
}

interface RouteInventory {
  pages: RouteInfo[];
  apis: RouteInfo[];
}

interface ClickResult {
  text: string;
  type: string;
  success: boolean;
  error?: string;
}

interface PageTestResult {
  route: string;
  title: string;
  h1?: string;
  authRequired: boolean;
  authSuccess: boolean;
  controlsFound: number;
  controlsClicked: number;
  controlsSkipped: number;
  clicks: ClickResult[];
  consoleErrors: string[];
  consoleWarnings: string[];
  failedRequests: Array<{
    url: string;
    status: number;
    statusText: string;
    method: string;
  }>;
  formFieldsFilled: number;
  formFieldsSkipped: number;
  formErrors: string[];
  screenshot?: string;
  timestamp: number;
}

test.describe('UI Screens and Buttons Audit', () => {
  let routes: RouteInventory;
  let authContext: any;
  let pageResults: PageTestResult[] = [];
  let authSuccess = false;

  test.beforeAll(async ({ browser }) => {
    // Load route inventory
    const routesFile = path.join(process.cwd(), 'audit-artifacts', 'routes.json');
    if (fs.existsSync(routesFile)) {
      routes = JSON.parse(fs.readFileSync(routesFile, 'utf-8'));
    } else {
      console.log('⚠️ Routes file not found, running route inventory...');
      // This would typically be run by the audit:routes script first
      routes = { pages: [], apis: [] };
    }

    // Try to establish authentication
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await seedTestUser(page);
    const signedIn = await signin(page);
    
    if (signedIn) {
      authContext = await context.storageState();
      authSuccess = true;
      console.log('✅ Authentication established for UI tests');
    } else {
      console.log('⚠️ Authentication failed - will test public pages only');
    }
    
    await context.close();
  });

  test('Test all pages', async ({ browser }) => {
    const maxControlsPerPage = 20;
    const maxPages = 50; // Limit to prevent extremely long test runs
    
    // Filter pages to test
    const pagesToTest = routes.pages
      .filter(route => {
        // Skip dynamic routes that require specific IDs
        if (route.isDynamic && !route.path.includes('[id]')) {
          return false;
        }
        // Skip auth-gated pages if auth failed
        if (route.isAuthGated && !authSuccess) {
          return false;
        }
        return true;
      })
      .slice(0, maxPages);

    console.log(`🎯 Testing ${pagesToTest.length} pages (${authSuccess ? 'with' : 'without'} auth)`);

    for (const routeInfo of pagesToTest) {
      const context = await browser.newContext();
      if (authContext) {
        await context.addCookies(authContext.cookies);
      }
      
      const page = await context.newPage();
      const result: PageTestResult = {
        route: routeInfo.path,
        title: '',
        authRequired: routeInfo.isAuthGated,
        authSuccess: authSuccess,
        controlsFound: 0,
        controlsClicked: 0,
        controlsSkipped: 0,
        clicks: [],
        consoleErrors: [],
        consoleWarnings: [],
        failedRequests: [],
        formFieldsFilled: 0,
        formFieldsSkipped: 0,
        formErrors: [],
        timestamp: Date.now()
      };

      try {
        console.log(`🔍 Testing page: ${routeInfo.path}`);
        
        // Attach log collectors
        const logCollector = attachLogCollectors(page);
        
        // Navigate to the page
        await page.goto(routeInfo.path, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Get page info
        result.title = await page.title();
        const h1 = page.locator('h1').first();
        if (await h1.isVisible()) {
          result.h1 = await h1.textContent() || '';
        }
        
        // Check if we're on an error page
        const isErrorPage = await page.locator('text=404, text=500, text=Error, text=Not Found').isVisible();
        if (isErrorPage) {
          console.log(`⚠️ Page ${routeInfo.path} appears to be an error page`);
          result.consoleErrors.push('Page appears to be an error page');
        }
        
        // Discover and click controls
        const controls = await discoverControls(page);
        result.controlsFound = controls.length;
        
        // Filter safe controls
        const safeControls = controls.filter(control => control.isSafe);
        const controlsToClick = safeControls.slice(0, maxControlsPerPage);
        
        for (const control of controlsToClick) {
          const clickResult: ClickResult = {
            text: control.text,
            type: control.type,
            success: false
          };
          
          try {
            const clickSuccess = await safeClick(control.locator, page);
            if (clickSuccess.success) {
              result.controlsClicked++;
              clickResult.success = true;
              console.log(`✅ Clicked: ${control.text} (${control.type})`);
            } else {
              result.controlsSkipped++;
              clickResult.error = clickSuccess.error;
              console.log(`⚠️ Failed to click: ${control.text} - ${clickSuccess.error}`);
            }
          } catch (error) {
            result.controlsSkipped++;
            clickResult.error = error instanceof Error ? error.message : String(error);
            console.log(`❌ Error clicking: ${control.text} - ${clickResult.error}`);
          }
          
          result.clicks.push(clickResult);
          
          // Small delay between clicks
          await page.waitForTimeout(500);
        }
        
        // Fill form fields if any
        const formResult = await fillFormFields(page);
        result.formFieldsFilled = formResult.filled;
        result.formFieldsSkipped = formResult.skipped;
        result.formErrors = formResult.errors;
        
        // Collect logs
        result.consoleErrors = getConsoleErrors(logCollector);
        result.consoleWarnings = getConsoleWarnings(logCollector);
        result.failedRequests = getFailedRequests(logCollector);
        
        // Take screenshot
        const screenshotPath = path.join(
          process.cwd(),
          'audit-artifacts',
          'screenshots',
          `${routeInfo.path.replace(/[^a-zA-Z0-9]/g, '_')}.png`
        );
        
        // Ensure screenshots directory exists
        const screenshotsDir = path.dirname(screenshotPath);
        if (!fs.existsSync(screenshotsDir)) {
          fs.mkdirSync(screenshotsDir, { recursive: true });
        }
        
        await page.screenshot({ path: screenshotPath, fullPage: true });
        result.screenshot = screenshotPath;
        
        console.log(`✅ Completed: ${routeInfo.path} - ${result.controlsClicked}/${result.controlsFound} controls clicked`);
        
      } catch (error) {
        console.log(`❌ Error testing page ${routeInfo.path}:`, error);
        result.consoleErrors.push(`Page load error: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      pageResults.push(result);
      await context.close();
    }
  });

  test.afterAll(async () => {
    // Save UI test results
    const artifactsDir = path.join(process.cwd(), 'audit-artifacts');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }
    
    const uiDir = path.join(artifactsDir, 'ui');
    if (!fs.existsSync(uiDir)) {
      fs.mkdirSync(uiDir, { recursive: true });
    }
    
    // Save individual page results
    for (const result of pageResults) {
      const filename = `${result.route.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
      const filepath = path.join(uiDir, filename);
      fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
    }
    
    // Save summary
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const summaryFile = path.join(uiDir, `ui-test-summary-${timestamp}.json`);
    
    const summary = {
      totalPages: pageResults.length,
      authSuccess,
      totalControlsFound: pageResults.reduce((sum, r) => sum + r.controlsFound, 0),
      totalControlsClicked: pageResults.reduce((sum, r) => sum + r.controlsClicked, 0),
      totalControlsSkipped: pageResults.reduce((sum, r) => sum + r.controlsSkipped, 0),
      totalConsoleErrors: pageResults.reduce((sum, r) => sum + r.consoleErrors.length, 0),
      totalConsoleWarnings: pageResults.reduce((sum, r) => sum + r.consoleWarnings.length, 0),
      totalFailedRequests: pageResults.reduce((sum, r) => sum + r.failedRequests.length, 0),
      totalFormFieldsFilled: pageResults.reduce((sum, r) => sum + r.formFieldsFilled, 0),
      pages: pageResults.map(r => ({
        route: r.route,
        title: r.title,
        controlsFound: r.controlsFound,
        controlsClicked: r.controlsClicked,
        controlsSkipped: r.controlsSkipped,
        consoleErrors: r.consoleErrors.length,
        failedRequests: r.failedRequests.length,
        screenshot: r.screenshot
      }))
    };
    
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`📝 UI test results saved to: ${summaryFile}`);
  });
});
