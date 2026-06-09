module.exports = {
  getDefaultWarehouse() {
    return {
      title: `Test Warehouse ${Date.now()}`,
      address: "Via Test 1, Milano, MI 20121",
    };
  },

  getCustomWarehouse(title, address) {
    return {
      title: title,
      address: address,
    };
  },
};
