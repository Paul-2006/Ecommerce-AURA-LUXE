import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import useControlledNavigation from "./hooks/useControlledNavigation";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductCompareChatbot from "./components/ProductCompareChatbot";
import DynamicEcommerceBackground from "./components/DynamicEcommerceBackground";

// Customer & General Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import PortalLogin from "./pages/PortalLogin";
import Profile from "./pages/Profile";

// Role-Specific Authentication Logins
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

// Seller Actions
import AddProduct from "./pages/seller/AddProduct";
import MyProducts from "./pages/seller/MyProducts";
import EditProduct from "./pages/seller/EditProduct";
import SellerOrders from "./pages/seller/SellerOrders";

import AdminLayout from "./components/admin/AdminLayout";

// Admin Management Pages
import ManageProducts from "./pages/admin/ManageProducts";
import ManageSellers from "./pages/admin/ManageSellers";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCustomers from "./pages/admin/ManageCustomers";
import ManageOrders from "./pages/admin/ManageOrders";
import AdminWarehouseMonitoring from "./pages/admin/AdminWarehouseMonitoring";
import AdminDeliveryMonitoring from "./pages/admin/AdminDeliveryMonitoring";
import ManageComplaints from "./pages/admin/ManageComplaints";
import AdminReports from "./pages/admin/AdminReports";
import ManageLoginActivity from "./pages/admin/ManageLoginActivity";
import AdminProfile from "./pages/admin/AdminProfile";

// Warehouse Actions
import Inventory from "./pages/warehouse/Inventory";
import PackingOrders from "./pages/warehouse/PackingOrders";

// Delivery Actions
import AssignedDeliveries from "./pages/delivery/AssignedDeliveries";
import DeliveryOTP from "./pages/delivery/DeliveryOTP";
import DeliveryHistory from "./pages/delivery/DeliveryHistory";

// Navigation Enforcer Wrapper Inside BrowserRouter
function ControlledNavigationEnforcer() {
  useControlledNavigation();
  return null;
}

// Entry Point Route Element: Login Portal as First Page
function MainEntryPoint() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <PortalLogin />;
  }

  // If authenticated, render role home
  if (user.role === "Admin" || user.roleId === 1) return <AdminDashboard />;
  if (user.role === "Seller" || user.roleId === 2) return <SellerDashboard />;
  if (user.role === "Warehouse" || user.roleId === 3) return <WarehouseDashboard />;
  if (user.role === "Delivery" || user.roleId === 4) return <DeliveryDashboard />;

  return <Home />;
}

function App() {
  return (
    <BrowserRouter>
      <ControlledNavigationEnforcer />
      <DynamicEcommerceBackground />
      <Navbar />
      <ProductCompareChatbot />

      <Routes>
        {/* Main Entry Point (First Page is Login Portal when unauthenticated) */}
        <Route path="/" element={<MainEntryPoint />} />
        <Route path="/login" element={<PortalLogin />} />
        <Route path="/register" element={<Register />} />

        {/* Public / Customer Catalog Routes */}
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Role Portal Logins */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/warehouse/login" element={<WarehouseLogin />} />
        <Route path="/delivery/login" element={<DeliveryLogin />} />

        {/* Protected Customer Routes */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute allowedRoles={["Customer", 5]}>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["Customer", 5]}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["Customer", 5]}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["Customer", 5]}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Customer", 5]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Seller Routes */}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Seller", 2]}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/add-product"
          element={
            <ProtectedRoute allowedRoles={["Seller", 2]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products"
          element={
            <ProtectedRoute allowedRoles={["Seller", 2]}>
              <MyProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/edit-product/:id"
          element={
            <ProtectedRoute allowedRoles={["Seller", 2]}>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/orders"
          element={
            <ProtectedRoute allowedRoles={["Seller", 2]}>
              <SellerOrders />
            </ProtectedRoute>
          }
        />

        {/* Isolated Protected Admin Control Center Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin", 1]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="sellers" element={<ManageSellers />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="warehouse" element={<AdminWarehouseMonitoring />} />
          <Route path="delivery" element={<AdminDeliveryMonitoring />} />
          <Route path="complaints" element={<ManageComplaints />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="login-activity" element={<ManageLoginActivity />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        {/* Protected Warehouse Routes */}
        <Route
          path="/warehouse/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Warehouse", 3]}>
              <WarehouseDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warehouse/inventory"
          element={
            <ProtectedRoute allowedRoles={["Warehouse", 3]}>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warehouse/packing-orders"
          element={
            <ProtectedRoute allowedRoles={["Warehouse", 3]}>
              <PackingOrders />
            </ProtectedRoute>
          }
        />

        {/* Protected Delivery Partner Routes */}
        <Route
          path="/delivery/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Delivery", 4]}>
              <DeliveryDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery/assigned"
          element={
            <ProtectedRoute allowedRoles={["Delivery", 4]}>
              <AssignedDeliveries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery/otp"
          element={
            <ProtectedRoute allowedRoles={["Delivery", 4]}>
              <DeliveryOTP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery/history"
          element={
            <ProtectedRoute allowedRoles={["Delivery", 4]}>
              <DeliveryHistory />
            </ProtectedRoute>
          }
        />

        {/* Fallback Wildcard Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
