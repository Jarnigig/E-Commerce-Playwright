import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginCard: Locator;
  readonly emailInput: Locator;
  readonly emailError: Locator;
  readonly passwordInput: Locator;
  readonly passwordError: Locator;
  readonly passwordToggleButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly loginErrorMessage: Locator;
  readonly successMessage: Locator;
  readonly submitButton: Locator;
  readonly autofillDemoButton: Locator;
  readonly demoEmail: Locator;
  readonly demoPassword: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginCard = page.getByTestId('login-card');
    this.emailInput = page.getByTestId('login-email-input');
    this.emailError = page.getByTestId('login-email-error');
    this.passwordInput = page.getByTestId('login-password-input');
    this.passwordError = page.getByTestId('login-password-error');
    this.passwordToggleButton = page.getByTestId('login-password-toggle');
    this.rememberMeCheckbox = page.getByTestId('login-remember-me');
    this.loginErrorMessage = page.getByTestId('login-error-message');
    this.successMessage = page.locator('#success');
    this.submitButton = page.getByTestId('login-submit-btn');
    this.autofillDemoButton = page.getByTestId('login-autofill-demo');
    this.demoEmail = page.getByTestId('demo-email');
    this.demoPassword = page.getByTestId('demo-password');
    this.registerLink = page.getByTestId('register-link');
  }

  async goto(): Promise<void> {
    await this.page.goto('/index.php');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async setRememberMe(checked: boolean): Promise<void> {
    if (checked) {
      await this.rememberMeCheckbox.check();
    } else {
      await this.rememberMeCheckbox.uncheck();
    }
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.passwordToggleButton.click();
  }

  async login(email: string, password: string, rememberMe = false): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.setRememberMe(rememberMe);
    await this.submit();
  }

  async autofillDemoCredentials(): Promise<void> {
    await this.autofillDemoButton.click();
  }
}