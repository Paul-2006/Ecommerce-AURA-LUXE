import api from "./api";


// Get all products
export const getProducts = async () => {
    const response = await api.get("/Product");
    return response.data;
};


// Get single product
export const getProduct = async (id) => {
    const response = await api.get(`/Product/${id}`);
    return response.data;
};


// Alias
export const getProductById = getProduct;


// Add product
export const addProduct = async (product) => {
    const response = await api.post("/Product", product);
    return response.data;
};


// Update product
export const updateProduct = async (id, product) => {
    const response = await api.put(`/Product/${id}`, product);
    return response.data;
};


// Delete product
export const deleteProduct = async (id) => {
    const response = await api.delete(`/Product/${id}`);
    return response.data;
};