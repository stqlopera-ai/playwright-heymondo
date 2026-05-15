import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login', () => {

  test('login con credenciales válidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      process.env.USER_EMAIL!,
      process.env.USER_PASSWORD!
    );
    await expect(page).toHaveURL('/account');
  });

  test('login con credenciales inválidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('wrong@test.com', 'wrongpass');
    await expect(loginPage.errorMessage).toBeVisible();
  });

});