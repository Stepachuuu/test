const { BasePage } = require("./BasePage");

class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
  }

  pageTitle() {
    return this.page.locator("h1.text-3xl.font-bold");
  }
  firstnameInput() {
    return this.page.locator('input[name="firstname"]');
  }
  lastnameInput() {
    return this.page.locator('input[name="lastname"]');
  }
  emailInput() {
    return this.page.locator('input[name="email"]');
  }
  usernameInput() {
    return this.page.locator('input[name="username"]');
  }
  phoneInput() {
    return this.page.locator('input[name="phoneNumber"]');
  }
  saveButton() {
    return this.page.locator('form button[type="submit"]');
  }
  formErrors() {
    return this.page.locator("p.text-destructive");
  }
  toastLocator() {
    return this.page.locator("[data-sonner-toast]").first();
  }

  async navigate() {
    await this.goto("/profile");
  }

  async updateEmail(email) {
    await this.emailInput().clear();
    await this.emailInput().fill(email);
    await this.saveButton().click();
  }

  async updateUsername(username) {
    await this.usernameInput().clear();
    await this.usernameInput().fill(username);
    await this.saveButton().click();
  }

  async updatePhone(phone) {
    await this.phoneInput().clear();
    await this.phoneInput().fill(phone);
    await this.saveButton().click();
  }

  async clearAndSave(field) {
    const input = field === "email" ? this.emailInput() : this.usernameInput();
    await input.clear();
    await this.saveButton().click();
  }
}

module.exports = { ProfilePage };
