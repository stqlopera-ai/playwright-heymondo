import { test as setup, request, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const apiRequest = await request.newContext();
  const ts = Date.now();
  const email = `pwuser_${ts}@mailinator.com`;
  const password = `Pw${ts}!Aa`;

  // Register a fresh user for this run
  const registerResponse = await apiRequest.post(
    `${process.env.API_URL}/users/register`,
    {
      data: {
        first_name: 'PW',
        last_name: 'Test',
        email,
        password,
        phone: '0612345678',
      },
    }
  );
  expect(registerResponse.ok()).toBeTruthy();

  // Login with the new user
  const loginResponse = await apiRequest.post(
    `${process.env.API_URL}/users/login`,
    {
      data: { email, password },
    }
  );
  expect(loginResponse.ok()).toBeTruthy();

  const { access_token } = await loginResponse.json();

  await page.goto('/');
  await page.evaluate(token => {
    localStorage.setItem('auth_token', token);
  }, access_token);

  await page.context().storageState({ path: authFile });
  await apiRequest.dispose();
});
