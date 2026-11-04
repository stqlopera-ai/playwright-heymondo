import { test, expect } from '@playwright/test';
import { logAndParse } from '../../utils/api-logger';
import { registerUser } from '../../utils/register-user';

const API_URL = process.env.API_URL;

test.describe('API - Invoices', () => {

  test('GET /invoices returns invoice list', async ({ request }) => {
    const { email, password } = await registerUser(request);
    const loginResponse = await request.post(`${API_URL}/users/login`, {
      data: { email, password }
    });
    const { access_token } = await logAndParse(loginResponse);

    const response = await request.get(`${API_URL}/invoices`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    expect(response.status()).toBe(200);

    const body = await logAndParse(response);
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('GET /invoices/{id} returns 404 for non-existent invoice', async ({ request }) => {
    const { email, password } = await registerUser(request);
    const loginResponse = await request.post(`${API_URL}/users/login`, {
      data: { email, password }
    });
    const { access_token } = await logAndParse(loginResponse);

    const response = await request.get(`${API_URL}/invoices/nonexistent-id`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    await logAndParse(response);
    expect([404, 400]).toContain(response.status());
  });

  test('GET /invoices/{id} returns 401 without auth', async ({ request }) => {
    const response = await request.get(`${API_URL}/invoices/nonexistent-id`);
    await logAndParse(response);
    expect(response.status()).toBe(401);
  });

});
