const BASE_URL = process.env.API_URL;

async function createWarehouse(request, data) {
  return request.post(`${BASE_URL}/warehouse`, { data });
}

async function getAllWarehouses(request) {
  return request.get(`${BASE_URL}/warehouse`);
}

async function getWarehouseById(request, warehouseId) {
  return request.get(`${BASE_URL}/warehouse/${warehouseId}`);
}

async function updateWarehouse(request, warehouseId, data) {
  return request.patch(`${BASE_URL}/warehouse/${warehouseId}`, { data });
}

async function updateInventory(request, data) {
  return request.post(`${BASE_URL}/warehouse/inventory`, { data });
}

module.exports = {
    createWarehouse,
    getAllWarehouses,
    getWarehouseById,
    updateWarehouse,
    updateInventory,
};