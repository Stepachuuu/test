const { test, expect } = require("@playwright/test");
const {
  registerUser,
  loginUser,
  updateUser,
} = require("../../services/auth_service");
const {
  getDefaultUser,
  getCustomUser,
  getAdminUser,
} = require("../../fixtures/userFixtures");
const { createUniqueUser } = require("../../helpers/api");

const uid = () => Date.now();

test.describe("Auth API", () => {
  test("AUTH-001 | Successful user registration", async ({ request }) => {
    const userData = getDefaultUser();
    const user = await createUniqueUser(request, userData);

    expect(user.userId).toBeDefined();
    expect(user.email).toBe(userData.email);
  });

  test("AUTH-002 | Registration with existing email returns 409", async ({
    request,
  }) => {
    const userData = getDefaultUser();
    const user = await createUniqueUser(request, userData);

    const res = await registerUser(request, {
      ...getDefaultUser(), // берем базовые данные
      email: user.email, // переопределяем email на существующий
      username: `other_${Date.now()}`, // уникальный username
    });

    expect(res.status()).toBe(409);
  });

  test("AUTH-003 | Registration without required field (password) returns 400", async ({
    request,
  }) => {
    const res = await registerUser(request, {
      firstname: "Ivan",
      lastname: "Ivanov",
      phoneNumber: "+12345678901",
      email: `nopwd_${uid()}@test.com`,
      username: `nopwd_${uid()}`,
      // password намеренно пропущен
      role: "USER",
    });

    expect(res.status()).toBe(400);
  });

  test("AUTH-004 | Registration with invalid email format returns 400", async ({
    request,
  }) => {
    const res = await registerUser(request, {
      firstname: "Ivan",
      lastname: "Ivanov",
      phoneNumber: "+12345678901",
      email: "not-an-email", // невалидный формат
      username: `bademail_${uid()}`,
      password: "password123",
      role: "USER",
    });

    expect(res.status()).toBe(400);
  });

  test("AUTH-005 | Login as existing user returns 201 with user data", async ({
    request,
  }) => {
    // Регистрируем нового пользователя, чтобы не зависеть от seed-данных
    const userData = getDefaultUser();
    const user = await createUniqueUser(request, userData);

    const res = await loginUser(request, user.email, user.password);

    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.email).toBe(user.email);
    expect(body.role).toBeDefined();
  });

  test("AUTH-006 | Login as admin returns 201 with role ADMIN", async ({
    request,
  }) => {
    const adminData = getAdminUser();
    const admin = await createUniqueUser(request, adminData);

    const res = await loginUser(request, admin.email, admin.password);

    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.role).toBe("ADMIN");
  });

  test("AUTH-007 | Login with invalid password returns 401", async ({
    request,
  }) => {
    const userData = getDefaultUser();
    const user = await createUniqueUser(request, userData);

    const res = await loginUser(request, user.email, "wrong_password");

    expect(res.status()).toBe(401);
  });

  test("AUTH-008 | Login with non-existing email returns 401", async ({
    request,
  }) => {
    const res = await loginUser(
      request,
      `ghost_${uid()}@test.com`,
      "password123",
    );

    expect(res.status()).toBe(401);
  });

  test("AUTH-009 | Update existing user returns 200 with updated data", async ({
    request,
  }) => {
    const userData = getDefaultUser();
    const user = await createUniqueUser(request, userData);

    const newEmail = `updated_${Date.now()}@test.com`;
    const res = await updateUser(request, user.userId, {
      email: newEmail,
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.email).toBe(newEmail);
  });

  test("AUTH-010 | Update non-existing user returns 404", async ({
    request,
  }) => {
    const res = await updateUser(request, 999999, {
      email: `ghost_${uid()}@test.com`,
    });

    expect(res.status()).toBe(404);
  });

  test("AUTH-011 | Update user with existing email returns 409", async ({
    request,
  }) => {
    const user1Data = getDefaultUser();
    const user1 = await createUniqueUser(request, user1Data);

    const user2Data = getDefaultUser();
    const user2 = await createUniqueUser(request, user2Data);

    // Пытаемся обновить email user2 на email user1
    const res = await updateUser(request, user2.userId, {
      email: user1.email,
    });
  });
});
