import { test as base } from '@playwright/test';
import { logAndParse } from '../utils/api-logger';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { NavPage } from '../pages/NavPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { BrandsPage } from '../pages/BrandsPage';
import { BrandDetailPage } from '../pages/BrandDetailPage';

type Fixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  registerPage: RegisterPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  navPage: NavPage;
  checkoutPage: CheckoutPage;
  brandsPage: BrandsPage;
  brandDetailPage: BrandDetailPage;
  createdBrand: { id: string; name: string; slug: string };
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },

  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },

  productDetailPage: async ({ page }, use) => {
    const productDetailPage = new ProductDetailPage(page);
    await use(productDetailPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  navPage: async ({ page }, use) => {
    const navPage = new NavPage(page);
    await use(navPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  brandsPage: async ({ page }, use) => {
    const brandsPage = new BrandsPage(page);
    await use(brandsPage);
  },

  brandDetailPage: async ({ page }, use) => {
    const brandDetailPage = new BrandDetailPage(page);
    await use(brandDetailPage);
  },

  createdBrand: async ({ request }, use) => {
    const API_URL = process.env.API_URL;

    const loginResponse = await request.post(`${API_URL}/users/login`, {
      data: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      },
    });
    const { access_token } = await logAndParse(loginResponse);

    const uniqueId = Date.now();
    const name = `Test Brand ${uniqueId}`;
    const slug = `test-brand-${uniqueId}`;

    const createResponse = await request.post(`${API_URL}/brands`, {
      data: { name, slug },
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const body = await logAndParse(createResponse);

    const brand = {
      id: String(body.id),
      name: body.name,
      slug: body.slug,
    };

    await use(brand);

    await request.delete(`${API_URL}/brands/${brand.id}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
  },
});

export { expect } from '@playwright/test';
