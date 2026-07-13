import { test, expect } from '@playwright/test';
import { logAndParse } from '../../utils/api-logger';
import { registerUser } from '../../utils/register-user';

const API_URL = process.env.API_URL;

test.describe('API - Reports (admin)', () => {

  let adminToken: string;

  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_URL}/users/login`, {
      data: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      }
    });
    const body = await logAndParse(response);
    adminToken = body.access_token;
  });

  const headers = {} as { Authorization: string };

  test.beforeEach(() => {
    headers.Authorization = `Bearer ${adminToken}`;
  });

  test('GET /reports/total-sales-per-country', async ({ request }) => {
    const response = await request.get(`${API_URL}/reports/total-sales-per-country`, { headers });
    expect(response.status()).toBe(200);
    const body = await logAndParse(response);
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /reports/top10-purchased-products', async ({ request }) => {
    const response = await request.get(`${API_URL}/reports/top10-purchased-products`, { headers });
    expect(response.status()).toBe(200);
    const body = await logAndParse(response);
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /reports/top10-best-selling-categories', async ({ request }) => {
    const response = await request.get(`${API_URL}/reports/top10-best-selling-categories`, { headers });
    expect(response.status()).toBe(200);
    const body = await logAndParse(response);
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /reports/total-sales-of-years', async ({ request }) => {
    const response = await request.get(`${API_URL}/reports/total-sales-of-years?years=1`, { headers });
    expect(response.status()).toBe(200);
    const body = await logAndParse(response);
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /reports/average-sales-per-month', async ({ request }) => {
    const response = await request.get(`${API_URL}/reports/average-sales-per-month?year=2024`, { headers });
    expect(response.status()).toBe(200);
    const body = await logAndParse(response);
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /reports/average-sales-per-week', async ({ request }) => {
    const response = await request.get(`${API_URL}/reports/average-sales-per-week?year=2024`, { headers });
    expect(response.status()).toBe(200);
    const body = await logAndParse(response);
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /reports/customers-by-country', async ({ request }) => {
    const response = await request.get(`${API_URL}/reports/customers-by-country`, { headers });
    expect(response.status()).toBe(200);
    const body = await logAndParse(response);
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /reports returns 403 with user auth', async ({ request }) => {
    const { email, password } = await registerUser(request);
    const userResponse = await request.post(`${API_URL}/users/login`, {
      data: { email, password }
    });
    const { access_token } = await logAndParse(userResponse);

    const response = await request.get(`${API_URL}/reports/total-sales-per-country`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    await logAndParse(response);
    expect(response.status()).toBe(403);
  });

});
