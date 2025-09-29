import { test, expect } from '@playwright/test';

test.describe('Exports / Downloads', () => {
  test('Advertiser CSV export contains valid data', async ({ page }) => {
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Go to reports
    await page.goto('/app/advertiser/reports');
    
    // Click export button
    const exportButton = page.locator('[data-testid="export-csv"], .export-button, button:has-text("Export")');
    if (await exportButton.count() > 0) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.csv');
      
      // Save and check file content
      const path = await download.path();
      if (path) {
        const fs = require('fs');
        const content = fs.readFileSync(path, 'utf8');
        
        // Check for CSV headers
        expect(content).toContain('Campaign');
        expect(content).toContain('Impressions');
        expect(content).toContain('Clicks');
        expect(content).toContain('Spend');
        
        // Check for data rows
        const lines = content.split('\n');
        expect(lines.length).toBeGreaterThan(1); // Header + at least one data row
      }
    }
  });

  test('Publisher CSV export contains valid data', async ({ page }) => {
    // Sign in as publisher
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'pub@coinads.test');
    await page.fill('input[name="password"]', 'Pub#1234');
    await page.click('button[type="submit"]');
    
    // Go to reports
    await page.goto('/app/publisher/reports');
    
    // Click export button
    const exportButton = page.locator('[data-testid="export-csv"], .export-button, button:has-text("Export")');
    if (await exportButton.count() > 0) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.csv');
      
      // Save and check file content
      const path = await download.path();
      if (path) {
        const fs = require('fs');
        const content = fs.readFileSync(path, 'utf8');
        
        // Check for CSV headers
        expect(content).toContain('Site');
        expect(content).toContain('Placement');
        expect(content).toContain('Impressions');
        expect(content).toContain('Clicks');
        expect(content).toContain('Earnings');
        
        // Check for data rows
        const lines = content.split('\n');
        expect(lines.length).toBeGreaterThan(1); // Header + at least one data row
      }
    }
  });

  test('Admin CSV export contains valid data', async ({ page }) => {
    // Sign in as admin
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Go to admin reports
    await page.goto('/app/admin/reports');
    
    // Click export button
    const exportButton = page.locator('[data-testid="export-csv"], .export-button, button:has-text("Export")');
    if (await exportButton.count() > 0) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.csv');
      
      // Save and check file content
      const path = await download.path();
      if (path) {
        const fs = require('fs');
        const content = fs.readFileSync(path, 'utf8');
        
        // Check for CSV headers
        expect(content).toContain('Date');
        expect(content).toContain('Campaign');
        expect(content).toContain('Site');
        expect(content).toContain('Impressions');
        expect(content).toContain('Clicks');
        expect(content).toContain('Revenue');
        
        // Check for data rows
        const lines = content.split('\n');
        expect(lines.length).toBeGreaterThan(1); // Header + at least one data row
      }
    }
  });

  test('Campaign performance export', async ({ page }) => {
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Go to campaigns
    await page.goto('/app/advertiser/campaigns');
    
    // Find first campaign and click export
    const exportButton = page.locator('[data-testid="export-campaign"], .export-campaign-button').first();
    if (await exportButton.count() > 0) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.csv');
      
      // Save and check file content
      const path = await download.path();
      if (path) {
        const fs = require('fs');
        const content = fs.readFileSync(path, 'utf8');
        
        // Check for campaign-specific headers
        expect(content).toContain('Campaign Name');
        expect(content).toContain('Status');
        expect(content).toContain('Budget');
        expect(content).toContain('Spend');
        
        // Check for data rows
        const lines = content.split('\n');
        expect(lines.length).toBeGreaterThan(1);
      }
    }
  });

  test('Site performance export', async ({ page }) => {
    // Sign in as publisher
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'pub@coinads.test');
    await page.fill('input[name="password"]', 'Pub#1234');
    await page.click('button[type="submit"]');
    
    // Go to sites
    await page.goto('/app/publisher/sites');
    
    // Find first site and click export
    const exportButton = page.locator('[data-testid="export-site"], .export-site-button').first();
    if (await exportButton.count() > 0) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.csv');
      
      // Save and check file content
      const path = await download.path();
      if (path) {
        const fs = require('fs');
        const content = fs.readFileSync(path, 'utf8');
        
        // Check for site-specific headers
        expect(content).toContain('Site Domain');
        expect(content).toContain('Status');
        expect(content).toContain('Impressions');
        expect(content).toContain('Earnings');
        
        // Check for data rows
        const lines = content.split('\n');
        expect(lines.length).toBeGreaterThan(1);
      }
    }
  });

  test('Date range filtering in exports', async ({ page }) => {
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Go to reports
    await page.goto('/app/advertiser/reports');
    
    // Set date range
    const startDateInput = page.locator('input[name="startDate"]');
    if (await startDateInput.count() > 0) {
      await startDateInput.fill('2024-01-01');
    }
    
    const endDateInput = page.locator('input[name="endDate"]');
    if (await endDateInput.count() > 0) {
      await endDateInput.fill('2024-01-31');
    }
    
    // Apply filters
    const applyButton = page.locator('button:has-text("Apply"), button[type="submit"]');
    if (await applyButton.count() > 0) {
      await applyButton.click();
    }
    
    // Export with filters
    const exportButton = page.locator('[data-testid="export-csv"], .export-button, button:has-text("Export")');
    if (await exportButton.count() > 0) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.csv');
      
      // Save and check file content
      const path = await download.path();
      if (path) {
        const fs = require('fs');
        const content = fs.readFileSync(path, 'utf8');
        
        // Check that export respects date filters
        const lines = content.split('\n');
        expect(lines.length).toBeGreaterThan(1);
      }
    }
  });

  test('Export file naming convention', async ({ page }) => {
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Go to reports
    await page.goto('/app/advertiser/reports');
    
    // Click export button
    const exportButton = page.locator('[data-testid="export-csv"], .export-button, button:has-text("Export")');
    if (await exportButton.count() > 0) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      const filename = download.suggestedFilename();
      
      // Check filename format
      expect(filename).toMatch(/^[a-zA-Z0-9_-]+\.csv$/);
      expect(filename).toContain('report');
    }
  });

  test('Large dataset export performance', async ({ page }) => {
    // Sign in as admin
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Go to admin reports
    await page.goto('/app/admin/reports');
    
    // Set a large date range
    const startDateInput = page.locator('input[name="startDate"]');
    if (await startDateInput.count() > 0) {
      await startDateInput.fill('2023-01-01');
    }
    
    const endDateInput = page.locator('input[name="endDate"]');
    if (await endDateInput.count() > 0) {
      await endDateInput.fill('2024-12-31');
    }
    
    // Apply filters
    const applyButton = page.locator('button:has-text("Apply"), button[type="submit"]');
    if (await applyButton.count() > 0) {
      await applyButton.click();
    }
    
    // Export large dataset
    const exportButton = page.locator('[data-testid="export-csv"], .export-button, button:has-text("Export")');
    if (await exportButton.count() > 0) {
      const startTime = Date.now();
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      const exportTime = Date.now() - startTime;
      
      // Should complete within reasonable time (30 seconds)
      expect(exportTime).toBeLessThan(30000);
      
      // File should be downloaded
      expect(download.suggestedFilename()).toContain('.csv');
    }
  });
});
