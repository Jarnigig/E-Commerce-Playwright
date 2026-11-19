import { expect, test } from '../fixtures/baseFixture';

test.use({ storageState: { cookies: [], origins: [] } });

const email = process.env.Email || '';
const password = process.env.PASS || '';

test.describe('login form validation', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('prevents login when the email is blank', async ({ loginPage }) => {
    await loginPage.fillPassword('demo');
    await loginPage.submit();

    await expect(loginPage.emailError).toHaveText('Please enter your email.');
  });

  test('prevents login when the password is blank', async ({ loginPage }) => {
    await loginPage.fillEmail('demo@demo.com');
    await loginPage.submit();

    await expect(loginPage.passwordError).toHaveText('Please enter your password.');
  });

  test('rejects an invalid email format', async ({ loginPage }) => {
    await loginPage.login('not-an-email', 'demo');

    await expect(loginPage.emailError).toHaveText('Please enter a valid email address.');
  });

  test('accepts a plus sign in the email address', async ({ loginPage }) => {
    await loginPage.login('demo+tag@demo.com', 'demo');

    await expect(loginPage.loginErrorMessage).toHaveText('Invalid email or password!');
  });

  test('requires a password of at least four characters', async ({ loginPage }) => {
    await loginPage.login('demo@demo.com', 'abc');

    await expect(loginPage.passwordError).toHaveText('Password must be at least 4 characters long.');
  });

  test('rejects an incorrect password', async ({ loginPage }) => {
    await loginPage.login('demo@demo.com', 'Wrong@123');

    await expect(loginPage.loginErrorMessage).toHaveText('Invalid email or password!');
  });

  test('rejects an incorrect email with the valid password', async ({ loginPage }) => {
    await loginPage.login('invalid@example.com', 'demo');

    await expect(loginPage.loginErrorMessage).toHaveText('Invalid email or password!');
  });

  test('uses the same error for an unknown account and a wrong password', async ({ loginPage }) => {
    await loginPage.login('unknown_user@example.com', 'Test@123');
    await expect(loginPage.loginErrorMessage).toHaveText('Invalid email or password!');

    await loginPage.login('demo@demo.com', 'Wrong@123');
    await expect(loginPage.loginErrorMessage).toHaveText('Invalid email or password!');
  });

  test('autofills the demo credentials', async ({ loginPage }) => {
    await loginPage.autofillDemoCredentials();

    await expect(loginPage.emailInput).toHaveValue('demo@demo.com');
    await expect(loginPage.passwordInput).toHaveValue('demo');
  });

  test('toggles password visibility', async ({ loginPage }) => {
    await loginPage.fillPassword('demo');
    await loginPage.togglePasswordVisibility();

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('remembers the email when Remember Me is selected', async ({ loginPage }) => {
    await loginPage.login(email, password, true);
    await expect(loginPage.page).toHaveURL(/shop\.php/);

    await loginPage.goto();

    await expect(loginPage.emailInput).toHaveValue(email);
    await expect(loginPage.rememberMeCheckbox).toBeChecked();
  });

  test('authenticates with the configured test account', async ({ loginPage }) => {
    await loginPage.login(email, password);

    await expect(loginPage.page).toHaveURL(/shop\.php/);
  });

  test('accepts the demo password at the four-character minimum', async ({ loginPage }) => {
    await loginPage.login('demo@demo.com', 'demo');

    await expect(loginPage.page).toHaveURL(/shop\.php/);
  });
});
