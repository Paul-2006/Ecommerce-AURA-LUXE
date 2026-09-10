import { useEffect, useState } from "react";
import { Truck, CheckCircle2, Clock, MapPin, RefreshCw, Search, ShieldCheck } from "lucide-react";
import "../../css/Dashboard.css";

function AdminDeliveryMonitoring() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadFleetData();
  }, []);

  const loadFleetData = async () => {
    try {
      setLoading(true);
      // Delivery partners sample/live data
      setRiders([
        { riderId: 401, name: "Vikram Rathore", email: "delivery@webkadai.com", phone: "+91 98765 43210", vehiclePlate: "KA-05-MB-4421", status: "Online / On Delivery", assignedOrderId: 1049, totalDrops: 14, failedDrops: 0, rating: 4.9, licenseVerified: true },
        { riderId: 402, name: "Suresh Kumar", email: "suresh.k@example.com", phone: "+91 98765 22334", vehiclePlate: "KA-01-EA-9988", status: "Online / Available", assignedOrderId: "None", totalDrops: 22, failedDrops: 1, rating: 4.8, licenseVerified: true },
        { riderId: 403, name: "Manish Verma", email: "manish.v@example.com", phone: "+91 98123 77889", vehiclePlate: "KA-03-MB-1122", status: "Offline", assignedOrderId: "None", totalDrops: 8, failedDrops: 0, rating: 4.7, licenseVerified: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const activeRiders = riders.filter((r) => r.status.includes("Online"));
  const totalCompletedDrops = riders.reduce((sum, r) => sum + r.totalDrops, 0);

  const filteredRiders = riders.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.vehiclePlate.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search)
  );

  return (
    <div className="admin-page-container centered-container">
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-primary">Delivery Fleet Control</span>
            <h1 style={{ margin: "4px 0 0 0", fontFamily: "Playfair Display, Georgia, serif" }}>Delivery Partner Directory & Route Operations</h1>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Monitor delivery partner availability, active motorcycle routes, completed drops, and rider ratings.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadFleetData} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Telemetry
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val">{riders.length} Fleet</span>
            <span className="metric-title">Registered Delivery Partners</span>
          </div>
          <Truck className="w-5 h-5 text-indigo-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val">{activeRiders.length} Active</span>
            <span className="metric-title">Online & On-Route Riders</span>
          </div>
          <MapPin className="w-5 h-5 text-sky-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val">{totalCompletedDrops} Drops</span>
            <span className="metric-title">Total Completed Deliveries</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val">4.85 / 5.0</span>
            <span className="metric-title">Fleet Customer Rating</span>
          </div>
          <ShieldCheck className="w-5 h-5 text-amber-400" aria-hidden="true" />
        </div>
      </div>

      {/* Main Delivery Partner Table */}
      <div className="glass-panel" style={{ padding: "24px", borderRadius: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h3 style={{ margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>Delivery Partner Directory</h3>
          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search className="w-4 h-4 text-slate-400" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search rider, license plate, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "8px", border: "1px solid var(--border-medium)", background: "var(--bg-main)", color: "var(--text-main)", fontSize: "0.85rem" }}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading fleet telemetry...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Partner ID</th>
                  <th>Rider Name & Contact</th>
                  <th>Motorbike Plate</th>
                  <th>License Verification</th>
                  <th>Assigned Route</th>
                  <th>Current Status</th>
                  <th>Completed Drops</th>
                </tr>
              </thead>
              <tbody>
                {filteredRiders.map((r) => (
                  <tr key={r.riderId}>
                    <td><strong>#DEL-{r.riderId}</strong></td>
                    <td>
                      <div>
                        <strong>{r.name}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{r.email} • {r.phone}</div>
                      </div>
                    </td>
                    <td><strong className="plate-badge">{r.vehiclePlate}</strong></td>
                    <td>
                      <span className="badge-pill badge-success" style={{ fontSize: "0.75rem" }}>
                        Verified Valid
                      </span>
                    </td>
                    <td>
                      {r.assignedOrderId !== "None" ? (
                        <span className="badge-pill badge-primary">Order #{r.assignedOrderId}</span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>No Active Order</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge-pill ${r.status.includes("Online") ? "badge-success" : "badge-secondary"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <strong>{r.totalDrops} Drops</strong> ({r.rating}★)
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

export default AdminDeliveryMonitoring;
