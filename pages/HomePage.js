const { BasePage } = require("./BasePage");

class HomePage extends BasePage {
  constructor(page) {
    super(page);
  }

  catalogTitle() {
    return this.page.locator("h1.text-3xl.font-bold.tracking-tight");
  }
  productCards() {
    return this.page.locator("a.group.flex");
  }
  productName(card) {
    return card.locator("div.font-semibold");
  }
  productDesc(card) {
    return card.locator("div.text-sm.text-muted-foreground");
  }
  productPrice(card) {
    return card.locator("span.text-2xl.font-bold.text-primary");
  }
  addToCartButtons() {
    return this.page.locator("button.w-full.font-semibold");
  }
  ordersNavLink() {
    return this.page.locator('a[href="/orders"]').first();
  }
  cartNavLink() {
    return this.page.locator('a[href="/cart"]');
  }

  async navigate() {
    await this.goto("/");
  }

  async clickFirstProduct() {
    await this.productCards().first().click();
  }
  async addFirstProductToCart() {
    await this.addToCartButtons().first().click();
  }
}

module.exports = { HomePage };
