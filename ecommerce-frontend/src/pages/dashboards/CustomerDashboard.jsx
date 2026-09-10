import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../css/Dashboard.css";

function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, cartCount, wishlistCount } = useContext(AuthContext);

  return (
    <div className="dashboard-page-container centered-container">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Welcome back, {user?.username || user?.name || "Customer"}!</h1>
          <p>Here is your personalized account dashboard and order management center.</p>
        </div>
        <span className="badge-pill badge-primary">Verified Customer Account</span>
      </div>

      {/* Account Profile Summary Card */}
      <div className="user-details-card glass-panel" style={{ padding: "20px", borderRadius: "16px", marginBottom: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>Account Name</span>
          <strong style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>{user?.username || user?.name || "Customer"}</strong>
        </div>
        <div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>Email Address</span>
          <strong style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>{user?.email || "customer@example.com"}</strong>
        </div>
        <div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>Account Role</span>
          <span className="badge-pill badge-success" style={{ display: "inline-block", marginTop: "4px" }}>Customer</span>
        </div>
        <div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>Status</span>
          <strong style={{ color: "var(--success, #10b981)" }}>Active</strong>
        </div>
      </div>

      {/* Customer Quick Metric Buttons */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card glass-panel" onClick={() => navigate("/cart")}>
          <div className="metric-info">
            <span className="metric-number">{cartCount} Items</span>
            <span className="metric-title">Active Shopping Cart</span>
          </div>
          <button className="btn btn-secondary btn-sm">Open Cart</button>
        </div>

        <div className="metric-card glass-panel" onClick={() => navigate("/wishlist")}>
          <div className="metric-info">
            <span className="metric-number">{wishlistCount} Items</span>
            <span className="metric-title">Saved Wishlist</span>
          </div>
          <button className="btn btn-secondary btn-sm">Open Wishlist</button>
        </div>

        <div className="metric-card glass-panel" onClick={() => navigate("/orders")}>
          <div className="metric-info">
            <span className="metric-number">My Orders</span>
            <span className="metric-title">Live GPS Rider Tracking</span>
          </div>
          <button className="btn btn-luxury btn-sm">Track Orders</button>
        </div>

        <div className="metric-card glass-panel" onClick={() => navigate("/products")}>
          <div className="metric-info">
            <span className="metric-number">Catalog</span>
            <span className="metric-title">Browse & AI Compare</span>
          </div>
          <button className="btn btn-compare btn-sm">Explore Hardware</button>
        </div>
      </div>

      {/* Customer Quick Actions Section */}
      <div className="dashboard-quick-links glass-panel">
        <div className="section-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h2>Customer Account Actions</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Quick shortcuts to manage your shopping cart, orders, wishlist, and account settings:
            </p>
          </div>
        </div>

        <div className="shortcuts-grid">
          <div className="shortcut-item" onClick={() => navigate("/orders")}>
            <strong>📦 My Orders & Live Tracking</strong>
            <p>View order history, invoices, and live delivery rider coordinates</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: "12px", width: "100%" }}>
              View Orders
            </button>
          </div>

          <div className="shortcut-item" onClick={() => navigate("/wishlist")}>
            <strong>💖 Saved Wishlist</strong>
            <p>Manage your saved hardware items and get instant deal notifications</p>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: "12px", width: "100%" }}>
              View Wishlist ({wishlistCount})
            </button>
          </div>

          <div className="shortcut-item" onClick={() => navigate("/cart")}>
            <strong>🛒 Active Shopping Cart</strong>
            <p>Review selected hardware, apply discount coupons, and checkout</p>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: "12px", width: "100%" }}>
              View Cart ({cartCount})
            </button>
          </div>

          <div className="shortcut-item" onClick={() => navigate("/profile")}>
            <strong>⚙️ Profile & Account Settings</strong>
            <p>Update your delivery address, phone number, and security preferences</p>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: "12px", width: "100%" }}>
              Manage Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;