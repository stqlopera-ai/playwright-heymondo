import { test, expect } from '../../fixtures';

const API_URL = process.env.API_URL;

async function findInStockProduct(request: any): Promise<string> {
  const res = await request.get(`${API_URL}/products`);
  const { data } = await res.json();
  return data.find((p: any) => p.in_stock).id;
}

test.describe('Cart', () => {

  test('add product to cart from detail page', async ({ productDetailPage, request }) => {
    const productId = await findInStockProduct(request);
    await productDetailPage.navigateToProductById(productId);
    await expect(productDetailPage.addToCartButton).toBeEnabled();
    await productDetailPage.addToCart();
    await expect(productDetailPage.page).toHaveURL(new RegExp(`/product/${productId}`));
  });

  test.describe('unauthenticated', () => {
    test.use({ storageState: { cookies: [], origins: [] } });
    test('cart redirects to home without authentication', async ({ cartPage }) => {
      await cartPage.page.goto('/cart');

      await expect(cartPage.page).toHaveURL('/');
    });
  });

});
