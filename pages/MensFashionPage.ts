import { type Locator, type Page } from '@playwright/test';

type ProductType = 'formal' | 'footwear';
type PriceRange = '0-100' | '101-200' | '201-300' | '301-400' | '401-500';
type ProductSize = 's' | 'm' | 'l' | 'xl' | 'xxl';
type ProductColor = 'black' | 'white' | 'red' | 'blue' | 'green';
type SortOption = 'Price: Low to High' | 'Price: High to Low' | 'Name: A to Z' | 'Name: Z to A';

export class MensFashionPage {
  readonly page: Page;
  readonly header: Locator;
  readonly cartLink: Locator;
  readonly cartCount: Locator;
  readonly logoutButton: Locator;
  readonly goBackLink: Locator;
  readonly productList: Locator;
  readonly visibleProductCards: Locator;
  readonly visibleProductImages: Locator;
  readonly resultsCount: Locator;
  readonly searchInput: Locator;
  readonly sortSelect: Locator;
  readonly typeFilters: Record<ProductType, Locator>;
  readonly priceFilters: Record<PriceRange, Locator>;
  readonly sizeFilters: Record<ProductSize, Locator>;
  readonly colorFilters: Record<ProductColor, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId('site-header');
    this.cartLink = page.getByTestId('header-cart-link');
    this.cartCount = page.getByTestId('header-cart-count');
    this.logoutButton = page.getByTestId('header-logout-btn');
    this.goBackLink = page.getByTestId('go-back-btn');
    this.productList = page.getByTestId('product-list');
    this.visibleProductCards = this.productList.locator('[data-testid^="product-card-"]:visible');
    this.visibleProductImages = this.visibleProductCards.locator('img');
    this.resultsCount = page.getByTestId('results-count');
    this.searchInput = page.getByTestId('search-input');
    this.sortSelect = page.getByTestId('sort-select');
    this.typeFilters = {
      formal: page.getByTestId('filter-type-formal'),
      footwear: page.getByTestId('filter-type-footwear'),
    };
    this.priceFilters = {
      '0-100': page.getByTestId('filter-price-0-100'),
      '101-200': page.getByTestId('filter-price-101-200'),
      '201-300': page.getByTestId('filter-price-201-300'),
      '301-400': page.getByTestId('filter-price-301-400'),
      '401-500': page.getByTestId('filter-price-401-500'),
    };
    this.sizeFilters = {
      s: page.getByTestId('filter-size-s'),
      m: page.getByTestId('filter-size-m'),
      l: page.getByTestId('filter-size-l'),
      xl: page.getByTestId('filter-size-xl'),
      xxl: page.getByTestId('filter-size-xxl'),
    };
    this.colorFilters = {
      black: page.getByTestId('filter-color-black'),
      white: page.getByTestId('filter-color-white'),
      red: page.getByTestId('filter-color-red'),
      blue: page.getByTestId('filter-color-blue'),
      green: page.getByTestId('filter-color-green'),
    };
  }

  async goto(): Promise<void> {
    await this.page.goto('/mens-wear.php');
  }

  async goBackToDashboard(): Promise<void> {
    await this.goBackLink.click();
    await this.page.waitForURL('**/shop.php');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async setTypeFilter(type: ProductType, selected = true): Promise<void> {
    await this.setCheckbox(this.typeFilters[type], selected);
  }

  async setPriceFilter(range: PriceRange, selected = true): Promise<void> {
    await this.setCheckbox(this.priceFilters[range], selected);
  }

  async setSizeFilter(size: ProductSize, selected = true): Promise<void> {
    await this.setCheckbox(this.sizeFilters[size], selected);
  }

  async setColorFilter(color: ProductColor, selected = true): Promise<void> {
    await this.setCheckbox(this.colorFilters[color], selected);
  }

  async searchProducts(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async sortProducts(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption({ label: option });
  }

  async openProduct(productId: number): Promise<void> {
    await this.page.getByTestId(`product-name-${productId}`).click();
  }

  async addProductToCart(productId: number): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${productId}`).click();
  }

  getProductCard(productId: number): Locator {
    return this.page.getByTestId(`product-card-${productId}`);
  }

  getProductName(productId: number): Locator {
    return this.page.getByTestId(`product-name-${productId}`);
  }

  getProductPrice(productId: number): Locator {
    return this.page.getByTestId(`product-price-${productId}`);
  }

  private async setCheckbox(locator: Locator, selected: boolean): Promise<void> {
    if (await locator.isChecked() === selected) {
      return;
    }

    const id = await locator.getAttribute('id');
    if (!id) {
      throw new Error('A filter checkbox must have an id to locate its associated label.');
    }

    await this.page.locator(`label[for="${id}"]`).click();
  }
}
