import { expect, test } from '../fixtures/baseFixture';

test.describe('dashboard', () => {
  test('opens the men fashion catalog and filters footwear', async ({ dashboardPage, mensFashionPage }) => {
    await dashboardPage.goto();
    await dashboardPage.openMensFashion();

    await expect(mensFashionPage.productList).toBeVisible();
    await expect(mensFashionPage.resultsCount).toHaveText('20 products');

    await mensFashionPage.setTypeFilter('footwear');
    await expect(mensFashionPage.typeFilters.footwear).toBeChecked();
  });
});

test.describe('add to cart', () => {
  test.beforeEach(async ({ cartPage }) => {
    await cartPage.goto();
    await expect(cartPage.emptyMessage).toBeVisible();
  });

  test('adds a product from its details page', async ({ cartPage, productDetailsPage }) => {
    await productDetailsPage.goto(21);
    await expect(productDetailsPage.productName).toHaveText('Black T-Shirt');
    await expect(productDetailsPage.productPrice).toHaveText('$150');

    await productDetailsPage.addToCart(21);
    await expect(productDetailsPage.cartCount).toHaveText('1');

    await cartPage.goto();
    await expect(cartPage.getItemRow(21)).toBeVisible();
    await expect(cartPage.getItemName(21)).toContainText('Black T-Shirt');
    await expect(cartPage.getItemPrice(21)).toHaveText('$150');
    await expect(cartPage.getItemQuantity(21)).toHaveValue('1');
    await expect(cartPage.getItemTotal(21)).toHaveText('$150');
    await expect(cartPage.cartTotal).toHaveText('Total: $150');
  });

  test('does not add duplicate items when Add to Cart is double-clicked', async ({ cartPage, mensFashionPage }) => {
    await mensFashionPage.goto();
    await mensFashionPage.page.getByTestId('add-to-cart-21').dblclick();

    await expect(mensFashionPage.cartCount).toHaveText('1');

    await cartPage.goto();
    await expect(cartPage.cartRows).toHaveCount(1);
    await expect(cartPage.getItemQuantity(21)).toHaveValue('2');
  });

  test('adds multiple products from the category listing', async ({ cartPage, mensFashionPage }) => {
    await mensFashionPage.goto();
    await mensFashionPage.addProductToCart(21);
    await expect(mensFashionPage.cartCount).toHaveText('1');
    await mensFashionPage.addProductToCart(22);
    await expect(mensFashionPage.cartCount).toHaveText('2');

    await cartPage.goto();
    await expect(cartPage.cartRows).toHaveCount(2);
    await expect(cartPage.getItemName(21)).toContainText('Black T-Shirt');
    await expect(cartPage.getItemName(22)).toContainText('White T-Shirt');
    await expect(cartPage.cartTotal).toHaveText('Total: $650');
  });

  test('Preserves cart items and quantities after logout and re-login', async ({
    cartPage,
    dashboardPage,
    loginPage,
    mensFashionPage,
  }) => {
    await mensFashionPage.goto();
    await mensFashionPage.addProductToCart(21);
    await mensFashionPage.addProductToCart(22);
    await expect(mensFashionPage.cartCount).toHaveText('2');

    await dashboardPage.logout();
    await loginPage.login('demo@demo.com', 'demo');

    await cartPage.goto();
    await expect(cartPage.cartCount).toHaveText('2');
    await expect(cartPage.cartRows).toHaveCount(2);
    await expect(cartPage.getItemName(21)).toContainText('Black T-Shirt');
    await expect(cartPage.getItemQuantity(21)).toHaveValue('1');
    await expect(cartPage.getItemName(22)).toContainText('White T-Shirt');
    await expect(cartPage.getItemQuantity(22)).toHaveValue('1');
  });

  test('adds a product from filtered search results', async ({ cartPage, mensFashionPage }) => {
    await mensFashionPage.goto();
    await mensFashionPage.searchProducts('Black T-Shirt');
    await mensFashionPage.addProductToCart(21);

    await cartPage.goto();
    await expect(cartPage.cartRows).toHaveCount(1);
    await expect(cartPage.getItemName(21)).toContainText('Black T-Shirt');
  });

  test('updates quantity and removes a product from the cart', async ({ cartPage, mensFashionPage }) => {
    await mensFashionPage.goto();
    await mensFashionPage.addProductToCart(21);

    await cartPage.goto();
    await cartPage.updateQuantity(21, 2);
    await expect(cartPage.getItemQuantity(21)).toHaveValue('2');
    await expect(cartPage.getItemTotal(21)).toHaveText('$300');
    await expect(cartPage.cartTotal).toHaveText('Total: $300');

    await cartPage.removeItem(21);
    await expect(cartPage.emptyMessage).toBeVisible();
    await expect(cartPage.cartCount).toHaveText('0');
    await expect(cartPage.cartTotal).toHaveText('Total: $0');
  });
});

