const { test, expect } = require("@playwright/test");
const { CartPage } = require("../../pages/CartPage");
const { HomePage } = require("../../pages/HomePage");
const { loginAs } = require("../../helpers/auth");
const { OrdersPage } = require("../../pages/OrdersPage");

const BASE_URL = process.env.BASE_URL;

test.describe("Cart page", () => {
  let cart;
  let home;
  let order;

  test.beforeEach(async ({ page }) => {
    cart = new CartPage(page);
    home = new HomePage(page);
    order = new OrdersPage(page);
    await loginAs(page, "user");
  });

  test("CART-001 | View cart with items", async ({ page }) => {
    await home.navigate();
    await home.addProductToCart(1);

    await expect(cart.toastLocator()).toBeVisible();
    await expect(cart.toastLocator()).toContainText("Товар добавлен в корзину");

    await cart.navigate();

    await expect(cart.cartTitle()).toBeVisible();
    await expect(cart.cartItems().first()).toBeVisible();
    await expect(cart.checkoutButton()).toBeEnabled();

    await expect(cart.cartItemsImage()).toBeVisible();
    await expect(cart.cartItemsText()).toBeVisible();
  });

  test("CART-002 | Remove item from cart", async ({ page }) => {
    await home.navigate();
    await home.addProductToCart(1);
    await expect(home.toastLocator()).toContainText("Товар добавлен в корзину");

    await cart.navigate();
    const itemName = await cart.cartItemsText().first().textContent();

    await cart.removeItem(0);
    await expect(cart.toastLocator()).toContainText("Товар удален из корзины");

    await expect(
      cart.cartItemsText().filter({ hasText: itemName }),
    ).toHaveCount(0);

    if ((await cart.cartItems().count()) === 0) {
      await expect(cart.emptyCartMessage()).toBeVisible();
      await expect(cart.checkoutButton()).toBeDisabled();
    }
  });

  test("CART-003 | Checkout creates order and clears cart", async ({
    page,
  }) => {
    await home.navigate();
    await home.addProductToCart(1);

    await expect(home.toastLocator()).toBeVisible();
    await expect(home.toastLocator()).toContainText("Товар добавлен в корзину");

    await cart.navigate();
    await cart.checkout();

    await expect(cart.toastLocator()).toBeVisible();
    await expect(cart.toastLocator()).toContainText("Заказ успешно создан");
    await expect(page).toHaveURL(`${BASE_URL}/`);

    await cart.navigate();
    await expect(cart.emptyCartMessage()).toBeVisible();

    await page.goto(`${BASE_URL}/orders`);
    await expect(order.orderHeadings().first()).toBeVisible();
  });
});
