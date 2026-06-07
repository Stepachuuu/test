const { test, expect } = require('@playwright/test');
const { registerUser, loginUser, updateUser, createUniqueUser } = require('../../helpers/api');

const uid = () => Date.now();

test.describe('Auth API', () => {

  test('AUTH-001 | Successful user registration', async ({ request }) => {
    const suffix = uid();
    const res = await registerUser(request, {
      firstname:   'Ivan',
      lastname:    'Ivanov',
      phoneNumber: '+12345678901',
      email:       `ivan_${suffix}@test.com`,
      username:    `ivan_${suffix}`,
      password:    'password123',
      role:        'USER',
    });

    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body).toMatchObject({
      email:    `ivan_${suffix}@test.com`,
      username: `ivan_${suffix}`,
    });
    // id присутствует
    expect(body.id ?? body.userId).toBeTruthy();
  });

  test('AUTH-002 | Registration with existing email returns 409', async ({ request }) => {
    // Создаём пользователя
    const user = await createUniqueUser(request);

    // Пытаемся зарегистрировать с тем же email, другим username
    const res = await registerUser(request, {
      firstname:   'Other',
      lastname:    'User',
      phoneNumber: '+19998887766',
      email:       user.email,           // дубликат
      username:    `other_${uid()}`,
      password:    'password123',
      role:        'USER',
    });

    expect(res.status()).toBe(409);
  });

  test('AUTH-003 | Registration without required field (password) returns 400', async ({ request }) => {
    const res = await registerUser(request, {
      firstname:   'Ivan',
      lastname:    'Ivanov',
      phoneNumber: '+12345678901',
      email:       `nopwd_${uid()}@test.com`,
      username:    `nopwd_${uid()}`,
      // password намеренно пропущен
      role:        'USER',
    });

    expect(res.status()).toBe(400);
  });

  test('AUTH-004 | Registration with invalid email format returns 400', async ({ request }) => {
    const res = await registerUser(request, {
      firstname:   'Ivan',
      lastname:    'Ivanov',
      phoneNumber: '+12345678901',
      email:       'not-an-email',       // невалидный формат
      username:    `bademail_${uid()}`,
      password:    'password123',
      role:        'USER',
    });

    expect(res.status()).toBe(400);
  });

  test('AUTH-005 | Login as existing user returns 201 with user data', async ({ request }) => {
    const user = await createUniqueUser(request);

    const res = await loginUser(request, user.email, user.password);

    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.email).toBe(user.email);
    expect(body.role).toBeDefined();
  });

  test('AUTH-006 | Login as admin returns 201 with role ADMIN', async ({ request }) => {
    const res = await loginUser(
      request,
      process.env.ADMIN_EMAIL    || 'admin@test.com',
      process.env.ADMIN_PASSWORD || 'admin123',
    );

    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.role).toBe('ADMIN');
  });

  test('AUTH-007 | Login with invalid password returns 401', async ({ request }) => {
    const user = await createUniqueUser(request);

    const res = await loginUser(request, user.email, 'wrong_password');

    expect(res.status()).toBe(401);
  });

  test('AUTH-008 | Login with non-existing email returns 401', async ({ request }) => {
    const res = await loginUser(request, `ghost_${uid()}@test.com`, 'password123');

    expect(res.status()).toBe(401);
  });

  test('AUTH-009 | Update existing user returns 200 with updated data', async ({ request }) => {
    const user = await createUniqueUser(request);

    const newEmail = `updated_${uid()}@test.com`;
    const res = await updateUser(request, user.userId, {
      email: newEmail,
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.email).toBe(newEmail);
  });

  test('AUTH-010 | Update non-existing user returns 404', async ({ request }) => {
    const res = await updateUser(request, 999999, {
      email: `ghost_${uid()}@test.com`,
    });

    expect(res.status()).toBe(404);
  });

  test('AUTH-011 | Update user with existing email returns 409', async ({ request }) => {
    const user1 = await createUniqueUser(request);
    const user2 = await createUniqueUser(request);

    // Пытаемся установить email user1 пользователю user2
    const res = await updateUser(request, user2.userId, {
      email: user1.email,
    });

    expect(res.status()).toBe(409);
  });

});
