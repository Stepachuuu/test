const { test, expect } = require("@playwright/test");
const {
  createOrder,
  getOrdersByUserId,
  updateOrderStatus,
} = require("../../services/order_service");
const { createUniqueUser, createTestProduct } = require("../../helpers/api");
const { getDefaultUser } = require("../../fixtures/userFixtures");
const { getDefaultProduct } = require("../../fixtures/productFixtures");

test.describe("Order API", () => {
  let user;
  let product;

  test.beforeEach(async ({ request }) => {
    const userData = getDefaultUser();
    const productData = getDefaultProduct();

    user = await createUniqueUser(request, userData);
    product = await createTestProduct(request, productData);
  });

  test("ORDER-001 | Create order with valid data returns 201", async ({
    request,
  }) => {
    const res = await createOrder(request, user.userId, [
      { product_id: product.productId, quantity: 1 },
    ]);

    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.id ?? body.orderId).toBeTruthy();
  });

  test("ORDER-002 | Create order with multiple products returns 201", async ({
    request,
  }) => {
    const productData = getDefaultProduct();
    const p2 = await createTestProduct(request, productData);

    const res = await createOrder(request, user.userId, [
      { product_id: product.productId, quantity: 2 },
      { product_id: p2.productId, quantity: 3 },
    ]);

    expect(res.status()).toBe(201);

    const body = await res.json();

    expect(body.orderId).toBeDefined();
    expect(typeof body.orderId).toBe("number");

    const ordersRes = await getOrdersByUserId(request, user.userId);
    const orders = await ordersRes.json();
    const createdOrder = orders.find((order) => order.id === body.orderId);

    expect(createdOrder).toBeDefined();
    expect(createdOrder.items.length).toBe(2);
  });

  test("ORDER-003 | Create order with invalid productId returns 404", async ({
    request,
  }) => {
    const res = await createOrder(request, user.userId, [
      { product_id: 999999, quantity: 1 },
    ]);

    expect(res.status()).toBe(404);
  });

  test("ORDER-004 | Create order for non-existing user returns 404", async ({
    request,
  }) => {
    const res = await createOrder(request, 999999, [
      { product_id: product.productId, quantity: 1 },
    ]);

    expect(res.status()).toBe(404);
  });

  test("ORDER-005 | Create order with quantity = 0 returns 400", async ({
    request,
  }) => {
    const res = await createOrder(request, user.userId, [
      { product_id: product.productId, quantity: 0 },
    ]);

    expect(res.status()).toBe(400);
  });

  test("ORDER-006 | Get user orders returns 200 with order list", async ({
    request,
  }) => {
    await createOrder(request, user.userId, [
      { product_id: product.productId, quantity: 1 },
    ]);

    const res = await getOrdersByUserId(request, user.userId);

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test("ORDER-007 | Get orders for non-existing user returns 404", async ({
    request,
  }) => {
    const res = await getOrdersByUserId(request, 999999);

    expect(res.status()).toBe(404);
  });

  test("ORDER-008 | Update order status returns 200 with updated status", async ({
    request,
  }) => {
    const orderRes = await createOrder(request, user.userId, [
      { product_id: product.productId, quantity: 1 },
    ]);
    const order = await orderRes.json();
    const orderId = order.id ?? order.orderId;

    const res = await updateOrderStatus(request, orderId, "SHIPPED");

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("SHIPPED");
  });

  test("ORDER-009 | Update status of non-existing order returns 404", async ({
    request,
  }) => {
    const res = await updateOrderStatus(request, 999999, "SHIPPED");

    expect(res.status()).toBe(404);
  });

  test("ORDER-010 | Update order with invalid status returns 400", async ({
    request,
  }) => {
    const orderRes = await createOrder(request, user.userId, [
      { product_id: product.productId, quantity: 1 },
    ]);
    const order = await orderRes.json();
    const orderId = order.id ?? order.orderId;

    const res = await updateOrderStatus(request, orderId, "FLYING");

    expect(res.status()).toBe(400);

    const body = await res.json();
    const message = Array.isArray(body.message)
      ? body.message[0]
      : body.message;

    expect(body.statusCode).toBe(400);
    expect(body.error).toBe("Bad Request");
    expect(message.toLowerCase()).toContain("status");
    expect(message.toLowerCase()).toContain("must be one of");
  });
});
