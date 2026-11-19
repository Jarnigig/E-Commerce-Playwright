import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly header: Locator;
  readonly cartCount: Locator;
  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly emptyMessage: Locator;
  readonly cartTotal: Locator;
  readonly proceedToCheckoutLink: Locator;
  readonly startShoppingLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId('site-header');
    this.cartCount = page.getByTestId('header-cart-count');
    this.cartTable = page.getByTestId('cart-table');
    this.cartRows = this.page.locator('[data-testid^="cart-row-"]');
    this.emptyMessage = page.getByTestId('cart-empty-message');
    this.cartTotal = page.getByTestId('cart-total');
    this.proceedToCheckoutLink = page.getByTestId('proceed-to-checkout-btn');
    this.startShoppingLink = page.getByTestId('start-shopping-btn');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart.php');
  }

  async updateQuantity(productId: number, quantity: number): Promise<void> {
    const quantityInput = this.getItemQuantity(productId);
    await quantityInput.fill(String(quantity));
    await quantityInput.press('Tab');
  }

  async removeItem(productId: number): Promise<void> {
    await this.getRemoveButton(productId).click();
  }

  getItemRow(productId: number): Locator {
    return this.page.getByTestId(`cart-row-${productId}`);
  }

  getItemName(productId: number): Locator {
    return this.page.getByTestId(`cart-item-name-${productId}`);
  }

  getItemPrice(productId: number): Locator {
    return this.page.getByTestId(`cart-item-price-${productId}`);
  }

  getItemQuantity(productId: number): Locator {
    return this.page.getByTestId(`cart-qty-${productId}`);
  }

  getItemTotal(productId: number): Locator {
    return this.page.getByTestId(`cart-item-total-${productId}`);
  }

  getRemoveButton(productId: number): Locator {
    return this.page.getByTestId(`cart-remove-${productId}`);
  }
}
