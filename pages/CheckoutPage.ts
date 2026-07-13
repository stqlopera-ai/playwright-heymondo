import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // Cart section
  readonly productTitle: Locator;
  readonly productQuantity: Locator;
  readonly productPrice: Locator;
  readonly linePrice: Locator;
  readonly cartTotal: Locator;
  readonly continueShoppingButton: Locator;
  readonly proceed1Button: Locator;

  // Login section
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmit: Locator;

  // Guest section
  readonly guestEmail: Locator;
  readonly guestFirstName: Locator;
  readonly guestLastName: Locator;
  readonly guestSubmit: Locator;

  // Address section
  readonly countrySelect: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly proceed3Button: Locator;

  // Payment section
  readonly paymentMethodSelect: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Cart
    this.productTitle = page.locator('[data-test="product-title"]');
    this.productQuantity = page.locator('[data-test="product-quantity"]');
    this.productPrice = page.locator('[data-test="product-price"]');
    this.linePrice = page.locator('[data-test="line-price"]');
    this.cartTotal = page.locator('[data-test="cart-total"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.proceed1Button = page.locator('[data-test="proceed-1"]');

    // Login
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginSubmit = page.locator('[data-test="login-submit"]');

    // Guest
    this.guestEmail = page.locator('[data-test="guest-email"]');
    this.guestFirstName = page.locator('[data-test="guest-first-name"]');
    this.guestLastName = page.locator('[data-test="guest-last-name"]');
    this.guestSubmit = page.locator('[data-test="guest-submit"]');

    // Address
    this.countrySelect = page.locator('[data-test="country"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
    this.streetInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.proceed3Button = page.locator('[data-test="proceed-3"]');

    // Payment
    this.paymentMethodSelect = page.locator('[data-test="payment-method"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  async navigate() {
    await this.page.goto('/checkout');
  }

  async proceedToCheckout() {
    // Try proceed-1 first (cart step), then fall back to any visible "Proceed" button
    if (await this.proceed1Button.isVisible().catch(() => false) && await this.proceed1Button.isEnabled()) {
      await this.proceed1Button.click();
    } else {
      // For logged-in users on step 2, find the visible proceed button
      await this.page.locator('button:has-text("Proceed to checkout"):visible').first().click();
    }
    await this.page.waitForTimeout(1500);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmit.click();
    await this.page.waitForTimeout(1000);
  }

  async fillAddress(data: {
    country: string;
    postalCode: string;
    houseNumber: string;
    street: string;
    city: string;
    state: string;
  }) {
    await this.countrySelect.selectOption({ label: data.country });
    await this.postalCodeInput.fill(data.postalCode);
    await this.houseNumberInput.fill(data.houseNumber);
    await this.streetInput.fill(data.street);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.page.waitForTimeout(500);
  }

  async proceedToPayment() {
    await this.proceed3Button.click();
    await this.page.waitForTimeout(1000);
  }

  async selectPaymentMethod(method: string) {
    await this.paymentMethodSelect.selectOption({ label: method });
    await this.page.waitForTimeout(500);
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async getCartTotal(): Promise<string> {
    return (await this.cartTotal.textContent()) ?? '';
  }
}
