import { test, expect } from '../../fixtures';

test.describe('Register', () => {

  test('valid registration redirects to login', async ({ registerPage }) => {
    await registerPage.navigate();
    const timestamp = Date.now();
    await registerPage.register({
      firstName: 'Test',
      lastName: 'User',
      dob: '1990-01-15',
      country: 'Netherlands (the)',
      postalCode: '1012',
      houseNumber: '42',
      street: 'Test Street',
      city: 'Amsterdam',
      state: 'Noord-Holland',
      phone: '0612345678',
      email: `testuser_${timestamp}@mailinator.com`,
      password: `Unique$ecure_${timestamp}!`,
    });
    await expect(registerPage.page).toHaveURL(/\/auth\/login/);
  });

  test('shows error for duplicate email', async ({ registerPage }) => {
    await registerPage.navigate();
    await registerPage.register({
      firstName: 'Test',
      lastName: 'Duplicate',
      dob: '1990-01-15',
      country: 'Netherlands (the)',
      postalCode: '1012',
      houseNumber: '42',
      street: 'Test Street',
      city: 'Amsterdam',
      state: 'Noord-Holland',
      phone: '0612345678',
      email: 'testuser_1783933754@mailinator.com',
      password: 'TestPass123!',
    });
    await expect(registerPage.errorMessage).toBeVisible();
  });

  test('registration form has all fields', async ({ registerPage }) => {
    await registerPage.navigate();
    await expect(registerPage.firstNameInput).toBeVisible();
    await expect(registerPage.lastNameInput).toBeVisible();
    await expect(registerPage.dobInput).toBeVisible();
    await expect(registerPage.countrySelect).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.registerButton).toBeVisible();
  });

});
