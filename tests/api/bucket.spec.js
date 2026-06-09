const { test, expect } = require("@playwright/test");
const { createUniqueUser, createTestProduct } = require("../../helpers/api");
const {
  getBucket,
  addProductToBucket,
  removeProductFromBucket,
} = require("../../services/bucket_service");
const { getDefaultUser } = require("../../fixtures/userFixtures");
const { getDefaultProduct } = require("../../fixtures/productFixtures");

test.describe("Bucket API", () => {
  let user;
  let product;

  test.beforeEach(async ({ request }) => {
    const userData = getDefaultUser();
    user = await createUniqueUser(request, userData);

    const productData = getDefaultProduct();
    product = await createTestProduct(request, productData);
  });

  test("BUCKET-001 | Add product to bucket returns 201", async ({
    request,
  }) => {
    const res = await addProductToBucket(
      request,
      user.userId,
      product.productId,
    );
    expect(res.status()).toBe(201);
  });

  test("BUCKET-002 | Add non-existing product to bucket returns 404", async ({
    request,
  }) => {
    const res = await addProductToBucket(request, user.userId, 999999);
    expect(res.status()).toBe(404);
  });

  test("BUCKET-003 | Add product to non-existing user bucket returns 404", async ({
    request,
  }) => {
    const res = await addProductToBucket(request, 999999, product.productId);
    expect(res.status()).toBe(404);
  });

  test("BUCKET-004 | Get user bucket returns 200 with bucket data", async ({
    request,
  }) => {
    await addProductToBucket(request, user.userId, product.productId);

    const res = await getBucket(request, user.userId);
    expect(res.status()).toBe(200);

    const body = await res.json();
    const items = body.items ?? body.bucketItems ?? body.products ?? [];
    expect(items.length).toBeGreaterThan(0);
  });

  test("BUCKET-005 | Get bucket for non-existing user returns 404", async ({
    request,
  }) => {
    const res = await getBucket(request, 999999);
    expect(res.status()).toBe(404);
  });

  test("BUCKET-006 | Remove product from bucket returns 200", async ({
    request,
  }) => {
    await addProductToBucket(request, user.userId, product.productId);

    const res = await removeProductFromBucket(
      request,
      user.userId,
      product.productId,
    );
    expect(res.status()).toBe(200);

    const bucketRes = await getBucket(request, user.userId);
    const body = await bucketRes.json();
    const items = body.items ?? body.bucketItems ?? body.products ?? [];
    const stillInCart = items.some(
      (i) =>
        (i.productId ?? i.product_id ?? i.product?.id) === product.productId,
    );
    expect(stillInCart).toBe(false);
  });

  test("BUCKET-007 | Remove product not present in bucket returns 404", async ({
    request,
  }) => {
    const res = await removeProductFromBucket(
      request,
      user.userId,
      product.productId,
    );
    expect(res.status()).toBe(404);
  });
});
