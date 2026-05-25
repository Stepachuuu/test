import { expect } from "@playwright/test";
import { locators } from "../helpers/locators.js";

export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.firstname = page.locator(locators.firstnameInput);
    this.lastname = page.locator(locators.lastnameInput);
    this.email = page.locator(locators.emailInput);
    this.username = page.locator(locators.usernameInput);
    this.phone = page.locator(locators.phoneInput);
    this.password = page.locator(locators.passwordInput);
    this.registerButton = page.locator(locators.submitButton);
  }

  async goto() {
    await this.page.goto("/register");
  }

  async register(user) {
    await this.firstname.fill(user.firstname);
    await this.lastname.fill(user.lastname);
    await this.email.fill(user.email);
    await this.username.fill(user.username);
    await this.phone.fill(user.phone);
    await this.password.fill(user.password);
    await this.registerButton.click();
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
    await expect(this.page.locator(locators.errorEmailFormat)).toBeVisible();
  }

  async expectPhoneFormatError() {
    await expect(this.page.locator(locators.errorPhoneFormat)).toBeVisible();
  }

  async expectEmailAlreadyExistsError(email) {
    await expect(
      this.page.locator(locators.errorEmailExists(email)),
    ).toBeVisible();
  }

  async getEmailValue() {
    return await this.email.inputValue();
  }

  async fillEmail(email) {
    await this.email.fill(email);
  }

  async expectRedirectToLogin() {
    await expect(this.page).toHaveURL("/login");
  }
}
