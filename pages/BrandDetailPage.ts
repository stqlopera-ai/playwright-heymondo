import { Page, Locator } from '@playwright/test';

export class BrandDetailPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly slugInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('[data-test="name"]');
    this.slugInput = page.locator('[data-test="slug"]');
  }

  async navigate(id: string) {
    await this.page.goto(`/admin/brands/edit/${id}`);
    await this.page.waitForLoadState('networkidle');
  }

  async getName(): Promise<string> {
    return await this.nameInput.inputValue();
  }

  async getSlug(): Promise<string> {
    return await this.slugInput.inputValue();
  }
}
