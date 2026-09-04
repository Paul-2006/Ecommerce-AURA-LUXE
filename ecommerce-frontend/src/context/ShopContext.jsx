import React, { createContext, useState, useEffect, useContext } from "react";
import { mockProducts, mockOrders } from "../data/mockData";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(mockProducts);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("nexus_cart");
    return saved ? JSON.parse(saved) : [
      { product: mockProducts[0], quantity: 1 }
    ];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("nexus_wishlist");
    return saved ? JSON.parse(saved) : [mockProducts[1].id];
  });

  const [compareList, setCompareList] = useState([]);
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("nexus_orders");
    return saved ? JSON.parse(saved) : mockOrders;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [activeNegotiatingProduct, setActiveNegotiatingProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem("nexus_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("nexus_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("nexus_orders", JSON.stringify(orders));
  }, [orders]);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`Added "${product.name}" to your Cart! ✨`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast("Item removed from cart", "info");
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    const id = typeof product === "object" ? product.id : product;
    const name = typeof product === "object" ? product.name : "Product";
    setWishlist(prev => {
      if (prev.includes(id)) {
        showToast(`Removed from Wishlist`, "info");
        return prev.filter(item => item !== id);
      } else {
        showToast(`Added "${name}" to Wishlist! ❤️`);
        return [...prev, id];
      }
    });
  };

  const toggleCompare = (product) => {
    setCompareList(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast(`Removed from Compare Matrix`, "info");
        return prev.filter(p => p.id !== product.id);
      } else {
        if (prev.length >= 4) {
          showToast("Maximum 4 products allowed in Compare Matrix", "error");
          return prev;
        }
        showToast(`Added to Compare Matrix ⚡`);
        setIsCompareOpen(true);
        return [...prev, product];
      }
    });
  };

  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: `NEX-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Order Confirmed",
      statusCode: 1,
      total: orderDetails.total,
      items: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images[0]
      })),
      shippingAddress: orderDetails.address || "742 Evergreen Terrace, Cyber City, NY",
      trackingId: `TRK-${Math.floor(100000 + Math.random() * 900000)}-US`,
      estimatedDelivery: "In 2-3 Business Days"
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        setProducts,
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        compareList,
        toggleCompare,
        isCompareOpen,
        setIsCompareOpen,
        orders,
        placeOrder,
        searchQuery,
        setSearchQuery,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        isVisualSearchOpen,
        setIsVisualSearchOpen,
        activeNegotiatingProduct,
        setActiveNegotiatingProduct,
        toastMessage,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
