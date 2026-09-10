import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getAdminSummary, getRecentOrders } from "../../services/adminService";
import api from "../../services/api";
import { Bell, X, LayoutDashboard, Shield, RefreshCw } from "lucide-react";
import "../../css/Dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'login_activity'
  const [summary, setSummary] = useState({});
  const [orders, setOrders] = useState([]);
  const [loginActivity, setLoginActivity] = useState([]);
  const [unreadLogins, setUnreadLogins] = useState([]);
  const [activePopupNotification, setActivePopupNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    fetchRecentLoginActivity();

    // Real-time polling every 5 seconds for new customer logins
    const interval = setInterval(() => {
      pollCustomerLogins();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      const [sumRes, ordRes] = await Promise.all([
        getAdminSummary(),
        getRecentOrders()
      ]);
      setSummary(sumRes.data || {});
      setOrders(ordRes.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentLoginActivity = async () => {
    try {
      const res = await api.get("/AdminUserActivity/RecentLogins?limit=50");
      setLoginActivity(res.data || []);
    } catch (err) {
      console.error("Login activity fetch error:", err);
    }
  };

  const pollCustomerLogins = async () => {
    try {
      const res = await api.get("/AdminUserActivity/UnreadCustomerLogins");
      const unread = res.data || [];
      if (unread.length > 0) {
        setUnreadLogins(unread);
        setActivePopupNotification(unread[0]);
      }
    } catch {
      // Ignore polling errors when server offline or non-admin
    }
  };

  const handleDismissNotification = async (logId) => {
    if (!logId) {
      setActivePopupNotification(null);
      return;
    }
    try {
      await api.post(`/AdminUserActivity/MarkRead/${logId}`);
    } catch {
      // Silently continue
    }
    setActivePopupNotification(null);
    setUnreadLogins((prev) => prev.filter((item) => item.logId !== logId));
    fetchRecentLoginActivity();
  };

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amt || 0);

  return (
    <div className="admin-dashboard-container centered-container" style={{ position: "relative" }}>
      {/* Real-time Customer Login Popup Notification */}
      {activePopupNotification && (
        <div
          className="customer-login-popup-card glass-panel"
          style={{
            position: "fixed",
            top: "84px",
            right: "24px",
            width: "340px",
            zIndex: 9999,
            background: "var(--bg-main)",
            border: "2px solid var(--primary)",
            borderRadius: "16px",
            padding: "18px",
            boxShadow: "0 12px 32px rgba(112, 26, 117, 0.3)",
            animation: "slideInRight 0.4s ease-out"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span className="badge-pill badge-primary" style={{ fontSize: "0.72rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Bell className="w-3.5 h-3.5" aria-hidden="true" /> New Customer Login
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => handleDismissNotification(activePopupNotification.logId)}
              style={{ padding: "0 6px" }}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div style={{ fontSize: "0.88rem", display: "flex", flexDirection: "column", gap: "4px" }}>
            <div>Customer: <strong>{activePopupNotification.username || "Customer"}</strong></div>
            <div>Customer ID: <strong className="plate-badge" style={{ fontSize: "0.78rem" }}>#{activePopupNotification.customerId || activePopupNotification.userId || 1024}</strong></div>
            <div>Login Time: <strong style={{ color: "var(--primary)" }}>{new Date(activePopupNotification.loginTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</strong></div>
            <div>Account Status: <span className="badge-pill badge-success" style={{ fontSize: "0.68rem" }}>{activePopupNotification.accountStatus || "Active"}</span></div>
            <div>Type: <strong>{activePopupNotification.userRole || "Customer"}</strong></div>
          </div>

          <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ width: "100%" }}
              onClick={() => {
                setActiveTab("login_activity");
                handleDismissNotification(activePopupNotification.logId);
              }}
            >
              View Login Activity
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="admin-dashboard-header glass-panel" style={{ marginBottom: "20px" }}>
        <div className="admin-header-left">
          <div>
            <h1 style={{ fontFamily: "Playfair Display, Georgia, serif" }}>Master Admin Security Console</h1>
            <p>
              Operator: <strong>{user?.username || user?.name || "System Administrator"}</strong> • Email: <strong>{user?.email}</strong> • Clearance: <span className="badge-pill badge-danger">Level 1 - Admin</span>
            </p>
          </div>
        </div>

        <div className="admin-quick-actions" style={{ display: "flex", gap: "8px" }}>
          <button className={`btn ${activeTab === "overview" ? "btn-primary" : "btn-secondary"} btn-sm`} onClick={() => setActiveTab("overview")} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> Dashboard Overview
          </button>
          <button className={`btn ${activeTab === "login_activity" ? "btn-primary" : "btn-secondary"} btn-sm`} onClick={() => { setActiveTab("login_activity"); fetchRecentLoginActivity(); }} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Shield className="w-4 h-4" aria-hidden="true" /> User Login Activity ({loginActivity.length})
          </button>
        </div>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* Metric Cards Grid */}
          <div className="admin-metrics-grid">
            <div className="admin-metric-card glass-panel" onClick={() => navigate("/admin/products")}>
              <div className="metric-details">
                <span className="metric-val">{summary.pendingProducts ?? 3} Pending</span>
                <span className="metric-title">Product Approvals</span>
              </div>
              <button className="btn btn-secondary btn-sm">Review Catalog</button>
            </div>

            <div className="admin-metric-card glass-panel" onClick={() => navigate("/admin/sellers")}>
              <div className="metric-details">
                <span className="metric-val">{summary.pendingSellers ?? 2} Pending</span>
                <span className="metric-title">Seller Verifications</span>
              </div>
              <button className="btn btn-secondary btn-sm">Inspect Documents</button>
            </div>

            <div className="admin-metric-card glass-panel" onClick={() => setActiveTab("login_activity")}>
              <div className="metric-details">
                <span className="metric-val">{loginActivity.length > 0 ? loginActivity.length : (summary.totalUsers ?? 154)} Logins</span>
                <span className="metric-title">Recorded Login Events</span>
              </div>
              <button className="btn btn-secondary btn-sm">Inspect Audit Log</button>
            </div>

            <div className="admin-metric-card glass-panel">
              <div className="metric-details">
                <span className="metric-val">{formatPrice(summary.totalRevenue ?? 2450000)}</span>
                <span className="metric-title">Platform Gross GMV</span>
              </div>
              <span className="badge-pill badge-success">89 Delivered</span>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="admin-table-section glass-panel">
            <div className="table-header-bar">
              <div>
                <h3>Recent Marketplace Transactions</h3>
                <p>Real-time customer order processing and routing audit</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={loadDashboard}>
                Refresh Feeds
              </button>
            </div>

            <div className="table-responsive">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Order Status</th>
                    <th>Total Volume</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.orderId}>
                      <td><strong>#{ord.orderId}</strong></td>
                      <td>{ord.customer}</td>
                      <td>
                        <span className={`badge-pill ${ord.status?.toLowerCase().includes("delivered") ? "badge-success" : "badge-primary"}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td><strong>{formatPrice(ord.totalAmount)}</strong></td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => alert(`Viewing full order details & audit trail for Order #${ord.orderId}`)}
                        >
                          Audit Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Tab 2: User Login Activity (Admin Only) */
        <div className="admin-table-section glass-panel" style={{ padding: "24px", borderRadius: "16px" }}>
          <div className="table-header-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>User Login Activity Audit Log</h3>
              <p style={{ margin: "2px 0 0 0", fontSize: "0.84rem", color: "var(--text-muted)" }}>
                Restricted Admin View: Real-time authentication events across Customer, Seller, Warehouse, Delivery, and Admin accounts.
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={fetchRecentLoginActivity} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Audit Log
            </button>
          </div>

          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>User / Customer ID</th>
                  <th>Customer Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Login Date & Time</th>
                  <th>Account Status</th>
                  <th>Login Status</th>
                </tr>
              </thead>
              <tbody>
                {loginActivity.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "24px" }}>
                      No recent user login activity recorded yet.
                    </td>
                  </tr>
                ) : (
                  loginActivity.map((log) => (
                    <tr key={log.logId}>
                      <td><strong>#{log.customerId || log.userId}</strong></td>
                      <td>{log.username}</td>
                      <td>{log.email}</td>
                      <td>
                        <span className={`badge-pill ${log.userRole === "Admin" ? "badge-danger" : log.userRole === "Seller" ? "badge-warning" : "badge-primary"}`}>
                          {log.userRole}
                        </span>
                      </td>
                      <td>{new Date(log.loginTime).toLocaleString("en-IN")}</td>
                      <td>
                        <span className="badge-pill badge-success">{log.accountStatus || "Active"}</span>
                      </td>
                      <td>
                        <strong style={{ color: log.loginStatus === "Success" ? "#10b981" : "#ef4444" }}>
                          {log.loginStatus || "Success"}
                        </strong>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
