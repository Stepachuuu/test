const { test, expect } = require("@playwright/test");
const { ProductDetailPage } = require("../../pages/ProductDetailPage");
const { CartPage } = require("../../pages/CartPage");
const { loginAs } = require("../../helpers/auth");

test.describe("Product detail page", () => {
  let pd;

  test.beforeEach(async ({ page }) => {
    pd = new ProductDetailPage(page);
    await loginAs(page, "user");
  });

  // PROD-001 — отображение карточки товара с ID=101
  test("PROD-001 | Display product details for product ID=101", async ({
    page,
  }) => {
    await pd.navigateToProduct(101);

    await expect(page).toHaveURL(/\/product\/101/);
    await expect(pd.productName()).toBeVisible();
    await expect(pd.productCategory()).toBeVisible();
    await expect(pd.productPrice()).toBeVisible();
    await expect(pd.productDescription()).toBeVisible();
    await expect(pd.productImage()).toBeVisible();
    await expect(pd.addToCartButton()).toBeEnabled();
  });

  // PROD-002 — добавление товара в корзину со страницы товара
  test("PROD-002 | Add product to cart from detail page", async ({ page }) => {
    await pd.navigateToProduct(101);
    await pd.addToCart();

    const toast = await pd.waitForToast();
    await expect(toast).toContainText("Товар добавлен в корзину");

    const cart = new CartPage(page);
    await cart.navigate();
    await expect(cart.cartItems().first()).toBeVisible();
  });

  // PROD-003 — несуществующий товар показывает ошибку
  test("PROD-003 | Open non-existent product shows error", async ({ page }) => {
    await pd.navigateToProduct(99999);
    const errBlock = pd.errorBlock();
    await expect(errBlock.or(page.locator("div.container.p-4"))).toBeVisible();
  });

  // PROD-004 — формат цены
  test("PROD-004 | Price formatting check", async ({ page }) => {
    await pd.navigateToProduct(101);

    const priceText = await pd.productPrice().textContent();
    expect(priceText).toMatch(/\d+[\.,]?\d*\s*руб\./);
  });
});
