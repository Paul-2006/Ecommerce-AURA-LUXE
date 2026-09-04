import api from "./api";


// Add item to cart

export const addCart = (data) => {

    return api.post("/Cart/AddItem", data);

};



// Get cart

export const getCart = (cartId) => {

    return api.get(`/Cart/${cartId}`);

};



// Get customer cart

export const getCustomerCart = (customerId) => {

    return api.get(`/Cart/Customer/${customerId}`);

};



// Update cart quantity

export const updateCart = (id, quantity) => {

    return api.put(
        `/Cart/UpdateQuantity/${id}?quantity=${quantity}`
    );

};



// Alias

export const updateQuantity = (id, quantity) => {

    return api.put(
        `/Cart/UpdateQuantity/${id}?quantity=${quantity}`
    );

};



// Remove cart item

export const removeCart = (id) => {

    return api.delete(
        `/Cart/RemoveItem/${id}`
    );

};



// Alias

export const removeCartItem = (id) => {

    return api.delete(
        `/Cart/RemoveItem/${id}`
    );

};