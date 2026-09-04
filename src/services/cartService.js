import api from "./api";

// Local storage key for offline/guest cart
const LOCAL_CART_KEY = "nexstore_local_cart";

export const getLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveLocalCart = (items) => {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
};

// Add item to cart
export const addCart = async (data) => {
  try {
    const res = await api.post("/Cart/AddItem", data);
    return res;
  } catch (err) {
    console.warn("Backend AddItem failed, updating local guest cart:", err.message);
    const local = getLocalCart();
    const existing = local.find((i) => i.productId === data.productId);
    if (existing) {
      existing.quantity += (data.quantity || 1);
    } else {
      local.push({
        cartItemId: Date.now(),
        productId: data.productId,
        productName: data.productName || "Selected Item",
        price: data.price || 999,
        quantity: data.quantity || 1,
        image: data.image || ""
      });
    }
    saveLocalCart(local);
    return { data: { message: "Item added to cart", cartItemId: Date.now() } };
  }
};

// Get cart by cartId
export const getCart = async (cartId) => {
  try {
    const res = await api.get(`/Cart/${cartId}`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res;
    }
  } catch (err) {
    console.warn("Backend getCart failed, returning local cart:", err.message);
  }
  const local = getLocalCart();
  return { data: local };
};

// Get customer cart
export const getCustomerCart = async (customerId) => {
  try {
    return await api.get(`/Cart/Customer/${customerId}`);
  } catch {
    return { data: { cartId: 1 } };
  }
};

// Update cart quantity
export const updateCart = async (id, quantity) => {
  try {
    return await api.put(`/Cart/UpdateQuantity/${id}?quantity=${quantity}`);
  } catch {
    const local = getLocalCart();
    const item = local.find((i) => i.cartItemId === id);
    if (item) item.quantity = Number(quantity);
    saveLocalCart(local);
    return { data: { message: "Quantity updated" } };
  }
};

export const updateQuantity = updateCart;

// Remove cart item
export const removeCart = async (id) => {
  try {
    return await api.delete(`/Cart/RemoveItem/${id}`);
  } catch {
    const local = getLocalCart().filter((i) => i.cartItemId !== id);
    saveLocalCart(local);
    return { data: { message: "Item removed" } };
  }
};

export const removeCartItem = removeCart;