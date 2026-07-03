import { test as setup, request, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const apiRequest = await request.newContext();

  const response = await apiRequest.post(
    `${process.env.API_URL}/users/login`,
    {
      data: {
        email: process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD,
      },
    }
  );

  expect(response.ok()).toBeTruthy();

  const { access_token } = await response.json();

  await page.goto('/');
  await page.evaluate(token => {
    localStorage.setItem('auth_token', token);
  }, access_token);

  await page.context().storageState({ path: authFile });
  await apiRequest.dispose();
});