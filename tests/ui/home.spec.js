const { test, expect } = require("@playwright/test");
const { HomePage } = require("../../pages/HomePage");
const { CartPage } = require("../../pages/CartPage");
const { ProductDetailPage } = require("../../pages/ProductDetailPage");
const { loginAs } = require("../../helpers/auth");

test.describe("Home page", () => {
  let home;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await loginAs(page, "user");
    await home.navigate();
  });

  // HOME-001 — каталог отображает список товаров (BUG #2: изображения не загружаются)
  test("HOME-001 | Catalog displays product list", async ({ page }) => {
    await expect(home.catalogTitle()).toBeVisible();

    const cards = home.productCards();
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);

    const first = cards.first();
    await expect(home.productName(first)).toBeVisible();
    await expect(home.productDesc(first)).toBeVisible();
    await expect(home.productPrice(first)).toBeVisible();
    await expect(home.addToCartButtons().first()).toBeVisible();
  });

  // HOME-002 — переход на страницу товара
  test("HOME-002 | Navigate to product detail page", async ({ page }) => {
    await home.productCards().first().click();

    const detail = new ProductDetailPage(page);
    await expect(page).toHaveURL(/\/product\/\d+/);
    await expect(detail.addToCartButton()).toBeVisible();
  });

  // HOME-003 — добавление товара в корзину с главной страницы
  test("HOME-003 | Add product to cart from home page", async ({ page }) => {
    await home.addProductToCart(1);

    await expect(home.toastLocator()).toBeVisible();
    await expect(home.toastLocator()).toContainText("Товар добавлен в корзину");

    const cart = new CartPage(page);
    await cart.navigate();
    await expect(cart.cartItems().first()).toBeVisible();
  });

  // HOME-004 — формат цены
  test("HOME-004 | Price displayed in correct format", async ({ page }) => {
    const priceText = await home
      .productPrice(home.productCards().first())
      .textContent();
    expect(priceText).toMatch(/[\d\s]+\s*₽/);
  });
});
