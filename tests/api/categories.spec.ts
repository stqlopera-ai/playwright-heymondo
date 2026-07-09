import { test, expect } from '@playwright/test';
import { logAndParse } from '../../utils/api-logger';

const API_URL = process.env.API_URL;

test.describe('API - Categories', () => {

  test('GET /categories returns all categories', async ({ request }) => {
    const response = await request.get(`${API_URL}/categories`);

    expect(response.status()).toBe(200);

    const body = await logAndParse(response);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    const category = body[0];
    expect(category).toHaveProperty('id');
    expect(category).toHaveProperty('name');
    expect(category).toHaveProperty('slug');

    const names = body.map((c: any) => c.name);
    expect(names).toContain('Hand Tools');
    expect(names).toContain('Power Tools');
  });

  test('GET /categories includes subcategories with parent_id', async ({ request }) => {
    const response = await request.get(`${API_URL}/categories`);

    const body = await logAndParse(response);
    const subcategories = body.filter((c: any) => c.parent_id !== null);

    expect(subcategories.length).toBeGreaterThan(0);

    for (const sub of subcategories) {
      expect(sub.parent_id).toBeTruthy();
    }
  });

  test('POST /categories creates a new category', async ({ request }) => {
    const uniqueId = Date.now();
    const response = await request.post(`${API_URL}/categories`, {
      data: { name: `Test Cat ${uniqueId}`, slug: `test-cat-${uniqueId}` }
    });

    expect(response.status()).toBe(201);

    const body = await logAndParse(response);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name', `Test Cat ${uniqueId}`);
    expect(body).toHaveProperty('slug', `test-cat-${uniqueId}`);
  });

  test('DELETE /categories/{id} deletes category with admin auth', async ({ request }) => {
    const loginResponse = await request.post(`${API_URL}/users/login`, {
      data: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      }
    });
    const { access_token } = await logAndParse(loginResponse);

    const createResponse = await request.post(`${API_URL}/categories`, {
      data: { name: `TempCat ${Date.now()}`, slug: `temp-cat-${Date.now()}` }
    });
    const { id: categoryId } = await logAndParse(createResponse);

    const deleteResponse = await request.delete(`${API_URL}/categories/${categoryId}`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    expect(deleteResponse.status()).toBe(204);
  });

});
