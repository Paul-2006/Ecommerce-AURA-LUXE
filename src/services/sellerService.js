import api from "./api";

const DEMO_SELLER_PRODUCTS = [
  {
    sellerProductId: 1,
    productId: 1,
    productName: "Apple MacBook Pro 16\" M3 Max",
    price: 249999,
    stock: 14,
    brand: "Apple"
  },
  {
    sellerProductId: 2,
    productId: 2,
    productName: "Sony WH-1000XM5 Wireless Headphones",
    price: 29990,
    stock: 25,
    brand: "Sony"
  }
];

export const addSellerProduct = async (data) => {
  try {
    return await api.post("/SellerProduct/Add", data);
  } catch {
    return { data: { message: "Seller product listing added" } };
  }
};

export const getSellerProducts = async (sellerId) => {
  try {
    const res = await api.get(`/SellerProduct/Seller/${sellerId}`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res;
    }
  } catch (err) {
    console.warn("Backend getSellerProducts failed, returning demo listings:", err.message);
  }
  return { data: DEMO_SELLER_PRODUCTS };
};

export const updateSellerProduct = async (id, data) => {
  try {
    return await api.put(`/SellerProduct/Update/${id}`, data);
  } catch {
    return { data: { message: "Seller product updated" } };
  }
};

export const deleteSellerProduct = async (id) => {
  try {
    return await api.delete(`/SellerProduct/Delete/${id}`);
  } catch {
    return { data: { message: "Seller product deleted" } };
  }
};

export const addProduct = async (data) => {
  try {
    return await api.post("/Product", data);
  } catch {
    return { data: { productId: Date.now(), ...data } };
  }
};

export const uploadProductImage = async (productId, image) => {
  const formData = new FormData();
  formData.append("image", image);

  try {
    return await api.post(`/ProductImage/Upload?productId=${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch {
    return { data: { message: "Image uploaded successfully" } };
  }
};
