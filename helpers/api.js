const { registerUser } = require ('../services/auth_service');
const { createProduct } = require ('../services/product_service');
const { createWarehouse } = require ('../services/warehouse_service');

const BASE_URL = process.env.API_URL;

// Creates a unique user and returns
async function createUniqueUser(request) {
  const suffix = Date.now();
  const payload = {
    firstname:   'Test',
    lastname:    'User',
    phoneNumber: '+12345678901',
    email:       `testuser_${suffix}@test.com`,
    username:    `testuser_${suffix}`,
    password:    'password123',
    role:        'USER',
  };
  const res = await registerUser(request, payload);
  if (!res.ok()) {
    throw new Error(`createUniqueUser failed: ${res.status()} ${await res.text()}`);
  }
  const body = await res.json();
  return { ...payload, userId: body.id ?? body.userId ?? body.user?.id };
}

// Creates a product and returns
async function createTestProduct(request, overrides = {}) {
  const payload = {
    name:        `Test Product ${Date.now()}`,
    description: 'Auto-generated test product',
    price:       9.99,
    category:    'ELECTRONICS',
    urlImage:    'https://example.com/img.png',
    ...overrides,
  };
  const res = await createProduct(request, payload);
  if (!res.ok()) {
    throw new Error(`createTestProduct failed: ${res.status()} ${await res.text()}`);
  }
  const body = await res.json();
  return { ...payload, productId: body.id ?? body.productId };
}

// Creates a warehouse and returns { warehouseId, ...fields }
async function createTestWarehouse(request, overrides = {}) {
  const payload = {
    title:   `Test Warehouse ${Date.now()}`,
    address: 'Via Test 1, Milano, MI 20121',
    ...overrides,
  };
  const res = await createWarehouse(request, payload);
  if (!res.ok()) {
    throw new Error(`createTestWarehouse failed: ${res.status()} ${await res.text()}`);
  }
  const body = await res.json();
  return { ...payload, warehouseId: body.id ?? body.warehouseId };
}

module.exports = {
  createUniqueUser,
  createTestProduct,
  createTestWarehouse,
};
