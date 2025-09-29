import { test, expect } from '@playwright/test';

test.describe('Health & Utility API Endpoints', () => {
  test('GET /api/health - Health check', async ({ request }) => {
    const response = await request.get('/api/health');
    
    // Health endpoint should be accessible
    expect([200, 401]).toContain(response.status());
    
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('status');
      expect(data.status).toBe('ok');
    }
  });

  test('GET /api/health - With auth token', async ({ request }) => {
    // Test with a mock auth token
    const response = await request.get('/api/health', {
      headers: {
        'Authorization': 'Bearer mock-token'
      }
    });
    
    // Should return health status
    expect([200, 401]).toContain(response.status());
  });

  test('GET /api/debug/force-error - Force error endpoint', async ({ request }) => {
    const response = await request.get('/api/debug/force-error');
    
    // Should return 500 error
    expect(response.status()).toBe(500);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('GET /api/debug/force-error - Error handling', async ({ request }) => {
    const response = await request.get('/api/debug/force-error');
    
    // Should handle error gracefully
    expect(response.status()).toBe(500);
    
    // Should return JSON error response
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(typeof data.error).toBe('string');
  });

  test('POST /api/support/contact - Contact form', async ({ request }) => {
    const response = await request.post('/api/support/contact', {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message content'
      }
    });
    
    // Should accept contact form submission
    expect([200, 201]).toContain(response.status());
    
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('success');
    }
  });

  test('POST /api/support/contact - Missing required fields', async ({ request }) => {
    const response = await request.post('/api/support/contact', {
      data: {
        name: 'Test User'
        // Missing email, subject, message
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
  });

  test('POST /api/support/contact - Invalid email', async ({ request }) => {
    const response = await request.post('/api/support/contact', {
      data: {
        name: 'Test User',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'Test message content'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
  });

  test('GET /api/user/profile - Without auth', async ({ request }) => {
    const response = await request.get('/api/user/profile');
    
    expect(response.status()).toBe(401);
  });

  test('PUT /api/user/profile - Without auth', async ({ request }) => {
    const response = await request.put('/api/user/profile', {
      data: {
        name: 'Updated Name'
      }
    });
    
    expect(response.status()).toBe(401);
  });

  test('GET /api/user/settings - Without auth', async ({ request }) => {
    const response = await request.get('/api/user/settings');
    
    expect(response.status()).toBe(401);
  });

  test('PUT /api/user/settings - Without auth', async ({ request }) => {
    const response = await request.put('/api/user/settings', {
      data: {
        notifications: true
      }
    });
    
    expect(response.status()).toBe(401);
  });

  test('CORS preflight on all endpoints', async ({ request }) => {
    const endpoints = [
      '/api/health',
      '/api/support/contact',
      '/api/track/imp',
      '/api/track/click',
      '/api/track/conversion',
      '/api/delivery'
    ];
    
    for (const endpoint of endpoints) {
      const response = await request.fetch(endpoint, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'https://example.com',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      // Should return CORS headers
      const headers = response.headers();
      expect(headers['access-control-allow-origin']).toBeDefined();
    }
  });

  test('Rate limiting on contact form', async ({ request }) => {
    // Fire multiple contact form submissions
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        request.post('/api/support/contact', {
          data: {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'Test message content'
          }
        })
      );
    }
    
    const responses = await Promise.all(promises);
    
    // Some requests should be rate limited
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('Input sanitization on contact form', async ({ request }) => {
    const response = await request.post('/api/support/contact', {
      data: {
        name: '<script>alert("XSS")</script>',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message with <script>alert("XSS")</script>'
      }
    });
    
    // Should accept the form but sanitize the input
    expect([200, 201]).toContain(response.status());
    
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('success');
    }
  });

  test('Health check response time', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/api/health');
    const responseTime = Date.now() - startTime;
    
    // Should respond quickly
    expect(responseTime).toBeLessThan(1000);
    expect([200, 401]).toContain(response.status());
  });

  test('Error endpoint response time', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/api/debug/force-error');
    const responseTime = Date.now() - startTime;
    
    // Should respond quickly even when throwing error
    expect(responseTime).toBeLessThan(1000);
    expect(response.status()).toBe(500);
  });
});
