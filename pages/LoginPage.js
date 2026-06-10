const { BasePage } = require("./BasePage");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
  }

  emailInput() {
    return this.page.locator('input[name="email"]');
  }
  passwordInput() {
    return this.page.locator('input[name="password"]');
  }
  loginButton() {
    return this.page.locator('form button[type="submit"]');
  }
  registerLink() {
    return this.page.locator('a[href="/register"]');
  }
  formErrors() {
    return this.page.locator("p.text-destructive");
  }
  toastMessage() {
    return this.page.locator("[data-sonner-toast]").first();
  }

  async navigate() {
    await this.goto("/login");
  }

  async login(email, password) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  async fillEmail(email) {
    await this.emailInput().fill(email);
  }
  async fillPassword(password) {
    await this.passwordInput().fill(password);
  }

  async waitForToast() {
    await this.toastMessage().waitFor({ state: "visible", timeout: 5000 });
    return this.toastMessage();
  }
}

module.exports = { LoginPage };
