import { test } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage.js";

const USER_EMAIL = process.env.TEST_USER_EMAIL;
const USER_PASSWORD = process.env.TEST_USER_PASSWORD;

test.describe("Login page tests", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("LGN-001: Successful login", async () => {
    await loginPage.login(USER_EMAIL, USER_PASSWORD);
    await loginPage.expectSuccess();
  });

  test("LGN-002: Navigate to Registration page", async () => {
    await loginPage.clickRegisterLink();
    await loginPage.page.waitForURL("/register");
  });

  test("LGN-003: Login with invalid password", async () => {
    await loginPage.login(USER_EMAIL, "wrongpass");
    await loginPage.expectError("Неверный email или пароль");
  });

  test("LGN-004: Login with empty fields", async () => {
    await loginPage.login("", "");
    await loginPage.expectEmailErrorVisible();
    await loginPage.expectPasswordErrorVisible();
  });

  test("LGN-005: Password case sensitivity", async () => {
    await loginPage.login(USER_EMAIL, USER_PASSWORD.toUpperCase());
    await loginPage.expectError("Неверный email или пароль");
  });
});
