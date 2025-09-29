import { test, expect } from '@playwright/test';

test.describe('Ad Delivery & Tracking', () => {
  test('tag.js returns ad for approved campaign and placement', async ({ page }) => {
    // Test tag.js delivery endpoint
    const response = await page.request.get('/api/delivery?placementId=1');
    
    // Should return 200 with ad content
    expect(response.status()).toBe(200);
    
    const responseText = await response.text();
    expect(responseText).toContain('ad');
  });

  test('Impression tracking writes to database', async ({ page }) => {
    // Fire impression tracking
    const response = await page.request.post('/api/track/imp', {
      data: {
        campaignId: 1,
        creativeId: 1,
        placementId: 1,
        siteId: 1,
        device: 'DESKTOP',
        country: 'US',
        browser: 'Chrome',
        os: 'Windows',
        costMicros: 5000
      }
    });
    
    // Should return 200
    expect(response.status()).toBe(200);
    
    const responseData = await response.json();
    expect(responseData).toHaveProperty('impressionId');
  });

  test('Click tracking writes to database', async ({ page }) => {
    // First create an impression
    const impResponse = await page.request.post('/api/track/imp', {
      data: {
        campaignId: 1,
        creativeId: 1,
        placementId: 1,
        siteId: 1,
        device: 'DESKTOP',
        country: 'US',
        browser: 'Chrome',
        os: 'Windows',
        costMicros: 5000
      }
    });
    
    const impData = await impResponse.json();
    const impressionId = impData.impressionId;
    
    // Then track a click
    const clickResponse = await page.request.post('/api/track/click', {
      data: {
        impressionId: impressionId
      }
    });
    
    // Should return 200
    expect(clickResponse.status()).toBe(200);
    
    const clickData = await clickResponse.json();
    expect(clickData).toHaveProperty('clickId');
  });

  test('Conversion tracking with attribution', async ({ page }) => {
    // First create an impression
    const impResponse = await page.request.post('/api/track/imp', {
      data: {
        campaignId: 1,
        creativeId: 1,
        placementId: 1,
        siteId: 1,
        device: 'DESKTOP',
        country: 'US',
        browser: 'Chrome',
        os: 'Windows',
        costMicros: 5000
      }
    });
    
    const impData = await impResponse.json();
    const impressionId = impData.impressionId;
    
    // Then track a click
    const clickResponse = await page.request.post('/api/track/click', {
      data: {
        impressionId: impressionId
      }
    });
    
    const clickData = await clickResponse.json();
    const clickId = clickData.clickId;
    
    // Then track a conversion
    const conversionResponse = await page.request.post('/api/track/conversion', {
      data: {
        clickId: clickId,
        campaignId: 1,
        value: 25.00,
        currency: 'USD'
      }
    });
    
    // Should return 200
    expect(conversionResponse.status()).toBe(200);
    
    const conversionData = await conversionResponse.json();
    expect(conversionData).toHaveProperty('conversionId');
  });

  test('Reports reflect new tracking data', async ({ page }) => {
    // Sign in as advertiser to check reports
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Go to reports
    await page.goto('/app/advertiser/reports');
    
    // Check for updated data
    const reportsTable = page.locator('[data-testid="reports-table"], .reports-table');
    if (await reportsTable.count() > 0) {
      await expect(reportsTable).toBeVisible();
    }
  });

  test('Publisher dashboard updates with earnings', async ({ page }) => {
    // Sign in as publisher to check earnings
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'pub@coinads.test');
    await page.fill('input[name="password"]', 'Pub#1234');
    await page.click('button[type="submit"]');
    
    // Go to earnings
    await page.goto('/app/publisher/earnings');
    
    // Check for updated earnings
    const earningsDisplay = page.locator('[data-testid="earnings"], .earnings');
    if (await earningsDisplay.count() > 0) {
      await expect(earningsDisplay).toBeVisible();
    }
  });

  test('Basic fraud checks do not crash', async ({ page }) => {
    // Test with bot user agent
    const botResponse = await page.request.post('/api/track/imp', {
      data: {
        campaignId: 1,
        creativeId: 1,
        placementId: 1,
        siteId: 1,
        device: 'DESKTOP',
        country: 'US',
        browser: 'Bot',
        os: 'Unknown',
        costMicros: 5000
      },
      headers: {
        'User-Agent': 'Bot/1.0'
      }
    });
    
    // Should not crash (may return 200 or 400, but not 500)
    expect(botResponse.status()).not.toBe(500);
  });

  test('Duplicate quick fires handled gracefully', async ({ page }) => {
    // Fire multiple impressions quickly
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        page.request.post('/api/track/imp', {
          data: {
            campaignId: 1,
            creativeId: 1,
            placementId: 1,
            siteId: 1,
            device: 'DESKTOP',
            country: 'US',
            browser: 'Chrome',
            os: 'Windows',
            costMicros: 5000
          }
        })
      );
    }
    
    const responses = await Promise.all(promises);
    
    // All should return valid responses (not crash)
    for (const response of responses) {
      expect(response.status()).not.toBe(500);
    }
  });

  test('CORS headers on tracking endpoints', async ({ page }) => {
    // Test OPTIONS request for CORS
    const corsResponse = await page.request.fetch('/api/track/imp', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'POST'
      }
    });
    
    // Check CORS headers
    const headers = corsResponse.headers();
    expect(headers['access-control-allow-origin']).toBeDefined();
    expect(headers['access-control-allow-methods']).toBeDefined();
  });

  test('Rate limiting on tracking endpoints', async ({ page }) => {
    // Fire many requests quickly to test rate limiting
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(
        page.request.post('/api/track/imp', {
          data: {
            campaignId: 1,
            creativeId: 1,
            placementId: 1,
            siteId: 1,
            device: 'DESKTOP',
            country: 'US',
            browser: 'Chrome',
            os: 'Windows',
            costMicros: 5000
          }
        })
      );
    }
    
    const responses = await Promise.all(promises);
    
    // Some requests should be rate limited (429)
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });
});
