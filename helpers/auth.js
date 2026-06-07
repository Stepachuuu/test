async function loginAs(page, role) {
  const email =
    role === "admin" ? process.env.ADMIN_EMAIL : process.env.USER_EMAIL;
  const password =
    role === "admin" ? process.env.ADMIN_PASSWORD : process.env.USER_PASSWORD;

  const baseUrl = process.env.BASE_URL;

  await page.goto(`${baseUrl}/login`);
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('form button[type="submit"]').click();
  await page.waitForURL(`${baseUrl}/`);
}

module.exports = { loginAs };
