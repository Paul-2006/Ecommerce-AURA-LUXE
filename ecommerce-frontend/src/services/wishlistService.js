import api from "./api";


// Get customer wishlist
export const getWishlist = (customerId) => {

    return api.get(`/Wishlist/${customerId}`);

};


// Add product to wishlist
export const addWishlist = (data) => {

    return api.post("/Wishlist/Add", data);

};


// Remove wishlist item
export const removeWishlist = (id) => {

    return api.delete(`/Wishlist/Delete/${id}`);

};