import { test, expect } from '@playwright/test';
import { logAndParse } from '../../utils/api-logger';

const API_URL = process.env.API_URL;

test.describe('API - Products', () => {

  test('GET /products returns paginated list', async ({ request }) => {
    const response = await request.get(`${API_URL}/products`);

    expect(response.status()).toBe(200);

    const body = await logAndParse(response);
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('current_page');
    expect(body).toHaveProperty('last_page');
    expect(body).toHaveProperty('total');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('GET /products paginates correctly across pages', async ({ request }) => {
    const page1 = await request.get(`${API_URL}/products?page=1`);
    const page2 = await request.get(`${API_URL}/products?page=2`);

    expect(page1.status()).toBe(200);
    expect(page2.status()).toBe(200);

    const body1 = await logAndParse(page1);
    const body2 = await logAndParse(page2);

    expect(body1.current_page).toBe(1);
    expect(body2.current_page).toBe(2);
    expect(body1.data.length).toBeGreaterThan(0);
    expect(body2.data.length).toBeGreaterThan(0);

    const ids1 = body1.data.map((p: any) => p.id);
    const ids2 = body2.data.map((p: any) => p.id);
    expect(ids1).not.toEqual(ids2);
  });

  test('GET /products/{id} returns single product', async ({ request }) => {
    const listResponse = await request.get(`${API_URL}/products`);
    const { data } = await logAndParse(listResponse);
    const productId = data[0].id;

    const response = await request.get(`${API_URL}/products/${productId}`);

    expect(response.status()).toBe(200);

    const product = await logAndParse(response);
    expect(product).toHaveProperty('id', productId);
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('in_stock');
    expect(product).toHaveProperty('category');
    expect(product).toHaveProperty('brand');
  });

  test('GET /products/invalid-id returns 404', async ({ request }) => {
    const response = await request.get(`${API_URL}/products/nonexistent-id`);

    await logAndParse(response);
    expect(response.status()).toBe(404);
  });

  test('GET /products?q=hammer filters by search term', async ({ request }) => {
    const response = await request.get(`${API_URL}/products?q=hammer`);

    expect(response.status()).toBe(200);

    const body = await logAndParse(response);
    expect(body.data.length).toBeGreaterThan(0);

    for (const product of body.data) {
      expect(product.name.toLowerCase()).toContain('hammer');
    }
  });

  test('GET /products?category_id filters by category', async ({ request }) => {
    const categoriesResponse = await request.get(`${API_URL}/categories`);
    const categories = await logAndParse(categoriesResponse);
    const category = categories.find((c: any) => c.name === 'Power Tools');

    const response = await request.get(`${API_URL}/products?category_id=${category.id}`);

    expect(response.status()).toBe(200);

    const body = await logAndParse(response);
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('POST /products creates a new product', async ({ request }) => {
    const categoriesResponse = await request.get(`${API_URL}/categories`);
    const categories = await logAndParse(categoriesResponse);
    const category = categories.find((c: any) => c.name === 'Power Tools');

    const brandsResponse = await request.get(`${API_URL}/brands`);
    const brands = await logAndParse(brandsResponse);
    const brand = brands[0];

    const imagesResponse = await request.get(`${API_URL}/images`);
    const images = await logAndParse(imagesResponse);
    const imageId = images[0].id;

    const uniqueId = Date.now();
    const response = await request.post(`${API_URL}/products`, {
      data: {
        name: `Test Product ${uniqueId}`,
        description: 'Test description',
        price: 19.99,
        category_id: category.id,
        brand_id: brand.id,
        product_image_id: imageId,
        is_location_offer: false,
        is_rental: false,
      }
    });

    expect(response.status()).toBe(201);

    const body = await logAndParse(response);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name', `Test Product ${uniqueId}`);
  });

  test('DELETE /products/{id} deletes product with admin auth', async ({ request }) => {
    const loginResponse = await request.post(`${API_URL}/users/login`, {
      data: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      }
    });
    const { access_token } = await logAndParse(loginResponse);

    const categoriesResponse = await request.get(`${API_URL}/categories`);
    const categories = await logAndParse(categoriesResponse);
    const category = categories.find((c: any) => c.name === 'Power Tools');

    const brandsResponse = await request.get(`${API_URL}/brands`);
    const brands = await logAndParse(brandsResponse);
    const brand = brands[0];

    const imagesResponse = await request.get(`${API_URL}/images`);
    const images = await logAndParse(imagesResponse);
    const imageId = images[0].id;

    const createResponse = await request.post(`${API_URL}/products`, {
      data: {
        name: `TempProduct ${Date.now()}`,
        description: 'Temp',
        price: 9.99,
        category_id: category.id,
        brand_id: brand.id,
        product_image_id: imageId,
        is_location_offer: false,
        is_rental: false,
      }
    });
    const { id: productId } = await logAndParse(createResponse);

    const deleteResponse = await request.delete(`${API_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    expect(deleteResponse.status()).toBe(204);
  });

});
