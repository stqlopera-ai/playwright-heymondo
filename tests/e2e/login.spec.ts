import { test, expect } from '../../fixtures';
import { registerUser } from '../../utils/register-user';

test.describe('Login', () => {

  test('login with valid credentials', async ({ loginPage, request }) => {
    const { email, password } = await registerUser(request);
    await loginPage.navigate();
    await loginPage.login(email, password);
    await expect(loginPage.page).toHaveURL('/account');
  });

  test('login with invalid credentials shows error', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('wrong@test.com', 'wrongpass');
    await expect(loginPage.errorMessage).toBeVisible();
  });

});
