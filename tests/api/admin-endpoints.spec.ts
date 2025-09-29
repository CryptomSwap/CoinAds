import { test, expect } from '@playwright/test';

test.describe('Admin API Endpoints', () => {
  let authContext: any;

  test.beforeAll(async ({ browser }) => {
    // Create authenticated context
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Sign in as admin
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL('/app/admin');
    
    // Get storage state
    authContext = await context.storageState();
    await context.close();
  });

  test('GET /api/admin/users - With auth', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/admin/users');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    await context.close();
  });

  test('GET /api/admin/users - Without auth', async ({ request }) => {
    const response = await request.get('/api/admin/users');
    
    expect(response.status()).toBe(401);
  });

  test('GET /api/admin/approvals - With auth', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/admin/approvals');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    await context.close();
  });

  test('POST /api/admin/approvals - Approve campaign', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/admin/approvals', {
      data: {
        entityType: 'CAMPAIGN',
        entityId: 1,
        status: 'APPROVED',
        reason: 'Test approval'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
    
    await context.close();
  });

  test('POST /api/admin/approvals - Reject campaign', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/admin/approvals', {
      data: {
        entityType: 'CAMPAIGN',
        entityId: 1,
        status: 'REJECTED',
        reason: 'Test rejection'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
    
    await context.close();
  });

  test('POST /api/admin/approvals - Missing fields', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.post('/api/admin/approvals', {
      data: {
        entityType: 'CAMPAIGN'
        // Missing entityId, status, reason
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
    
    await context.close();
  });

  test('GET /api/admin/transactions - With auth', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/admin/transactions');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    await context.close();
  });

  test('GET /api/admin/logs - With auth', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/admin/logs');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    await context.close();
  });

  test('GET /api/admin/logs - With filters', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/admin/logs?action=APPROVE&startDate=2024-01-01&endDate=2024-12-31');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    
    await context.close();
  });

  test('PUT /api/admin/users/:id/role - Change user role', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.put('/api/admin/users/2/role', {
      data: {
        role: 'ADVERTISER'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
    
    await context.close();
  });

  test('PUT /api/admin/users/:id/role - Invalid role', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.put('/api/admin/users/2/role', {
      data: {
        role: 'INVALID_ROLE'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
    
    await context.close();
  });

  test('GET /api/admin/pricing - With auth', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/admin/pricing');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('pricing');
    
    await context.close();
  });

  test('PUT /api/admin/pricing - Update pricing', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.put('/api/admin/pricing', {
      data: {
        placementId: 1,
        price: 6.00
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success');
    
    await context.close();
  });

  test('GET /api/admin/reports - With auth', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/admin/reports');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('reports');
    
    await context.close();
  });

  test('GET /api/admin/reports - With date filters', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/admin/reports?startDate=2024-01-01&endDate=2024-01-31');
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('reports');
    
    await context.close();
  });

  test('GET /api/admin/reports/export - CSV export', async ({ browser }) => {
    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const response = await request.get('/api/admin/reports/export');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/csv');
    
    await context.close();
  });
});
