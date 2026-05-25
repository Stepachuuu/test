import { expect } from "@playwright/test";
import { locators } from "../helpers/locators.js";

export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.firstnameInput = page.locator(locators.firstnameInput);
    this.lastnameInput = page.locator(locators.lastnameInput);
    this.emailInput = page.locator(locators.emailInput);
    this.usernameInput = page.locator(locators.usernameInput);
    this.phoneInput = page.locator(locators.phoneInput);
    this.passwordInput = page.locator(locators.passwordInput);
    this.submitButton = page.locator(locators.submitButton);
  }

  async goto() {
    await this.page.goto("/register");
  }

  async register(user) {
    await this.firstnameInput.fill(user.firstname);
    await this.lastnameInput.fill(user.lastname);
    await this.emailInput.fill(user.email);
    await this.usernameInput.fill(user.username);
    await this.phoneInput.fill(user.phone);
    await this.passwordInput.fill(user.password);
    await this.submitButton.click();
  }

  async expectSuccess() {
    await expect(this.page).toHaveURL("/login");
  }

  async expectErrorOnPage() {
    await expect(this.page).toHaveURL("/register");
  }

  async expectFieldErrors() {
    await expect(this.page.getByText("Имя обязательно")).toBeVisible();
    await expect(this.page.getByText("Фамилия обязательна")).toBeVisible();
    await expect(this.page.getByText("Email обязателен")).toBeVisible();
    await expect(this.page.getByText("Username обязателен")).toBeVisible();
    await expect(this.page.getByText("Телефон обязателен")).toBeVisible();
    await expect(this.page.getByText("Пароль обязателен")).toBeVisible();
  }

  async expectEmailFormatError() {
    await expect(this.page.locator(selectors.errorEmailFormat)).toBeVisible();
  }

  async expectPhoneFormatError() {
    await expect(this.page.locator(selectors.errorPhoneFormat)).toBeVisible();
  }

  async getEmailValue() {
    return await this.emailInput.inputValue();
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async expectRedirectToLogin() {
    await expect(this.page).toHaveURL("/login");
  }
}
