import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage.js";
import { ShopPage } from "../../pages/ShopPage.js";
import { CartPage } from "../../pages/CartPage.js";

const USER_EMAIL = process.env.TEST_USER_EMAIL;
const USER_PASSWORD = process.env.TEST_USER_PASSWORD;

test.describe.configure({ timeout: 60000 });

test.describe("Shop Page Tests", () => {
  let shopPage;
  let cartPage;
  let page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);
    await page.waitForURL("/", { timeout: 15000 });

    shopPage = new ShopPage(page);
    cartPage = new CartPage(page);
    await shopPage.goto();
  });

  test("SHP-001: Verify product list display", async () => {
    const count = await shopPage.productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("SHP-002: Verify product price display", async () => {
    const firstCard = await shopPage.getFirstProductCard();
    const price = await firstCard.locator(".font-bold").first().textContent();
    expect(parseFloat(price.replace(/\s/g, ""))).toBeGreaterThan(0);
  });

  test("SHP-003: Add product to cart", async () => {
    await shopPage.addProductByIndex(0);
    await cartPage.goToCart();
    const count = await cartPage.getCartItemCount();
    expect(count).toBe(1);
  });

  test("SHP-004: Open product card", async () => {
    const firstCard = await shopPage.getFirstProductCard();
    const productName = await firstCard
      .locator("h3, .font-semibold")
      .first()
      .textContent();
    await firstCard.click();
    await expect(page).toHaveURL(/\/product\/\d+/);
    await expect(page.getByText(productName)).toBeVisible();
  });

  test("SHP-005: Verify cart persistence after page refresh", async () => {
    await shopPage.addProductByIndex(0);
    await page.reload();
    await shopPage.productCards.first().waitFor({ state: "visible" });
    await cartPage.goToCart();
    const count = await cartPage.getCartItemCount();
    expect(count).toBe(1);
  });
});
