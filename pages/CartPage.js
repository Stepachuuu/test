import { expect } from "@playwright/test";
import { locators } from "../helpers/locators.js";

export class CartPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = page.locator(locators.cartIcon);
    this.removeButton = page.locator(locators.removeProductBtn);
    this.totalPrice = page.locator(locators.totalPriceSpan);
    this.checkoutButton = page.locator(locators.checkoutBtn);
    this.emptyCartMessage = page.locator(locators.emptyCartText);
    this.orderSuccessMessage = page.locator(locators.orderSuccessToast);
    this.cartItemRow = page.locator(locators.cartItemRow);
  }

  async goToCart() {
    await this.cartIcon.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getCartItemCount() {
    return await this.cartItemRow.count();
  }

  async removeProduct(index = 0) {
    const removeButtons = await this.removeButton.all();
    if (removeButtons.length === 0) throw new Error('Нет кнопок "Удалить"');
    await removeButtons[index].click();
    await this.page.waitForTimeout(500);
  }

  async getTotalPrice() {
    const text = await this.totalPrice.textContent();
    return parseFloat(text?.split(" ")[0]?.replace(",", ".") || "0");
  }

  async expectEmptyCart() {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async clearCart() {
    await this.page.goto("/cart");
    let removeButtons = await this.removeButton.all();
    while (removeButtons.length > 0) {
      await removeButtons[0].click();
      await this.page.waitForTimeout(500);
      removeButtons = await this.removeButton.all();
    }
    await this.expectEmptyCart();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async expectOrderSuccess() {
    await expect(this.orderSuccessMessage).toBeVisible({ timeout: 10000 });
    await expect(this.page).toHaveURL("/");
  }
}
