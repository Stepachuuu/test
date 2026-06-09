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
    await expect(home.toastLocator()).toContainText("Товар добавлен в корзину");

    const cart = new CartPage(page);
    await cart.navigate();
    await cart.checkout();
    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(cart.toastLocator()).toContainText("Заказ успешно создан");

    await orders.navigate();

    const trigger = orders.orderDetail().first();
    await expect(trigger).toBeVisible({ timeout: 10000 });

    // Раскрываем заказ
    await trigger.click();
    await expect(trigger).toHaveAttribute("data-state", "open");

    await expect(orders.orderComposition()).toHaveText("Состав заказа:", {
      timeout: 5000,
    });

    await expect(orders.expandedOrderItems().first()).toBeVisible();
    await expect(orders.expandedOrderItemImage().first()).toBeVisible();
    await expect(orders.expandedOrderItemName().first()).toBeVisible();

    // Сворачиваем заказ
    await trigger.click();
    await expect(orders.orderComposition()).not.toBeVisible();
  });

  // ORD-002 — Display of order statuses as plain text
  test("ORD-002 | Display of order statuses as plain text", async ({
    page,
  }) => {
    // Убеждаемся, что есть хотя бы один заказ (создаём, если нет)
    const home = new HomePage(page);
    await home.navigate();
    await home.addProductToCart(1);
    await expect(home.toastLocator()).toContainText("Товар добавлен в корзину");

    const cart = new CartPage(page);
    await cart.navigate();
    await cart.checkout();
    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(cart.toastLocator()).toContainText("Заказ успешно создан");

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
