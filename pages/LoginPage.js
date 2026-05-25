import { expect } from '@playwright/test';
import { locators } from '../helpers/locators.js';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator(locators.loginEmailInput);
    this.passwordInput = page.locator(locators.loginPasswordInput);
    this.loginButton = page.locator(locators.loginButton);
    this.errorMessage = page.locator(locators.loginErrorMessage);
    this.emailError = page.locator(locators.emailRequiredError);
    this.passwordError = page.locator(locators.passwordRequiredError);
    this.registerLink = page.locator(locators.registerLink);
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectSuccess() {
    await expect(this.page).toHaveURL('/');
  }

  async expectError() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectEmailErrorVisible() {
    await expect(this.emailError).toBeVisible();
  }

  async expectPasswordErrorVisible() {
    await expect(this.passwordError).toBeVisible();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
    await expect(this.page).toHaveURL('/register');
  }
}