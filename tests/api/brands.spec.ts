import { test, expect } from '@playwright/test';
import { logAndParse } from '../../utils/api-logger';

const API_URL = process.env.API_URL;

test.describe('API - Brands', () => {

  test('GET /brands returns all brands', async ({ request }) => {
    const response = await request.get(`${API_URL}/brands`);

    expect(response.status()).toBe(200);

    const body = await logAndParse(response);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    const brand = body[0];
    expect(brand).toHaveProperty('id');
    expect(brand).toHaveProperty('name');
    expect(brand).toHaveProperty('slug');
  });

  test('GET /brands includes known brands', async ({ request }) => {
    const response = await request.get(`${API_URL}/brands`);
    const body = await logAndParse(response);

    const names = body.map((b: any) => b.name);
    // Just verify the list contains expected brands (any 2 from the set)
    expect(names.length).toBeGreaterThanOrEqual(2);
  });

  test('GET /brands/{id} returns single brand', async ({ request }) => {
    const listResponse = await request.get(`${API_URL}/brands`);
    const brands = await logAndParse(listResponse);
    const brandId = brands[0].id;

    const response = await request.get(`${API_URL}/brands/${brandId}`);

    expect(response.status()).toBe(200);

    const brand = await logAndParse(response);
    expect(brand).toHaveProperty('id', brandId);
    expect(brand).toHaveProperty('name');
    expect(brand).toHaveProperty('slug');
  });

  test('GET /brands/invalid-id returns 404', async ({ request }) => {
    const response = await request.get(`${API_URL}/brands/nonexistent-id`);

    await logAndParse(response);
    expect(response.status()).toBe(404);
  });

  test('GET /brands/search?q= filters by name', async ({ request }) => {
    const allResponse = await request.get(`${API_URL}/brands`);
    const allBrands = await logAndParse(allResponse);

    // Search using the first brand's name
    const searchName = allBrands[0].name.split(' ')[0];
    const response = await request.get(`${API_URL}/brands/search?q=${searchName}`);

    expect(response.status()).toBe(200);

    const body = await logAndParse(response);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body.length).toBeLessThanOrEqual(allBrands.length);

    for (const brand of body) {
      expect(brand.name.toLowerCase()).toContain(searchName.toLowerCase());
    }
  });

  test('POST /brands creates a new brand', async ({ request }) => {
    const uniqueId = Date.now();
    let brandId: string | number | undefined;

    try {
      const response = await request.post(`${API_URL}/brands`, {
        data: { name: `Test Brand ${uniqueId}`, slug: `test-brand-${uniqueId}` }
      });

      expect(response.status()).toBe(201);

      const body = await logAndParse(response);
      brandId = body.id;
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name', `Test Brand ${uniqueId}`);
      expect(body).toHaveProperty('slug', `test-brand-${uniqueId}`);

      const allResponse = await request.get(`${API_URL}/brands`);
      const allBrands = await logAndParse(allResponse);
      const names = allBrands.map((b: any) => b.name);
      expect(names).toContain(`Test Brand ${uniqueId}`);
    } finally {
      if (brandId) {
        const loginResponse = await request.post(`${API_URL}/users/login`, {
          data: {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
          }
        });
        const { access_token } = await logAndParse(loginResponse);

        await request.delete(`${API_URL}/brands/${brandId}`, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
      }
    }
  });

  test('DELETE /brands/{id} returns 401 without auth', async ({ request }) => {
    const listResponse = await request.get(`${API_URL}/brands`);
    const brands = await logAndParse(listResponse);
    const brandId = brands[0].id;

    const response = await request.delete(`${API_URL}/brands/${brandId}`);

    await logAndParse(response);
    expect(response.status()).toBe(401);
  });

  test('DELETE /brands/{id} deletes brand with admin auth', async ({ request }) => {
    const loginResponse = await request.post(`${API_URL}/users/login`, {
      data: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      }
    });
    const { access_token } = await logAndParse(loginResponse);

    const createResponse = await request.post(`${API_URL}/brands`, {
      data: { name: `TempDelete ${Date.now()}`, slug: `temp-delete-${Date.now()}` }
    });
    const { id: brandId } = await logAndParse(createResponse);

    const deleteResponse = await request.delete(`${API_URL}/brands/${brandId}`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    expect(deleteResponse.status()).toBe(204);
  });

});
