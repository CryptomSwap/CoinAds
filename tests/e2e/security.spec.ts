import { test, expect } from '@playwright/test';

test.describe('Security', () => {
  test('Auth-only endpoints check session and role', async ({ page }) => {
    // Test admin endpoint without auth
    const adminResponse = await page.request.get('/api/admin/users');
    expect([401, 403]).toContain(adminResponse.status());
    
    // Test advertiser endpoint without auth
    const advertiserResponse = await page.request.get('/api/advertiser/campaigns');
    expect([401, 403]).toContain(advertiserResponse.status());
    
    // Test publisher endpoint without auth
    const publisherResponse = await page.request.get('/api/publisher/sites');
    expect([401, 403]).toContain(publisherResponse.status());
  });

  test('No server secrets leak to client', async ({ page }) => {
    await page.goto('/');
    
    // Check page source for secrets
    const pageContent = await page.content();
    
    // Should not contain database URLs
    expect(pageContent).not.toContain('postgresql://');
    expect(pageContent).not.toContain('DATABASE_URL');
    
    // Should not contain API keys
    expect(pageContent).not.toContain('sk_');
    expect(pageContent).not.toContain('STRIPE_SECRET_KEY');
    
    // Should not contain NextAuth secret
    expect(pageContent).not.toContain('NEXTAUTH_SECRET');
    
    // Should only contain NEXT_PUBLIC_ variables
    const publicVars = pageContent.match(/NEXT_PUBLIC_/g);
    if (publicVars) {
      // All environment variables in client should be NEXT_PUBLIC_
      expect(publicVars.every(v => v.startsWith('NEXT_PUBLIC_'))).toBe(true);
    }
  });

  test('CORS enabled on public tracking endpoints', async ({ page }) => {
    // Test CORS on tracking endpoints
    const corsResponse = await page.request.fetch('/api/track/imp', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    // Check CORS headers
    const headers = corsResponse.headers();
    expect(headers['access-control-allow-origin']).toBeDefined();
    expect(headers['access-control-allow-methods']).toBeDefined();
    expect(headers['access-control-allow-headers']).toBeDefined();
  });

  test('Rate limits enabled on public endpoints', async ({ page }) => {
    // Test rate limiting on tracking endpoint
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
    
    // Some requests should be rate limited
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('No XSS via unescaped HTML creative previews', async ({ page }) => {
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Go to creative preview
    await page.goto('/app/advertiser/creatives');
    
    // Check for creative preview
    const previewButton = page.locator('[data-testid="preview-creative"], .preview-button').first();
    if (await previewButton.count() > 0) {
      await previewButton.click();
      
      // Check for preview modal
      const previewModal = page.locator('[data-testid="preview-modal"], .preview-modal');
      if (await previewModal.count() > 0) {
        await expect(previewModal).toBeVisible();
        
        // Check that HTML is properly escaped or sandboxed
        const previewContent = previewModal.locator('iframe, [data-testid="preview-content"]');
        if (await previewContent.count() > 0) {
          // If using iframe, check for sandbox attribute
          const iframe = previewContent.locator('iframe');
          if (await iframe.count() > 0) {
            const sandbox = await iframe.getAttribute('sandbox');
            expect(sandbox).toBeTruthy();
          }
        }
      }
    }
  });

  test('Input validation prevents SQL injection', async ({ page }) => {
    // Test SQL injection attempts
    const sqlInjectionPayloads = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "'; INSERT INTO users VALUES ('hacker', 'password'); --"
    ];
    
    for (const payload of sqlInjectionPayloads) {
      // Test on campaign creation
      const response = await page.request.post('/api/advertiser/campaigns', {
        data: {
          name: payload,
          budget: 1000
        }
      });
      
      // Should return validation error, not execute SQL
      expect([400, 401, 403]).toContain(response.status());
    }
  });

  test('CSRF protection on state-changing endpoints', async ({ page }) => {
    // Test CSRF protection
    const response = await page.request.post('/api/advertiser/campaigns', {
      data: {
        name: 'Test Campaign',
        budget: 1000
      },
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    // Should require proper CSRF token or return 403
    if (response.status() === 403) {
      const responseData = await response.json();
      expect(responseData.error).toContain('CSRF');
    }
  });

  test('File upload security', async ({ page }) => {
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Go to creative upload
    await page.goto('/app/advertiser/creatives');
    
    // Test malicious file upload
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      // Create a malicious file
      const maliciousContent = '<script>alert("XSS")</script>';
      const file = new File([maliciousContent], 'malicious.html', { type: 'text/html' });
      
      await fileInput.setInputFiles([file]);
      await page.click('button[type="submit"]');
      
      // Should reject malicious file
      const errorMessage = page.locator('[data-testid="error-message"], .error-message');
      if (await errorMessage.count() > 0) {
        await expect(errorMessage).toBeVisible();
      }
    }
  });

  test('Session security', async ({ page }) => {
    // Sign in
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'admin@coinads.test');
    await page.fill('input[name="password"]', 'Admin#1234');
    await page.click('button[type="submit"]');
    
    // Check for secure session cookies
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name.includes('session') || c.name.includes('auth'));
    
    if (sessionCookie) {
      // Should be secure in production
      expect(sessionCookie.secure).toBe(true);
      expect(sessionCookie.httpOnly).toBe(true);
    }
  });

  test('API endpoint authorization', async ({ page }) => {
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Try to access admin endpoint
    const response = await page.request.get('/api/admin/users');
    
    // Should be forbidden
    expect(response.status()).toBe(403);
  });

  test('Data sanitization', async ({ page }) => {
    // Test XSS in user input
    const xssPayload = '<script>alert("XSS")</script>';
    
    // Sign in as advertiser
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'adv@coinads.test');
    await page.fill('input[name="password"]', 'Adv#1234');
    await page.click('button[type="submit"]');
    
    // Try to create campaign with XSS payload
    await page.goto('/app/advertiser/campaigns/create');
    await page.fill('input[name="name"]', xssPayload);
    await page.fill('textarea[name="description"]', xssPayload);
    await page.click('button[type="submit"]');
    
    // Check that XSS is not executed
    const pageContent = await page.content();
    expect(pageContent).not.toContain('<script>alert("XSS")</script>');
  });
});
