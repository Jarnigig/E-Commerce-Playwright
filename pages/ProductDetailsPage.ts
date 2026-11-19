import { type Locator, type Page } from '@playwright/test';

export class ProductDetailsPage {
  readonly page: Page;
  readonly header: Locator;
  readonly cartLink: Locator;
  readonly cartCount: Locator;
  readonly productDetails: Locator;
  readonly productImage: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly goBackLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId('site-header');
    this.cartLink = page.getByTestId('header-cart-link');
    this.cartCount = page.getByTestId('header-cart-count');
    this.productDetails = page.getByTestId('product-detail');
    this.productImage = page.getByTestId('product-detail-image');
    this.productName = page.getByTestId('product-detail-name');
    this.productPrice = page.getByTestId('product-detail-price');
    this.goBackLink = page.getByTestId('go-back-btn');
  }

  async goto(productId: number): Promise<void> {
    await this.page.goto(`/product.php?id=${productId}`);
  }

  async addToCart(productId: number): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${productId}`).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
