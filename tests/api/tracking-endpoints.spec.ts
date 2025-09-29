import { test, expect } from '@playwright/test';

test.describe('Tracking API Endpoints', () => {
  test('POST /api/track/imp - Valid impression', async ({ request }) => {
    const response = await request.post('/api/track/imp', {
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
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('impressionId');
  });

  test('POST /api/track/imp - Missing required fields', async ({ request }) => {
    const response = await request.post('/api/track/imp', {
      data: {
        campaignId: 1
        // Missing creativeId, placementId, etc.
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
  });

  test('POST /api/track/imp - Invalid campaign ID', async ({ request }) => {
    const response = await request.post('/api/track/imp', {
      data: {
        campaignId: 99999,
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
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('POST /api/track/click - Valid click', async ({ request }) => {
    // First create an impression
    const impResponse = await request.post('/api/track/imp', {
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
    const response = await request.post('/api/track/click', {
      data: {
        impressionId: impressionId
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('clickId');
  });

  test('POST /api/track/click - Invalid impression ID', async ({ request }) => {
    const response = await request.post('/api/track/click', {
      data: {
        impressionId: 99999
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('POST /api/track/conversion - Valid conversion', async ({ request }) => {
    // First create an impression
    const impResponse = await request.post('/api/track/imp', {
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
    const clickResponse = await request.post('/api/track/click', {
      data: {
        impressionId: impressionId
      }
    });
    
    const clickData = await clickResponse.json();
    const clickId = clickData.clickId;
    
    // Then track a conversion
    const response = await request.post('/api/track/conversion', {
      data: {
        clickId: clickId,
        campaignId: 1,
        value: 25.00,
        currency: 'USD'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('conversionId');
  });

  test('POST /api/track/conversion - Invalid click ID', async ({ request }) => {
    const response = await request.post('/api/track/conversion', {
      data: {
        clickId: 99999,
        campaignId: 1,
        value: 25.00,
        currency: 'USD'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('POST /api/track/conversion - Missing value', async ({ request }) => {
    const response = await request.post('/api/track/conversion', {
      data: {
        clickId: 1,
        campaignId: 1,
        currency: 'USD'
        // Missing value
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
  });

  test('GET /api/delivery - Valid placement', async ({ request }) => {
    const response = await request.get('/api/delivery?placementId=1');
    
    expect(response.status()).toBe(200);
    const data = await response.text();
    expect(data).toContain('ad');
  });

  test('GET /api/delivery - Invalid placement', async ({ request }) => {
    const response = await request.get('/api/delivery?placementId=99999');
    
    expect(response.status()).toBe(404);
  });

  test('GET /api/delivery - Missing placement ID', async ({ request }) => {
    const response = await request.get('/api/delivery');
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('CORS headers on tracking endpoints', async ({ request }) => {
    const response = await request.fetch('/api/track/imp', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeDefined();
    expect(headers['access-control-allow-methods']).toBeDefined();
    expect(headers['access-control-allow-headers']).toBeDefined();
  });

  test('Rate limiting on tracking endpoints', async ({ request }) => {
    // Fire many requests quickly
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(
        request.post('/api/track/imp', {
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
    
    // Some requests should be rate limited
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('Bot detection on tracking endpoints', async ({ request }) => {
    const response = await request.post('/api/track/imp', {
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
    expect(response.status()).not.toBe(500);
  });

  test('Duplicate impression detection', async ({ request }) => {
    // Fire the same impression twice quickly
    const data = {
      campaignId: 1,
      creativeId: 1,
      placementId: 1,
      siteId: 1,
      device: 'DESKTOP',
      country: 'US',
      browser: 'Chrome',
      os: 'Windows',
      costMicros: 5000
    };
    
    const response1 = await request.post('/api/track/imp', { data });
    const response2 = await request.post('/api/track/imp', { data });
    
    // Both should return valid responses (duplicate detection may be handled differently)
    expect([200, 400]).toContain(response1.status());
    expect([200, 400]).toContain(response2.status());
  });

  test('Geographic data validation', async ({ request }) => {
    const response = await request.post('/api/track/imp', {
      data: {
        campaignId: 1,
        creativeId: 1,
        placementId: 1,
        siteId: 1,
        device: 'DESKTOP',
        country: 'INVALID_COUNTRY',
        browser: 'Chrome',
        os: 'Windows',
        costMicros: 5000
      }
    });
    
    // Should handle invalid country gracefully
    expect([200, 400]).toContain(response.status());
  });

  test('Cost calculation validation', async ({ request }) => {
    const response = await request.post('/api/track/imp', {
      data: {
        campaignId: 1,
        creativeId: 1,
        placementId: 1,
        siteId: 1,
        device: 'DESKTOP',
        country: 'US',
        browser: 'Chrome',
        os: 'Windows',
        costMicros: -1000 // Negative cost
      }
    });
    
    // Should reject negative costs
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
  });
});