test.describe('catalog search', () => {
  test.beforeEach(async ({ mensFashionPage }) => {
    await mensFashionPage.goto();
  });

  test('shows an enabled search field and returns matching products', async ({ mensFashionPage }) => {
    await expect(mensFashionPage.searchInput).toBeVisible();
    await expect(mensFashionPage.searchInput).toBeEnabled();

    await mensFashionPage.searchProducts('Black T-Shirt');

    await expect(mensFashionPage.resultsCount).toHaveText('1 product');
    await expect(mensFashionPage.getProductName(21)).toBeVisible();
    await expect(mensFashionPage.getProductPrice(21)).toHaveText('$150');
    await expect(mensFashionPage.visibleProductImages).toHaveCount(1);
    await expect(mensFashionPage.visibleProductImages.first()).toBeVisible();
  });

  test('searches case-insensitively and ignores surrounding whitespace', async ({ mensFashionPage }) => {
    await mensFashionPage.searchProducts('black t-shirt');
    await expect(mensFashionPage.resultsCount).toHaveText('1 product');

    await mensFashionPage.searchProducts('   Black T-Shirt   ');
    await expect(mensFashionPage.resultsCount).toHaveText('1 product');
    await expect(mensFashionPage.getProductName(21)).toBeVisible();
  });

  test('handles empty, unmatched, and unusual queries safely', async ({ mensFashionPage }) => {
    for (const query of [
      'xyz_nonexistent_product_987',
      '@#$%',
      '123456',
      '18/11/2026',
      'x'.repeat(300),
    ]) {
      await mensFashionPage.searchProducts(query);
      await expect(mensFashionPage.resultsCount).toHaveText('0 products');
      await expect(mensFashionPage.visibleProductCards).toHaveCount(0);
    }

    await mensFashionPage.searchProducts('');
    await expect(mensFashionPage.resultsCount).toHaveText('20 products');
  });

  test('combines search with category and price filters, then sorts results', async ({ mensFashionPage }) => {
    await mensFashionPage.searchProducts('Black');
    await expect(mensFashionPage.resultsCount).toHaveText('8 products');

    await mensFashionPage.setTypeFilter('footwear');
    await expect(mensFashionPage.resultsCount).toHaveText('4 products');

    await mensFashionPage.setPriceFilter('301-400');
    await expect(mensFashionPage.resultsCount).toHaveText('2 products');

    await mensFashionPage.sortProducts('Price: Low to High');
    await expect(mensFashionPage.page.getByTestId('product-price-32')).toHaveText('$350');
    await expect(mensFashionPage.page.getByTestId('product-price-36')).toHaveText('$356');
  });

  test('keeps the displayed result count aligned with visible products', async ({ mensFashionPage }) => {
    await mensFashionPage.searchProducts('Black');

    await expect(mensFashionPage.resultsCount).toHaveText('8 products');
    await expect(mensFashionPage.visibleProductCards).toHaveCount(8);
  });

  test('opens the selected product from search results', async ({ mensFashionPage }) => {
    await mensFashionPage.searchProducts('Black T-Shirt');
    await mensFashionPage.openProduct(21);

    await expect(mensFashionPage.page).toHaveURL(/product\.php\?id=21/);
  });
});
