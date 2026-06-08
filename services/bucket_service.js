const BASE_URL = process.env.API_URL;

async function getBucket(request, userId) {
  return request.get(`${BASE_URL}/bucket/${userId}`);
}

async function addProductToBucket(request, userId, productId) {
  return request.post(`${BASE_URL}/bucket/${userId}/addProduct`, {
    data: { productId },
  });
}

async function removeProductFromBucket(request, userId, productId) {
  return request.delete(`${BASE_URL}/bucket/${userId}/removeProduct`, {
    data: { productId },
  });
}


module.exports = {
    getBucket,
    addProductToBucket,
    removeProductFromBucket,
};