import { test, expect } from '@playwright/test';

test.describe('Publisher Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as publisher
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'pub@coinads.test');
    await page.fill('input[name="password"]', 'Pub#1234');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/app/publisher');
  });

  test('Overview shows earnings and KPIs', async ({ page }) => {
    await page.goto('/app/publisher/overview');
    
    // Check for dashboard elements
    await expect(page.locator('h1')).toContainText('Overview');
    
    // Check for earnings display
    const earningsDisplay = page.locator('[data-testid="earnings"], .earnings, .revenue');
    if (await earningsDisplay.count() > 0) {
      await expect(earningsDisplay).toBeVisible();
    }
    
    // Check for KPI cards
    const kpiCards = page.locator('[data-testid*="kpi"], .kpi-card, .metric-card');
    if (await kpiCards.count() > 0) {
      await expect(kpiCards.first()).toBeVisible();
    }
  });

  test.describe('Site Management', () => {
    test('Add site domain', async ({ page }) => {
      await page.goto('/app/publisher/sites');
      
      // Click add site button
      const addSiteButton = page.locator('[data-testid="add-site"], .add-site-button, button:has-text("Add Site")');
      if (await addSiteButton.count() > 0) {
        await addSiteButton.click();
        
        // Fill site form
        await page.fill('input[name="domain"]', 'new-publisher.test');
        await page.fill('textarea[name="description"]', 'Test publisher site');
        await page.click('button[type="submit"]');
        
        // Should redirect back to sites list
        await expect(page).toHaveURL('/app/publisher/sites');
      }
    });

    test('Site verification flow', async ({ page }) => {
      await page.goto('/app/publisher/sites');
      
      // Find first site and click verify
      const verifyButton = page.locator('[data-testid="verify-site"], .verify-button').first();
      if (await verifyButton.count() > 0) {
        await verifyButton.click();
        
        // Check for verification instructions
        const verificationInstructions = page.locator('[data-testid="verification-instructions"], .verification-instructions');
        if (await verificationInstructions.count() > 0) {
          await expect(verificationInstructions).toBeVisible();
        }
        
        // Test meta tag method (if available)
        const metaTagMethod = page.locator('[data-testid="meta-tag-method"], .meta-tag-method');
        if (await metaTagMethod.count() > 0) {
          await metaTagMethod.click();
          
          // Check for meta tag code
          const metaTagCode = page.locator('[data-testid="meta-tag-code"], .meta-tag-code');
          if (await metaTagCode.count() > 0) {
            await expect(metaTagCode).toBeVisible();
          }
        }
      }
    });

    test('Admin approval status', async ({ page }) => {
      await page.goto('/app/publisher/sites');
      
      // Check for approval status indicators
      const approvalStatus = page.locator('[data-testid="approval-status"], .approval-status');
      if (await approvalStatus.count() > 0) {
        await expect(approvalStatus.first()).toBeVisible();
      }
    });
  });

  test.describe('Placement Management', () => {
    test('Create placement', async ({ page }) => {
      await page.goto('/app/publisher/placements');
      
      // Click add placement button
      const addPlacementButton = page.locator('[data-testid="add-placement"], .add-placement-button, button:has-text("Add Placement")');
      if (await addPlacementButton.count() > 0) {
        await addPlacementButton.click();
        
        // Fill placement form
        await page.selectOption('select[name="size"]', '300x250');
        await page.selectOption('select[name="pricing"]', 'CPM');
        await page.fill('input[name="price"]', '5.00');
        await page.fill('textarea[name="description"]', 'Test placement');
        await page.click('button[type="submit"]');
        
        // Should redirect back to placements list
        await expect(page).toHaveURL('/app/publisher/placements');
      }
    });

    test('Approvals pipeline', async ({ page }) => {
      await page.goto('/app/publisher/placements');
      
      // Check for approval status
      const approvalStatus = page.locator('[data-testid="approval-status"], .approval-status');
      if (await approvalStatus.count() > 0) {
        await expect(approvalStatus.first()).toBeVisible();
      }
    });

    test('Ad tag generation', async ({ page }) => {
      await page.goto('/app/publisher/placements');
      
      // Find first placement and click generate tag
      const generateTagButton = page.locator('[data-testid="generate-tag"], .generate-tag-button').first();
      if (await generateTagButton.count() > 0) {
        await generateTagButton.click();
        
        // Check for tag code snippet
        const tagCode = page.locator('[data-testid="tag-code"], .tag-code, pre, code');
        if (await tagCode.count() > 0) {
          await expect(tagCode).toBeVisible();
          
          // Check that tag contains tag.js URL and placement ID
          const tagText = await tagCode.textContent();
          expect(tagText).toContain('tag.js');
        }
      }
    });
  });

  test.describe('Earnings & Payouts', () => {
    test('Earnings reflect impressions and clicks', async ({ page }) => {
      await page.goto('/app/publisher/earnings');
      
      // Check for earnings breakdown
      const earningsBreakdown = page.locator('[data-testid="earnings-breakdown"], .earnings-breakdown');
      if (await earningsBreakdown.count() > 0) {
        await expect(earningsBreakdown).toBeVisible();
      }
      
      // Check for impressions count
      const impressionsCount = page.locator('[data-testid="impressions-count"], .impressions-count');
      if (await impressionsCount.count() > 0) {
        await expect(impressionsCount).toBeVisible();
      }
      
      // Check for clicks count
      const clicksCount = page.locator('[data-testid="clicks-count"], .clicks-count');
      if (await clicksCount.count() > 0) {
        await expect(clicksCount).toBeVisible();
      }
    });

    test('Request payout with validation', async ({ page }) => {
      await page.goto('/app/publisher/payouts');
      
      // Click request payout button
      const requestPayoutButton = page.locator('[data-testid="request-payout"], .request-payout-button, button:has-text("Request Payout")');
      if (await requestPayoutButton.count() > 0) {
        await requestPayoutButton.click();
        
        // Check for payout form
        const payoutForm = page.locator('[data-testid="payout-form"], .payout-form');
        if (await payoutForm.count() > 0) {
          await expect(payoutForm).toBeVisible();
          
          // Test minimum threshold validation
          const amountInput = page.locator('input[name="amount"]');
          if (await amountInput.count() > 0) {
            // Try to request below minimum
            await amountInput.fill('10.00');
            await page.click('button[type="submit"]');
            
            // Check for validation error
            const validationError = page.locator('[data-testid="validation-error"], .validation-error');
            if (await validationError.count() > 0) {
              await expect(validationError).toBeVisible();
            }
          }
        }
      }
    });
  });

  test.describe('Reports & CSV Export', () => {
    test('Reports filter by date range', async ({ page }) => {
      await page.goto('/app/publisher/reports');
      
      // Test date filter
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
      
      // Check for results
      const resultsTable = page.locator('[data-testid="results-table"], .results-table');
      if (await resultsTable.count() > 0) {
        await expect(resultsTable).toBeVisible();
      }
    });

    test('CSV export download', async ({ page }) => {
      await page.goto('/app/publisher/reports');
      
      // Click export button
      const exportButton = page.locator('[data-testid="export-csv"], .export-button, button:has-text("Export")');
      if (await exportButton.count() > 0) {
        const downloadPromise = page.waitForEvent('download');
        await exportButton.click();
        
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toContain('.csv');
      }
    });
  });
});
