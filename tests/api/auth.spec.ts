import { test, expect } from '@playwright/test';
import { logAndParse } from '../../utils/api-logger';

const API_URL = process.env.API_URL;

test.describe('API - Auth', () => {

  test('login returns token with valid credentials', async ({ request }) => {
    const response = await request.post(`${API_URL}/users/login`, {
      data: {
        email: process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD,
      }
    });

    expect(response.status()).toBe(200);

    const body = await logAndParse(response);
    expect(body).toHaveProperty('access_token');
    expect(typeof body.access_token).toBe('string');
  });

  test('login returns 401 with invalid credentials', async ({ request }) => {
    const response = await request.post(`${API_URL}/users/login`, {
      data: {
        email: 'wrong@test.com',
        password: 'wrongpass',
      }
    });

    await logAndParse(response);
    expect(response.status()).toBe(401);
  });

  test('protected endpoints return 401 without token', async ({ request }) => {
    const endpoints = ['/users/me', '/invoices', '/messages'];
    for (const endpoint of endpoints) {
      const response = await request.get(`${API_URL}${endpoint}`);
      await logAndParse(response);
      expect(response.status(), `${endpoint} should return 401`).toBe(401);
    }
  });

});
