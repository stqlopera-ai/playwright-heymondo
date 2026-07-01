import { test, expect } from '../../fixtures';


test.describe('Login', () => {

  test('login con credenciales válidas', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login(
  process.env.USER_EMAIL!,
  process.env.USER_PASSWORD!
);
    await expect(loginPage.page).toHaveURL('/account');
  });

  test('login con credenciales inválidas', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('wrong@test.com', 'wrongpass');
    await expect(loginPage.errorMessage).toBeVisible();
  });

});