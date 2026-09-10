import api from "./api";

const LOCAL_WISHLIST_KEY = "nexstore_local_wishlist";

export const getLocalWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveLocalWishlist = (items) => {
  localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(items));
};

// Get customer wishlist
export const getWishlist = async (customerId) => {
  try {
    const res = await api.get(`/Wishlist/${customerId}`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res;
    }
  } catch (err) {
    console.warn("Backend getWishlist failed, using local wishlist:", err.message);
  }
  return { data: getLocalWishlist() };
};

// Add product to wishlist
export const addWishlist = async (data) => {
  try {
    return await api.post("/Wishlist/Add", data);
  } catch {
    const local = getLocalWishlist();
    if (!local.some((i) => i.productId === data.productId)) {
      local.push({
        wishlistItemId: Date.now(),
        productId: data.productId,
        productName: data.productName || "Saved Item",
        brand: data.brand || "Brand",
        price: data.price || 999,
        image: data.image || ""
      });
      saveLocalWishlist(local);
    }
    return { data: { message: "Product added to wishlist" } };
  }
};

// Remove wishlist item
export const removeWishlist = async (id) => {
  try {
    return await api.delete(`/Wishlist/Remove/${id}`);
  } catch {
    const local = getLocalWishlist().filter((i) => i.wishlistItemId !== id && i.productId !== id);
    saveLocalWishlist(local);
    return { data: { message: "Removed from wishlist" } };
  }
};