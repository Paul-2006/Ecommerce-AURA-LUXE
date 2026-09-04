import api from "./api";

export const getAdminSummary = () => {
    return api.get("/AdminDashboard/Summary");
};

export const getRecentOrders = () => {
    return api.get("/AdminDashboard/RecentOrders");
};

export const getPendingProducts = () => {
    return api.get("/AdminProduct/Pending");
};

export const updateProductApproval = (data) => {
    return api.put("/AdminProduct/Approve", data);
};

export const getPendingSellers = () => {
    return api.get("/AdminSeller/Pending");
};

export const updateSellerApproval = (data) => {
    return api.put("/AdminSeller/UpdateStatus", data);
};

export const getUsers = () => {
    return api.get("/Admin/Users");
};

export const getSellers = () => {
    return api.get("/Admin/Sellers");
};
