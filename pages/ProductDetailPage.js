const { BasePage } = require("./BasePage");

class ProductDetailPage extends BasePage {
  constructor(page) {
    super(page);
  }

  productName() {
    return this.page.locator("h1.text-3xl.font-bold");
  }
  productCategory() {
    return this.page.locator("p.text-muted-foreground").first();
  }
  productPrice() {
    return this.page.locator("p.text-3xl.font-bold");
  }
  productDescription() {
    return this.page.locator("p.mt-2.text-muted-foreground");
  }
  productImage() {
    return this.page.locator("img.w-full.h-auto.rounded-lg");
  }
  addToCartButton() {
    return this.page.locator("button.h-10.rounded-md.px-8");
  }
  errorBlock() {
    return this.page.locator("div.text-destructive");
  }

  async navigateToProduct(productId) {
    await this.goto(`/product/${productId}`);
  }

  async addToCart() {
    await this.addToCartButton().click();
  }
}

module.exports = { ProductDetailPage };
