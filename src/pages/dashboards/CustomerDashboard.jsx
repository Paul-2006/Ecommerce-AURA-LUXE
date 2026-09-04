import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../css/Dashboard.css";

function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, cartCount, wishlistCount } = useContext(AuthContext);

  const portals = [
    {
      id: "seller",
      title: "Seller Merchant Portal",
      desc: "Manage product listings, inventory stock & sales",
      path: "/seller/login",
      btnClass: "btn-primary",
      btnText: "Go to Seller Portal"
    },
    {
      id: "admin",
      title: "Master Admin Security Portal",
      desc: "2-Admin clearance, user approvals & platform audit",
      path: "/admin/login",
      btnClass: "btn-luxury",
      btnText: "Go to Admin Portal"
    },
    {
      id: "warehouse",
      title: "Warehouse Stock & Scanner Portal",
      desc: "Optical barcode/QR scanner & order packing",
      path: "/warehouse/login",
      btnClass: "btn-primary",
      btnText: "Go to Warehouse Portal"
    },
    {
      id: "delivery",
      title: "Delivery Partner Dispatch Portal",
      desc: "Motorbike dispatch, real-time live GPS & customer OTP",
      path: "/delivery/login",
      btnClass: "btn-success",
      btnText: "Go to Delivery Portal"
    }
  ];

  return (
    <div className="dashboard-page-container centered-container">
      {/* Header */}
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Welcome to AURA Luxe, {user?.username || user?.name || "Shopper"}</h1>
          <p>Switch to any operational portal or manage your customer shopping activities.</p>
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
            <span className="metric-number">Live Orders</span>
            <span className="metric-title">Live GPS Rider Tracking</span>
          </div>
          <button className="btn btn-luxury btn-sm">Track Live GPS</button>
        </div>

        <div className="metric-card glass-panel" onClick={() => navigate("/products")}>
          <div className="metric-info">
            <span className="metric-number">Catalog</span>
            <span className="metric-title">Browse & AI Compare</span>
          </div>
          <button className="btn btn-compare btn-sm">Compare Specs</button>
        </div>
      </div>

      {/* Move to Next Portal Button Section */}
      <div className="dashboard-quick-links glass-panel">
        <div className="section-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>Operational Portals</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Direct access buttons to move to Seller, Admin, Warehouse, or Delivery Partner portals:
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/login")}>
            View All Portals
          </button>
        </div>

        <div className="shortcuts-grid">
          {portals.map((portal) => (
            <div key={portal.id} className="shortcut-item">
              <strong>{portal.title}</strong>
              <p>{portal.desc}</p>
              <button
                className={`btn ${portal.btnClass} btn-sm`}
                style={{ marginTop: "12px", width: "100%" }}
                onClick={() => navigate(portal.path)}
              >
                {portal.btnText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;