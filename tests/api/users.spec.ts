import { test, expect } from '@playwright/test';
import { logAndParse } from '../../utils/api-logger';
import { registerUser } from '../../utils/register-user';

const API_URL = process.env.API_URL;

test.describe('API - Users (authenticated)', () => {

  let token: string;
  let userEmail: string;
  let adminToken: string;

  test.beforeAll(async ({ request }) => {
    const { email, password } = await registerUser(request);
    userEmail = email;

    const response = await request.post(`${API_URL}/users/login`, {
      data: { email, password }
    });

    const body = await logAndParse(response);
    token = body.access_token;

    const adminResponse = await request.post(`${API_URL}/users/login`, {
      data: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      }
    });
    const adminBody = await logAndParse(adminResponse);
    adminToken = adminBody.access_token;
  });

  test('GET /users/me returns profile', async ({ request }) => {
    const response = await request.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(response.status()).toBe(200);

    const body = await logAndParse(response);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('email', userEmail);
    expect(body).toHaveProperty('first_name');
    expect(body).toHaveProperty('last_name');
    expect(body).toHaveProperty('address');
  });

  test('GET /users returns all users with admin auth', async ({ request }) => {
    const response = await request.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    expect(response.status()).toBe(200);

    const body = await logAndParse(response);
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('current_page');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('GET /users returns 403 with user auth', async ({ request }) => {
    const response = await request.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await logAndParse(response);
    expect(response.status()).toBe(403);
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

  test('DELETE /users/{id} deletes user with admin auth', async ({ request }) => {
    const uniqueId = Date.now();
    const registerResponse = await request.post(`${API_URL}/users/register`, {
      data: {
        first_name: 'Temp',
        last_name: 'User' + uniqueId,
        email: 'tempuser' + uniqueId + '@test.com',
        password: 'Xy' + uniqueId + '@!zSecure',
        phone: '1234567890',
      }
    });
    expect(registerResponse.status()).toBe(201);

    const { id: userId } = await logAndParse(registerResponse);

    const deleteResponse = await request.delete(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    expect(deleteResponse.status()).toBe(204);
  });

});
