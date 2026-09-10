import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, Search, ShieldAlert, FileText } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setComplaints([
        { complaintId: 801, orderId: 1045, customer: "Rahul Sharma", product: "Apple MacBook Pro 16\"", issue: "Box seal arrived loose", date: "2026-09-09", severity: "High", status: "Under Review", adminAction: "Requested Merchant Clarification" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-page-container">
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Risk & Compliance</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Seller Complaints & Dispute Desk</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Monitor buyer complaints, Admin risk warnings, and clarify dispute resolutions.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadComplaints}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Telemetry
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0 }}>Active Disputes Queue</h3>
          <span className="badge-pill badge-success">Good Standing (0 Critical Escalations)</span>
        </div>

        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--seller-text-secondary)" }}>
            <CheckCircle2 className="w-8 h-8 mx-auto" style={{ color: "var(--seller-success)", marginBottom: "8px" }} aria-hidden="true" />
            <strong style={{ display: "block", color: "var(--seller-primary)" }}>No Active Complaints Found</strong>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem" }}>Your merchant account has 0 active customer complaints or Admin warnings.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Order & Date</th>
                  <th>Customer</th>
                  <th>Product & Dispute Issue</th>
                  <th>Severity</th>
                  <th>Dispute Status</th>
                  <th>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.complaintId}>
                    <td><strong>#CMP-{c.complaintId}</strong></td>
                    <td>
                      <div>
                        <strong>Order #{c.orderId}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)" }}>{c.date}</div>
                      </div>
                    </td>
                    <td><strong>{c.customer}</strong></td>
                    <td>
                      <div>
                        <strong>{c.product}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)" }}>"{c.issue}"</div>
                      </div>
                    </td>
                    <td><span className="badge-pill badge-warning">{c.severity}</span></td>
                    <td><span className="badge-pill badge-warning">{c.status}</span></td>
                    <td>{c.adminAction}</td>
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

export default SellerComplaints;
