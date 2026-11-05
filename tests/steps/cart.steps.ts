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

Given('I am on a product detail page', async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto(process.env.BASE_URL || 'https://practicesoftwaretesting.com', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-test="product-name"]').first()).toBeVisible({ timeout: 15_000 });
  await page.locator('[data-test="product-name"]').first().click();
  await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible({ timeout: 15_000 });
});

When('I add the product to cart', async function () {
  await page!.locator('[data-test="add-to-cart"]').click();
});

Then('the cart should be updated', async function () {
  await expect(page!.locator('[data-test="cart-quantity"], [data-test="nav-cart"]').first()).toBeVisible({ timeout: 15_000 });
});

Given('I have added a product to cart', async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto(process.env.BASE_URL || 'https://practicesoftwaretesting.com', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-test="product-name"]').first()).toBeVisible({ timeout: 15_000 });
  await page.locator('[data-test="product-name"]').first().click();
  await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible({ timeout: 15_000 });
  await page.locator('[data-test="add-to-cart"]').click();
});

When('I view the cart', async function () {
  await page!.locator('[data-test="nav-cart"]').click();
  await page!.waitForURL(/\/checkout|\/cart/, { timeout: 15_000 }).catch(() => {});
});

Then('I should see the product in the cart', async function () {
  await expect(page!.locator('[data-test="product-title"], .product-title, tbody tr').first()).toBeVisible({ timeout: 15_000 });
});
