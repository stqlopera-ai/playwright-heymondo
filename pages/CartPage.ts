import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('[data-test^="cart-item"]');
    this.emptyCartMessage = page.locator('[data-test="empty-cart"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async navigate() {
    await this.page.goto('/cart');
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async isEmpty(): Promise<boolean> {
    return (await this.cartItems.count()) === 0;
  }
}
