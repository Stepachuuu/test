import { test, expect } from "@playwright/test";
import { RegisterPage } from "../../pages/RegisterPage.js";
import { getNewUser } from "../../helpers/testData.js";

const EXISTING_EMAIL = process.env.TEST_USER_EMAIL; // email уже существующего пользователя

test.describe("Registration Page Tests", () => {
  let registerPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test("REG-001: Successful user registration", async () => {
    const newUser = getNewUser();
    await registerPage.register(newUser);
    await registerPage.expectSuccess(); // редирект на /login
  });

  test("REG-002: Verify required fields validation", async () => {
    await registerPage.register({
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      phone: "",
      password: "",
    });
    await registerPage.expectFieldErrors();
  });

  test("REG-003: Verify invalid email format validation", async () => {
    const user = getNewUser();
    await registerPage.register({ ...user, email: "not-an-email" });
    await registerPage.expectEmailFormatError();
  });

  test("REG-004: Verify registration with existing email", async () => {
    const user = getNewUser();
    await registerPage.register({ ...user, email: EXISTING_EMAIL });
    await registerPage.expectEmailAlreadyExistsError(EXISTING_EMAIL);
  });
});
