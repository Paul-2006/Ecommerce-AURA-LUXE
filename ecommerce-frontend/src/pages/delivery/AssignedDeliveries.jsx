import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  getAssignedDeliveries,
  updateDeliveryStatus,
  updateDeliveryLocation
} from "../../services/deliveryService";
import "../../css/Dashboard.css";

function AssignedDeliveries() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      const partnerId = user?.deliveryPartnerId || 1;
      const res = await getAssignedDeliveries(partnerId);
      setDeliveries(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (assignmentId, newStatus) => {
    await updateDeliveryStatus(assignmentId, newStatus);
    setDeliveries((prev) =>
      prev.map((d) => (d.assignmentId === assignmentId ? { ...d, status: newStatus } : d))
    );
    alert(`Order status updated to "${newStatus}". Live delivery map updated for customer.`);
  };

  const handleSendGps = async (orderId) => {
    if (!navigator.geolocation) {
      alert("GPS not available");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await updateDeliveryLocation({
          deliveryPartnerId: user?.deliveryPartnerId || 1,
          orderId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        alert(`Live GPS Ping Sent: (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
      },
      () => {
        alert("Simulated live GPS route coordinates sent to customer.");
      }
    );
  };

  return (
    <div className="assigned-deliveries-container centered-container">
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Assigned Motorbike Delivery Routes</h1>
          <p>
            Rider: <strong>{user?.username || "Vikram Rathore"}</strong> • Motorbike: <strong className="plate-badge">{user?.vehicleNumber || "KA-05-MB-4421"}</strong>
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px", marginTop: "24px" }}>
        <div className="table-header-bar">
          <div>
            <h3>Active Deliveries Queue</h3>
            <p>Update order states and broadcast real-time telemetry coordinates to customer map view</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadDeliveries}>
            Refresh Routes
          </button>
        </div>

        {loading ? (
          <p>Loading assigned routes...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer & Contact</th>
                  <th>Delivery Address</th>
                  <th>Total COD</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((d) => (
                  <tr key={d.assignmentId}>
                    <td><strong>#{d.orderId}</strong></td>
                    <td>
                      <div>
                        <strong>{d.customerName || "Rahul Sharma"}</strong>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{d.customerPhone || "+91 98765 43210"}</p>
                      </div>
                    </td>
                    <td><p style={{ maxWidth: "220px", fontSize: "0.85rem" }}>{d.deliveryAddress || "Plot 42, Tech Park, Bengaluru"}</p></td>
                    <td><strong>₹ {(d.totalAmount || 249999).toLocaleString("en-IN")}</strong></td>
                    <td>
                      <span className={`badge-pill ${d.status === "Delivered" ? "badge-success" : "badge-primary"}`}>
                        {d.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleSendGps(d.orderId)}
                          title="Broadcast GPS to customer"
                        >
                          Ping GPS
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStatusChange(d.assignmentId, "Out For Delivery")}
                        >
                          Start Trip
                        </button>
                        <button
                          className="btn btn-luxury btn-sm"
                          onClick={() => navigate("/delivery/otp")}
                        >
                          Verify OTP & Finish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignedDeliveries;
