const BASE_URL = process.env.API_URL;

//Auth

async function registerUser(request, data) {
  return request.post(`${BASE_URL}/auth/register`, { data });
}

async function loginUser(request, email, password) {
  return request.post(`${BASE_URL}/auth/login`, {
    data: { email, password },
  });
}

async function updateUser(request, userId, data) {
  return request.patch(`${BASE_URL}/auth/${userId}`, { data });
}

//Product

async function createProduct(request, data) {
  return request.post(`${BASE_URL}/product`, { data });
}

async function getAllProducts(request) {
  return request.get(`${BASE_URL}/product`);
}

async function getProductById(request, productId) {
  return request.get(`${BASE_URL}/product/${productId}`);
}

async function updateProduct(request, productId, data) {
  return request.patch(`${BASE_URL}/product/${productId}`, { data });
}

async function deleteProduct(request, productId) {
  return request.delete(`${BASE_URL}/product/${productId}`);
}

//Order

async function createOrder(request, userId, items) {
  return request.post(`${BASE_URL}/order/${userId}`, {
    data: { items },
  });
}

async function getOrdersByUserId(request, userId) {
  return request.get(`${BASE_URL}/order/${userId}`);
}

async function updateOrderStatus(request, orderId, status) {
  return request.patch(`${BASE_URL}/order/${orderId}/status`, {
    data: { status },
  });
}

//Bucket

async function getBucket(request, userId) {
  return request.get(`${BASE_URL}/bucket/${userId}`);
}

async function addProductToBucket(request, userId, productId) {
  return request.post(`${BASE_URL}/bucket/${userId}/addProduct`, {
    data: { productId },
  });
}

async function removeProductFromBucket(request, userId, productId) {
  return request.delete(`${BASE_URL}/bucket/${userId}/removeProduct`, {
    data: { productId },
  });
}

//Warehouse

async function createWarehouse(request, data) {
  return request.post(`${BASE_URL}/warehouse`, { data });
}

async function getAllWarehouses(request) {
  return request.get(`${BASE_URL}/warehouse`);
}

async function getWarehouseById(request, warehouseId) {
  return request.get(`${BASE_URL}/warehouse/${warehouseId}`);
}

async function updateWarehouse(request, warehouseId, data) {
  return request.patch(`${BASE_URL}/warehouse/${warehouseId}`, { data });
}

async function updateInventory(request, data) {
  return request.post(`${BASE_URL}/warehouse/inventory`, { data });
}

//Factories

//Creates a unique user and returns { userId, email, username, password }
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

// Creates a product and returns { productId, ...fields }
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

//Creates a warehouse and returns { warehouseId, ...fields }
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
  registerUser,
  loginUser,
  updateUser,
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createOrder,
  getOrdersByUserId,
  updateOrderStatus,
  getBucket,
  addProductToBucket,
  removeProductFromBucket,
  createWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
  updateInventory,
  createUniqueUser,
  createTestProduct,
  createTestWarehouse,
};
