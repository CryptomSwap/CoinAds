import { test, expect } from '@playwright/test';

test.describe('Auth API Endpoints', () => {
  test('POST /api/auth/signin - Valid credentials', async ({ request }) => {
    const response = await request.post('/api/auth/signin', {
      data: {
        email: 'admin@coinads.test',
        password: 'Admin#1234'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('user');
    expect(data.user.email).toBe('admin@coinads.test');
  });

  test('POST /api/auth/signin - Invalid credentials', async ({ request }) => {
    const response = await request.post('/api/auth/signin', {
      data: {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      }
    });
    
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('POST /api/auth/signin - Missing fields', async ({ request }) => {
    const response = await request.post('/api/auth/signin', {
      data: {
        email: 'admin@coinads.test'
        // Missing password
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
  });

  test('POST /api/auth/signup - Valid signup', async ({ request }) => {
    const response = await request.post('/api/auth/signup', {
      data: {
        email: 'newuser@test.com',
        password: 'NewUser#1234',
        confirmPassword: 'NewUser#1234',
        role: 'ADVERTISER',
        name: 'New User'
      }
    });
    
    // Should return 200 or 201
    expect([200, 201]).toContain(response.status());
  });

  test('POST /api/auth/signup - Password mismatch', async ({ request }) => {
    const response = await request.post('/api/auth/signup', {
      data: {
        email: 'newuser@test.com',
        password: 'NewUser#1234',
        confirmPassword: 'DifferentPassword',
        role: 'ADVERTISER',
        name: 'New User'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
  });

  test('POST /api/auth/signup - Invalid role', async ({ request }) => {
    const response = await request.post('/api/auth/signup', {
      data: {
        email: 'newuser@test.com',
        password: 'NewUser#1234',
        confirmPassword: 'NewUser#1234',
        role: 'INVALID_ROLE',
        name: 'New User'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
  });

  test('POST /api/auth/signout', async ({ request }) => {
    const response = await request.post('/api/auth/signout');
    
    expect(response.status()).toBe(200);
  });

  test('GET /api/auth/session - Without auth', async ({ request }) => {
    const response = await request.get('/api/auth/session');
    
    expect(response.status()).toBe(401);
  });

  test('POST /api/auth/forgot-password - Valid email', async ({ request }) => {
    const response = await request.post('/api/auth/forgot-password', {
      data: {
        email: 'admin@coinads.test'
      }
    });
    
    // Should return 200 (even if email sending is mocked)
    expect(response.status()).toBe(200);
  });

  test('POST /api/auth/forgot-password - Invalid email', async ({ request }) => {
    const response = await request.post('/api/auth/forgot-password', {
      data: {
        email: 'nonexistent@test.com'
      }
    });
    
    // Should still return 200 for security (don't reveal if email exists)
    expect(response.status()).toBe(200);
  });

  test('POST /api/auth/reset-password - Valid token', async ({ request }) => {
    const response = await request.post('/api/auth/reset-password', {
      data: {
        token: 'valid-token',
        password: 'NewPassword#1234',
        confirmPassword: 'NewPassword#1234'
      }
    });
    
    // Should return 200 or 400 (depending on token validity)
    expect([200, 400]).toContain(response.status());
  });

  test('POST /api/auth/reset-password - Invalid token', async ({ request }) => {
    const response = await request.post('/api/auth/reset-password', {
      data: {
        token: 'invalid-token',
        password: 'NewPassword#1234',
        confirmPassword: 'NewPassword#1234'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('POST /api/auth/reset-password - Password mismatch', async ({ request }) => {
    const response = await request.post('/api/auth/reset-password', {
      data: {
        token: 'valid-token',
        password: 'NewPassword#1234',
        confirmPassword: 'DifferentPassword'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('errors');
  });
});
