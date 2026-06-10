module.exports = {
  getDefaultProduct() {
    return {
      name: `Test Product ${Date.now()}`,
      description: "Auto-generated test product",
      price: 9.99,
      category: "ELECTRONICS",
      urlImage: "https://example.com/img.png",
    };
  },

  getCustomProduct(name, price) {
    return {
      name: name,
      description: "Custom test product",
      price: price,
      category: "ELECTRONICS",
      urlImage: "https://example.com/img.png",
    };
  },
};
