import { expect, test as base } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { MensFashionPage } from '../pages/MensFashionPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

type TestFixtures = {
  cartPage: CartPage;
  dashboardPage: DashboardPage;
  loginPage: LoginPage;
  mensFashionPage: MensFashionPage;
  productDetailsPage: ProductDetailsPage;
};

export const test = base.extend<TestFixtures>({
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  mensFashionPage: async ({ page }, use) => {
    await use(new MensFashionPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
});

export { expect };
