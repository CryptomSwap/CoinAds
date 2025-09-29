import { test, expect } from '@playwright/test';

test.describe('Advertiser API Endpoints', () => {
  let authContext: any;

  test.beforeAll(async ({ browser }) => {
    // Create authenticated context
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL('/app/advertiser');
    
    // Get storage state
    authContext = await context.storageState();
    await context.close();
  });

  test('GET /api/advertiser/campaigns - With auth', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/advertiser/campaigns');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    await context.close();
  });

  test('GET /api/advertiser/campaigns - Without auth', async ({ request }) => {
    const response = await request.get('/api/advertiser/campaigns');
    
    expect(response.status()).toBe(401);
  });

  test('POST /api/advertiser/campaigns - Create campaign', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/advertiser/campaigns', {
      data: {
        name: 'Test Campaign API',
        budget: 1000.0,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        description: 'Test campaign created via API'
      }
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('campaign');
    expect(data.campaign.name).toBe('Test Campaign API');
    
    await context.close();
  });

  test('POST /api/advertiser/campaigns - Missing required fields', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/advertiser/campaigns', {
      data: {
        name: 'Test Campaign'
        // Missing budget, startDate, endDate
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
    
    await context.close();
  });

  test('POST /api/advertiser/campaigns - Invalid budget', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/advertiser/campaigns', {
      data: {
        name: 'Test Campaign',
        budget: -100,
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
    
    await context.close();
  });

  test('GET /api/advertiser/campaigns/:id - Get specific campaign', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/advertiser/campaigns/1');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('campaign');
    
    await context.close();
  });

  test('PUT /api/advertiser/campaigns/:id - Update campaign', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.put('/api/advertiser/campaigns/1', {
      data: {
        name: 'Updated Campaign Name',
        budget: 1500.0
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('campaign');
    
    await context.close();
  });

  test('DELETE /api/advertiser/campaigns/:id - Delete campaign', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.delete('/api/advertiser/campaigns/1');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
    
    await context.close();
  });

  test('POST /api/advertiser/campaigns/:id/pause - Pause campaign', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/advertiser/campaigns/1/pause');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
    
    await context.close();
  });

  test('POST /api/advertiser/campaigns/:id/resume - Resume campaign', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/advertiser/campaigns/1/resume');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
    
    await context.close();
  });

  test('GET /api/advertiser/creatives - Get creatives', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/advertiser/creatives');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    await context.close();
  });

  test('POST /api/advertiser/creatives - Upload creative', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/advertiser/creatives', {
      data: {
        campaignId: 1,
        fileUrl: 'https://example.com/creative.png',
        clickUrl: 'https://example.com/landing',
        altText: 'Test Creative'
      }
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('creative');
    
    await context.close();
  });

  test('DELETE /api/advertiser/creatives/:id - Delete creative', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.delete('/api/advertiser/creatives/1');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
    
    await context.close();
  });

  test('GET /api/advertiser/reports - Get reports', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/advertiser/reports');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('reports');
    
    await context.close();
  });

  test('GET /api/advertiser/reports - With filters', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/advertiser/reports?campaignId=1&startDate=2024-01-01&endDate=2024-01-31');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('reports');
    
    await context.close();
  });

  test('GET /api/advertiser/reports/export - CSV export', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/advertiser/reports/export');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/csv');
    
    await context.close();
  });

  test('GET /api/advertiser/wallet - Get wallet info', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/advertiser/wallet');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('balance');
    expect(data).toHaveProperty('transactions');
    
    await context.close();
  });

  test('GET /api/advertiser/transactions - Get transactions', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/advertiser/transactions');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    await context.close();
  });

  test('POST /api/advertiser/transactions - Create deposit', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/advertiser/transactions', {
      data: {
        type: 'DEPOSIT',
        amount: 100.0
      }
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('transaction');
    
    await context.close();
  });
});
