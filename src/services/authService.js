import api from "./api";

// Unified Login API for any role or specific portal
export const loginUser = async (credentials, roleEndpoint = "") => {
  const url = roleEndpoint ? `/Auth/Login/${roleEndpoint}` : "/Auth/Login";
  const response = await api.post(url, {
    email: credentials.email,
    password: credentials.password,
    rememberMe: Boolean(credentials.rememberMe)
  });
  return response.data;
};

// Customer Login
export const loginCustomer = async (credentials) => {
  return loginUser(credentials, "Customer");
};

// Seller Login
export const loginSeller = async (credentials) => {
  return loginUser(credentials, "Seller");
};

// Admin Login (Secure Backend JWT Authentication - No Hardcoded Credentials)
export const loginAdmin = async (credentials) => {
  return loginUser(credentials, "Admin");
};

// Delivery Partner Login
export const loginDelivery = async (credentials) => {
  return loginUser(credentials, "Delivery");
};

// Warehouse Manager Login
export const loginWarehouse = async (credentials) => {
  return loginUser(credentials, "Warehouse");
};

// Unified Registration
export const registerUser = async (userData) => {
  const payload = {
    username: userData.username || userData.name,
    email: userData.email,
    password: userData.password,
    phoneNumber: userData.phoneNumber || userData.phone || "",
    roleId: Number(userData.roleId || 5) // 5 = Customer, 2 = Seller, 3 = Warehouse, 4 = Delivery
  };

  const response = await api.post("/Auth/Register", payload);
  return response.data;
};

// Forgot Password (OTP)
export const requestPasswordOtp = async (email) => {
  const response = await api.post("/Auth/ForgotPassword", { email });
  return response.data;
};

// Reset Password
export const resetPassword = async (data) => {
  const response = await api.post("/Auth/ResetPassword", {
    email: data.email,
    otp: data.otp,
    newPassword: data.newPassword
  });
  return response.data;
};
