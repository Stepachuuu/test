const { BasePage } = require("./BasePage");

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
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
  passwordInput() {
    return this.page.locator('input[name="password"]');
  }
  registerButton() {
    return this.page.locator('form button[type="submit"]');
  }
  loginLink() {
    return this.page.locator('a[href="/login"]');
  }
  formErrors() {
    return this.page.locator("p.text-destructive");
  }

  async navigate() {
    await this.goto("/register");
  }

  async fillForm({ firstname, lastname, email, username, phone, password }) {
    if (firstname !== undefined) await this.firstnameInput().fill(firstname);
    if (lastname !== undefined) await this.lastnameInput().fill(lastname);
    if (email !== undefined) await this.emailInput().fill(email);
    if (username !== undefined) await this.usernameInput().fill(username);
    if (phone !== undefined) await this.phoneInput().fill(phone);
    if (password !== undefined) await this.passwordInput().fill(password);
  }

  async submit() {
    await this.registerButton().click();
  }

  async register(data) {
    await this.fillForm(data);
    await this.submit();
  }
}

module.exports = { RegisterPage };
