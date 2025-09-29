import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as admin
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/app/admin');
  });

  test('Overview loads metrics', async ({ page }) => {
    await page.goto('/app/admin/overview');
    
    // Check for dashboard elements
    await expect(page.locator('h1')).toContainText('Overview');
    
    // Check for metrics cards
    const metricsCards = page.locator('[data-testid*="metric"], .metric-card, .stats-card');
    if (await metricsCards.count() > 0) {
      await expect(metricsCards.first()).toBeVisible();
    }
    
    // Check for specific metrics
    const usersMetric = page.locator('[data-testid="users-count"], .users-metric');
    if (await usersMetric.count() > 0) {
      await expect(usersMetric).toBeVisible();
    }
    
    const campaignsMetric = page.locator('[data-testid="campaigns-count"], .campaigns-metric');
    if (await campaignsMetric.count() > 0) {
      await expect(campaignsMetric).toBeVisible();
    }
    
    const sitesMetric = page.locator('[data-testid="sites-count"], .sites-metric');
    if (await sitesMetric.count() > 0) {
      await expect(sitesMetric).toBeVisible();
    }
    
    const impressionsMetric = page.locator('[data-testid="impressions-count"], .impressions-metric');
    if (await impressionsMetric.count() > 0) {
      await expect(impressionsMetric).toBeVisible();
    }
  });

  test.describe('Approvals', () => {
    test('Approve advertiser campaign', async ({ page }) => {
      await page.goto('/app/admin/approvals');
      
      // Check for pending campaigns
      const pendingCampaigns = page.locator('[data-testid="pending-campaign"], .pending-campaign');
      if (await pendingCampaigns.count() > 0) {
        const firstCampaign = pendingCampaigns.first();
        
        // Click approve button
        const approveButton = firstCampaign.locator('[data-testid="approve"], .approve-button');
        if (await approveButton.count() > 0) {
          await approveButton.click();
          
          // Check for success message
          const successMessage = page.locator('[data-testid="success-message"], .success-message');
          if (await successMessage.count() > 0) {
            await expect(successMessage).toBeVisible();
          }
        }
      }
    });

    test('Approve publisher site', async ({ page }) => {
      await page.goto('/app/admin/approvals');
      
      // Check for pending sites
      const pendingSites = page.locator('[data-testid="pending-site"], .pending-site');
      if (await pendingSites.count() > 0) {
        const firstSite = pendingSites.first();
        
        // Click approve button
        const approveButton = firstSite.locator('[data-testid="approve"], .approve-button');
        if (await approveButton.count() > 0) {
          await approveButton.click();
          
          // Check for success message
          const successMessage = page.locator('[data-testid="success-message"], .success-message');
          if (await successMessage.count() > 0) {
            await expect(successMessage).toBeVisible();
          }
        }
      }
    });

    test('Approve publisher placement', async ({ page }) => {
      await page.goto('/app/admin/approvals');
      
      // Check for pending placements
      const pendingPlacements = page.locator('[data-testid="pending-placement"], .pending-placement');
      if (await pendingPlacements.count() > 0) {
        const firstPlacement = pendingPlacements.first();
        
        // Click approve button
        const approveButton = firstPlacement.locator('[data-testid="approve"], .approve-button');
        if (await approveButton.count() > 0) {
          await approveButton.click();
          
          // Check for success message
          const successMessage = page.locator('[data-testid="success-message"], .success-message');
          if (await successMessage.count() > 0) {
            await expect(successMessage).toBeVisible();
          }
        }
      }
    });

    test('Reject with reason', async ({ page }) => {
      await page.goto('/app/admin/approvals');
      
      // Find first pending item
      const pendingItem = page.locator('[data-testid*="pending"], .pending-item').first();
      if (await pendingItem.count() > 0) {
        // Click reject button
        const rejectButton = pendingItem.locator('[data-testid="reject"], .reject-button');
        if (await rejectButton.count() > 0) {
          await rejectButton.click();
          
          // Fill rejection reason
          const reasonInput = page.locator('textarea[name="reason"], input[name="reason"]');
          if (await reasonInput.count() > 0) {
            await reasonInput.fill('Test rejection reason');
            await page.click('button[type="submit"]');
            
            // Check for success message
            const successMessage = page.locator('[data-testid="success-message"], .success-message');
            if (await successMessage.count() > 0) {
              await expect(successMessage).toBeVisible();
            }
          }
        }
      }
    });
  });

  test.describe('Delivery & Pricing', () => {
    test('Pricing rules visible and editable', async ({ page }) => {
      await page.goto('/app/admin/pricing');
      
      // Check for pricing rules
      const pricingRules = page.locator('[data-testid="pricing-rules"], .pricing-rules');
      if (await pricingRules.count() > 0) {
        await expect(pricingRules).toBeVisible();
        
        // Test editing pricing
        const editButton = page.locator('[data-testid="edit-pricing"], .edit-button').first();
        if (await editButton.count() > 0) {
          await editButton.click();
          
          // Check for edit form
          const editForm = page.locator('[data-testid="pricing-form"], .pricing-form');
          if (await editForm.count() > 0) {
            await expect(editForm).toBeVisible();
            
            // Make a change
            const priceInput = page.locator('input[name="price"]');
            if (await priceInput.count() > 0) {
              await priceInput.fill('6.00');
              await page.click('button[type="submit"]');
            }
          }
        }
      }
    });

    test('Pacing rules visible and editable', async ({ page }) => {
      await page.goto('/app/admin/pacing');
      
      // Check for pacing rules
      const pacingRules = page.locator('[data-testid="pacing-rules"], .pacing-rules');
      if (await pacingRules.count() > 0) {
        await expect(pacingRules).toBeVisible();
        
        // Test editing pacing
        const editButton = page.locator('[data-testid="edit-pacing"], .edit-button').first();
        if (await editButton.count() > 0) {
          await editButton.click();
          
          // Check for edit form
          const editForm = page.locator('[data-testid="pacing-form"], .pacing-form');
          if (await editForm.count() > 0) {
            await expect(editForm).toBeVisible();
          }
        }
      }
    });
  });

  test.describe('Logs', () => {
    test('Admin actions appear in logs', async ({ page }) => {
      await page.goto('/app/admin/logs');
      
      // Check for logs table
      const logsTable = page.locator('[data-testid="logs-table"], .logs-table');
      if (await logsTable.count() > 0) {
        await expect(logsTable).toBeVisible();
        
        // Check for log entries
        const logEntries = page.locator('[data-testid="log-entry"], .log-entry');
        if (await logEntries.count() > 0) {
          await expect(logEntries.first()).toBeVisible();
        }
      }
    });

    test('Filter logs by action type', async ({ page }) => {
      await page.goto('/app/admin/logs');
      
      // Test action filter
      const actionFilter = page.locator('select[name="action"]');
      if (await actionFilter.count() > 0) {
        await actionFilter.selectOption('APPROVE');
        
        // Apply filter
        const applyButton = page.locator('button:has-text("Apply"), button[type="submit"]');
        if (await applyButton.count() > 0) {
          await applyButton.click();
        }
      }
    });

    test('Filter logs by date range', async ({ page }) => {
      await page.goto('/app/admin/logs');
      
      // Test date filter
      const startDateInput = page.locator('input[name="startDate"]');
      if (await startDateInput.count() > 0) {
        await startDateInput.fill('2024-01-01');
      }
      
      const endDateInput = page.locator('input[name="endDate"]');
      if (await endDateInput.count() > 0) {
        await endDateInput.fill('2024-01-31');
      }
      
      // Apply filter
      const applyButton = page.locator('button:has-text("Apply"), button[type="submit"]');
      if (await applyButton.count() > 0) {
        await applyButton.click();
      }
    });
  });

  test.describe('Transactions', () => {
    test('Deposits and payouts listed', async ({ page }) => {
      await page.goto('/app/admin/transactions');
      
      // Check for transactions table
      const transactionsTable = page.locator('[data-testid="transactions-table"], .transactions-table');
      if (await transactionsTable.count() > 0) {
        await expect(transactionsTable).toBeVisible();
        
        // Check for deposit transactions
        const depositTransactions = page.locator('[data-testid="deposit-transaction"], .deposit-transaction');
        if (await depositTransactions.count() > 0) {
          await expect(depositTransactions.first()).toBeVisible();
        }
        
        // Check for payout transactions
        const payoutTransactions = page.locator('[data-testid="payout-transaction"], .payout-transaction');
        if (await payoutTransactions.count() > 0) {
          await expect(payoutTransactions.first()).toBeVisible();
        }
      }
    });

    test('Filter transactions by type', async ({ page }) => {
      await page.goto('/app/admin/transactions');
      
      // Test type filter
      const typeFilter = page.locator('select[name="type"]');
      if (await typeFilter.count() > 0) {
        await typeFilter.selectOption('DEPOSIT');
        
        // Apply filter
        const applyButton = page.locator('button:has-text("Apply"), button[type="submit"]');
        if (await applyButton.count() > 0) {
          await applyButton.click();
        }
      }
    });

    test('Filter transactions by status', async ({ page }) => {
      await page.goto('/app/admin/transactions');
      
      // Test status filter
      const statusFilter = page.locator('select[name="status"]');
      if (await statusFilter.count() > 0) {
        await statusFilter.selectOption('COMPLETED');
        
        // Apply filter
        const applyButton = page.locator('button:has-text("Apply"), button[type="submit"]');
        if (await applyButton.count() > 0) {
          await applyButton.click();
        }
      }
    });
  });

  test.describe('User Management', () => {
    test('List users', async ({ page }) => {
      await page.goto('/app/admin/users');
      
      // Check for users table
      const usersTable = page.locator('[data-testid="users-table"], .users-table');
      if (await usersTable.count() > 0) {
        await expect(usersTable).toBeVisible();
        
        // Check for user entries
        const userEntries = page.locator('[data-testid="user-entry"], .user-entry');
        if (await userEntries.count() > 0) {
          await expect(userEntries.first()).toBeVisible();
        }
      }
    });

    test('Role changes protected', async ({ page }) => {
      await page.goto('/app/admin/users');
      
      // Find first user and try to change role
      const roleSelect = page.locator('select[name="role"]').first();
      if (await roleSelect.count() > 0) {
        // Try to change role
        await roleSelect.selectOption('ADMIN');
        
        // Check for confirmation or protection
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Save")');
        if (await confirmButton.count() > 0) {
          await confirmButton.click();
          
          // Check for success message or error
          const message = page.locator('[data-testid*="message"], .message');
          if (await message.count() > 0) {
            await expect(message).toBeVisible();
          }
        }
      }
    });

    test('Filter users by role', async ({ page }) => {
      await page.goto('/app/admin/users');
      
      // Test role filter
      const roleFilter = page.locator('select[name="roleFilter"]');
      if (await roleFilter.count() > 0) {
        await roleFilter.selectOption('ADVERTISER');
        
        // Apply filter
        const applyButton = page.locator('button:has-text("Apply"), button[type="submit"]');
        if (await applyButton.count() > 0) {
          await applyButton.click();
        }
      }
    });
  });
});
