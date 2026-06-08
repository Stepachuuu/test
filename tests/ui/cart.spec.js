const { test, expect } = require("@playwright/test");
const { CartPage } = require("../../pages/CartPage");
const { HomePage } = require("../../pages/HomePage");
const { loginAs } = require("../../helpers/auth");

const BASE_URL = process.env.BASE_URL;

test.describe("Cart page", () => {
  let cart;
  let home;

  test.beforeEach(async ({ page }) => {
    cart = new CartPage(page);
    home = new HomePage(page);
    await loginAs(page, "user");
  });

  test("CART-001 | View cart with items", async ({ page }) => {
    await home.navigate();
    await home.addProductToCart(1);

    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText("Товар добавлен в корзину");

    await cart.navigate();

    await expect(cart.cartTitle()).toBeVisible();
    await expect(cart.cartItems().first()).toBeVisible();
    await expect(cart.checkoutButton()).toBeEnabled();

    const first = cart.cartItems().first();
    await expect(first.locator("img.h-16.w-16.rounded-md")).toBeVisible();
    await expect(first.locator("h4.font-semibold")).toBeVisible();
  });

  test("CART-002 | Remove item from cart", async ({ page }) => {
    await home.navigate();
    await home.addProductToCart(1);
    await expect(page.locator("[data-sonner-toast]").first()).toContainText(
      "Товар добавлен в корзину",
    );

    await cart.navigate();
    const firstItem = cart.cartItems().first();
    await expect(firstItem).toBeVisible();
    const itemName = await firstItem.locator("h4.font-semibold").textContent();

    await cart.removeItem(0);
    await expect(page.locator("[data-sonner-toast]").first()).toContainText(
      "Товар удален из корзины",
    );

    await expect(
      page.locator(`h4.font-semibold:has-text("${itemName}")`),
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

    const addToast = page.locator("[data-sonner-toast]").first();
    await expect(addToast).toBeVisible();
    await expect(addToast).toContainText("Товар добавлен в корзину");

    await cart.navigate();
    await cart.checkout();

    const orderToast = page.locator("[data-sonner-toast]").first();
    await expect(orderToast).toBeVisible();
    await expect(orderToast).toContainText("Заказ успешно создан");
    await expect(page).toHaveURL(`${BASE_URL}/`);

    await cart.navigate();
    await expect(cart.emptyCartMessage()).toBeVisible();

    await page.goto(`${BASE_URL}/orders`);
    await expect(
      page.locator("h4.font-semibold.text-lg").first(),
    ).toBeVisible();
  });
});
