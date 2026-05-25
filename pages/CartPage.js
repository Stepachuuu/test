import { expect } from "@playwright/test";
import { locators } from "../helpers/locators.js";

export class CartPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = page.locator(locators.cartIcon);
    this.removeButton = page.locator(locators.removeButton);
    this.totalPrice = page.locator(locators.totalPrice);
    this.checkoutButton = page.locator(locators.checkoutButton);
    this.emptyCartMessage = page.locator(locators.emptyCartMessage);
    this.successMessage = page.locator(locators.successAddMessage);
    this.orderSuccessMessage = page.locator(locators.orderSuccessMessage);
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async successAdd() {
    await expect(this.successMessage).toBeVisible();
  }

  async expectProductInCart(productName) {
    await expect(this.page.getByText(productName)).toBeVisible();
  }

  async removeProduct() {
    await this.removeButton.first().click();
  }

  async getTotalPrice() {
    await expect(this.totalPrice).toBeVisible();
    return await this.totalPrice.textContent();
  }

  async expectEmptyCart() {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async clearCart() {
    await this.page.goto("/cart");

    // Ждём загрузки страницы корзины (появление сообщения "Ваша корзина пуста" или кнопок удаления)
    await Promise.race([
      this.emptyCartMessage.waitFor({ timeout: 5000 }),
      this.removeButton.first().waitFor({ timeout: 5000 }),
    ]);

    // Удаляем все товары, пока они есть
    let removeButtons = await this.removeButton.all();
    while (removeButtons.length > 0) {
      // Кликаем по первой кнопке "Удалить"
      await removeButtons[0].click();
      // Ждём, пока элемент исчезнет (или обновится список)
      await this.page.waitForTimeout(300);
      // Пересчитываем кнопки
      removeButtons = await this.removeButton.all();
    }

    await this.expectEmptyCart();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async expectOrderSuccess() {
    await expect(this.orderSuccessMessage).toBeVisible();
  }

  async getCartTotalPrice() {
    const totalText = await this.getTotalPrice();
    return parseFloat(totalText?.split(" ")[0]?.replace(",", ".") || "0");
  }
}
