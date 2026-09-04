import { createContext, useState, useEffect } from "react";
import { getLocalCart } from "../services/cartService";
import { getLocalWishlist } from "../services/wishlistService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("user") || "null");
      if (saved) {
        const isAdminUser = saved.role === "Admin" || saved.roleId === 1 || saved.roleId === "1";
        if (!isAdminUser) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("cartId");
          return null;
        }
      }
      return saved;
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cartId");
      return null;
    }
  });

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Sync cart and wishlist count
  const updateCounts = () => {
    const cart = getLocalCart();
    const totalCartItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(totalCartItems);

    const wishlist = getLocalWishlist();
    setWishlistCount(wishlist.length);
  };

  useEffect(() => {
    updateCounts();
    window.addEventListener("storage", updateCounts);
    return () => window.removeEventListener("storage", updateCounts);
  }, []);

  const login = (data) => {
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    updateCounts();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartId");
    setUser(null);
    updateCounts();
  };

  const updateUserProfile = (partial) => {
    const updated = { ...user, ...partial };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  const isAdmin = user?.role === "Admin" || user?.roleId === 1;
  const isSeller = user?.role === "Seller" || user?.roleId === 2;
  const isWarehouse = user?.role === "Warehouse" || user?.roleId === 3;
  const isDelivery = user?.role === "Delivery" || user?.roleId === 4;
  const isCustomer = user?.role === "Customer" || user?.roleId === 5 || !user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUserProfile,
        isAdmin,
        isSeller,
        isWarehouse,
        isDelivery,
        isCustomer,
        cartCount,
        wishlistCount,
        updateCounts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};