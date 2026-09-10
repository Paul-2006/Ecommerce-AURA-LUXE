import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2, RefreshCw, Search, Flag, UserX, AlertOctagon } from "lucide-react";
import "../../css/AdminPortal.css";

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
      const dataset = [
        { complaintId: 901, date: "2026-09-09", reporterType: "Customer", reporterName: "Rahul Sharma", sellerName: "Zenith Retail Corp", orderId: 1045, severity: "High", category: "Damaged Package", issueText: "Product box arrived damaged with missing seal.", status: "Pending", sellerBadComplaintsCount: 5 },
        { complaintId: 902, date: "2026-09-08", reporterType: "Customer", reporterName: "Priya Nair", sellerName: "Zenith Retail Corp", orderId: 1038, severity: "Medium", category: "Late Shipping", issueText: "Fulfillment delay exceeded 48 hours.", status: "Warning Issued", sellerBadComplaintsCount: 5 },
        { complaintId: 903, date: "2026-09-07", reporterType: "Customer", reporterName: "Amit Patel", sellerName: "Zenith Retail Corp", orderId: 1022, severity: "High", category: "Wrong Model", issueText: "Sent wrong color variant.", status: "Under Review", sellerBadComplaintsCount: 5 },
        { complaintId: 904, date: "2026-09-06", reporterType: "Customer", reporterName: "Sneha Reddy", sellerName: "Zenith Retail Corp", orderId: 1014, severity: "Critical", category: "Defective Display", issueText: "Screen flicker on power up.", status: "Pending", sellerBadComplaintsCount: 5 },
        { complaintId: 905, date: "2026-09-05", reporterType: "Customer", reporterName: "Vikram Kumar", sellerName: "Zenith Retail Corp", orderId: 1008, severity: "High", category: "Counterfeit Concern", issueText: "Serial number verification failed.", status: "Pending", sellerBadComplaintsCount: 5 },
        { complaintId: 906, date: "2026-09-10", reporterType: "Delivery Partner", reporterName: "Vikram Rathore", sellerName: "Apex Electronics Hub", orderId: 1049, severity: "Low", category: "Address Typo", issueText: "Customer landmark clarification requested.", status: "Resolved", sellerBadComplaintsCount: 1 }
      ];

      setComplaints(dataset);

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

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === "All" || c.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesSearch =
      c.sellerName.toLowerCase().includes(search.toLowerCase()) ||
      c.reporterName.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-page-container">
      <div className="admin-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-danger">Dispute Resolution Desk</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Marketplace Dispute Center & 5-Complaint Seller Warnings</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Investigate buyer & delivery complaints, issue automated warnings to high-risk merchants (&ge; 5 complaints), and suspend repeat violators.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadComplaintsData}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Disputes
          </button>
        </div>
      </div>

      {/* 5-Complaint Risk Warning Alert Banners */}
      {Object.entries(sellersRiskMap).map(([sellerName, count]) => {
        if (count >= 5) {
          return (
            <div key={sellerName} className="admin-alert admin-alert-danger" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <AlertOctagon className="w-5 h-5 text-red-500 flex-shrink-0" aria-hidden="true" />
                <div>
                  <strong>AUTOMATED 5-COMPLAINT WARNING RULE TRIGGERED: Merchant "{sellerName}"</strong>
                  <div style={{ fontSize: "0.82rem", marginTop: "2px" }}>
                    This merchant has accumulated <strong>{count} active complaints</strong>. Platform rules mandate issuing an official warning or freezing catalog listings.
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="btn btn-warning btn-sm" onClick={() => handleIssueWarning(sellerName)}>
                  <Flag className="w-3.5 h-3.5" aria-hidden="true" /> Issue Warning
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleSuspendSeller(sellerName)}>
                  <UserX className="w-3.5 h-3.5" aria-hidden="true" /> Suspend Merchant
                </button>
              </div>
            </div>
          );
        }
        return null;
      })}

      {/* Metrics Grid */}
      <div className="admin-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--admin-danger)" }}>{complaints.filter((c) => c.status !== "Resolved").length} Pending</span>
            <span className="metric-title">Active Complaints</span>
          </div>
          <AlertTriangle className="w-5 h-5" style={{ color: "var(--admin-danger)" }} aria-hidden="true" />
        </div>

        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--admin-warning)" }}>1 Merchant</span>
            <span className="metric-title">High Risk (&ge; 5 Complaints)</span>
          </div>
          <ShieldAlert className="w-5 h-5" style={{ color: "var(--admin-warning)" }} aria-hidden="true" />
        </div>

        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val">{complaints.filter((c) => c.status === "Resolved").length} Resolved</span>
            <span className="metric-title">Closed Disputes</span>
          </div>
          <CheckCircle2 className="w-5 h-5" style={{ color: "var(--admin-success)" }} aria-hidden="true" />
        </div>
      </div>

      {/* Complaints Table Card */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["All", "Pending", "Under Review", "Warning Issued", "Resolved"].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn ${statusFilter === st ? "btn-primary" : "btn-outline"} btn-sm`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search className="w-4 h-4" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-secondary)" }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by merchant, reporter, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: "36px" }}
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
                  <th>Complaint ID</th>
                  <th>Date & Reporter</th>
                  <th>Target Merchant</th>
                  <th>Issue Category & Description</th>
                  <th>Severity Level</th>
                  <th>Dispute Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((c) => (
                  <tr key={c.complaintId}>
                    <td><strong>#DISP-{c.complaintId}</strong></td>
                    <td>
                      <div>
                        <strong>{c.reporterName}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--admin-text-secondary)", margin: "2px 0 0 0" }}>{c.reporterType} • {c.date}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{c.sellerName}</strong>
                        <div style={{ fontSize: "0.78rem", color: c.sellerBadComplaintsCount >= 5 ? "var(--admin-danger)" : "var(--admin-text-secondary)" }}>
                          {c.sellerBadComplaintsCount} Total Complaints
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{c.category} (Order #{c.orderId})</strong>
                        <p style={{ margin: "2px 0 0 0", fontSize: "0.82rem", color: "var(--admin-text-secondary)" }}>"{c.issueText}"</p>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-pill ${c.severity === "Critical" || c.severity === "High" ? "badge-danger" : "badge-warning"}`}>
                        {c.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-pill ${c.status === "Resolved" ? "badge-success" : c.status === "Warning Issued" || c.status === "Seller Suspended" ? "badge-danger" : "badge-warning"}`}>
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
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleIssueWarning(c.sellerName)}
                        >
                          Warn
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

export default ManageComplaints;
