import { Page, Locator } from '@playwright/test';

export class BrandsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchQuery: Locator;
  readonly searchSubmit: Locator;
  readonly searchReset: Locator;
  readonly addBrandLink: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="page-title"]');
    this.searchQuery = page.locator('[data-test="brand-search-query"]');
    this.searchSubmit = page.locator('[data-test="brand-search-submit"]');
    this.searchReset = page.locator('[data-test="brand-search-reset"]');
    this.addBrandLink = page.locator('[data-test="brand-add"]');
    this.rows = page.locator('table tbody tr');
  }

  async navigate() {
    await this.page.goto('/admin/brands');
  }

  async searchForBrand(query: string) {
    await this.searchQuery.fill(query);
    await this.searchSubmit.click();
  }

  async resetSearch() {
    await this.searchReset.click();
  }

  brandRow(name: string): Locator {
    return this.rows.filter({ hasText: name });
  }
}
