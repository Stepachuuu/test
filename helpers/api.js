const { registerUser } = require("../services/auth_service");
const { createProduct } = require("../services/product_service");
const { createWarehouse } = require("../services/warehouse_service");

const BASE_URL = process.env.API_URL;

async function createUniqueUser(request, userData) {
  const res = await registerUser(request, userData);
  if (!res.ok()) {
    throw new Error(
      `createUniqueUser failed: ${res.status()} ${await res.text()}`,
    );
  }
  const body = await res.json();
  return { ...userData, userId: body.id ?? body.userId ?? body.user?.id };
}

async function createTestProduct(request, productData) {
  const res = await createProduct(request, productData);
  if (!res.ok()) {
    throw new Error(
      `createTestProduct failed: ${res.status()} ${await res.text()}`,
    );
  }
  const body = await res.json();
  return { ...productData, productId: body.id ?? body.productId };
}

async function createTestWarehouse(request, warehouseData) {
  const res = await createWarehouse(request, warehouseData);
  if (!res.ok()) {
    throw new Error(
      `createTestWarehouse failed: ${res.status()} ${await res.text()}`,
    );
  }
  const body = await res.json();
  return { ...warehouseData, warehouseId: body.id ?? body.warehouseId };
}

module.exports = {
  createUniqueUser,
  createTestProduct,
  createTestWarehouse,
};
