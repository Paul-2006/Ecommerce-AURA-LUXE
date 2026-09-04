import api from "./api";

export const getAssignedDeliveries = (partnerId) => {
    return api.get(`/DeliveryAssignment/Partner/${partnerId}`);
};

export const updateDeliveryStatus = (assignmentId, status) => {
    return api.put(`/DeliveryAssignment/Update/${assignmentId}?status=${encodeURIComponent(status)}`);
};

export const updateDeliveryLocation = (data) => {
    return api.post("/DeliveryLocation/Update", data);
};

export const getLatestOrderLocation = (orderId) => {
    return api.get(`/DeliveryLocation/Latest/${orderId}`);
};

export const generateDeliveryOtp = (orderId) => {
    return api.post(`/DeliveryOTP/Generate?orderId=${orderId}`);
};

export const verifyDeliveryOtp = (data) => {
    return api.post("/DeliveryOTP/Verify", data);
};
