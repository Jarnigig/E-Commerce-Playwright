import { expect, test } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

test('authenticate', async ({ page }) => {
  const email = process.env.Email || '';
  const password = process.env.PASS || '';

  await page.goto('/index.php');
  await page.getByTestId('login-email-input').fill(email);
  await page.getByTestId('login-password-input').fill(password);
  await page.getByTestId('login-submit-btn').click();

  await expect(page).toHaveURL(/shop\.php/);
  await expect(page.getByTestId('header-logout-btn')).toBeVisible();
  await page.context().storageState({ path: authFile });
});
