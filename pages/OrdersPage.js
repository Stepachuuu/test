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
  orderDetail() {
    return this.page.locator('h3 button:has-text("Заказ #")');
  }
  expandedOrderItems() {
    return this.page.locator(
      '[data-state="open"] .flex.justify-between.items-center.py-2',
    );
  }

  expandedOrderItemImage() {
    return this.expandedOrderItems().locator("img");
  }

  expandedOrderItemName() {
    return this.expandedOrderItems().locator("h5.font-medium");
  }

  expandedOrderCompositionHeader() {
    return this.page.locator('[data-state="open"] h5.font-semibold.mb-2');
  }

  async navigate() {
    await this.goto("/orders");
  }

  async expandOrder(index = 0) {
    await this.accordionTriggers().nth(index).click();
  }

  async expandOrderById(orderId) {
    const trigger = this.page.locator(
      `h3 button:has-text("Заказ #${orderId}")`,
    );
    await trigger.click();
  }
  async expectOrderContainsItems(expectedCount = 1) {
    await expect(this.expandedOrderCompositionHeader()).toHaveText(
      "Состав заказа:",
    );
    await expect(this.expandedOrderItems().first()).toBeVisible();
    await expect(this.expandedOrderItemImage().first()).toBeVisible();
    await expect(this.expandedOrderItemName().first()).toBeVisible();
    expect(await this.expandedOrderItems().count()).toBe(expectedCount);
  }
}

module.exports = { OrdersPage };
