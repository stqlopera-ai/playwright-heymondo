import { Given, When, Then, After, setDefaultTimeout } from '@cucumber/cucumber';
import { expect, request as playwrightRequest } from '@playwright/test';
import { chromium, Browser, Page } from 'playwright';
import { registerUser } from '../../utils/register-user';

setDefaultTimeout(60_000);

let browser: Browser | undefined;
let page: Page | undefined;

After(async function () {
  await page?.close().catch(() => {});
  await browser?.close().catch(() => {});
  page = undefined;
  browser = undefined;
});

Given('I am on the login page', async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto(`${process.env.BASE_URL || 'https://practicesoftwaretesting.com'}/auth/login`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-test="email"]')).toBeVisible({ timeout: 15_000 });
});

When('I login with valid credentials', async function () {
  const api = await playwrightRequest.newContext();
  try {
    const { email, password } = await registerUser(api);
    await page!.fill('[data-test="email"]', email);
    await page!.fill('[data-test="password"]', password);
    await page!.click('[data-test="login-submit"]');
  } finally {
    await api.dispose();
  }
});

When('I login with invalid credentials', async function () {
  await page!.fill('[data-test="email"]', 'invalid@test.com');
  await page!.fill('[data-test="password"]', 'wrongpassword');
  await page!.click('[data-test="login-submit"]');
});

Then('I should be redirected to the account page', async function () {
  await expect(page!).toHaveURL(/\/account/, { timeout: 15_000 });
});

Then('I should see an error message', async function () {
  await expect(page!.locator('[data-test="login-error"], .alert-danger')).toBeVisible({ timeout: 15_000 });
});
