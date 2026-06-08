const { createProduct } = require ('../services/product_service');
const { registerUser } = require ('../services/auth_service');

const BASE_URL = process.env.API_URL;

async function createOrder(request, userId, items) {
  return request.post(`${BASE_URL}/order/${userId}`, {
    data: { items },
  });
}

async function getOrdersByUserId(request, userId) {
  return request.get(`${BASE_URL}/order/${userId}`);
}

async function updateOrderStatus(request, orderId, status) {
  return request.patch(`${BASE_URL}/order/${orderId}/status`, {
    data: { status },
  });
}

module.exports = {
    createOrder,
    getOrdersByUserId,
    updateOrderStatus,
};