import { test, expect } from '../../fixtures';

test.describe('Products', () => {

  test('displays products on page load', async ({ productsPage }) => {
    await productsPage.navigate();
    await expect(productsPage.productNames.first()).toBeVisible();
  });

  test('search for product by text', async ({ productsPage }) => {
    await productsPage.navigate();
    await productsPage.searchForProduct('Hammer');
    await expect(productsPage.productNames.first()).toContainText(/hammer/i);
  });

  test('filter by category', async ({ productsPage }) => {
    await productsPage.navigate();
    await productsPage.filterByCategory('Hammer');
    await expect(productsPage.productNames.first()).toBeVisible();
    await expect(productsPage.productNames.first()).toContainText(/hammer/i);
  });

});
