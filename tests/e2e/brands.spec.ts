import { test, expect } from '../../fixtures';

test.describe('Brands', () => {

  test('created brand appears in brands list', async ({ loginPage, brandsPage, createdBrand }) => {
    await loginPage.navigate();
    await loginPage.login(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
    await expect(loginPage.page).toHaveURL(/\/admin/);

    await brandsPage.navigate();
    await expect(brandsPage.pageTitle).toHaveText('Brands');
    await expect(brandsPage.brandRow(createdBrand.name)).toBeVisible();
  });

  test('brand detail page shows created brand name', async ({ loginPage, brandDetailPage, createdBrand }) => {
    await loginPage.navigate();
    await loginPage.login(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
    await expect(loginPage.page).toHaveURL(/\/admin/);

    await brandDetailPage.navigate(createdBrand.id);
    await expect(brandDetailPage.nameInput).toHaveValue(createdBrand.name);
  });

});
