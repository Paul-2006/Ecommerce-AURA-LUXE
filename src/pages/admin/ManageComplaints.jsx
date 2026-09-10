import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2, RefreshCw, Search, Flag, UserX, AlertOctagon } from "lucide-react";
import "../../css/Dashboard.css";

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [sellersRiskMap, setSellersRiskMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadComplaintsData();
  }, []);

  const loadComplaintsData = async () => {
    try {
      setLoading(true);
      // Sample dataset representing complaints across Customer, Seller, Delivery portals
      const dataset = [
        { complaintId: 901, date: "2026-09-09", reporterType: "Customer", reporterName: "Rahul Sharma", sellerName: "Zenith Retail Corp", orderId: 1045, severity: "High", category: "Damaged Package", issueText: "Product box arrived damaged with missing seal.", status: "Pending", sellerBadComplaintsCount: 5 },
        { complaintId: 902, date: "2026-09-08", reporterType: "Customer", reporterName: "Priya Nair", sellerName: "Zenith Retail Corp", orderId: 1038, severity: "Medium", category: "Late Shipping", issueText: "Fulfillment delay exceeded 48 hours.", status: "Warning Issued", sellerBadComplaintsCount: 5 },
        { complaintId: 903, date: "2026-09-07", reporterType: "Customer", reporterName: "Amit Patel", sellerName: "Zenith Retail Corp", orderId: 1022, severity: "High", category: "Wrong Model", issueText: "Sent wrong color variant.", status: "Under Review", sellerBadComplaintsCount: 5 },
        { complaintId: 904, date: "2026-09-06", reporterType: "Customer", reporterName: "Sneha Reddy", sellerName: "Zenith Retail Corp", orderId: 1014, severity: "Critical", category: "Defective Display", issueText: "Screen flicker on power up.", status: "Pending", sellerBadComplaintsCount: 5 },
        { complaintId: 905, date: "2026-09-05", reporterType: "Customer", reporterName: "Vikram Kumar", sellerName: "Zenith Retail Corp", orderId: 1008, severity: "High", category: "Counterfeit Concern", issueText: "Serial number verification failed.", status: "Pending", sellerBadComplaintsCount: 5 },
        { complaintId: 906, date: "2026-09-10", reporterType: "Delivery Partner", reporterName: "Vikram Rathore", sellerName: "Apex Electronics Hub", orderId: 1049, severity: "Low", category: "Address Typo", issueText: "Customer landmark clarification requested.", status: "Resolved", sellerBadComplaintsCount: 1 }
      ];

      setComplaints(dataset);

      // Compute complaints per seller for 5-complaint rule enforcement
      const risk = {};
      dataset.forEach((c) => {
        if (c.sellerName) {
          risk[c.sellerName] = (risk[c.sellerName] || 0) + 1;
        }
      });
      setSellersRiskMap(risk);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueWarning = (sellerName) => {
    alert(`OFFICIAL WARNING ISSUED TO MERCHANT "${sellerName}".\n\nRule Enforcement Triggered: Merchant has accumulated 5 or more verified complaints.`);
    setComplaints((prev) =>
      prev.map((c) => (c.sellerName === sellerName ? { ...c, status: "Warning Issued" } : c))
    );
  };

  const handleSuspendSeller = (sellerName) => {
    alert(`MERCHANT "${sellerName}" HAS BEEN TEMPORARILY SUSPENDED FROM THE MARKETPLACE.\n\nAccount Status: Suspended pending formal audit.`);
    setComplaints((prev) =>
      prev.map((c) => (c.sellerName === sellerName ? { ...c, status: "Seller Suspended" } : c))
    );
  };

  const handleResolveComplaint = (complaintId) => {
    setComplaints((prev) =>
      prev.map((c) => (c.complaintId === complaintId ? { ...c, status: "Resolved" } : c))
    );
  };

  const flaggedSellers = Object.entries(sellersRiskMap).filter(([_, count]) => count >= 5);

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesSearch =
      c.sellerName.toLowerCase().includes(search.toLowerCase()) ||
      c.reporterName.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.issueText.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-page-container centered-container">
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-danger">Platform Disputes & Risk Control</span>
            <h1 style={{ margin: "4px 0 0 0", fontFamily: "Playfair Display, Georgia, serif" }}>Marketplace Complaints & Merchant Risk Audit</h1>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Investigate customer, seller, and delivery issues. Automated 5-complaint threshold enforcement flags problematic merchants.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadComplaintsData} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Complaints
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="admin-metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val">{complaints.length} Disputes</span>
            <span className="metric-title">Total Registered Complaints</span>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--danger, #ef4444)" }}>{flaggedSellers.length} Flagged</span>
            <span className="metric-title">Sellers Exceeding 5 Complaints</span>
          </div>
          <AlertOctagon className="w-5 h-5 text-rose-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val">{complaints.filter((c) => c.status === "Pending").length} Pending</span>
            <span className="metric-title">Unresolved Disputes</span>
          </div>
          <Clock className="w-5 h-5 text-indigo-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val">{complaints.filter((c) => c.status === "Resolved").length} Resolved</span>
            <span className="metric-title">Settled Cases</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
        </div>
      </div>

      {/* Rule 5 Warning Flag Alert Banner */}
      {flaggedSellers.length > 0 && (
        <div
          className="glass-panel"
          style={{
            padding: "20px 24px",
            marginBottom: "24px",
            borderRadius: "16px",
            border: "2px solid rgba(239,68,68,0.5)",
            background: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(245,158,11,0.12))"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ShieldAlert className="w-6 h-6 text-rose-500" aria-hidden="true" />
              <div>
                <h3 style={{ margin: 0, color: "#f87171" }}>Rule Enforcement Triggered: Seller Warning Limit Exceeded</h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.88rem", color: "var(--text-main)" }}>
                  Merchant <strong>"{flaggedSellers[0][0]}"</strong> has received <strong>{flaggedSellers[0][1]} bad complaints</strong>. Official warning or temporary suspension is required.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="btn btn-warning btn-sm"
                onClick={() => handleIssueWarning(flaggedSellers[0][0])}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Flag className="w-4 h-4" aria-hidden="true" /> Issue Formal Warning
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleSuspendSeller(flaggedSellers[0][0])}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <UserX className="w-4 h-4" aria-hidden="true" /> Suspend Merchant Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Complaints Register Table */}
      <div className="glass-panel" style={{ padding: "24px", borderRadius: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["All", "Pending", "Under Review", "Warning Issued", "Resolved"].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn ${statusFilter === st ? "btn-primary" : "btn-secondary"} btn-sm`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search className="w-4 h-4 text-slate-400" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by seller, customer, issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "8px", border: "1px solid var(--border-medium)", background: "var(--bg-main)", color: "var(--text-main)", fontSize: "0.85rem" }}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading complaints...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Reporter</th>
                  <th>Related Seller & Bad Complaints</th>
                  <th>Category & Issue Details</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((c) => (
                  <tr key={c.complaintId}>
                    <td><strong>#CMP-{c.complaintId}</strong></td>
                    <td>{c.date}</td>
                    <td>
                      <div>
                        <strong>{c.reporterName}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{c.reporterType}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{c.sellerName}</strong>
                        <div style={{ fontSize: "0.78rem", color: c.sellerBadComplaintsCount >= 5 ? "#ef4444" : "var(--text-muted)", fontWeight: "600" }}>
                          {c.sellerBadComplaintsCount} Bad Complaints {c.sellerBadComplaintsCount >= 5 ? "(Limit Exceeded!)" : ""}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{c.category}</strong> (Order #{c.orderId})
                        <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>{c.issueText}</p>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-pill ${c.severity === "Critical" || c.severity === "High" ? "badge-danger" : "badge-warning"}`}>
                        {c.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-pill ${c.status === "Resolved" ? "badge-success" : c.status === "Warning Issued" ? "badge-warning" : "badge-danger"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {c.status !== "Resolved" && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleResolveComplaint(c.complaintId)}
                          >
                            Resolve
                          </button>
                        )}
                        {c.sellerBadComplaintsCount >= 5 && c.status !== "Warning Issued" && (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleIssueWarning(c.sellerName)}
                          >
                            Warn Seller
                          </button>
                        )}
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

export default ManageComplaints;
