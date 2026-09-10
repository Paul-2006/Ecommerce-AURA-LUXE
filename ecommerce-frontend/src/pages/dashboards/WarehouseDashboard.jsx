import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../css/Dashboard.css";

function WarehouseDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="warehouse-dashboard-container centered-container">
      {/* Header */}
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Warehouse Logistics & Scanning Console</h1>
          <p>
            Operator: <strong>{user?.username || "Kiran Kumar"}</strong> • Terminal: <strong>{user?.warehouseName || "Hub #01 - Bengaluru Central"}</strong>
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card glass-panel" onClick={() => navigate("/warehouse/inventory")}>
          <div className="metric-info">
            <span className="metric-number">Optical Scanner</span>
            <span className="metric-title">Barcode / QR Reader</span>
          </div>
          <button className="btn btn-primary btn-sm">Launch Scanner</button>
        </div>

        <div className="metric-card glass-panel" onClick={() => navigate("/warehouse/inventory")}>
          <div className="metric-info">
            <span className="metric-number">48 SKUs</span>
            <span className="metric-title">Active Warehouse Catalog</span>
          </div>
          <button className="btn btn-secondary btn-sm">Stock Master</button>
        </div>

        <div className="metric-card glass-panel" onClick={() => navigate("/warehouse/packing-orders")}>
          <div className="metric-info">
            <span className="metric-number">6 Orders</span>
            <span className="metric-title">Awaiting Box Packing</span>
          </div>
          <button className="btn btn-secondary btn-sm">Packing Queue</button>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-info">
            <span className="metric-number">12 Dispatched</span>
            <span className="metric-title">Handed to Motorbike Riders</span>
          </div>
          <span className="badge-pill badge-success">100% On-Time</span>
        </div>
      </div>

      {/* Navigation Quick Actions */}
      <div className="dashboard-quick-links glass-panel">
        <h2>Warehouse Operations</h2>
        <div className="shortcuts-grid">
          <div className="shortcut-item" onClick={() => navigate("/warehouse/inventory")}>
            <strong>Barcode Stock Scanner</strong>
            <p>Scan barcodes to increment/decrement inventory records</p>
          </div>

          <div className="shortcut-item" onClick={() => navigate("/warehouse/packing-orders")}>
            <strong>Order Packing Line</strong>
            <p>Verify items and generate shipping labels</p>
          </div>

          <div className="shortcut-item" onClick={() => navigate("/products")}>
            <strong>Marketplace Catalog</strong>
            <p>View public product listings and prices</p>
          </div>

          <div className="shortcut-item" onClick={() => navigate("/warehouse/inventory")}>
            <strong>Warehouse Stock Reports</strong>
            <p>Export SKU inventory counts and low-stock alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarehouseDashboard;