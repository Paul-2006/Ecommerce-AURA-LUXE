import api from "./api";

export const addSellerProduct = (data) => {
    return api.post("/SellerProduct/Add", data);
};

export const getSellerProducts = (sellerId) => {
    return api.get(`/SellerProduct/Seller/${sellerId}`);
};

export const updateSellerProduct = (id, data) => {
    return api.put(`/SellerProduct/Update/${id}`, data);
};

export const deleteSellerProduct = (id) => {
    return api.delete(`/SellerProduct/Delete/${id}`);
};

export const addProduct = (data) => {
    return api.post("/Product", data);
};

export const uploadProductImage = (productId, image) => {
    const formData = new FormData();
    formData.append("image", image);

    return api.post(`/ProductImage/Upload?productId=${productId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};
