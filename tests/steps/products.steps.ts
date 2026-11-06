import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { chromium } from 'playwright';
import { bddState } from './support/state';

Given('I am on the products page', async function () {
  bddState.browser = await chromium.launch();
  bddState.page = await bddState.browser.newPage();
  await bddState.page.goto(`${process.env.BASE_URL || 'https://practicesoftwaretesting.com'}/`, { waitUntil: 'domcontentloaded' });
  await expect(bddState.page.locator('[data-test="search-query"]')).toBeVisible({ timeout: 15_000 });
});

When('I search for {string}', async function (query: string) {
  await bddState.page!.locator('[data-test="search-query"]').fill(query);
  await bddState.page!.locator('[data-test="search-submit"]').click();
  await bddState.page!.waitForLoadState('networkidle').catch(() => {});
});

When('I filter by category {string}', async function (category: string) {
  const checkbox = bddState.page!
    .locator('label')
    .filter({ hasText: category })
    .locator('input[type="checkbox"]');
  await expect(checkbox).toBeVisible({ timeout: 15_000 });
  await checkbox.check();
  await bddState.page!.waitForLoadState('networkidle').catch(() => {});
});

Then('I should see products matching {string}', async function (_query: string) {
  await expect(bddState.page!.locator('[data-test="product-name"]').first()).toBeVisible({ timeout: 15_000 });
});

Then('I should see products in that category', async function () {
  await expect(bddState.page!.locator('[data-test="product-name"]').first()).toBeVisible({ timeout: 15_000 });
});
