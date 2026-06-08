const { BasePage } = require("./BasePage");

class AdminPage extends BasePage {
  constructor(page) {
    super(page);
  }

  sidebarOverviewLink() {
    return this.page
      .locator("nav a.flex.items-center.gap-3.rounded-lg")
      .first();
  }
  sidebarProductsLink() {
    return this.page.locator('nav a[href="/admin/products"]');
  }
  sidebarWarehousesLink() {
    return this.page.locator('nav a[href="/admin/warehouses"]');
  }
  sidebarOrdersLink() {
    return this.page.locator('nav a[href="/admin/orders"]');
  }
  tableHeaderId() {
    return this.page.locator("th").filter({ hasText: "ID" });
  }
  tableHeaderName() {
    return this.page.locator("th").filter({ hasText: "Название" });
  }
  tableHeaderPrice() {
    return this.page.locator("th").filter({ hasText: "Цена" });
  }
  tableHeaderCategory() {
    return this.page.locator("th").filter({ hasText: "Категория" });
  }
  logoutButton() {
    return this.page.locator("button.w-full.justify-start.gap-3");
  }
  welcomeTitle() {
    return this.page.locator("div.font-semibold.leading-none.tracking-tight");
  }
  dashboardText() {
    return this.page.locator("p.mt-4");
  }
  tableRows() {
    return this.page.locator("tbody tr");
  }
  createProductButton() {
    return this.page
      .locator("button.bg-primary.text-primary-foreground")
      .first();
  }
  editButtons() {
    return this.page.locator("button.h-8.rounded-md.border.border-input");
  }
  deleteButtons() {
    return this.page.locator("button.h-8.rounded-md.bg-destructive");
  }
  modal() {
    return this.page.locator('[role="dialog"]');
  }

  productNameInput() {
    return this.page.locator('[role="dialog"] input[name="name"]');
  }
  productDescInput() {
    return this.page.locator('[role="dialog"] input[name="description"]');
  }
  productPriceInput() {
    return this.page.locator('[role="dialog"] input[name="price"]');
  }
  productImageInput() {
    return this.page.locator('[role="dialog"] input[name="urlImage"]');
  }
  productCategorySelect() {
    return this.page.locator('[role="dialog"] button[role="combobox"]');
  }
  saveModalButton() {
    return this.page.locator('[role="dialog"] button[type="submit"]');
  }

  createWarehouseButton() {
    return this.page
      .locator("button.bg-primary.text-primary-foreground")
      .first();
  }
  warehouseTitleInput() {
    return this.page.locator('[role="dialog"] input[name="title"]');
  }
  warehouseAddressInput() {
    return this.page.locator('[role="dialog"] input[name="address"]');
  }

  statusSelects() {
    return this.page.locator('button[role="combobox"].w-\\[160px\\]');
  }

  async navigate() {
    await this.goto("/admin");
  }
  async navigateToProducts() {
    await this.goto("/admin/products");
  }
  async navigateToWarehouses() {
    await this.goto("/admin/warehouses");
  }
  async navigateToOrders() {
    await this.goto("/admin/orders");
  }

  async fillProductForm({ name, description, price, urlImage, category }) {
    if (name) await this.productNameInput().fill(name);
    if (description) await this.productDescInput().fill(description);
    if (price) await this.productPriceInput().fill(String(price));
    if (urlImage) await this.productImageInput().fill(urlImage);
    if (category) {
      await this.productCategorySelect().click();
      await this.page
        .locator(`[role="option"]:has-text("${category}")`)
        .click();
    }
  }

  async fillWarehouseForm({ title, address }) {
    if (title) await this.warehouseTitleInput().fill(title);
    if (address) await this.warehouseAddressInput().fill(address);
  }

  async changeOrderStatus(rowIndex, status) {
    await this.statusSelects().nth(rowIndex).click();
    await this.page.locator(`[role="option"]:has-text("${status}")`).click();
  }
}

module.exports = { AdminPage };
