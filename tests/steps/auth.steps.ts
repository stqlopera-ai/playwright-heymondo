import { Given, When, Then } from '@cucumber/cucumber';
import { expect, request as playwrightRequest } from '@playwright/test';
import { chromium } from 'playwright';
import { registerUser } from '../../utils/register-user';
import { bddState } from './support/state';

Given('I am on the login page', async function () {
  bddState.browser = await chromium.launch();
  bddState.page = await bddState.browser.newPage();
  await bddState.page.goto(`${process.env.BASE_URL || 'https://practicesoftwaretesting.com'}/auth/login`, { waitUntil: 'domcontentloaded' });
  await expect(bddState.page.locator('[data-test="email"]')).toBeVisible({ timeout: 15_000 });
});

When('I login with valid credentials', async function () {
  const api = await playwrightRequest.newContext();
  try {
    const { email, password } = await registerUser(api);
    await bddState.page!.fill('[data-test="email"]', email);
    await bddState.page!.fill('[data-test="password"]', password);
    await bddState.page!.click('[data-test="login-submit"]');
  } finally {
    await api.dispose();
  }
});

When('I login with invalid credentials', async function () {
  await bddState.page!.fill('[data-test="email"]', 'invalid@test.com');
  await bddState.page!.fill('[data-test="password"]', 'wrongpassword');
  await bddState.page!.click('[data-test="login-submit"]');
});

Then('I should be redirected to the account page', async function () {
  await expect(bddState.page!).toHaveURL(/\/account/, { timeout: 15_000 });
});

Then('I should see an error message', async function () {
  await expect(bddState.page!.locator('[data-test="login-error"], .alert-danger')).toBeVisible({ timeout: 15_000 });
});
