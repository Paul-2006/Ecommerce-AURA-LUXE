import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getAdminSummary, getRecentOrders } from "../../services/adminService";
import "../../css/Dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [summary, setSummary] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amt);

  return (
    <div className="admin-dashboard-container centered-container">
      {/* Header */}
      <div className="admin-dashboard-header glass-panel">
        <div className="admin-header-left">
          <div>
            <h1>Master Admin Security Console</h1>
            <p>
              Operator: <strong>{user?.username || "Alex Vance"}</strong> • Clearance: <span className="badge-pill badge-danger">{user?.adminSlot || "Slot 1: Platform Director"}</span>
            </p>
          </div>
        </div>

        <div className="admin-quick-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/admin/sellers")}>
            Verify Sellers ({summary.pendingSellers ?? 2})
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/admin/products")}>
            Approve Products ({summary.pendingProducts ?? 3})
          </button>
        </div>
      </div>

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
            <span className="metric-title">Seller GST Verifications</span>
          </div>
          <button className="btn btn-secondary btn-sm">Inspect Documents</button>
        </div>

        <div className="admin-metric-card glass-panel" onClick={() => navigate("/admin/users")}>
          <div className="metric-details">
            <span className="metric-val">{summary.totalUsers ?? 154} Users</span>
            <span className="metric-title">Registered Accounts</span>
          </div>
          <button className="btn btn-secondary btn-sm">Manage Users</button>
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
            <h3>Recent Marketplace Orders</h3>
            <p>Real-time customer transactions and delivery routing status</p>
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
    </div>
  );
}

export default AdminDashboard;
