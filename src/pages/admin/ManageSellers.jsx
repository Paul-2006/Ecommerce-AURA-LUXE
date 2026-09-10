import { useEffect, useState } from "react";
import { getSellers, updateSellerApproval } from "../../services/adminService";
import { X, Store, CheckCircle, RefreshCw } from "lucide-react";
import "../../css/AdminPortal.css";

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
    <div className="manage-sellers-container">
      <div className="admin-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Seller Risk & Approvals</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Merchant Document Verification & Compliance Desk</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Inspect seller business registrations, GSTIN numbers, and approve or reject trading accounts.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadSellersList}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Queue
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        <div className="table-header-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0 }}>Registered Merchant Verification Queue</h3>
          <span className="badge-pill badge-secondary">{sellers.length} Total Merchants</span>
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
                        <p style={{ fontSize: "0.78rem", color: "var(--admin-text-secondary)", margin: "2px 0 0 0" }}>{s.email}</p>
                      </div>
                    </td>
                    <td><strong style={{ background: "var(--admin-surface-alt)", padding: "2px 8px", borderRadius: "6px", fontSize: "0.82rem" }}>{s.gstnumber || "29AAAAA0000A1Z5"}</strong></td>
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
                      <span className={`badge-pill ${s.approvalStatus === "Approved" || s.status === "Approved" ? "badge-success" : s.approvalStatus === "Rejected" ? "badge-danger" : "badge-warning"}`}>
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
        <div style={{ position: "fixed", inset: 0, background: "rgba(14, 21, 36, 0.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="glass-panel" style={{ maxWidth: "560px", width: "100%", padding: "24px", borderRadius: "14px", background: "var(--admin-surface)" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0 }}>Business Document Verification</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setInspectingDoc(null)} style={{ padding: "4px" }}>
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <p style={{ textAlign: "left", width: "100%", fontSize: "0.88rem", color: "var(--admin-text-secondary)", marginBottom: "16px" }}>
              Seller: <strong style={{ color: "var(--admin-primary)" }}>{inspectingDoc.sellerName}</strong> • GSTIN: <strong style={{ color: "var(--admin-primary)" }}>{inspectingDoc.gst}</strong>
            </p>

            <img
              src={inspectingDoc.url}
              alt="Document"
              style={{ width: "100%", height: "260px", objectFit: "cover", borderRadius: "10px", border: "1px solid var(--admin-border)" }}
            />

            <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "flex-end", marginTop: "18px" }}>
              <button className="btn btn-outline" onClick={() => setInspectingDoc(null)}>Close</button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  alert("Document verified by administrator.");
                  setInspectingDoc(null);
                }}
              >
                <CheckCircle className="w-4 h-4" aria-hidden="true" /> Mark Valid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSellers;
