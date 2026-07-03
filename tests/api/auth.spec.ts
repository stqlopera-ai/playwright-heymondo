import { test, expect } from '@playwright/test';

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

    const body = await response.json();
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

    expect(response.status()).toBe(401);
  });

});