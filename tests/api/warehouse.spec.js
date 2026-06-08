const { test, expect } = require("@playwright/test");
const { createTestWarehouse, createTestProduct } = require("../../helpers/api");
const {
  createWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
  updateInventory,
} = require("../../services/warehouse_service");

test.describe("Warehouse API", () => {
  test("WH-001 | Create warehouse with valid data returns 201", async ({
    request,
  }) => {
    const payload = {
      title: `Main WH ${Date.now()}`,
      address: "Via Roma 25, Milano, MI 20121",
    };

    const res = await createWarehouse(request, payload);

    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.title).toBe(payload.title);
    expect(body.id ?? body.warehouseId).toBeTruthy();
  });

  test("WH-002 | Create warehouse without required field (address) returns 400", async ({
    request,
  }) => {
    const res = await createWarehouse(request, {
      title: `NoAddr WH ${Date.now()}`,
      // address намеренно пропущен
    });

    expect(res.status()).toBe(400);
  });

  test("WH-003 | Get warehouse by valid ID returns 200 with warehouse data", async ({
    request,
  }) => {
    const { warehouseId, title } = await createTestWarehouse(request);

    const res = await getWarehouseById(request, warehouseId);

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.title).toBe(title);
    expect(body.id ?? body.warehouseId).toBe(warehouseId);
  });

  test("WH-004 | Get non-existing warehouse returns 404", async ({
    request,
  }) => {
    const res = await getWarehouseById(request, 999999);

    expect(res.status()).toBe(404);
  });

  test("WH-005 | Update warehouse with valid data returns 200", async ({
    request,
  }) => {
    const { warehouseId } = await createTestWarehouse(request);
    const newTitle = `Updated WH ${Date.now()}`;

    const res = await updateWarehouse(request, warehouseId, {
      title: newTitle,
      address: "Via Nuova 99, Roma, RM 00100",
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.title).toBe(newTitle);
  });

  test("WH-006 | Update non-existing warehouse returns 404", async ({
    request,
  }) => {
    const res = await updateWarehouse(request, 999999, {
      title: "Ghost WH",
    });

    expect(res.status()).toBe(404);
  });

  test("WH-007 | Update inventory with valid data returns 201", async ({
    request,
  }) => {
    const { warehouseId } = await createTestWarehouse(request);
    const { productId } = await createTestProduct(request);

    const res = await updateInventory(request, {
      productId,
      warehouseId,
      quantity: 100,
    });

    // Swagger: 201 Inventory successfully updated or created
    expect(res.status()).toBe(201);
  });

  test("WH-008 | Update inventory with invalid productId returns 404", async ({
    request,
  }) => {
    const { warehouseId } = await createTestWarehouse(request);

    const res = await updateInventory(request, {
      productId: 999999,
      warehouseId,
      quantity: 50,
    });

    expect(res.status()).toBe(404);
  });

  test("WH-009 | Update inventory with invalid warehouseId returns 404", async ({
    request,
  }) => {
    const { productId } = await createTestProduct(request);

    const res = await updateInventory(request, {
      productId,
      warehouseId: 999999,
      quantity: 50,
    });

    expect(res.status()).toBe(404);
  });
});
