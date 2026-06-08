const { BasePage } = require("./BasePage");

class CartPage extends BasePage {
  constructor(page) {
    super(page);
  }

  cartTitle() {
    return this.page.locator("h1.text-3xl.font-bold");
  }
  cartItems() {
    return this.page.locator(
      "div.flex.items-center.justify-between.p-4.border-b",
    );
  }
  removeButtons() {
    return this.page.locator("button.h-8.rounded-md.bg-destructive");
  }
  checkoutButton() {
    return this.page.locator("button.mt-6.w-full");
  }
  emptyCartMessage() {
    return this.page.locator("p.p-6.text-center.text-muted-foreground");
  }
  totalAmount() {
    return this.page
      .locator("div.flex.justify-between.text-lg.font-bold span")
      .last();
  }

  async navigate() {
    await this.goto("/cart");
  }
  async removeItem(index = 0) {
    await this.removeButtons().nth(index).click();
  }

  async removeItemByName(productName) {
    const row = this.page.locator(
      `div.flex.items-center.justify-between.p-4.border-b:has-text("${productName}")`,
    );
    await row.locator("button.h-8.rounded-md.bg-destructive").click();
  }

  async checkout() {
    await this.checkoutButton().click();
  }
}

module.exports = { CartPage };
