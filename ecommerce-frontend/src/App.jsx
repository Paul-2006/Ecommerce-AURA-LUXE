import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShopProvider, useShop } from "./context/ShopContext";

// Components
import Navbar from "./components/Navbar";
import NexusAIAssistant from "./components/NexusAIAssistant";
import AIVisualSearchModal from "./components/AIVisualSearchModal";
import ProductCompareChatbot from "./components/ProductCompareChatbot";
import AIPriceNegotiatorModal from "./components/AIPriceNegotiatorModal";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import PortalLogin from "./pages/PortalLogin";

// Auth Pages
import CustomerLogin from "./pages/auth/CustomerLogin";
import SellerLogin from "./pages/auth/SellerLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import WarehouseLogin from "./pages/auth/WarehouseLogin";
import DeliveryLogin from "./pages/auth/DeliveryLogin";

// Dashboards
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import SellerDashboard from "./pages/dashboards/SellerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import WarehouseDashboard from "./pages/dashboards/WarehouseDashboard";
import DeliveryDashboard from "./pages/dashboards/DeliveryDashboard";

// Seller Pages
import AddProduct from "./pages/seller/AddProduct";
import MyProducts from "./pages/seller/MyProducts";
import EditProduct from "./pages/seller/EditProduct";
import SellerOrders from "./pages/seller/SellerOrders";

import ManageProducts from "./pages/admin/ManageProducts";
import ManageSellers from "./pages/admin/ManageSellers";
import ManageUsers from "./pages/admin/ManageUsers";

import AssignedDeliveries from "./pages/delivery/AssignedDeliveries";
import DeliveryOTP from "./pages/delivery/DeliveryOTP";

const AppContent = () => {
  const { toastMessage } = useShop();

  return (
    <BrowserRouter>
      <Navbar />
      <NexusAIAssistant />
      <AIVisualSearchModal />
      <ProductCompareChatbot />
      <AIPriceNegotiatorModal />

      {/* Global Toast Notification Popup */}
      {toastMessage && (
        <div className={`nexus-toast nexus-toast-${toastMessage.type || "success"}`}>
          <span>{toastMessage.text}</span>
        </div>
      )}

      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<PortalLogin />} />

        {/* Login Portals */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/warehouse/login" element={<WarehouseLogin />} />
        <Route path="/delivery/login" element={<DeliveryLogin />} />

        {/* Dashboards */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/warehouse/dashboard" element={<WarehouseDashboard />} />
        <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />

        {/* Seller Sub-routes */}
        <Route path="/seller/add-product" element={<AddProduct />} />
        <Route path="/seller/products" element={<MyProducts />} />
        <Route path="/seller/edit-product/:id" element={<EditProduct />} />
        <Route path="/seller/orders" element={<SellerOrders />} />

        {/* Admin Sub-routes */}
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/sellers" element={<ManageSellers />} />
        <Route path="/admin/users" element={<ManageUsers />} />

        {/* Delivery Sub-routes */}
        <Route path="/delivery/assigned" element={<AssignedDeliveries />} />
        <Route path="/delivery/otp" element={<DeliveryOTP />} />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

export default App;
