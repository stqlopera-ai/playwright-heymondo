import { test, expect } from '../../fixtures';

test.describe('Product Detail', () => {

  test('displays product information', async ({ productDetailPage }) => {
    await productDetailPage.navigateToFirstProduct();
    await expect(productDetailPage.productName).toBeVisible();
    await expect(productDetailPage.unitPrice).toBeVisible();
    await expect(productDetailPage.description).toBeVisible();
  });

  test('displays price in correct format', async ({ productDetailPage }) => {
    await productDetailPage.navigateToFirstProduct();
    const price = await productDetailPage.getPrice();
    expect(price).toMatch(/^\d+\.\d{2}$/);
  });

  test('displays product specifications', async ({ productDetailPage }) => {
    await productDetailPage.navigateToFirstProduct();
    await expect(productDetailPage.specsTitle).toBeVisible();
    const specCount = await productDetailPage.getSpecCount();
    expect(specCount).toBeGreaterThan(0);
  });

  test('add to cart button is visible', async ({ productDetailPage }) => {
    await productDetailPage.navigateToFirstProduct();
    await expect(productDetailPage.addToCartButton).toBeVisible();
  });

  test('quantity buttons work for in-stock product', async ({ productDetailPage, request }) => {
    const productId = await findInStockProduct(request);
    await productDetailPage.navigateToProductById(productId);
    await expect(productDetailPage.addToCartButton).toBeEnabled();
    const initialQty = await productDetailPage.quantityInput.inputValue();
    await productDetailPage.increaseQuantityBy(2);
    const newQty = await productDetailPage.quantityInput.inputValue();
    expect(Number(newQty)).toBe(Number(initialQty) + 2);
  });

  test('out-of-stock product shows disabled buttons', async ({ productDetailPage, request }) => {
    const productId = await findOutOfStockProduct(request);
    test.skip(!productId, 'No out-of-stock product found');
    await productDetailPage.navigateToProductById(productId);
    await expect(productDetailPage.outOfStock).toBeVisible();
    await expect(productDetailPage.addToCartButton).toBeDisabled();
  });

  test('product name matches homepage', async ({ productDetailPage, productsPage }) => {
    await productsPage.navigate();
    const firstName = await productsPage.getFirstProductName();
    await productDetailPage.navigateToFirstProduct();
    const detailName = await productDetailPage.getName();
    expect(detailName).toBe(firstName);
  });

});

const API_URL = process.env.API_URL;

async function findInStockProduct(request: any): Promise<string> {
  const res = await request.get(`${API_URL}/products`);
  const { data } = await res.json();
  return data.find((p: any) => p.in_stock).id;
}

async function findOutOfStockProduct(request: any): Promise<string> {
  const res = await request.get(`${API_URL}/products`);
  const { data } = await res.json();
  const oos = data.find((p: any) => !p.in_stock);
  return oos ? oos.id : '';
}
