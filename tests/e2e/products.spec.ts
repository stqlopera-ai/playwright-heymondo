import { test, expect } from '../../fixtures';

test.describe('Products', () => {

  test('muestra productos al cargar la página', async ({ productsPage }) => {
    await productsPage.navigate();
    await expect(productsPage.productNames.first()).toBeVisible();
  });

  test('buscar producto por texto', async ({ productsPage }) => {
    await productsPage.navigate();
    await productsPage.searchForProduct('Hammer');
    await expect(productsPage.productNames.first()).toContainText(/hammer/i);
  });

  test('filtrar por categoría', async ({ productsPage }) => {
    await productsPage.navigate();
    await productsPage.filterByCategory('Hammer');
    await expect(productsPage.productNames.first()).toBeVisible();
    await expect(productsPage.productNames.first()).toContainText(/hammer/i);
  });

});
