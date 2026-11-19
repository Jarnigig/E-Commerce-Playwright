import { type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly header: Locator;
  readonly menuToggleButton: Locator;
  readonly logoLink: Locator;
  readonly homeLink: Locator;
  readonly shopLink: Locator;
  readonly cartLink: Locator;
  readonly cartCount: Locator;
  readonly logoutButton: Locator;
  readonly searchInput: Locator;
  readonly mensFashionCard: Locator;
  readonly mensFashionTitle: Locator;
  readonly mensFashionShopNow: Locator;
  readonly womensFashionCard: Locator;
  readonly womensFashionTitle: Locator;
  readonly womensFashionShopNow: Locator;
  readonly kidsFashionCard: Locator;
  readonly kidsFashionTitle: Locator;
  readonly kidsFashionShopNow: Locator;
  readonly electronicsCard: Locator;
  readonly electronicsTitle: Locator;
  readonly electronicsShopNow: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId('site-header');
    this.menuToggleButton = page.getByRole('button', { name: 'Toggle navigation' });
    this.logoLink = page.getByTestId('header-logo-link');
    this.homeLink = page.getByTestId('nav-home');
    this.shopLink = page.getByTestId('nav-shop');
    this.cartLink = page.getByTestId('header-cart-link');
    this.cartCount = page.getByTestId('header-cart-count');
    this.logoutButton = page.getByTestId('header-logout-btn');
    this.searchInput = page.getByTestId('header-search');
    this.mensFashionCard = page.getByTestId('category-card-men');
    this.mensFashionTitle = page.getByTestId('category-title-men');
    this.mensFashionShopNow = page.getByTestId('shop-now-mens-wear');
    this.womensFashionCard = page.getByTestId('category-card-women');
    this.womensFashionTitle = page.getByTestId('category-title-women');
    this.womensFashionShopNow = page.getByTestId('shop-now-womens-wear');
    this.kidsFashionCard = page.getByTestId('category-card-kids');
    this.kidsFashionTitle = page.getByTestId('category-title-kids');
    this.kidsFashionShopNow = page.getByTestId('shop-now-kids-wear');
    this.electronicsCard = page.getByTestId('category-card-electronics');
    this.electronicsTitle = page.getByTestId('category-title-electronics');
    this.electronicsShopNow = page.getByTestId('shop-now-electronics');
  }

  async goto(): Promise<void> {
    await this.page.goto('/shop.php');
  }

  async openMensFashion(): Promise<void> {
    await this.mensFashionShopNow.click();
    await this.page.waitForURL('**/mens-wear.php');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async toggleNavigation(): Promise<void> {
    await this.menuToggleButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
