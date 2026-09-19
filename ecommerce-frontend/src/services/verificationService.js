import api from "./api";

// Seller Verification APIs
export const verifyGst = async (data) => {
  const response = await api.post("/SellerVerification/verify-gst", data);
  return response.data;
};

export const verifyPan = async (data) => {
  const response = await api.post("/SellerVerification/verify-pan", data);
  return response.data;
};

export const uploadSellerVerificationDocument = async (formData) => {
  const response = await api.post("/SellerVerification/upload-document", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export const submitSellerVerification = async (data) => {
  const response = await api.post("/SellerVerification/submit", data);
  return response.data;
};

export const getSellerVerificationStatus = async (sellerId) => {
  const response = await api.get(`/SellerVerification/my-status/${sellerId}`);
  return response.data;
};

export const getAdminSellerVerificationList = async (status = "ALL", search = "") => {
  const response = await api.get(`/SellerVerification/admin/list?status=${status}&search=${search}`);
  return response.data;
};

export const getAdminSellerVerificationDetail = async (id) => {
  const response = await api.get(`/SellerVerification/admin/${id}`);
  return response.data;
};

export const approveSellerVerification = async (id) => {
  const response = await api.post(`/SellerVerification/admin/${id}/approve`);
  return response.data;
};

export const rejectSellerVerification = async (id, reason) => {
  const response = await api.post(`/SellerVerification/admin/${id}/reject`, { reason });
  return response.data;
};

export const requestSellerCorrection = async (id, reason) => {
  const response = await api.post(`/SellerVerification/admin/${id}/request-correction`, { reason });
  return response.data;
};

// Delivery Partner Verification APIs
export const verifyDl = async (data) => {
  const response = await api.post("/DeliveryVerification/verify-dl", data);
  return response.data;
};

export const verifyVehicle = async (data) => {
  const response = await api.post("/DeliveryVerification/verify-vehicle", data);
  return response.data;
};

export const uploadDeliveryVerificationDocument = async (formData) => {
  const response = await api.post("/DeliveryVerification/upload-document", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export const submitDeliveryVerification = async (data) => {
  const response = await api.post("/DeliveryVerification/submit", data);
  return response.data;
};

export const getDeliveryVerificationStatus = async (partnerId) => {
  const response = await api.get(`/DeliveryVerification/my-status/${partnerId}`);
  return response.data;
};

export const getAdminDeliveryVerificationList = async (status = "ALL", search = "") => {
  const response = await api.get(`/DeliveryVerification/admin/list?status=${status}&search=${search}`);
  return response.data;
};

export const getAdminDeliveryVerificationDetail = async (id) => {
  const response = await api.get(`/DeliveryVerification/admin/${id}`);
  return response.data;
};

export const approveDeliveryVerification = async (id) => {
  const response = await api.post(`/DeliveryVerification/admin/${id}/approve`);
  return response.data;
};

export const rejectDeliveryVerification = async (id, reason) => {
  const response = await api.post(`/DeliveryVerification/admin/${id}/reject`, { reason });
  return response.data;
};

export const requestDeliveryCorrection = async (id, reason) => {
  const response = await api.post(`/DeliveryVerification/admin/${id}/request-correction`, { reason });
  return response.data;
};

// Admin Summary Center API
export const getAdminVerificationSummary = async () => {
  const response = await api.get("/AdminVerificationCenter/summary");
  return response.data;
};
