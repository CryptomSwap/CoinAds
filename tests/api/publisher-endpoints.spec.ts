import { test, expect } from '@playwright/test';

test.describe('Publisher API Endpoints', () => {
  let authContext: any;

  test.beforeAll(async ({ browser }) => {
    // Create authenticated context
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Sign in as publisher
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'pub@coinads.test');
    await page.fill('input[name="password"]', 'Pub#1234');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL('/app/publisher');
    
    // Get storage state
    authContext = await context.storageState();
    await context.close();
  });

  test('GET /api/publisher/sites - With auth', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/publisher/sites');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    await context.close();
  });

  test('GET /api/publisher/sites - Without auth', async ({ request }) => {
    const response = await request.get('/api/publisher/sites');
    
    expect(response.status()).toBe(401);
  });

  test('POST /api/publisher/sites - Create site', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/publisher/sites', {
      data: {
        domain: 'new-publisher.test',
        description: 'Test publisher site'
      }
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('site');
    expect(data.site.domain).toBe('new-publisher.test');
    
    await context.close();
  });

  test('POST /api/publisher/sites - Invalid domain', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/publisher/sites', {
      data: {
        domain: 'invalid-domain',
        description: 'Test site'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
    
    await context.close();
  });

  test('GET /api/publisher/sites/:id - Get specific site', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/publisher/sites/1');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('site');
    
    await context.close();
  });

  test('PUT /api/publisher/sites/:id - Update site', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.put('/api/publisher/sites/1', {
      data: {
        description: 'Updated site description'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('site');
    
    await context.close();
  });

  test('DELETE /api/publisher/sites/:id - Delete site', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.delete('/api/publisher/sites/1');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
    
    await context.close();
  });

  test('POST /api/publisher/sites/:id/verify - Verify site', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/publisher/sites/1/verify', {
      data: {
        method: 'META_TAG'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('verificationCode');
    
    await context.close();
  });

  test('GET /api/publisher/placements - Get placements', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/publisher/placements');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    await context.close();
  });

  test('POST /api/publisher/placements - Create placement', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/publisher/placements', {
      data: {
        siteId: 1,
        size: '300x250',
        pricing: 'CPM',
        price: 5.0,
        description: 'Test placement'
      }
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('placement');
    
    await context.close();
  });

  test('POST /api/publisher/placements - Invalid size', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/publisher/placements', {
      data: {
        siteId: 1,
        size: 'invalid-size',
        pricing: 'CPM',
        price: 5.0
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
    
    await context.close();
  });

  test('GET /api/publisher/placements/:id - Get specific placement', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/publisher/placements/1');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('placement');
    
    await context.close();
  });

  test('PUT /api/publisher/placements/:id - Update placement', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.put('/api/publisher/placements/1', {
      data: {
        price: 6.0,
        description: 'Updated placement'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('placement');
    
    await context.close();
  });

  test('DELETE /api/publisher/placements/:id - Delete placement', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.delete('/api/publisher/placements/1');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
    
    await context.close();
  });

  test('GET /api/publisher/placements/:id/tag - Get ad tag', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/publisher/placements/1/tag');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('tag');
    expect(data.tag).toContain('tag.js');
    
    await context.close();
  });

  test('GET /api/publisher/earnings - Get earnings', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/publisher/earnings');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('totalEarnings');
    expect(data).toHaveProperty('breakdown');
    
    await context.close();
  });

  test('GET /api/publisher/earnings - With date filters', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/publisher/earnings?startDate=2024-01-01&endDate=2024-01-31');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('totalEarnings');
    
    await context.close();
  });

  test('GET /api/publisher/reports - Get reports', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/publisher/reports');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('reports');
    
    await context.close();
  });

  test('GET /api/publisher/reports/export - CSV export', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/publisher/reports/export');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/csv');
    
    await context.close();
  });

  test('GET /api/publisher/payouts - Get payouts', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/publisher/payouts');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    await context.close();
  });

  test('POST /api/publisher/payouts - Request payout', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/publisher/payouts', {
      data: {
        amount: 100.0,
        method: 'BANK_TRANSFER'
      }
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty('payout');
    
    await context.close();
  });

  test('POST /api/publisher/payouts - Below minimum threshold', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/publisher/payouts', {
      data: {
        amount: 10.0,
        method: 'BANK_TRANSFER'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
    
    await context.close();
  });
});
