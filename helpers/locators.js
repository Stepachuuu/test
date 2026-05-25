export const locators = {
  // Reg
  firstnameInput: 'input[name="firstname"]',
  lastnameInput: 'input[name="lastname"]',
  emailInput: 'input[name="email"]',
  usernameInput: 'input[name="username"]',
  phoneInput: 'input[name="phoneNumber"]',
  passwordInput: 'input[name="password"]',
  submitButton: 'button[type="submit"]',

  // Errors reg
  errorRequired: (field) => `text=${field} обязательно`,
  errorEmailFormat: "text=email must be an email",
  errorPhoneFormat: "text=phoneNumber must be in international format",
  errorEmailExists: (email) => `text=Email "${email}" already exists.`,

  // Login
  loginEmailInput: 'input[name="email"]',
  loginPasswordInput: 'input[name="password"]',
  loginButton: 'button[type="submit"]',
  loginErrorMessage: "text=Неверный email или пароль",
  emailRequiredError: "text=Email обязателен",
  passwordRequiredError: "text=Пароль обязателен",
  registerLink: 'a[href="/register"]',

  // Cart
  cartIcon: 'a[href="/cart"]',
  cartItemRow: '.cart-item, [class*="border-b"]',
  removeProductBtn:
    'button:has-text("Удалить"), button:has-text("Remove"), button[aria-label="Удалить"], button[aria-label="Remove"], button[data-testid="remove"], button[class*="remove"]',
  totalPriceSpan: 'span:has-text("Итого:") + span',
  checkoutBtn: 'button:has-text("Оформить заказ")',
  emptyCartText: "text=Ваша корзина пуста",
  orderSuccessToast: "text=Заказ успешно создан",

  // Shop
  productCard: 'a[href^="/product/"]',
  productTitle: "h3, .font-semibold",
  productPrice: "span.font-bold",
  addToCartButton: 'button:has-text("В корзину")',
  successAddMessage: "text=Товар добавлен в корзину",
  cartIcon: 'a[href="/cart"]',
};
