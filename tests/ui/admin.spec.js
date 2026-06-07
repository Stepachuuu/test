const { test, expect } = require("@playwright/test");
const { AdminPage } = require("../../pages/AdminPage");
const { loginAs } = require("../../helpers/auth");

const BASE_URL = process.env.BASE_URL;

test.describe("Admin panel", () => {
  let admin;

  // ADM-ACCESS-001 — обычный пользователь не может зайти в админку
  test("ADM-ACCESS-001 | Admin panel blocked for regular user", async ({
    page,
  }) => {
    admin = new AdminPage(page);
    await loginAs(page, "user");
    await admin.navigate();
    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(page.locator('a[href="/admin"]')).not.toBeVisible();
  });

  test.describe("Admin authenticated", () => {
    test.beforeEach(async ({ page }) => {
      admin = new AdminPage(page);
      await loginAs(page, "admin");
    });

    // ADM-DASH-001 — дашборд администратора
    test("ADM-DASH-001 | Admin dashboard overview section", async ({
      page,
    }) => {
      await admin.navigate();

      await expect(admin.welcomeTitle()).toContainText("Добро пожаловать!");
      await expect(admin.dashboardText()).toContainText(
        "Это главная страница админ-панели",
      );
      await expect(admin.sidebarOverviewLink()).toBeVisible();
      await expect(admin.sidebarProductsLink()).toBeVisible();
      await expect(admin.sidebarWarehousesLink()).toBeVisible();
      await expect(admin.sidebarOrdersLink()).toBeVisible();
      await expect(page).toHaveURL(/\/admin$/);
    });

    // ADM-PROD-001 — список товаров
    test("ADM-PROD-001 | View product list in admin", async ({ page }) => {
      await admin.navigateToProducts();

      await expect(admin.createProductButton()).toBeVisible();
      await expect(admin.tableRows().first()).toBeVisible();

      await expect(page.locator("th").filter({ hasText: "ID" })).toBeVisible();
      await expect(
        page.locator("th").filter({ hasText: "Название" }),
      ).toBeVisible();
      await expect(
        page.locator("th").filter({ hasText: "Цена" }),
      ).toBeVisible();
      await expect(
        page.locator("th").filter({ hasText: "Категория" }),
      ).toBeVisible();

      await expect(admin.editButtons().first()).toBeVisible();
      await expect(admin.deleteButtons().first()).toBeVisible();
    });

    // ADM-PROD-002 — создание нового товара
    test("ADM-PROD-002 | Create new product", async ({ page }) => {
      await admin.navigateToProducts();
      await admin.createProductButton().click();
      await expect(admin.modal()).toBeVisible();

      await admin.fillProductForm({
        name: `AutoTest Product ${Date.now()}`,
        description: "Auto test description",
        price: "99.99",
        urlImage:
          "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=500",
      });
      await admin.saveModalButton().click();

      const toast = page.locator("[data-sonner-toast]").first();
      await expect(toast).toBeVisible();
      await expect(toast).toContainText("Товар успешно создан");
      await expect(admin.modal()).not.toBeVisible();
    });

    // ADM-PROD-003 — редактирование товара
    test("ADM-PROD-003 | Edit product", async ({ page }) => {
      await admin.navigateToProducts();
      await admin.editButtons().first().click();
      await expect(admin.modal()).toBeVisible();

      const newName = `Edited Product ${Date.now()}`;
      await admin.productNameInput().clear();
      await admin.productNameInput().fill(newName);
      await admin.productPriceInput().clear();
      await admin.productPriceInput().fill("199.99");
      await admin.saveModalButton().click();

      const toast = page.locator("[data-sonner-toast]").first();
      await expect(toast).toBeVisible();
      await expect(toast).toContainText("Товар успешно обновлен");
    });

    // ADM-PROD-004 — удаление товара
    test("ADM-PROD-004 | Delete product", async ({ page }) => {
      await admin.navigateToProducts();
      await admin.createProductButton().click();

      const productName = `ToDelete ${Date.now()}`;
      await admin.fillProductForm({
        name: productName,
        description: "Will be deleted",
        price: "1.00",
        urlImage:
          "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=500",
      });
      await admin.saveModalButton().click();
      // Ждём создания
      await expect(page.locator("[data-sonner-toast]").first()).toBeVisible();

      // Находим строку с этим названием и кликаем «Удалить»
      const row = page.locator("tr").filter({ hasText: productName });
      await row.locator("button.h-8.rounded-md.bg-destructive").click();

      const toast = page.locator("[data-sonner-toast]").first();
      await expect(toast).toBeVisible();
      await expect(toast).toContainText("Товар удален");
      await expect(row).not.toBeVisible();
    });

    // ADM-PROD-005 — валидация формы товара
    test("ADM-PROD-005 | Product form validation - required fields", async ({
      page,
    }) => {
      await admin.navigateToProducts();
      await admin.createProductButton().click();
      await expect(admin.modal()).toBeVisible();

      await admin.productNameInput().fill("");
      await admin.saveModalButton().click();

      // Модалка не закрылась
      await expect(admin.modal()).toBeVisible();

      // Появился toast с ошибкой
      const toast = page.locator("[data-sonner-toast]").first();
      await expect(toast).toBeVisible();
      await expect(toast).toContainText("Не удалось создать товар");
    });

    // ADM-WH-001 — список складов
    test("ADM-WH-001 | View warehouses list", async ({ page }) => {
      await admin.navigateToWarehouses();

      await expect(admin.createWarehouseButton()).toBeVisible();
      await expect(page.locator("th").filter({ hasText: "ID" })).toBeVisible();
      await expect(
        page.locator("th").filter({ hasText: "Название" }),
      ).toBeVisible();
      await expect(
        page.locator("th").filter({ hasText: "Адрес" }),
      ).toBeVisible();
    });

    // ADM-WH-002 — создание склада
    test("ADM-WH-002 | Create new warehouse", async ({ page }) => {
      await admin.navigateToWarehouses();
      await admin.createWarehouseButton().click();
      await expect(admin.modal()).toBeVisible();

      await admin.fillWarehouseForm({
        title: `Склад Auto ${Date.now()}`,
        address: "ул. Тестовая, д. 1",
      });
      await admin.saveModalButton().click();

      const toast = page.locator("[data-sonner-toast]").first();
      await expect(toast).toBeVisible();
      await expect(toast).toContainText("Склад создан");
    });

    // ADM-WH-003 — редактирование склада
    test("ADM-WH-003 | Edit warehouse", async ({ page }) => {
      await admin.navigateToWarehouses();

      if ((await admin.editButtons().count()) === 0) {
        await admin.createWarehouseButton().click();
        await admin.fillWarehouseForm({
          title: "Test WH",
          address: "Test Address",
        });
        await admin.saveModalButton().click();
        await expect(page.locator("[data-sonner-toast]").first()).toBeVisible();
        await admin.navigateToWarehouses();
      }

      await admin.editButtons().first().click();
      await expect(admin.modal()).toBeVisible();

      const newAddress = `Updated Address ${Date.now()}`;
      await admin.warehouseAddressInput().clear();
      await admin.warehouseAddressInput().fill(newAddress);
      await admin.saveModalButton().click();

      const toast = page.locator("[data-sonner-toast]").first();
      await expect(toast).toBeVisible();
      await expect(toast).toContainText("Склад обновлен");
    });

    // ADM-ORDERS-001 — список всех заказов
    test("ADM-ORDERS-001 | View all orders in admin", async ({ page }) => {
      await admin.navigateToOrders();

      await expect(page.locator("th").filter({ hasText: "ID" })).toBeVisible();
      await expect(
        page.locator("th").filter({ hasText: "Дата" }),
      ).toBeVisible();
      await expect(
        page.locator("th").filter({ hasText: "Покупатель" }),
      ).toBeVisible();
      await expect(
        page.locator("th").filter({ hasText: "Статус" }),
      ).toBeVisible();
    });

    // ADM-ORDERS-002 — изменение статуса заказа
    test("ADM-ORDERS-002 | Change order status", async ({ page }) => {
      await admin.navigateToOrders();

      const rows = admin.tableRows();
      if ((await rows.count()) === 0) {
        test.skip();
        return;
      }

      const firstRow = rows.first();
      const statusCell = firstRow.locator("td").last();
      const currentStatus = (await statusCell.textContent()).trim();

      // Выбираем статус, отличный от текущего
      let newStatus;
      switch (currentStatus) {
        case "SHIPPED":
          newStatus = "DELIVERED";
          break;
        case "DELIVERED":
          newStatus = "SHIPPED";
          break;
        default:
          newStatus = "SHIPPED";
          break; // PENDING или другой → SHIPPED
      }

      await admin.changeOrderStatus(0, newStatus);

      // Проверяем, что статус в таблице изменился на новый
      await expect(statusCell).toHaveText(newStatus, { timeout: 10000 });
    });

    // ADM-LAYOUT-001 — навигация по сайдбару
    test("ADM-LAYOUT-001 | Navigation via sidebar", async ({ page }) => {
      await admin.navigate();

      await admin.sidebarProductsLink().click();
      await expect(page).toHaveURL(`${BASE_URL}/admin/products`);
      await expect(admin.createProductButton()).toBeVisible();

      await admin.sidebarWarehousesLink().click();
      await expect(page).toHaveURL(`${BASE_URL}/admin/warehouses`);
      await expect(admin.createWarehouseButton()).toBeVisible();

      await admin.sidebarOrdersLink().click();
      await expect(page).toHaveURL(`${BASE_URL}/admin/orders`);

      await admin.sidebarOverviewLink().click();
      await expect(page).toHaveURL(`${BASE_URL}/admin`);
      await expect(admin.welcomeTitle()).toContainText("Добро пожаловать!");
    });

    // ADM-LAYOUT-002 — выход из админ-панели
    test("ADM-LAYOUT-002 | Logout from admin panel", async ({ page }) => {
      await admin.navigate();
      await admin.logoutButton().click();

      await expect(page).toHaveURL(`${BASE_URL}/login`);

      await page.goto(`${BASE_URL}/admin`);
      await expect(page).not.toHaveURL(/\/admin/);
    });
  });
});
