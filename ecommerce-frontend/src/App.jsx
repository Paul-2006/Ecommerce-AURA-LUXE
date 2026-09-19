import { useContext, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import useControlledNavigation from "./hooks/useControlledNavigation";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductCompareChatbot from "./components/ProductCompareChatbot";
import DynamicEcommerceBackground from "./components/DynamicEcommerceBackground";

// Eager Core Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import PortalLogin from "./pages/PortalLogin";

// Lazy-Loaded Customer Pages
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const Profile = lazy(() => import("./pages/Profile"));

// Lazy-Loaded Logins
const CustomerLogin = lazy(() => import("./pages/auth/CustomerLogin"));
const SellerLogin = lazy(() => import("./pages/auth/SellerLogin"));
const AdminLogin = lazy(() => import("./pages/auth/AdminLogin"));
const WarehouseLogin = lazy(() => import("./pages/auth/WarehouseLogin"));
const DeliveryLogin = lazy(() => import("./pages/auth/DeliveryLogin"));

// Lazy-Loaded Dashboards
const CustomerDashboard = lazy(() => import("./pages/dashboards/CustomerDashboard"));
const SellerDashboard = lazy(() => import("./pages/dashboards/SellerDashboard"));
const AdminDashboard = lazy(() => import("./pages/dashboards/AdminDashboard"));
const WarehouseDashboard = lazy(() => import("./pages/dashboards/WarehouseDashboard"));
const DeliveryDashboard = lazy(() => import("./pages/dashboards/DeliveryDashboard"));

// Seller Portal
const SellerLayout = lazy(() => import("./components/seller/SellerLayout"));
const AddProduct = lazy(() => import("./pages/seller/AddProduct"));
const MyProducts = lazy(() => import("./pages/seller/MyProducts"));
const EditProduct = lazy(() => import("./pages/seller/EditProduct"));
const SellerInventory = lazy(() => import("./pages/seller/SellerInventory"));
const SellerOrders = lazy(() => import("./pages/seller/SellerOrders"));
const SellerReturns = lazy(() => import("./pages/seller/SellerReturns"));
const SellerCustomers = lazy(() => import("./pages/seller/SellerCustomers"));
const SellerReviews = lazy(() => import("./pages/seller/SellerReviews"));
const SellerComplaints = lazy(() => import("./pages/seller/SellerComplaints"));
const SellerAnalytics = lazy(() => import("./pages/seller/SellerAnalytics"));
const SellerPayments = lazy(() => import("./pages/seller/SellerPayments"));
const SellerShipping = lazy(() => import("./pages/seller/SellerShipping"));
const SellerNotifications = lazy(() => import("./pages/seller/SellerNotifications"));
const SellerReports = lazy(() => import("./pages/seller/SellerReports"));
const SellerStore = lazy(() => import("./pages/seller/SellerStore"));
const SellerProfile = lazy(() => import("./pages/seller/SellerProfile"));
const SellerSettings = lazy(() => import("./pages/seller/SellerSettings"));

// Admin Portal
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const ManageProducts = lazy(() => import("./pages/admin/ManageProducts"));
const ManageSellers = lazy(() => import("./pages/admin/ManageSellers"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageCustomers = lazy(() => import("./pages/admin/ManageCustomers"));
const ManageOrders = lazy(() => import("./pages/admin/ManageOrders"));
const AdminWarehouseMonitoring = lazy(() => import("./pages/admin/AdminWarehouseMonitoring"));
const AdminDeliveryMonitoring = lazy(() => import("./pages/admin/AdminDeliveryMonitoring"));
const ManageComplaints = lazy(() => import("./pages/admin/ManageComplaints"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const ManageLoginActivity = lazy(() => import("./pages/admin/ManageLoginActivity"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));

// Verification System Pages
const AdminVerificationCenter = lazy(() => import("./pages/admin/AdminVerificationCenter"));
const SellerVerificationList = lazy(() => import("./pages/admin/SellerVerificationList"));
const SellerVerificationDetail = lazy(() => import("./pages/admin/SellerVerificationDetail"));
const DeliveryVerificationList = lazy(() => import("./pages/admin/DeliveryVerificationList"));
const DeliveryVerificationDetail = lazy(() => import("./pages/admin/DeliveryVerificationDetail"));
const SellerOnboardingVerification = lazy(() => import("./pages/seller/SellerOnboardingVerification"));
const DeliveryOnboardingVerification = lazy(() => import("./pages/delivery/DeliveryOnboardingVerification"));

// Warehouse Actions
const Inventory = lazy(() => import("./pages/warehouse/Inventory"));
const PackingOrders = lazy(() => import("./pages/warehouse/PackingOrders"));

// Delivery Actions
const AssignedDeliveries = lazy(() => import("./pages/delivery/AssignedDeliveries"));
const DeliveryOTP = lazy(() => import("./pages/delivery/DeliveryOTP"));
const DeliveryHistory = lazy(() => import("./pages/delivery/DeliveryHistory"));

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

function RouteFallbackLoader() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div className="skeleton-box" style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "16px" }} />
      <div className="skeleton-box" style={{ width: "220px", height: "24px", borderRadius: "8px", marginBottom: "8px" }} />
      <div className="skeleton-box" style={{ width: "160px", height: "14px", borderRadius: "6px" }} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ControlledNavigationEnforcer />
      <DynamicEcommerceBackground />
      <Navbar />
      <ProductCompareChatbot />

      <Suspense fallback={<RouteFallbackLoader />}>
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

        {/* Isolated Protected Seller Merchant Center Routes */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={["Seller", 2]}>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="verification" element={<SellerOnboardingVerification />} />
          <Route path="products" element={<MyProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="inventory" element={<SellerInventory />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="returns" element={<SellerReturns />} />
          <Route path="customers" element={<SellerCustomers />} />
          <Route path="reviews" element={<SellerReviews />} />
          <Route path="complaints" element={<SellerComplaints />} />
          <Route path="analytics" element={<SellerAnalytics />} />
          <Route path="payments" element={<SellerPayments />} />
          <Route path="shipping" element={<SellerShipping />} />
          <Route path="notifications" element={<SellerNotifications />} />
          <Route path="reports" element={<SellerReports />} />
          <Route path="store" element={<SellerStore />} />
          <Route path="profile" element={<SellerProfile />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>

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
          <Route path="verification" element={<AdminVerificationCenter />} />
          <Route path="verification/sellers" element={<SellerVerificationList />} />
          <Route path="verification/seller/:id" element={<SellerVerificationDetail />} />
          <Route path="verification/delivery" element={<DeliveryVerificationList />} />
          <Route path="verification/delivery/:id" element={<DeliveryVerificationDetail />} />
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
          path="/delivery/verification"
          element={
            <ProtectedRoute allowedRoles={["Delivery", 4]}>
              <DeliveryOnboardingVerification />
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
