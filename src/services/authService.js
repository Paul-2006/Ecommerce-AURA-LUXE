import api from "./api";

// Authorized 2 Admin accounts for the security requirement
export const AUTHORIZED_ADMINS = [
  {
    email: "admin@nexstore.com",
    name: "Alex Vance (Super Admin)",
    role: "Admin",
    roleId: 1,
    adminSlot: "Slot 1: Platform Director",
    pin: "9988"
  },
  {
    email: "opsadmin@nexstore.com",
    name: "Sarah Connor (Operations Admin)",
    role: "Admin",
    roleId: 1,
    adminSlot: "Slot 2: Security & Operations",
    pin: "7766"
  }
];

// Login API for any role or specific portal
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

// Seller Login with Document Verification Check
export const loginSeller = async (credentials) => {
  return loginUser(credentials, "Seller");
};

// Admin Login with 2-Account Clearance Check
export const loginAdmin = async (credentials) => {
  const emailClean = credentials.email?.trim().toLowerCase();
  const isAuthorized = AUTHORIZED_ADMINS.some(
    (adm) => adm.email.toLowerCase() === emailClean
  );

  if (!isAuthorized) {
    throw new Error("ACCESS RESTRICTED: Only the 2 designated System Administrators have security clearance to access this portal.");
  }

  return loginUser(credentials, "Admin");
};

// Delivery Partner Login with Motorbike & License Check
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
