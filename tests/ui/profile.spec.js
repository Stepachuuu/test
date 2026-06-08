const { test, expect } = require("@playwright/test");
const { ProfilePage } = require("../../pages/ProfilePage");
const { loginAs } = require("../../helpers/auth");

test.describe("Profile page", () => {
  let profile;

  test.beforeEach(async ({ page }) => {
    profile = new ProfilePage(page);
    await loginAs(page, "user");
    await profile.navigate();
  });

  // PFL-001 — успешное обновление данных
  test("PFL-001 | Successful update phone and username", async ({ page }) => {
    const s = Date.now();

    await profile.usernameInput().clear();
    await profile.usernameInput().fill(`updateduser_${s}`);
    await profile.updatePhone("+79991234568");
    await profile.saveButton().click();

    const toast = await profile.waitForToast();
    await expect(toast).toContainText("Профиль успешно обновлен");

    await page.reload();
    await expect(profile.emailInput()).not.toHaveValue("");
  });

  // PFL-002 — обновление только телефона
  test("PFL-002 | Update only phone number field", async ({ page }) => {
    await profile.updatePhone("+79991234567");

    const toast = await profile.waitForToast();
    await expect(toast).toContainText("Профиль успешно обновлен");
    // Остальные поля не очистились
    await expect(profile.emailInput()).not.toHaveValue("");
  });

  // PFL-003 — занятый email
  test("PFL-003 | Attempt to use existing email", async ({ page }) => {
    await profile.updateEmail("user2@test.com");

    const toast = await profile.waitForToast();
    await expect(toast).toContainText("already exists");
  });

  // PFL-004 — занятый username
  test("PFL-004 | Attempt to use existing username", async ({ page }) => {
    await profile.updateUsername("user2");
    await profile.updatePhone("+37529292929");

    const toast = await profile.waitForToast();
    await expect(toast).toContainText("already exists");
  });

  // PFL-005 — очистка обязательного поля email
  test("PFL-005 | Empty required field - email", async ({ page }) => {
    await profile.clearAndSave("email");

    // FormMessage: p.text-destructive
    await expect(
      profile.formErrors().filter({ hasText: "обязателен" }),
    ).toBeVisible();
  });

  // PFL-005b — очистка обязательного поля username
  test("PFL-005b | Empty required field - username", async ({ page }) => {
    await profile.clearAndSave("username");

    await expect(
      profile.formErrors().filter({ hasText: "обязателен" }),
    ).toBeVisible();
  });
});
