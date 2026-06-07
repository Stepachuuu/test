const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../../pages/LoginPage");
const { HomePage } = require("../../pages/HomePage");

const BASE_URL = process.env.BASE_URL;

test.describe("Login", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // LGN-001 — вход обычного пользователя
  test("LGN-001 | Login with valid regular user credentials", async ({
    page,
  }) => {
    await loginPage.login(process.env.USER_EMAIL, process.env.USER_PASSWORD);

    await expect(page).toHaveURL(`${BASE_URL}/`);

    const homePage = new HomePage(page);
    await expect(homePage.ordersNavLink()).toBeVisible();
    await expect(
      page.locator(
        "div.flex.flex-col.items-start.text-left span.text-sm.font-medium.leading-none",
      ),
    ).toContainText("user");
  });

  // LGN-002 — вход администратора
  test("LGN-002 | Login with valid admin credentials", async ({ page }) => {
    await loginPage.login(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(page.locator('a[href="/admin"]')).toBeVisible();

    await page.goto(`${BASE_URL}/admin`);
    await expect(page).toHaveURL(/\/admin/);
  });

  // LGN-003 — неверный пароль
  test("LGN-003 | Login with incorrect password", async ({ page }) => {
    await loginPage.login(process.env.USER_EMAIL, "wrong");

    await expect(page).toHaveURL(/\/login/);
    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText("Неверный email или пароль");
  });

  // LGN-004 — несуществующий email
  test("LGN-004 | Login with non-existent email", async ({ page }) => {
    await loginPage.login("noexist@test.com", "12345678");

    await expect(page).toHaveURL(/\/login/);
    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText("Неверный email или пароль");
  });

  // LGN-005 — пустые поля
  test("LGN-005 | Login with empty fields", async ({ page }) => {
    await loginPage.loginButton().click();

    await expect(page).toHaveURL(/\/login/);
    await expect(
      loginPage.formErrors().filter({ hasText: "Email обязателен" }),
    ).toBeVisible();
    await expect(
      loginPage.formErrors().filter({ hasText: "Пароль обязателен" }),
    ).toBeVisible();
  });

  // LGN-006 — только email, пароль пустой
  test("LGN-006 | Login with only email, password empty", async ({ page }) => {
    await loginPage.fillEmail(process.env.USER_EMAIL || "user1@test.com");
    await loginPage.loginButton().click();

    await expect(
      loginPage.formErrors().filter({ hasText: "Пароль обязателен" }),
    ).toBeVisible();
  });

  // LGN-007 — только пароль, email пустой
  test("LGN-007 | Login with only password, email empty", async ({ page }) => {
    await loginPage.fillPassword(process.env.USER_PASSWORD || "user123");
    await loginPage.loginButton().click();

    await expect(
      loginPage.formErrors().filter({ hasText: "Email обязателен" }),
    ).toBeVisible();
  });

  // LGN-008 — переход на страницу регистрации по ссылке
  test("LGN-008 | Redirect to register page via link", async ({ page }) => {
    await loginPage.registerLink().click();

    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator('form button[type="submit"]')).toBeVisible();
  });

  // LGN-009 — пароль с неверным регистром
  test("LGN-009 | Login with wrong case password", async ({ page }) => {
    await loginPage.login(
      process.env.USER_EMAIL || "user1@test.com",
      "USER123",
    );

    await expect(page).toHaveURL(/\/login/);
    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText("Неверный email или пароль");
  });
});
