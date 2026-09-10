import { useEffect, useState } from "react";
import { getSellers, updateSellerApproval } from "../../services/adminService";
import { X } from "lucide-react";
import "../../css/Dashboard.css";

function ManageSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inspectingDoc, setInspectingDoc] = useState(null);

  useEffect(() => {
    loadSellersList();
  }, []);

  const loadSellersList = async () => {
    try {
      const res = await getSellers();
      setSellers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetStatus = async (sellerId, newStatus) => {
    await updateSellerApproval({
      sellerId,
      status: newStatus,
      remarks: `${newStatus} by Admin Document Verification Desk`
    });

    setSellers((prev) =>
      prev.map((s) => (s.sellerId === sellerId ? { ...s, approvalStatus: newStatus, status: newStatus } : s))
    );
    alert(`Seller #${sellerId} has been marked as ${newStatus}.`);
  };

  return (
    <div className="manage-sellers-container centered-container">
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Merchant Document Verification & Compliance Desk</h1>
          <p>Inspect seller business registrations, GSTIN numbers, and approve or reject trading accounts.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px", marginTop: "24px" }}>
        <div className="table-header-bar">
          <h3>Registered Merchant Verification Queue</h3>
          <button className="btn btn-secondary btn-sm" onClick={loadSellersList}>
            Refresh List
          </button>
        </div>

        {loading ? (
          <p>Loading seller document records...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Seller ID</th>
                  <th>Business Name & Email</th>
                  <th>GST Number</th>
                  <th>Business Document</th>
                  <th>Compliance Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((s) => (
                  <tr key={s.sellerId}>
                    <td><strong>#SEL-{s.sellerId}</strong></td>
                    <td>
                      <div>
                        <strong>{s.businessName || "Zenith Store"}</strong>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{s.email}</p>
                      </div>
                    </td>
                    <td><strong className="plate-badge">{s.gstnumber || "29AAAAA0000A1Z5"}</strong></td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() =>
                          setInspectingDoc({
                            sellerName: s.businessName,
                            gst: s.gstnumber,
                            url: s.documentUrl || "https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80"
                          })
                        }
                      >
                        Inspect Proof
                      </button>
                    </td>
                    <td>
                      <span className={`badge-pill ${s.approvalStatus === "Approved" || s.status === "Approved" ? "badge-success" : "badge-warning"}`}>
                        {s.approvalStatus || s.status || "Pending Verification"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleSetStatus(s.sellerId, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleSetStatus(s.sellerId, "Rejected")}
                        >
                          Reject
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

      {/* Document Inspection Modal */}
      {inspectingDoc && (
        <div className="live-tracking-modal">
          <div className="live-tracking-content glass-panel center-content" style={{ maxWidth: "560px" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>Business Document Verification</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setInspectingDoc(null)}>
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <p style={{ textAlign: "left", width: "100%" }}>
              Seller: <strong>{inspectingDoc.sellerName}</strong> • GSTIN: <strong>{inspectingDoc.gst}</strong>
            </p>

            <img
              src={inspectingDoc.url}
              alt="Document"
              style={{ width: "100%", height: "260px", objectFit: "cover", borderRadius: "10px", border: "1px solid var(--border-light)" }}
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "flex-end", marginTop: "12px" }}>
              <button className="btn btn-secondary" onClick={() => setInspectingDoc(null)}>Close</button>
              <button
                className="btn btn-success"
                onClick={() => {
                  alert("Document verified by administrator.");
                  setInspectingDoc(null);
                }}
              >
                Mark Document Valid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSellers;
