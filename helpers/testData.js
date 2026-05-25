export const getTestUser = () => {
  const timestamp = Date.now();
  return {
    email: `testEmail_${timestamp}@gmail.com`,
    phone: `+${timestamp}`,
    username: `userName_${timestamp}`,
    firstname: "Ora",
    lastname: "Oraora",
    password: "9876543210",
  };
};
