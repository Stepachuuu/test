const { BasePage } = require("./BasePage");

class OrdersPage extends BasePage {
  constructor(page) {
    super(page);
  }

  pageTitle() {
    return this.page.locator("h1.text-3xl.font-bold");
  }
  emptyOrdersMessage() {
    return this.page.locator("p.p-6.text-center.text-muted-foreground");
  }
  accordionTriggers() {
    return this.page.locator("button[data-state]");
  }
  orderHeadings() {
    return this.page.locator("h4.font-semibold.text-lg");
  }
  orderStatuses() {
    return this.page.locator("p.text-sm.font-medium");
  }
  orderComposition() {
    return this.page.locator("h5.font-semibold.mb-2");
  }

  async navigate() {
    await this.goto("/orders");
  }

  async expandFirstOrder() {
    await this.accordionTriggers().first().click();
  }
}

module.exports = { OrdersPage };
