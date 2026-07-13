import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dobInput: Locator;
  readonly countrySelect: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.dobInput = page.locator('[data-test="dob"]');
    this.countrySelect = page.locator('[data-test="country"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
    this.streetInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.phoneInput = page.locator('[data-test="phone"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.registerButton = page.locator('[data-test="register-submit"]');
    this.errorMessage = page.locator('.alert-danger');
  }

  async navigate() {
    await this.page.goto('/auth/register');
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    dob: string;
    country: string;
    postalCode: string;
    houseNumber: string;
    street: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    password: string;
  }) {
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.dobInput.fill(userData.dob);
    await this.countrySelect.selectOption({ label: userData.country });
    await this.postalCodeInput.fill(userData.postalCode);
    await this.houseNumberInput.fill(userData.houseNumber);
    await this.streetInput.fill(userData.street);
    await this.cityInput.fill(userData.city);
    await this.stateInput.fill(userData.state);
    await this.phoneInput.fill(userData.phone);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.registerButton.click();
  }
}
