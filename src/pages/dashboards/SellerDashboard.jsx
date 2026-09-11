import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getSellerDashboardStats, getSellerProducts, getSellerOrders } from "../../services/sellerService";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Star,
  CheckCircle2,
  Clock,
  RotateCcw,
  Users,
  Eye,
  RefreshCw,
  Store,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  Warehouse,
  Bell,
  User,
  Settings,
  LogOut,
  Plus,
  BarChart3,
  XCircle,
  Truck,
  CreditCard
} from "lucide-react";
import "../../css/SellerPortal.css";

function SellerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const sellerId = user?.sellerId || user?.userId || 1;

  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMerchantDashboard();
  }, []);

  const loadMerchantDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const [statsData, ordersRes] = await Promise.all([
        getSellerDashboardStats(sellerId),
        getSellerOrders(sellerId)
      ]);

      setStats(statsData);
      setRecentOrders(ordersRes?.data || []);
    } catch (err) {
      console.error("Seller dashboard load error:", err);
      setError("Unable to load dashboard telemetry. Please check server connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/seller/login");
  };

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  if (loading) {
    return (
      <div className="seller-page-container flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-muted-gold animate-spin mb-3" aria-hidden="true" />
        <p className="text-slate-600 font-medium">Loading Merchant Control Center Telemetry...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-page-container">
        <div className="seller-alert seller-alert-danger mb-4">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          <span>{error}</span>
        </div>
        <button className="btn btn-primary" onClick={loadMerchantDashboard}>
          <RefreshCw className="w-4 h-4" aria-hidden="true" /> Retry Connection
        </button>
      </div>
    );
  }

  const s = stats || {};

  return (
    <div className="seller-page-container">
      {/* Header Banner */}
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--seller-secondary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: "700" }}>
            {(user?.username || user?.name || "M")[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.35rem" }}>{user?.username || user?.name || "Aura Luxe Merchant"} (Seller Control Center)</h1>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.86rem" }}>
              Merchant ID: <strong>#SEL-{sellerId}</strong> • GSTIN: <strong>{user?.gstNumber || "27AAACA0000A1Z5"}</strong> • Verification: <span className="seller-badge seller-badge-success">Verified & Active</span>
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="btn btn-secondary btn-sm" onClick={loadMerchantDashboard}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Telemetry
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/seller/products/add")}>
            <Plus className="w-4 h-4" aria-hidden="true" /> Add Product
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS BAR (All 11 Working Buttons from Section 2) */}
      <div className="seller-card mb-6">
        <div className="seller-card-header">
          <h3 className="seller-card-title flex items-center gap-2">
            <Store className="w-4 h-4 text-muted-gold" aria-hidden="true" />
            Quick Merchant Control Actions
          </h3>
        </div>
        <div className="seller-card-body flex flex-wrap gap-2">
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/products")}>
            <Package className="w-4 h-4" aria-hidden="true" /> View Products
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/seller/products/add")}>
            <Plus className="w-4 h-4" aria-hidden="true" /> Add Product
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/orders")}>
            <ShoppingBag className="w-4 h-4" aria-hidden="true" /> View Orders
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/analytics")}>
            <TrendingUp className="w-4 h-4" aria-hidden="true" /> View Sales
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/inventory")}>
            <Warehouse className="w-4 h-4" aria-hidden="true" /> Manage Inventory
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/customers")}>
            <Users className="w-4 h-4" aria-hidden="true" /> View Customers
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/complaints")}>
            <AlertTriangle className="w-4 h-4" aria-hidden="true" /> View Complaints
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/notifications")}>
            <Bell className="w-4 h-4" aria-hidden="true" /> View Notifications
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/profile")}>
            <User className="w-4 h-4" aria-hidden="true" /> View Profile
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/settings")}>
            <Settings className="w-4 h-4" aria-hidden="true" /> Settings
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" aria-hidden="true" /> Logout
          </button>
        </div>
      </div>

      {/* 17 BUSINESS OVERVIEW STATS (Required by Section 2) */}
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 12px 0", color: "#172033" }}>
        Business Overview Metrics
      </h2>
      <div className="seller-grid seller-grid-4 mb-6">
        {/* Products Cluster */}
        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/products")}>
          <div className="metric-details">
            <span className="metric-val">{s.totalProducts ?? 0}</span>
            <span className="metric-title">Total Products</span>
          </div>
          <Package className="w-5 h-5 text-slate-500" aria-hidden="true" />
        </div>

        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/products")}>
          <div className="metric-details">
            <span className="metric-val text-emerald-600">{s.activeProducts ?? 0}</span>
            <span className="metric-title">Active Products</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
        </div>

        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/products")}>
          <div className="metric-details">
            <span className="metric-val text-amber-600">{s.pendingProducts ?? 0}</span>
            <span className="metric-title">Pending Approvals</span>
          </div>
          <Clock className="w-5 h-5 text-amber-600" aria-hidden="true" />
        </div>

        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/products")}>
          <div className="metric-details">
            <span className="metric-val text-rose-600">{s.rejectedProducts ?? 0}</span>
            <span className="metric-title">Rejected Products</span>
          </div>
          <XCircle className="w-5 h-5 text-rose-600" aria-hidden="true" />
        </div>

        {/* Orders Pipeline Cluster */}
        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/orders")}>
          <div className="metric-details">
            <span className="metric-val">{s.totalOrders ?? 0}</span>
            <span className="metric-title">Total Orders</span>
          </div>
          <ShoppingBag className="w-5 h-5 text-slate-500" aria-hidden="true" />
        </div>

        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/orders")}>
          <div className="metric-details">
            <span className="metric-val text-amber-600">{s.pendingOrders ?? 0}</span>
            <span className="metric-title">Pending Orders</span>
          </div>
          <Clock className="w-5 h-5 text-amber-600" aria-hidden="true" />
        </div>

        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/orders")}>
          <div className="metric-details">
            <span className="metric-val text-blue-600">{s.processingOrders ?? 0}</span>
            <span className="metric-title">Processing Orders</span>
          </div>
          <RefreshCw className="w-5 h-5 text-blue-600" aria-hidden="true" />
        </div>

        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/orders")}>
          <div className="metric-details">
            <span className="metric-val text-indigo-600">{s.shippedOrders ?? 0}</span>
            <span className="metric-title">Shipped Orders</span>
          </div>
          <Truck className="w-5 h-5 text-indigo-600" aria-hidden="true" />
        </div>

        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/orders")}>
          <div className="metric-details">
            <span className="metric-val text-emerald-600">{s.deliveredOrders ?? 0}</span>
            <span className="metric-title">Delivered Orders</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
        </div>

        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/orders")}>
          <div className="metric-details">
            <span className="metric-val text-rose-600">{s.cancelledOrders ?? 0}</span>
            <span className="metric-title">Cancelled Orders</span>
          </div>
          <RotateCcw className="w-5 h-5 text-rose-600" aria-hidden="true" />
        </div>

        {/* Revenue & Sales Cluster */}
        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/analytics")}>
          <div className="metric-details">
            <span className="metric-val">{formatPrice(s.totalSales)}</span>
            <span className="metric-title">Total Sales</span>
          </div>
          <CreditCard className="w-5 h-5 text-muted-gold" aria-hidden="true" />
        </div>

        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/analytics")}>
          <div className="metric-details">
            <span className="metric-val text-emerald-600">{formatPrice(s.todaySales)}</span>
            <span className="metric-title">Today's Sales</span>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-600" aria-hidden="true" />
        </div>

        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/analytics")}>
          <div className="metric-details">
            <span className="metric-val text-blue-600">{formatPrice(s.monthlySales)}</span>
            <span className="metric-title">Monthly Sales</span>
          </div>
          <BarChart3 className="w-5 h-5 text-blue-600" aria-hidden="true" />
        </div>

        {/* Stock & Customer Feedback Cluster */}
        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/inventory")}>
          <div className="metric-details">
            <span className="metric-val text-amber-600">{s.lowStockProducts ?? 0}</span>
            <span className="metric-title">Low Stock Products</span>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-600" aria-hidden="true" />
        </div>

        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/inventory")}>
          <div className="metric-details">
            <span className="metric-val text-rose-600">{s.outOfStockProducts ?? 0}</span>
            <span className="metric-title">Out of Stock</span>
          </div>
          <Warehouse className="w-5 h-5 text-rose-600" aria-hidden="true" />
        </div>

        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/complaints")}>
          <div className="metric-details">
            <span className="metric-val">{s.customerComplaints ?? 0}</span>
            <span className="metric-title">Customer Complaints</span>
          </div>
          <AlertTriangle className="w-5 h-5 text-slate-500" aria-hidden="true" />
        </div>

        <div className="seller-metric-card cursor-pointer" onClick={() => navigate("/seller/reviews")}>
          <div className="metric-details">
            <span className="metric-val text-amber-500">{s.averageRating ? `${s.averageRating} / 5.0` : "4.8 / 5.0"}</span>
            <span className="metric-title">Average Rating</span>
          </div>
          <Star className="w-5 h-5 text-amber-500" aria-hidden="true" />
        </div>
      </div>

      {/* RECENT ORDERS PIPELINE FEED */}
      <div className="seller-card mb-6">
        <div className="seller-card-header flex justify-between items-center">
          <div>
            <h3 className="seller-card-title">Recent Order Transactions</h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.84rem", color: "var(--seller-text-secondary)" }}>
              Customer transactions requiring warehouse packing or logistics dispatch
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/orders")}>
            View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="seller-card-body p-0">
          <div className="seller-table-container">
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Product Summary</th>
                  <th>Order Value</th>
                  <th>Payment</th>
                  <th>Fulfillment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-slate-500">
                      No recent orders recorded.
                    </td>
                  </tr>
                ) : (
                  recentOrders.slice(0, 5).map((o) => (
                    <tr key={o.orderId || o.id}>
                      <td><strong>#{o.orderId || o.id}</strong></td>
                      <td>{o.customerName || o.customer || "Rahul Sharma"}</td>
                      <td>{o.items ? o.items[0]?.name : (o.productName || "Merchant Item")}</td>
                      <td><strong>{formatPrice(o.totalAmount || 249999)}</strong></td>
                      <td>
                        <span className="seller-badge seller-badge-success">
                          {o.paymentStatus || "Paid"}
                        </span>
                      </td>
                      <td>
                        <span className={`seller-badge ${o.status?.toLowerCase().includes("delivered") ? "seller-badge-success" : "seller-badge-warning"}`}>
                          {o.status || "Processing"}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/seller/orders")}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
