import { test, expect } from '@playwright/test';
import { logAndParse } from '../../utils/api-logger';

const API_URL = process.env.API_URL;

test.describe('API - Users (authenticated)', () => {

  let token: string;

  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_URL}/users/login`, {
      data: {
        email: process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD,
      }
    });

    const body = await logAndParse(response);
    token = body.access_token;
  });

  test('GET /users/me returns profile', async ({ request }) => {
    const response = await request.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(response.status()).toBe(200);

    const body = await logAndParse(response);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('email', process.env.USER_EMAIL);
    expect(body).toHaveProperty('first_name');
    expect(body).toHaveProperty('last_name');
    expect(body).toHaveProperty('address');
  });

  test('GET /invoices returns invoice list', async ({ request }) => {
    const response = await request.get(`${API_URL}/invoices`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(response.status()).toBe(200);

    const body = await logAndParse(response);
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('current_page');
    expect(Array.isArray(body.data)).toBe(true);

    if (body.data.length > 0) {
      const invoice = body.data[0];
      expect(invoice).toHaveProperty('invoice_number');
      expect(invoice).toHaveProperty('total');
      expect(invoice).toHaveProperty('status');
      expect(invoice).toHaveProperty('invoice_date');
      expect(invoice).toHaveProperty('invoicelines');
    }
  });

  test('GET /messages returns message list', async ({ request }) => {
    const response = await request.get(`${API_URL}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(response.status()).toBe(200);

    const body = await logAndParse(response);
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('current_page');
    expect(Array.isArray(body.data)).toBe(true);
  });

});
