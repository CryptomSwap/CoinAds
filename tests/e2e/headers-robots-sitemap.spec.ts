import { test, expect } from '@playwright/test';

const ROOT_DOMAIN = process.env.TEST_ROOT_DOMAIN || 'http://localhost:3000';
const APP_DOMAIN = process.env.TEST_APP_DOMAIN || 'http://localhost:3000';

test.describe('Headers, Robots, and Sitemap Tests', () => {
  test('Root domain has proper security headers', async ({ request }) => {
    const response = await request.get(ROOT_DOMAIN);
    const headers = response.headers();

    // Check essential security headers
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBeTruthy();
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');

    // Check HSTS in production
    if (ROOT_DOMAIN.startsWith('https://')) {
      expect(headers['strict-transport-security']).toContain('max-age=31536000');
      expect(headers['strict-transport-security']).toContain('includeSubDomains');
    }

    // Check CSP
    expect(headers['content-security-policy']).toBeTruthy();
    expect(headers['content-security-policy']).toContain("default-src 'self'");

    console.log('✅ Root domain security headers:', headers);
  });

  test('App subdomain has proper security headers', async ({ request }) => {
    const response = await request.get(`${APP_DOMAIN}/auth/signin`);
    const headers = response.headers();

    // Check essential security headers
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBeTruthy();
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');

    // Check HSTS in production
    if (APP_DOMAIN.startsWith('https://')) {
      expect(headers['strict-transport-security']).toContain('max-age=31536000');
    }

    // Check CSP
    expect(headers['content-security-policy']).toBeTruthy();

    console.log('✅ App subdomain security headers:', headers);

    // Save headers to artifacts
    const fs = require('fs');
    const path = require('path');
    
    const artifactsDir = path.join(process.cwd(), 'artifacts', 'split-domain');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }
    
    // Save root headers
    const rootResponse = await request.get(ROOT_DOMAIN);
    const rootHeaders = rootResponse.headers();
    
    const rootHeadersFile = path.join(artifactsDir, 'headers-root.txt');
    fs.writeFileSync(rootHeadersFile, formatHeaders(rootHeaders));
    
    // Save app headers
    const appHeadersFile = path.join(artifactsDir, 'headers-app.txt');
    fs.writeFileSync(appHeadersFile, formatHeaders(headers));
    
    console.log(`📄 Headers saved to: ${artifactsDir}`);
  });

  test('Robots.txt exists and disallows /app/*', async ({ request }) => {
    const response = await request.get(`${ROOT_DOMAIN}/robots.txt`);
    
    expect(response.status()).toBe(200);
    
    const content = await response.text();
    
    // Check basic structure
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Disallow: /app/');
    expect(content).toContain('Disallow: /api/');
    expect(content).toContain('Disallow: /auth/');
    
    // Check sitemap reference
    expect(content).toContain('/sitemap.xml');
    
    console.log('✅ Robots.txt content:', content);
    
    // Save robots.txt to artifacts
    const fs = require('fs');
    const path = require('path');
    
    const artifactsDir = path.join(process.cwd(), 'artifacts', 'split-domain');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }
    
    const robotsFile = path.join(artifactsDir, 'robots.txt');
    fs.writeFileSync(robotsFile, content);
    
    console.log(`📄 Robots.txt saved to: ${robotsFile}`);
  });

  test('Sitemap.xml exists and excludes /app/* routes', async ({ request }) => {
    const response = await request.get(`${ROOT_DOMAIN}/sitemap.xml`);
    
    expect(response.status()).toBe(200);
    
    const content = await response.text();
    
    // Check basic XML structure
    expect(content).toContain('<?xml');
    expect(content).toContain('<urlset');
    expect(content).toContain('<url>');
    expect(content).toContain('<loc>');
    
    // Check for marketing pages
    expect(content).toContain('coinads.com');
    expect(content).toContain('/advertisers');
    expect(content).toContain('/publishers');
    
    // Verify NO app routes are included
    expect(content).not.toContain('/app/');
    expect(content).not.toContain('/auth/');
    expect(content).not.toContain('/api/');
    
    console.log('✅ Sitemap.xml is properly configured');
    
    // Save sitemap to artifacts
    const fs = require('fs');
    const path = require('path');
    
    const artifactsDir = path.join(process.cwd(), 'artifacts', 'split-domain');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }
    
    const sitemapFile = path.join(artifactsDir, 'sitemap.xml');
    fs.writeFileSync(sitemapFile, content);
    
    console.log(`📄 Sitemap.xml saved to: ${sitemapFile}`);
  });

  test('App domain dashboard returns proper response', async ({ request }) => {
    const response = await request.get(`${APP_DOMAIN}/app/advertiser/overview`, {
      maxRedirects: 0,
      failOnStatusCode: false,
    });
    
    // Should either be a redirect to sign-in or show dashboard (if authenticated)
    expect([200, 307, 308]).toContain(response.status());
    
    console.log(`✅ App dashboard response status: ${response.status()}`);
  });

  test('Health endpoint accessible on both domains', async ({ request }) => {
    const rootHealth = await request.get(`${ROOT_DOMAIN}/api/health`);
    expect(rootHealth.status()).toBe(200);
    
    const rootData = await rootHealth.json();
    expect(rootData.status).toBe('ok');
    
    const appHealth = await request.get(`${APP_DOMAIN}/api/health`);
    expect(appHealth.status()).toBe(200);
    
    const appData = await appHealth.json();
    expect(appData.status).toBe('ok');
    
    console.log('✅ Health endpoint accessible on both domains');
  });
});

function formatHeaders(headers: Record<string, string>): string {
  let output = 'HTTP Response Headers\n';
  output += '=====================\n\n';
  
  Object.entries(headers).forEach(([key, value]) => {
    output += `${key}: ${value}\n`;
  });
  
  return output;
}
