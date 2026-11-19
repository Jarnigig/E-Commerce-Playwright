import { expect, test } from '../fixtures/baseFixture';

test.describe('logout and re-login', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await expect(dashboardPage.logoutButton).toBeVisible();
  });

  test('logs out, clears the authenticated state, and redirects to login', async ({ dashboardPage, loginPage }) => {
    await expect.poll(() => dashboardPage.page.evaluate(() => localStorage.getItem('isLoggedIn'))).toBe('true');

    await dashboardPage.logout();

    await expect(dashboardPage.page).toHaveURL(/index\.php/);
    await expect(loginPage.loginCard).toBeVisible();
    await expect(dashboardPage.logoutButton).toBeHidden();
    await expect.poll(() => dashboardPage.page.evaluate(() => localStorage.getItem('isLoggedIn'))).toBeNull();
  });

  test('allows the user to log in again after logging out', async ({ dashboardPage, loginPage }) => {
    await dashboardPage.logout();
    await loginPage.login('demo@demo.com', 'demo');

    await expect(dashboardPage.page).toHaveURL(/shop\.php/);
    await expect(dashboardPage.logoutButton).toBeVisible();
    await expect.poll(() => dashboardPage.page.evaluate(() => localStorage.getItem('isLoggedIn'))).toBe('true');
  });

  test('keeps protected catalog pages inaccessible after logout', async ({ dashboardPage, loginPage }) => {
    await dashboardPage.logout();
    await dashboardPage.page.goto('/mens-wear.php');

    await expect(dashboardPage.page).toHaveURL(/index\.php/);
    await expect(loginPage.loginCard).toBeVisible();
    await expect.poll(() => dashboardPage.page.evaluate(() => localStorage.getItem('isLoggedIn'))).toBeNull();
  });

  test('does not restore the session after logout when Remember Me was selected', async ({
    dashboardPage,
    loginPage,
  }) => {
    await dashboardPage.logout();
    await loginPage.login('demo@demo.com', 'demo', true);
    await expect(dashboardPage.page).toHaveURL(/shop\.php/);

    await dashboardPage.logout();
    await dashboardPage.page.goto('/shop.php');

    await expect(dashboardPage.page).toHaveURL(/index\.php/);
    await expect(loginPage.loginCard).toBeVisible();
    await expect.poll(() => dashboardPage.page.evaluate(() => localStorage.getItem('isLoggedIn'))).toBeNull();
  });

  test('keeps the user authenticated when navigating to mens fashion', async ({ dashboardPage }) => {
    await dashboardPage.openMensFashion();

    await expect(dashboardPage.logoutButton).toBeVisible();
    await expect.poll(() => dashboardPage.page.evaluate(() => localStorage.getItem('isLoggedIn'))).toBe('true');
  });

  test('keeps the session active when visiting the login URL without logging out', async ({ dashboardPage }) => {
    await dashboardPage.page.goto('/index.php');
    await dashboardPage.page.goto('/shop.php');

    await expect(dashboardPage.page).toHaveURL(/shop\.php/);
    await expect(dashboardPage.logoutButton).toBeVisible();
    await expect.poll(() => dashboardPage.page.evaluate(() => localStorage.getItem('isLoggedIn'))).toBe('true');
  });

  test('keeps the user signed out after an invalid login attempt', async ({ dashboardPage, loginPage }) => {
    await dashboardPage.logout();
    await loginPage.login('demo@demo.com', 'Wrong@123');

    await expect(dashboardPage.page).toHaveURL(/index\.php/);
    await expect(loginPage.loginErrorMessage).toHaveText('Invalid email or password!');
    await expect.poll(() => dashboardPage.page.evaluate(() => localStorage.getItem('isLoggedIn'))).toBeNull();
  });
});
