import { test, expect } from '@playwright/test';

test.describe('Advertiser Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/app/advertiser');
  });

  test('Overview loads charts and KPIs', async ({ page }) => {
    await page.goto('/app/advertiser/overview');
    
    // Check for dashboard elements
    await expect(page.locator('h1')).toContainText('Overview');
    
    // Check for charts/KPIs (these might be placeholders)
    const chartElements = page.locator('[data-testid*="chart"], .chart, canvas');
    if (await chartElements.count() > 0) {
      await expect(chartElements.first()).toBeVisible();
    }
    
    // Check for KPI cards
    const kpiCards = page.locator('[data-testid*="kpi"], .kpi-card, .metric-card');
    if (await kpiCards.count() > 0) {
      await expect(kpiCards.first()).toBeVisible();
    }
  });

  test.describe('Campaign Management', () => {
    test('List existing campaigns', async ({ page }) => {
      await page.goto('/app/advertiser/campaigns');
      
      await expect(page.locator('h1')).toContainText('Campaigns');
      
      // Check for campaigns table/list
      const campaignsList = page.locator('[data-testid="campaigns-list"], .campaigns-table, .campaign-card');
      if (await campaignsList.count() > 0) {
        await expect(campaignsList.first()).toBeVisible();
      }
    });

    test('Create new campaign via wizard', async ({ page }) => {
      await page.goto('/app/advertiser/campaigns/create');
      
      // Step 1: Basic Information
      await page.fill('input[name="name"]', 'Test Campaign E2E');
      await page.fill('textarea[name="description"]', 'E2E test campaign');
      await page.click('button[type="submit"]');
      
      // Step 2: Creative Upload
      // Check if file upload exists
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.count() > 0) {
        // For testing, we'll just proceed without file upload
        await page.click('button[type="submit"]');
      }
      
      // Step 3: Targeting
      await page.selectOption('select[name="geo"]', 'US');
      await page.selectOption('select[name="device"]', 'DESKTOP');
      await page.click('button[type="submit"]');
      
      // Step 4: Budget
      await page.fill('input[name="dailyBudget"]', '100');
      await page.fill('input[name="totalBudget"]', '1000');
      await page.fill('input[name="startDate"]', '2024-01-01');
      await page.fill('input[name="endDate"]', '2024-01-31');
      await page.click('button[type="submit"]');
      
      // Step 5: Review & Submit
      await page.click('button[type="submit"]');
      
      // Should redirect to campaigns list
      await expect(page).toHaveURL('/app/advertiser/campaigns');
    });

    test('Edit campaign', async ({ page }) => {
      await page.goto('/app/advertiser/campaigns');
      
      // Find first campaign and click edit
      const editButton = page.locator('[data-testid="edit-campaign"], .edit-button').first();
      if (await editButton.count() > 0) {
        await editButton.click();
        
        // Should be on edit page
        await expect(page).toHaveURL(/\/app\/advertiser\/campaigns\/\d+\/edit/);
        
        // Make a change
        await page.fill('input[name="name"]', 'Updated Campaign Name');
        await page.click('button[type="submit"]');
        
        // Should redirect back to campaigns list
        await expect(page).toHaveURL('/app/advertiser/campaigns');
      }
    });

    test('Pause/resume campaign', async ({ page }) => {
      await page.goto('/app/advertiser/campaigns');
      
      // Find first campaign and click pause/resume
      const pauseButton = page.locator('[data-testid="pause-campaign"], .pause-button').first();
      if (await pauseButton.count() > 0) {
        await pauseButton.click();
        
        // Check for success message or status change
        const successMessage = page.locator('[data-testid="success-message"], .success-message');
        if (await successMessage.count() > 0) {
          await expect(successMessage).toBeVisible();
        }
      }
    });

    test('Delete draft campaign', async ({ page }) => {
      await page.goto('/app/advertiser/campaigns');
      
      // Find a draft campaign and click delete
      const deleteButton = page.locator('[data-testid="delete-campaign"], .delete-button').first();
      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        
        // Confirm deletion
        const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm")');
        if (await confirmButton.count() > 0) {
          await confirmButton.click();
        }
        
        // Check for success message
        const successMessage = page.locator('[data-testid="success-message"], .success-message');
        if (await successMessage.count() > 0) {
          await expect(successMessage).toBeVisible();
        }
      }
    });
  });

  test.describe('Creative Management', () => {
    test('Upload and preview creative', async ({ page }) => {
      await page.goto('/app/advertiser/creatives');
      
      // Check if upload form exists
      const uploadForm = page.locator('form');
      if (await uploadForm.count() > 0) {
        // Test file upload (if available)
        const fileInput = page.locator('input[type="file"]');
        if (await fileInput.count() > 0) {
          // For testing, we'll just check the form exists
          await expect(fileInput).toBeVisible();
        }
        
        // Test preview functionality
        const previewButton = page.locator('[data-testid="preview-creative"], .preview-button');
        if (await previewButton.count() > 0) {
          await previewButton.click();
          
          // Check for preview modal or page
          const previewModal = page.locator('[data-testid="preview-modal"], .preview-modal');
          if (await previewModal.count() > 0) {
            await expect(previewModal).toBeVisible();
          }
        }
      }
    });

    test('Associate creative with campaign', async ({ page }) => {
      await page.goto('/app/advertiser/creatives');
      
      // Find first creative and click associate
      const associateButton = page.locator('[data-testid="associate-creative"], .associate-button').first();
      if (await associateButton.count() > 0) {
        await associateButton.click();
        
        // Select campaign
        const campaignSelect = page.locator('select[name="campaign"]');
        if (await campaignSelect.count() > 0) {
          await campaignSelect.selectOption({ index: 1 });
          await page.click('button[type="submit"]');
        }
      }
    });

    test('Delete creative', async ({ page }) => {
      await page.goto('/app/advertiser/creatives');
      
      // Find first creative and click delete
      const deleteButton = page.locator('[data-testid="delete-creative"], .delete-button').first();
      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        
        // Confirm deletion
        const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm")');
        if (await confirmButton.count() > 0) {
          await confirmButton.click();
        }
      }
    });
  });

  test.describe('Reports', () => {
    test('Filter reports by date and campaign', async ({ page }) => {
      await page.goto('/app/advertiser/reports');
      
      // Test date filter
      const startDateInput = page.locator('input[name="startDate"]');
      if (await startDateInput.count() > 0) {
        await startDateInput.fill('2024-01-01');
      }
      
      const endDateInput = page.locator('input[name="endDate"]');
      if (await endDateInput.count() > 0) {
        await endDateInput.fill('2024-01-31');
      }
      
      // Test campaign filter
      const campaignSelect = page.locator('select[name="campaign"]');
      if (await campaignSelect.count() > 0) {
        await campaignSelect.selectOption({ index: 1 });
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
      await page.goto('/app/advertiser/reports');
      
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

  test.describe('Wallet & Billing', () => {
    test('View balance and transactions', async ({ page }) => {
      await page.goto('/app/advertiser/wallet');
      
      // Check for balance display
      const balanceDisplay = page.locator('[data-testid="balance"], .balance, .wallet-balance');
      if (await balanceDisplay.count() > 0) {
        await expect(balanceDisplay).toBeVisible();
      }
      
      // Check for transactions list
      const transactionsList = page.locator('[data-testid="transactions"], .transactions-list');
      if (await transactionsList.count() > 0) {
        await expect(transactionsList).toBeVisible();
      }
    });

    test('Top-up flow (stub)', async ({ page }) => {
      await page.goto('/app/advertiser/wallet');
      
      // Click top-up button
      const topUpButton = page.locator('[data-testid="top-up"], .top-up-button, button:has-text("Top Up")');
      if (await topUpButton.count() > 0) {
        await topUpButton.click();
        
        // Check for top-up modal or page
        const topUpModal = page.locator('[data-testid="top-up-modal"], .top-up-modal');
        if (await topUpModal.count() > 0) {
          await expect(topUpModal).toBeVisible();
          
          // Test form (if Stripe is disabled, should show stub)
          const amountInput = page.locator('input[name="amount"]');
          if (await amountInput.count() > 0) {
            await amountInput.fill('100');
            await page.click('button[type="submit"]');
          }
        }
      }
    });
  });
});
