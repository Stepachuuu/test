const { test, expect } = require("@playwright/test");
const { OrdersPage } = require("../../pages/OrdersPage");
const { HomePage } = require("../../pages/HomePage");
const { CartPage } = require("../../pages/CartPage");
const { loginAs } = require("../../helpers/auth");

const BASE_URL = process.env.BASE_URL;

test.describe("Orders page", () => {
  let orders;

  test.beforeEach(async ({ page }) => {
    orders = new OrdersPage(page);
    await loginAs(page, "user");
  });

  // ORD-001 — Expand order and view items
  test("ORD-001 | Expand order and view items", async ({ page }) => {
    const home = new HomePage(page);
    await home.navigate();
    await home.addProductToCart(1);
    await expect(page.locator("[data-sonner-toast]").first()).toContainText(
      "Товар добавлен в корзину",
    );

    const cart = new CartPage(page);
    await cart.navigate();
    await cart.checkout();
    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(page.locator("[data-sonner-toast]").first()).toContainText(
      "Заказ успешно создан",
    );

    await orders.navigate();

    const trigger = page.locator('h3 button:has-text("Заказ #")').first();
    await expect(trigger).toBeVisible({ timeout: 10000 });

    // Раскрываем заказ
    await trigger.click();
    await expect(trigger).toHaveAttribute("data-state", "open");

    // Проверяем заголовок "Состав заказа:"
    const compositionHeader = page.locator(
      '[data-state="open"] h5.font-semibold.mb-2',
    );
    await expect(compositionHeader).toHaveText("Состав заказа:", {
      timeout: 5000,
    });

    const firstItem = page
      .locator('[data-state="open"] .flex.justify-between.items-center.py-2')
      .first();
    await expect(firstItem.locator("img")).toBeVisible();
    await expect(firstItem.locator("h5.font-medium")).toBeVisible();

    // Сворачиваем заказ
    await trigger.click();
    await expect(compositionHeader).not.toBeVisible();
  });

  // ORD-002 — Display of order statuses as plain text
  test("ORD-002 | Display of order statuses as plain text", async ({
    page,
  }) => {
    // Убеждаемся, что есть хотя бы один заказ (создаём, если нет)
    const home = new HomePage(page);
    await home.navigate();
    await home.addProductToCart(1);
    await expect(page.locator("[data-sonner-toast]").first()).toContainText(
      "Товар добавлен в корзину",
    );

    const cart = new CartPage(page);
    await cart.navigate();
    await cart.checkout();
    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(page.locator("[data-sonner-toast]").first()).toContainText(
      "Заказ успешно создан",
    );

    await orders.navigate();

    // Ждём загрузки статусов
    const statuses = orders.orderStatuses();
    await expect(statuses.first()).toBeVisible({ timeout: 10000 });

    const count = await statuses.count();
    for (let i = 0; i < count; i++) {
      const statusText = await statuses.nth(i).textContent();
      const validStatuses = ["PENDING", "SHIPPED", "DELIVERED", "CANCELED"];
      expect(validStatuses).toContain(statusText.trim().toUpperCase());
    }
  });
});
