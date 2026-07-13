import { Page, Locator } from '@playwright/test';

export class NavPage {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly categoriesButton: Locator;
  readonly handToolsLink: Locator;
  readonly powerToolsLink: Locator;
  readonly otherLink: Locator;
  readonly specialToolsLink: Locator;
  readonly rentalsLink: Locator;
  readonly contactLink: Locator;
  readonly signInLink: Locator;
  readonly languageSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.locator('[data-test="nav-home"]');
    this.categoriesButton = page.locator('[data-test="nav-categories"]');
    this.handToolsLink = page.locator('[data-test="nav-hand-tools"]');
    this.powerToolsLink = page.locator('[data-test="nav-power-tools"]');
    this.otherLink = page.locator('[data-test="nav-other"]');
    this.specialToolsLink = page.locator('[data-test="nav-special-tools"]');
    this.rentalsLink = page.locator('[data-test="nav-rentals"]');
    this.contactLink = page.locator('[data-test="nav-contact"]');
    this.signInLink = page.locator('[data-test="nav-sign-in"]');
    this.languageSelect = page.locator('[data-test="language-select"]');
  }

  async navigateHome() {
    await this.homeLink.click();
  }

  async openCategories() {
    await this.categoriesButton.click();
  }

  async navigateToCategory(category: 'hand-tools' | 'power-tools' | 'other' | 'special-tools') {
    await this.openCategories();
    const link = this.page.locator(`[data-test="nav-${category}"]`);
    await link.click();
  }

  async navigateToContact() {
    await this.contactLink.click();
  }

  async navigateToSignIn() {
    await this.signInLink.click();
  }
}
