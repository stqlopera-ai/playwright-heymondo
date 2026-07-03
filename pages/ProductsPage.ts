import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    this.productNames = page.locator('[data-test="product-name"]');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async searchForProduct(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  async filterByCategory(categoryName: string) {
    const categoryCheckbox = this.page
      .locator('label')
      .filter({ hasText: categoryName })
      .locator('[data-test^="category-"]');
    await categoryCheckbox.check();
  }

  async getFirstProductName(): Promise<string> {
    return (await this.productNames.first().textContent()) ?? '';
  }
}
