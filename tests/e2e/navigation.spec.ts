import { test, expect } from '../../fixtures';

test.describe('Navigation', () => {

  test('navigate to home from logo', async ({ navPage }) => {
    await navPage.page.goto('/auth/login');
    await navPage.navigateHome();
    await expect(navPage.page).toHaveURL('/');
  });

  test('navigate to contact', async ({ navPage }) => {
    await navPage.page.goto('/');
    await navPage.navigateToContact();
    await expect(navPage.page).toHaveURL(/\/contact/);
  });

  test('navigate to hand tools', async ({ navPage }) => {
    await navPage.page.goto('/');
    await navPage.navigateToCategory('hand-tools');
    await expect(navPage.page).toHaveURL(/\/category\/hand-tools/);
  });

  test('navigate to power tools', async ({ navPage }) => {
    await navPage.page.goto('/');
    await navPage.navigateToCategory('power-tools');
    await expect(navPage.page).toHaveURL(/\/category\/power-tools/);
  });

  test('navigate to login', async ({ navPage }) => {
    await navPage.page.goto('/');
    await navPage.navigateToSignIn();
    await expect(navPage.page).toHaveURL(/\/auth\/login/);
  });

  test('switch language to Spanish', async ({ navPage }) => {
    await navPage.page.goto('/');
    await navPage.languageSelect.click();
    await navPage.page.locator('[data-test="lang-es"]').click();
    await expect(navPage.page.locator('[data-test="language-select"]')).toContainText('ES');
  });

  test('categories dropdown shows options', async ({ navPage }) => {
    await navPage.page.goto('/');
    await navPage.openCategories();
    await expect(navPage.handToolsLink).toBeVisible();
    await expect(navPage.powerToolsLink).toBeVisible();
    await expect(navPage.otherLink).toBeVisible();
  });

});
