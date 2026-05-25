import { expect } from "@playwright/test";
import { locators } from "../helpers/locators.js";

export class ShopPage {
  constructor(page) {
    this.page = page;
    this.productCards = page.locator(locators.productCard);
    this.cartIcon = page.locator(locators.cartIcon);
  }

  async goto() {
    await this.page.goto("/");
    await this.page
      .locator(locators.productCard)
      .first()
      .waitFor({ state: "visible", timeout: 15000 });
  }

  // Добавленный метод
  async getFirstProductCard() {
    const firstCard = this.productCards.first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    return firstCard;
  }

  async getProductPriceByIndex(index) {
    const cards = await this.productCards.all();
    const priceText = await cards[index]
      .locator(locators.productPrice)
      .first()
      .textContent();
    return parseFloat(priceText?.replace(/\s/g, "").replace(",", ".") || "0");
  }

  async addProductByIndex(index) {
    const cards = await this.productCards.all();
    if (index >= cards.length)
      throw new Error(`Товар с индексом ${index} не найден`);
    const addButton = cards[index].locator(locators.addToCartButton);
    await expect(addButton).toBeVisible({ timeout: 5000 });
    await addButton.click();
    await this.page.waitForTimeout(500);
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}
