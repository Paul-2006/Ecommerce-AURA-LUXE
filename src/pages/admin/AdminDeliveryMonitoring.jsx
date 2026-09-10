import { useEffect, useState } from "react";
import { Truck, CheckCircle2, Clock, MapPin, RefreshCw, Search, ShieldCheck } from "lucide-react";
import "../../css/AdminPortal.css";

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
    <div className="admin-page-container">
      <div className="admin-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Delivery Fleet Control</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Delivery Partner Directory & Route Operations</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Monitor delivery partner availability, active motorcycle routes, completed drops, and rider ratings.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadFleetData}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Telemetry
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val">{riders.length} Fleet</span>
            <span className="metric-title">Registered Partners</span>
          </div>
          <Truck className="w-5 h-5" style={{ color: "var(--admin-secondary)" }} aria-hidden="true" />
        </div>

        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val">{activeRiders.length} Active</span>
            <span className="metric-title">Online & On Route</span>
          </div>
          <Clock className="w-5 h-5" style={{ color: "var(--admin-warning)" }} aria-hidden="true" />
        </div>

        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val">{totalCompletedDrops} Drops</span>
            <span className="metric-title">Completed Packages</span>
          </div>
          <CheckCircle2 className="w-5 h-5" style={{ color: "var(--admin-success)" }} aria-hidden="true" />
        </div>

        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val">4.8 / 5.0</span>
            <span className="metric-title">Fleet Customer Score</span>
          </div>
          <ShieldCheck className="w-5 h-5" style={{ color: "var(--admin-secondary)" }} aria-hidden="true" />
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h3 style={{ margin: 0 }}>Logistics Partner Fleet Telemetry</h3>
          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search className="w-4 h-4" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-secondary)" }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search rider name, plate, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: "36px" }}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading logistics fleet data...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Rider ID</th>
                  <th>Partner Name & Phone</th>
                  <th>Vehicle Plate</th>
                  <th>Active Assignment</th>
                  <th>Total Drops</th>
                  <th>Duty Status</th>
                  <th>License Verification</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRiders.map((r) => (
                  <tr key={r.riderId}>
                    <td><strong>#RIDER-{r.riderId}</strong></td>
                    <td>
                      <div>
                        <strong>{r.name}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--admin-text-secondary)", margin: "2px 0 0 0" }}>{r.phone} • {r.email}</div>
                      </div>
                    </td>
                    <td><strong style={{ background: "var(--admin-surface-alt)", padding: "2px 8px", borderRadius: "6px", fontSize: "0.82rem" }}>{r.vehiclePlate}</strong></td>
                    <td>
                      {r.assignedOrderId !== "None" ? (
                        <strong>Order #{r.assignedOrderId}</strong>
                      ) : (
                        <span style={{ color: "var(--admin-text-secondary)" }}>Standby</span>
                      )}
                    </td>
                    <td><strong>{r.totalDrops} Drops</strong></td>
                    <td>
                      <span className={`badge-pill ${r.status.includes("Online") ? "badge-success" : "badge-secondary"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <span className="badge-pill badge-success" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> Clear
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => alert(`Pinged location telemetry for rider ${r.name}.`)}
                      >
                        Ping GPS
                      </button>
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
