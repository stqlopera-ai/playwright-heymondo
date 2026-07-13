import { test, expect } from '../../fixtures';
import { registerUser } from '../../utils/register-user';

const API_URL = process.env.API_URL;

async function findInStockProduct(request: any): Promise<{ id: string; name: string; price: string }> {
  const res = await request.get(`${API_URL}/products`);
  const { data } = await res.json();
  const product = data.find((p: any) => p.in_stock);
  return { id: product.id, name: product.name, price: `$${product.price}` };
}

test.describe('Full E2E Journey', () => {

  test('register, login, browse, add to cart, and checkout', async ({
    page, request, loginPage, productDetailPage, checkoutPage,
  }) => {
    // Step 1: Register a new user via API
    const { email, password } = await registerUser(request);

    // Step 2: Login via UI
    await loginPage.navigate();
    await loginPage.login(email, password);
    await expect(loginPage.page).toHaveURL('/account');

    // Step 3: Find an in-stock product and navigate to it
    const product = await findInStockProduct(request);
    await productDetailPage.navigateToProductById(product.id);
    await expect(productDetailPage.productName).toContainText(product.name);
    await expect(productDetailPage.addToCartButton).toBeEnabled();

    // Step 4: Add to cart
    await productDetailPage.addToCart();
    await page.waitForTimeout(1000);

    // Step 5: Go to checkout via cart nav icon
    await page.locator('[data-test="nav-cart"]').click();
    await page.waitForURL(/\/checkout/);

    // Step 6: Verify product in cart
    await expect(checkoutPage.productTitle).toContainText(product.name);
    const total = await checkoutPage.getCartTotal();
    expect(total).toContain('$');

    // Step 7: Proceed to checkout (step 1 → step 2)
    await checkoutPage.proceedToCheckout();
    await page.waitForTimeout(1000);

    // Step 8: Already logged in, proceed to billing (step 2 → step 3)
    await checkoutPage.proceedToCheckout();
    await page.waitForTimeout(1000);

    // Step 9: Fill address (Netherlands auto-fills)
    await checkoutPage.fillAddress({
      country: 'Netherlands (the)',
      postalCode: '1012',
      houseNumber: '42',
      street: 'Test Street',
      city: 'Amsterdam',
      state: 'Noord-Holland',
    });

    // Step 9: Proceed to payment
    await expect(checkoutPage.proceed3Button).toBeEnabled();
    await checkoutPage.proceedToPayment();

    // Step 10: Select payment method and confirm
    await checkoutPage.selectPaymentMethod('Cash on Delivery');
    await expect(checkoutPage.finishButton).toBeEnabled();
    await checkoutPage.finishOrder();

    // Verify order was placed (payment step completed)
    await expect(page.locator('text=Payment was successful')).toBeVisible({ timeout: 5000 });
  });

});
