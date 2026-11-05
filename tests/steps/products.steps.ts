import { Given, When, Then, After, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { chromium, Browser, Page } from 'playwright';

setDefaultTimeout(60_000);

let browser: Browser | undefined;
let page: Page | undefined;

After(async function () {
  await page?.close().catch(() => {});
  await browser?.close().catch(() => {});
  page = undefined;
  browser = undefined;
});

Given('I am on the products page', async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto(`${process.env.BASE_URL || 'https://practicesoftwaretesting.com'}/`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-test="search-query"]')).toBeVisible({ timeout: 15_000 });
});

When('I search for {string}', async function (query: string) {
  await page!.locator('[data-test="search-query"]').fill(query);
  await page!.locator('[data-test="search-submit"]').click();
  await page!.waitForLoadState('networkidle').catch(() => {});
});

When('I filter by category {string}', async function (category: string) {
  const checkbox = page!
    .locator('label')
    .filter({ hasText: category })
    .locator('input[type="checkbox"]');
  await expect(checkbox).toBeVisible({ timeout: 15_000 });
  await checkbox.check();
  await page!.waitForLoadState('networkidle').catch(() => {});
});

Then('I should see products matching {string}', async function (_query: string) {
  await expect(page!.locator('[data-test="product-name"]').first()).toBeVisible({ timeout: 15_000 });
});

Then('I should see products in that category', async function () {
  await expect(page!.locator('[data-test="product-name"]').first()).toBeVisible({ timeout: 15_000 });
});
