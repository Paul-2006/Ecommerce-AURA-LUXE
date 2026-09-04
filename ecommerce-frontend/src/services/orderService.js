import api from "./api";


// Create order
export const createOrder = (data)=>{

    return api.post("/Order/Create",data);

};


// Get customer orders
export const getOrders = (customerId)=>{

    return api.get(`/Order/Customer/${customerId}`);

};


// Get order details
export const getOrderDetails = (id)=>{

    return api.get(`/Order/Details/${id}`);

};