import { expect } from "@playwright/test";
import { locators } from "../helpers/locators.js";

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator(locators.loginEmailInput);
    this.passwordInput = page.locator(locators.loginPasswordInput);
    this.loginButton = page.locator(locators.loginButton);
    this.errorMessage = page.locator(locators.loginErrorMessage);
    this.emailError = page.getByText("Email обязателен");
    this.passwordError = page.getByText("Пароль обязателен");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectSuccess() {
    await expect(this.page).toHaveURL("/");
  }

  async expectErrorOnPage() {
    await expect(this.page).toHaveURL("/login");
    await expect(this.errorMessage).toBeVisible();
  }

  async expectEmailError() {
    await expect(this.emailError).toBeVisible();
  }

  async expectPasswordError() {
    await expect(this.passwordError).toBeVisible();
  }
}
