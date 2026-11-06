import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { chromium } from 'playwright';
import { bddState } from './support/state';

Given('I am on a product detail page', async function () {
  bddState.browser = await chromium.launch();
  bddState.page = await bddState.browser.newPage();
  await bddState.page.goto(process.env.BASE_URL || 'https://practicesoftwaretesting.com', { waitUntil: 'domcontentloaded' });
  await expect(bddState.page.locator('[data-test="product-name"]').first()).toBeVisible({ timeout: 15_000 });
  await bddState.page.locator('[data-test="product-name"]').first().click();
  await expect(bddState.page.locator('[data-test="add-to-cart"]')).toBeVisible({ timeout: 15_000 });
});

When('I add the product to cart', async function () {
  await bddState.page!.locator('[data-test="add-to-cart"]').click();
});

Then('the cart should be updated', async function () {
  await expect(bddState.page!.locator('[data-test="cart-quantity"], [data-test="nav-cart"]').first()).toBeVisible({ timeout: 15_000 });
});

Given('I have added a product to cart', async function () {
  bddState.browser = await chromium.launch();
  bddState.page = await bddState.browser.newPage();
  await bddState.page.goto(process.env.BASE_URL || 'https://practicesoftwaretesting.com', { waitUntil: 'domcontentloaded' });
  await expect(bddState.page.locator('[data-test="product-name"]').first()).toBeVisible({ timeout: 15_000 });
  await bddState.page.locator('[data-test="product-name"]').first().click();
  await expect(bddState.page.locator('[data-test="add-to-cart"]')).toBeVisible({ timeout: 15_000 });
  await bddState.page.locator('[data-test="add-to-cart"]').click();
});

When('I view the cart', async function () {
  await bddState.page!.locator('[data-test="nav-cart"]').click();
  await bddState.page!.waitForURL(/\/checkout|\/cart/, { timeout: 15_000 }).catch(() => {});
});

Then('I should see the product in the cart', async function () {
  await expect(bddState.page!.locator('[data-test="product-title"], .product-title, tbody tr').first()).toBeVisible({ timeout: 15_000 });
});
