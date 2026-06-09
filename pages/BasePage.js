class BasePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL;
  }

  async goto(path) {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  async waitForToast() {
    const toast = this.page.locator("[data-sonner-toast]").first();
    await toast.waitFor({ state: "visible", timeout: 5000 });
    return toast;
  }
}

module.exports = { BasePage };
