const BASE_URL = process.env.API_URL;

async function registerUser(request, data) {
  return request.post(`${BASE_URL}/auth/register`, { data });
}

async function loginUser(request, email, password) {
  return request.post(`${BASE_URL}/auth/login`, {
    data: { email, password },
  });
}

async function updateUser(request, userId, data) {
  return request.patch(`${BASE_URL}/auth/${userId}`, { data });
}



module.exports = {
    registerUser,
    loginUser,
    updateUser,
};