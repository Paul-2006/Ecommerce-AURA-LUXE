import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../css/SellerDashboard.css";

function SellerDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="seller-dashboard-container centered-container">
      {/* Header */}
      <div className="seller-dashboard-header glass-panel">
        <div className="seller-header-left">
          <div>
            <h1>{user?.username || "Zenith Retail Corp"} (Merchant Hub)</h1>
            <p>GSTIN: {user?.gstNumber || "29AAAAA0000A1Z5"} • Verification Status: <strong className="text-success">Verified & Approved</strong></p>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => navigate("/seller/add-product")}>
          Add New Listing
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="seller-metrics-grid">
        <div className="seller-metric-card glass-panel" onClick={() => navigate("/seller/products")}>
          <div className="metric-details">
            <span className="metric-value">12 Listings</span>
            <span className="metric-name">Active Catalog Items</span>
          </div>
          <button className="btn btn-secondary btn-sm">Manage Stock</button>
        </div>

        <div className="seller-metric-card glass-panel" onClick={() => navigate("/seller/orders")}>
          <div className="metric-details">
            <span className="metric-value">4 Orders</span>
            <span className="metric-name">New Customer Orders</span>
          </div>
          <button className="btn btn-secondary btn-sm">View Orders</button>
        </div>

        <div className="seller-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-value">₹ 4,89,980</span>
            <span className="metric-name">Total Sales Volume</span>
          </div>
          <span className="badge-pill badge-success">Healthy Volume</span>
        </div>

        <div className="seller-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-value">4.92 / 5.0</span>
            <span className="metric-name">Merchant Trust Score</span>
          </div>
          <span className="badge-pill badge-primary">Top Rated</span>
        </div>
      </div>

      {/* Seller Portals Grid */}
      <div className="seller-actions-grid">
        <div className="seller-action-card glass-panel">
          <h3>Add New Product</h3>
          <p>Create high-resolution product listings with technical specifications.</p>
          <button className="btn btn-primary" onClick={() => navigate("/seller/add-product")}>
            Create Product
          </button>
        </div>

        <div className="seller-action-card glass-panel">
          <h3>Inventory & Stock Control</h3>
          <p>Update inventory quantities, price listings, or adjust SKU batch counts.</p>
          <button className="btn btn-secondary" onClick={() => navigate("/seller/products")}>
            Manage Products
          </button>
        </div>

        <div className="seller-action-card glass-panel">
          <h3>Fulfillment & Orders</h3>
          <p>Review customer orders and coordinate warehouse dispatch queues.</p>
          <button className="btn btn-secondary" onClick={() => navigate("/seller/orders")}>
            Sales Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
