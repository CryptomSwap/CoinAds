import { test, expect } from '@playwright/test';

test.describe('Order API Endpoints', () => {
  let advertiserAuthContext: any;
  let adminAuthContext: any;

  test.beforeAll(async ({ browser }) => {
    // Create authenticated context for advertiser
    const advertiserContext = await browser.newContext();
    const advertiserPage = await advertiserContext.newPage();
    
    await advertiserPage.goto('/auth/signin');
    await advertiserPage.fill('input[name="email"]', 'adv@coinads.test');
    await advertiserPage.fill('input[name="password"]', 'Adv#1234');
    await advertiserPage.click('button[type="submit"]');
    await advertiserPage.waitForURL('/app/advertiser');
    
    advertiserAuthContext = await advertiserContext.storageState();
    await advertiserContext.close();

    // Create authenticated context for admin
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    
    await adminPage.goto('/auth/signin');
    await adminPage.fill('input[name="email"]', 'admin@coinads.test');
    await adminPage.fill('input[name="password"]', 'Admin#1234');
    await adminPage.click('button[type="submit"]');
    await adminPage.waitForURL('/app/admin');
    
    adminAuthContext = await adminContext.storageState();
    await adminContext.close();
  });

  test.describe('Advertiser Order Endpoints', () => {
    test('GET /api/advertiser/orders - With auth', async ({ browser }) => {
      const context = await browser.newContext({ storageState: advertiserAuthContext });
      const request = context.request;
      
      const response = await request.get('/api/advertiser/orders');
      
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.orders).toBeDefined();
      expect(Array.isArray(data.orders)).toBe(true);
      
      await context.close();
    });

    test('GET /api/advertiser/orders - Without auth', async ({ request }) => {
      const response = await request.get('/api/advertiser/orders');
      
      expect(response.status()).toBe(401);
    });

    test('POST /api/advertiser/orders - Create order', async ({ browser }) => {
      const context = await browser.newContext({ storageState: advertiserAuthContext });
      const request = context.request;
      
      const response = await request.post('/api/advertiser/orders', {
        data: {
          title: 'Test Order API',
          notes: 'Created via API test',
          totalAmountMicros: '200000000', // $200
          currency: 'USD',
        },
      });
      
      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data.order).toBeDefined();
      expect(data.order.title).toBe('Test Order API');
      expect(data.order.status).toBe('PENDING');
      
      await context.close();
    });

    test('POST /api/advertiser/orders - Invalid data', async ({ browser }) => {
      const context = await browser.newContext({ storageState: advertiserAuthContext });
      const request = context.request;
      
      const response = await request.post('/api/advertiser/orders', {
        data: {
          title: 'A', // Too short
          totalAmountMicros: '-100000000', // Negative amount
        },
      });
      
      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
      
      await context.close();
    });

    test('GET /api/advertiser/orders/[id] - Get specific order', async ({ browser }) => {
      const context = await browser.newContext({ storageState: advertiserAuthContext });
      const request = context.request;
      
      // First create an order
      const createResponse = await request.post('/api/advertiser/orders', {
        data: {
          title: 'Test Order for GET',
          totalAmountMicros: '100000000',
          currency: 'USD',
        },
      });
      
      const createData = await createResponse.json();
      const orderId = createData.order.id;
      
      // Then get it
      const response = await request.get(`/api/advertiser/orders/${orderId}`);
      
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.order.id).toBe(orderId);
      expect(data.order.title).toBe('Test Order for GET');
      
      await context.close();
    });

    test('PUT /api/advertiser/orders/[id] - Update order', async ({ browser }) => {
      const context = await browser.newContext({ storageState: advertiserAuthContext });
      const request = context.request;
      
      // First create an order
      const createResponse = await request.post('/api/advertiser/orders', {
        data: {
          title: 'Test Order for UPDATE',
          totalAmountMicros: '100000000',
          currency: 'USD',
        },
      });
      
      const createData = await createResponse.json();
      const orderId = createData.order.id;
      
      // Then update it
      const response = await request.put(`/api/advertiser/orders/${orderId}`, {
        data: {
          title: 'Updated Order Title',
          notes: 'Updated notes',
        },
      });
      
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.order.title).toBe('Updated Order Title');
      expect(data.order.notes).toBe('Updated notes');
      
      await context.close();
    });
  });

  test.describe('Admin Order Endpoints', () => {
    test('GET /api/admin/orders - With admin auth', async ({ browser }) => {
      const context = await browser.newContext({ storageState: adminAuthContext });
      const request = context.request;
      
      const response = await request.get('/api/admin/orders');
      
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.orders).toBeDefined();
      expect(Array.isArray(data.orders)).toBe(true);
      
      await context.close();
    });

    test('GET /api/admin/orders - Without auth', async ({ request }) => {
      const response = await request.get('/api/admin/orders');
      
      expect(response.status()).toBe(401);
    });

    test('GET /api/admin/orders - With advertiser auth (should fail)', async ({ browser }) => {
      const context = await browser.newContext({ storageState: advertiserAuthContext });
      const request = context.request;
      
      const response = await request.get('/api/admin/orders');
      
      expect(response.status()).toBe(401);
      
      await context.close();
    });

    test('PUT /api/admin/orders/[id]/status - Approve order', async ({ browser }) => {
      const context = await browser.newContext({ storageState: adminAuthContext });
      const request = context.request;
      
      // First get an existing order
      const getResponse = await request.get('/api/admin/orders');
      const getData = await getResponse.json();
      
      if (getData.orders.length > 0) {
        const orderId = getData.orders[0].id;
        
        // Update status to approved
        const response = await request.put(`/api/admin/orders/${orderId}/status`, {
          data: {
            status: 'APPROVED',
            adminReason: 'Approved for testing',
          },
        });
        
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.order.status).toBe('APPROVED');
      }
      
      await context.close();
    });

    test('PUT /api/admin/orders/[id]/status - Reject order', async ({ browser }) => {
      const context = await browser.newContext({ storageState: adminAuthContext });
      const request = context.request;
      
      // First get an existing order
      const getResponse = await request.get('/api/admin/orders');
      const getData = await getResponse.json();
      
      if (getData.orders.length > 0) {
        const orderId = getData.orders[0].id;
        
        // Update status to rejected
        const response = await request.put(`/api/admin/orders/${orderId}/status`, {
          data: {
            status: 'REJECTED',
            adminReason: 'Rejected for testing',
          },
        });
        
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.order.status).toBe('REJECTED');
      }
      
      await context.close();
    });
  });
});
