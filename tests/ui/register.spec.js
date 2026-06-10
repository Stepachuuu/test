const { test, expect } = require("@playwright/test");
const { RegisterPage } = require("../../pages/RegisterPage");

const uid = () => Date.now();

test.describe("Register", () => {
  let reg;

  test.beforeEach(async ({ page }) => {
    reg = new RegisterPage(page);
    await reg.navigate();
  });

  // REG-001 — успешная регистрация
  test("REG-001 | Register new user with valid data", async ({ page }) => {
    const s = uid();
    await reg.register({
      firstname: "Test",
      lastname: "User",
      email: `testuser_${s}@test.com`,
      username: `testuser_${s}`,
      phone: "+12345678901",
      password: "password123",
    });

    await expect(reg.toastLocator()).toContainText(
      "Регистрация прошла успешно!",
    );
    await expect(page).toHaveURL(/\/login/);
  });

  // REG-002 — существующий email
  test("REG-002 | Register with existing email", async ({ page }) => {
    await reg.register({
      firstname: "Test",
      lastname: "User",
      email: "user1@test.com", // существует
      username: `uniq_${uid()}`,
      phone: "+12345678901",
      password: "password123",
    });

    await expect(reg.toastLocator()).toContainText("already exists");
    await expect(page).toHaveURL(/\/register/);
  });

  // REG-003 — существующий username (BUG #2: сервер возвращает Internal server error)
  test.fixme("REG-003 | Register with existing username", async ({ page }) => {
    await reg.register({
      firstname: "Test",
      lastname: "User",
      email: `uniq_${uid()}@test.com`,
      username: "user1", // существует
      phone: "+12345678901",
      password: "password123",
    });

    await expect(reg.toastLocator()).toContainText("already exists");
    await expect(page).toHaveURL(/\/register/);
  });

  // REG-004 — пароль короче 8 символов (BUG #1: сообщение об ошибки не отображается)
  test.fixme("REG-004 | Register with password shorter than 8 characters @bug", async ({
    page,
  }) => {
    await reg.register({
      firstname: "Test",
      lastname: "User",
      email: `short_${uid()}@test.com`,
      username: `short_${uid()}`,
      phone: "+12345678901",
      password: "1234567",
    });

    // BUG #1: ожидаем FormMessage с текстом
    await expect(
      reg
        .formErrors()
        .filter({ hasText: "Password must be at least 8 characters long" }),
    ).toBeVisible();
  });

  // REG-005 — телефон без +
  test("REG-005 | Register with invalid phone format (without +)", async ({
    page,
  }) => {
    await reg.register({
      firstname: "Test",
      lastname: "User",
      email: `phone_${uid()}@test.com`,
      username: `phone_${uid()}`,
      phone: "1234567890",
      password: "password123",
    });

    const toast = await reg.waitForToast();
    await expect(toast).toContainText(
      "phoneNumber must be in international format",
    );
  });

  // REG-006 — все поля пустые
  test("REG-006 | Register with all empty fields", async ({ page }) => {
    await reg.submit();

    const errors = reg.formErrors();
    await expect(errors.filter({ hasText: "Имя обязательно" })).toBeVisible();
    await expect(
      errors.filter({ hasText: "Фамилия обязательна" }),
    ).toBeVisible();
    await expect(errors.filter({ hasText: "Email обязателен" })).toBeVisible();
    await expect(
      errors.filter({ hasText: "Username обязателен" }),
    ).toBeVisible();
    await expect(
      errors.filter({ hasText: "Телефон обязателен" }),
    ).toBeVisible();
    await expect(errors.filter({ hasText: "Пароль обязателен" })).toBeVisible();
  });

  // REG-007 — невалидный формат email
  test("REG-007 | Register with invalid email format", async ({ page }) => {
    await reg.register({
      firstname: "Test",
      lastname: "User",
      email: "userexample.com",
      username: `invalidemail_${uid()}`,
      phone: "+12345678901",
      password: "password123",
    });

    await expect(reg.toastLocator()).toContainText("email must be an email");
  });

  // REG-008 — переход на страницу входа по ссылке
  test("REG-008 | Redirect to login page via link", async ({ page }) => {
    await reg.loginLink().click();
    await expect(page).toHaveURL(/\/login/);
  });

  // REG-009 — телефон с буквами
  test("REG-009 | Register with phone containing letters", async ({ page }) => {
    await reg.register({
      firstname: "Test",
      lastname: "User",
      email: `phone2_${uid()}@test.com`,
      username: `phone2_${uid()}`,
      phone: "+abc123",
      password: "password123",
    });

    await expect(reg.toastLocator()).toContainText(
      "phoneNumber must be in international format",
    );
  });
});
