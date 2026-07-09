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

});
