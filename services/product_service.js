const BASE_URL = process.env.API_URL;

async function createProduct(request, data) {
  return request.post(`${BASE_URL}/product`, { data });
}

async function getAllProducts(request) {
  return request.get(`${BASE_URL}/product`);
}

async function getProductById(request, productId) {
  return request.get(`${BASE_URL}/product/${productId}`);
}

async function updateProduct(request, productId, data) {
  return request.patch(`${BASE_URL}/product/${productId}`, { data });
}

async function deleteProduct(request, productId) {
  return request.delete(`${BASE_URL}/product/${productId}`);
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};