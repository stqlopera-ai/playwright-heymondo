import { Page, Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly unitPrice: Locator;
  readonly description: Locator;
  readonly quantityInput: Locator;
  readonly decreaseQuantity: Locator;
  readonly increaseQuantity: Locator;
  readonly addToCartButton: Locator;
  readonly addToFavoritesButton: Locator;
  readonly addToCompareButton: Locator;
  readonly outOfStock: Locator;
  readonly specsTitle: Locator;
  readonly specRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('[data-test="product-name"]');
    this.unitPrice = page.locator('[data-test="unit-price"]');
    this.description = page.locator('[data-test="product-description"]');
    this.quantityInput = page.locator('[data-test="quantity"]');
    this.decreaseQuantity = page.locator('[data-test="decrease-quantity"]');
    this.increaseQuantity = page.locator('[data-test="increase-quantity"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.addToFavoritesButton = page.locator('[data-test="add-to-favorites"]');
    this.addToCompareButton = page.locator('[data-test="add-to-compare"]');
    this.outOfStock = page.locator('[data-test="out-of-stock"]');
    this.specsTitle = page.locator('[data-test="specs-title"]');
    this.specRows = page.locator('[data-test="spec-row"]');
  }

  async navigateToFirstProduct() {
    await this.page.goto('/');
    await this.page.locator('[data-test="product-name"]').first().click();
    await this.page.waitForURL(/\/product\//);
  }

  async navigateToInStockProduct() {
    await this.page.goto('/');
    const productLinks = this.page.locator('a[href*="/product/"]');
    const count = await productLinks.count();
    for (let i = 0; i < count; i++) {
      await productLinks.nth(i).click();
      await this.page.waitForURL(/\/product\//);
      if (await this.isInStock()) return;
      await this.page.goBack();
      await this.page.waitForSelector('a[href*="/product/"]');
    }
  }

  async navigateToProductById(id: string) {
    await this.page.goto(`/product/${id}`);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.fill(String(quantity));
  }

  async increaseQuantityBy(amount: number) {
    for (let i = 0; i < amount; i++) {
      await this.increaseQuantity.click();
    }
  }

  async getPrice(): Promise<string> {
    return (await this.unitPrice.textContent()) ?? '';
  }

  async getName(): Promise<string> {
    return (await this.productName.textContent()) ?? '';
  }

  async isInStock(): Promise<boolean> {
    return (await this.outOfStock.count()) === 0;
  }

  async getSpecCount(): Promise<number> {
    return await this.specRows.count();
  }
}
