import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../css/Dashboard.css";

function DeliveryDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [isOnline, setIsOnline] = useState(true);
  const [liveGpsCoords, setLiveGpsCoords] = useState("12.9750° N, 77.6020° E (Bengaluru)");

  const handleBroadcastGps = () => {
    if (!navigator.geolocation) {
      alert("GPS not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLiveGpsCoords(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
        alert("Live GPS coordinates broadcasted to active customer tracking screen.");
      },
      () => {
        alert("Simulated high-precision GPS coordinate ping broadcasted.");
      }
    );
  };

  return (
    <div className="delivery-dashboard-container centered-container">
      {/* Header */}
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Delivery Partner Live Dispatch Console</h1>
          <p>
            Rider: <strong>{user?.username || "Vikram Rathore"}</strong> • Motorbike: <strong className="plate-badge">{user?.vehicleNumber || "KA-05-MB-4421"}</strong> • License: <strong className="text-success">Verified</strong>
          </p>
        </div>

        <div className="online-toggle-box">
          <button
            className={`btn ${isOnline ? "btn-success" : "btn-secondary"}`}
            onClick={() => setIsOnline(!isOnline)}
          >
            {isOnline ? "ONLINE (Receiving Orders)" : "OFFLINE"}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card glass-panel" onClick={() => navigate("/delivery/assigned")}>
          <div className="metric-info">
            <span className="metric-number">2 Deliveries</span>
            <span className="metric-title">Assigned Routes</span>
          </div>
          <button className="btn btn-primary btn-sm">View Routes</button>
        </div>

        <div className="metric-card glass-panel" onClick={() => navigate("/delivery/otp")}>
          <div className="metric-info">
            <span className="metric-number">Verify OTP</span>
            <span className="metric-title">Customer Hand-off</span>
          </div>
          <button className="btn btn-luxury btn-sm">Enter OTP</button>
        </div>

        <div className="metric-card glass-panel" onClick={handleBroadcastGps}>
          <div className="metric-info">
            <span className="metric-number">Ping GPS</span>
            <span className="metric-title">{liveGpsCoords}</span>
          </div>
          <button className="btn btn-secondary btn-sm">Broadcast GPS</button>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-info">
            <span className="metric-number">₹ 1,480</span>
            <span className="metric-title">Today's Earnings</span>
          </div>
          <span className="badge-pill badge-success">14 Drops Completed</span>
        </div>
      </div>

      {/* Action Shortcuts */}
      <div className="dashboard-quick-links glass-panel">
        <h2>Delivery Partner Actions</h2>
        <div className="shortcuts-grid">
          <div className="shortcut-item" onClick={() => navigate("/delivery/assigned")}>
            <strong>Active Delivery Queue</strong>
            <p>Customer drop locations, navigation & phone calls</p>
          </div>

          <div className="shortcut-item" onClick={() => navigate("/delivery/otp")}>
            <strong>Delivery OTP Verification</strong>
            <p>Verify customer 4-digit code to complete order</p>
          </div>

          <div className="shortcut-item" onClick={handleBroadcastGps}>
            <strong>Live Route GPS Telemetry</strong>
            <p>Broadcast bike coordinates along delivery route</p>
          </div>

          <div className="shortcut-item" onClick={() => navigate("/delivery/history")}>
            <strong>Delivery Performance History</strong>
            <p>Review past completed drops, earnings breakdown, and ratings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryDashboard;
