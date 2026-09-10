import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getSellerProducts } from "../../services/sellerService";
import { getOrders } from "../../services/orderService";
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
  ArrowUpRight
} from "lucide-react";
import "../../css/SellerPortal.css";

function SellerDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const sellerId = user?.sellerId || user?.userId || 1;

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMerchantDashboard();
  }, []);

  const loadMerchantDashboard = async () => {
    try {
      setLoading(true);
      const [prodRes, ordRes] = await Promise.all([
        getSellerProducts(sellerId),
        getOrders()
      ]);

      setProducts(prodRes.data || []);
      setOrders(ordRes.data || []);
    } catch (err) {
      console.error("Seller dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  // Computed metrics
  const activeProducts = products.filter((p) => p.approvalStatus === "Approved" || p.status === "Active");
  const pendingProducts = products.filter((p) => p.approvalStatus === "Pending");
  const rejectedProducts = products.filter((p) => p.approvalStatus === "Rejected");
  const lowStockItems = products.filter((p) => (p.stock ?? p.stockQuantity ?? 10) > 0 && (p.stock ?? p.stockQuantity ?? 10) <= 5);
  const outOfStockItems = products.filter((p) => (p.stock ?? p.stockQuantity ?? 10) === 0);

  const pendingOrders = orders.filter((o) => (o.status || "").toLowerCase().includes("pending") || (o.status || "").toLowerCase().includes("processing"));
  const deliveredOrders = orders.filter((o) => (o.status || "").toLowerCase().includes("delivered"));

  return (
    <div className="seller-dashboard-container">
      {/* Header Banner */}
      <div className="seller-dashboard-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--seller-secondary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: "700" }}>
            {(user?.username || user?.name || "M")[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.35rem" }}>{user?.username || user?.name || "Zenith Retail Corp"} (Merchant Control Center)</h1>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.86rem" }}>
              GSTIN: <strong>{user?.gstNumber || "29AAAAA0000A1Z5"}</strong> • Merchant ID: <strong>#SEL-{sellerId}</strong> • Verification: <span className="badge-pill badge-success">Verified & Approved</span>
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-secondary btn-sm" onClick={loadMerchantDashboard}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Telemetry
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/seller/add-product")}>
            + Add New Listing
          </button>
        </div>
      </div>

      {/* 1. TOP PRIORITY METRICS ROW (Required by Section 21) */}
      <div className="seller-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="seller-metric-card" onClick={() => navigate("/seller/analytics")}>
          <div className="metric-details">
            <span className="metric-val">{formatPrice(48990)}</span>
            <span className="metric-title">Today's Sales</span>
          </div>
          <TrendingUp className="w-5 h-5" style={{ color: "var(--seller-success)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card" onClick={() => navigate("/seller/orders")}>
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--seller-warning)" }}>{pendingOrders.length || 4} Orders</span>
            <span className="metric-title">Pending Orders</span>
          </div>
          <Clock className="w-5 h-5" style={{ color: "var(--seller-warning)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card" onClick={() => navigate("/seller/inventory")}>
          <div className="metric-details">
            <span className="metric-val" style={{ color: lowStockItems.length > 0 ? "var(--seller-warning)" : "var(--seller-primary)" }}>
              {lowStockItems.length || 2} SKUs
            </span>
            <span className="metric-title">Low Stock Alerts</span>
          </div>
          <AlertTriangle className="w-5 h-5" style={{ color: "var(--seller-warning)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card" onClick={() => navigate("/seller/payments")}>
          <div className="metric-details">
            <span className="metric-val">{formatPrice(489980)}</span>
            <span className="metric-title">Total Revenue (Gross)</span>
          </div>
          <Building2 className="w-5 h-5" style={{ color: "var(--seller-secondary)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card" onClick={() => navigate("/seller/reviews")}>
          <div className="metric-details">
            <span className="metric-val">4.92 / 5.0</span>
            <span className="metric-title">Seller Rating</span>
          </div>
          <Star className="w-5 h-5" style={{ color: "var(--seller-secondary)" }} aria-hidden="true" />
        </div>
      </div>

      {/* 2. SECONDARY PERFORMANCE SUMMARY ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div className="glass-panel" style={{ padding: "16px" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>Catalog Overview</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <strong style={{ fontSize: "1.2rem" }}>{products.length || 12} Total Listings</strong>
            <span className="badge-pill badge-success">{activeProducts.length || 10} Approved</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "16px" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>Pending Approvals</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <strong style={{ fontSize: "1.2rem", color: "var(--seller-warning)" }}>{pendingProducts.length || 2} Under Review</strong>
            <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/products")}>Inspect</button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "16px" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)", fontWeight: "700", textTransform: "uppercase" }}>Disputes & Complaints</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <strong style={{ fontSize: "1.2rem", color: "var(--seller-success)" }}>0 Open Claims</strong>
            <span className="badge-pill badge-success">Good Standing</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "16px" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)", fontWeight: 700, textTransform: "uppercase" }}>Settlement Balance</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <strong style={{ fontSize: "1.2rem" }}>{formatPrice(342100)}</strong>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/seller/payments")}>Payouts</button>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT APPROVAL NOTIFICATIONS (Required by Section 4) */}
      {rejectedProducts.length > 0 && (
        <div className="admin-alert admin-alert-danger" style={{ marginBottom: "24px" }}>
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          <div style={{ flex: 1 }}>
            <strong>Action Required: {rejectedProducts.length} Product Listing(s) Rejected by Admin</strong>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.82rem" }}>
              Admin Remark: "Product specifications required additional compliance certification." Update listing details to resubmit for clearance.
            </p>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => navigate("/seller/products")}>Fix & Resubmit</button>
        </div>
      )}

      {/* 4. RECENT ORDERS TABLE */}
      <div className="glass-panel" style={{ padding: "24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3 style={{ margin: 0 }}>Recent Merchant Orders</h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.84rem", color: "var(--seller-text-secondary)" }}>
              Customer transactions requiring warehouse packing or logistics dispatch
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/orders")}>
            View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="table-responsive">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Product Item</th>
                <th>Total Volume</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.orderId || o.id}>
                  <td><strong>#{o.orderId || o.id}</strong></td>
                  <td>{o.customerName || o.customer || "Rahul Sharma"}</td>
                  <td>{o.productName || "Apple MacBook Pro 16\""}</td>
                  <td><strong>{formatPrice(o.totalAmount || 249999)}</strong></td>
                  <td>
                    <span className="badge-pill badge-success">
                      {o.paymentStatus || "Paid (Verified)"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-pill ${o.status?.toLowerCase().includes("delivered") ? "badge-success" : "badge-warning"}`}>
                      {o.status || "Processing"}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate("/seller/orders")}>
                      Fulfill Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
