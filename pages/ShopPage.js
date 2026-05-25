import { expect } from "@playwright/test";
import { locators } from "../helpers/locators.js";

export class ShopPage {
  constructor(page) {
    this.page = page;
    this.productCard = page.locator(locators.productCard);
    this.addToCartButton = page.locator(locators.addToCartButton);
    this.cartIcon = page.locator(locators.cartIcon);
    this.successMessage = page.locator(locators.successAddMessage);
    this.productPrice = page.locator(locators.productPrice);
    this.productImage = page.locator("img");
    this.errorMessageProduct = page.getByText("Не удалось загрузить продукт");
  }

  async goto() {
    await this.page.goto("/");
  }

  async expectSuccess() {
    await expect(this.page).toHaveURL("/");
  }

  async getProductCardByName(productName) {
    return this.page
      .locator(`a[href*="/product/"]:has-text("${productName}")`)
      .first();
  }

  async addProductToCart(productName) {
    const productCard = await this.getProductCardByName(productName);
    await expect(productCard).toBeVisible();
    const addButton = productCard.locator(locators.addToCartButton);
    await expect(addButton).toBeVisible();
    await addButton.click();
    await expect(this.successMessage).toBeVisible();
  }

  async addProductByHref(productHref) {
    const product = this.page.locator(`a[href="${productHref}"]`);
    await expect(product).toBeVisible();
    const addButton = product.locator(locators.addToCartButton);
    await expect(addButton).toBeVisible();
    await addButton.click();
    await expect(this.successMessage).toBeVisible();
  }

  async addProductByIndex(index) {
    const products = await this.productCard.all();
    if (index >= products.length)
      throw new Error(`Товар с индексом ${index} не найден`);
    const addButton = products[index].locator(locators.addToCartButton);
    await expect(addButton).toBeVisible();
    await addButton.click();
    await expect(this.successMessage).toBeVisible();
  }

  async expectProductCount(expectedCount) {
    await expect(this.productCard).toHaveCount(expectedCount);
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}
