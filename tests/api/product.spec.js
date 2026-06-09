const { test, expect } = require("@playwright/test");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../../services/product_service");
const { createTestProduct } = require("../../helpers/api");
const {
  getDefaultProduct,
  getCustomProduct,
} = require("../../fixtures/productFixtures");

test.describe("Product API", () => {
  test("PROD-001 | Create product with valid data returns 201", async ({
    request,
  }) => {
    const productData = getDefaultProduct();

    const res = await createProduct(request, productData);

    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.name).toBe(productData.name);
    expect(Number(body.price)).toBe(productData.price);
    expect(body.id ?? body.productId).toBeTruthy();
  });

  test("PROD-002 | Create product without name field returns 400", async ({
    request,
  }) => {
    const productData = getDefaultProduct();

    const res = await createProduct(request, {
      description: productData.description,
      price: productData.price,
      category: productData.category,
      urlImage: productData.urlImage,
    });

    expect(res.status()).toBe(400);
  });

  test("PROD-003 | Create product with negative price returns 400", async ({
    request,
  }) => {
    const res = await createProduct(request, {
      name: `NegPrice ${Date.now()}`,
      description: "Negative price test",
      price: -1,
      category: "ELECTRONICS",
      urlImage: "https://example.com/img.png",
    });

    expect(res.status()).toBe(400);
  });

  test("PROD-004 | Get all products returns 200 with array", async ({
    request,
  }) => {
    const productData = getDefaultProduct();
    await createTestProduct(request, productData);

    const res = await getAllProducts(request);

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test("PROD-005 | Get product by valid ID returns 200 with product details", async ({
    request,
  }) => {
    const productData = getDefaultProduct();
    const { productId, name } = await createTestProduct(request, productData);

    const res = await getProductById(request, productId);

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.name).toBe(name);
    expect(body.id ?? body.productId).toBe(productId);
  });

  test("PROD-006 | Get product by invalid ID returns 404", async ({
    request,
  }) => {
    const res = await getProductById(request, 999999);

    expect(res.status()).toBe(404);
  });

  test("PROD-007 | Update product with valid data returns 200", async ({
    request,
  }) => {
    const productData = getDefaultProduct();
    const { productId } = await createTestProduct(request, productData);
    const newName = `Updated ${Date.now()}`;

    const res = await updateProduct(request, productId, {
      name: newName,
      price: 59.99,
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.name).toBe(newName);
    expect(Number(body.price)).toBe(59.99);
  });

  test("PROD-008 | Update non-existing product returns 404", async ({
    request,
  }) => {
    const res = await updateProduct(request, 999999, { name: "Ghost" });

    expect(res.status()).toBe(404);
  });

  test("PROD-009 | Delete product returns 200 and product no longer exists", async ({
    request,
  }) => {
    const productData = getDefaultProduct();
    const { productId } = await createTestProduct(request, productData);

    const deleteRes = await deleteProduct(request, productId);
    expect(deleteRes.status()).toBe(200);

    // Проверяем что товар действительно удалён
    const getRes = await getProductById(request, productId);
    expect(getRes.status()).toBe(404);
  });

  test("PROD-010 | Delete non-existing product returns 404", async ({
    request,
  }) => {
    const res = await deleteProduct(request, 999999);

    expect(res.status()).toBe(404);
  });
});
