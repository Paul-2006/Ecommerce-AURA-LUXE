import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, FileText, Truck, ShieldCheck, History, Calendar } from "lucide-react";
import { getAdminDeliveryVerificationDetail, approveDeliveryVerification, rejectDeliveryVerification, requestDeliveryCorrection } from "../../services/verificationService";
import VerificationBadge from "../../components/verification/VerificationBadge";
import VerificationChecklist from "../../components/verification/VerificationChecklist";
import EvidenceViewer from "../../components/verification/EvidenceViewer";
import VerificationHistoryTimeline from "../../components/verification/VerificationHistoryTimeline";
import "../../css/AdminPortal.css";

export function DeliveryVerificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const [actionModalType, setActionModalType] = useState(null); // 'REJECT' | 'CORRECTION'
  const [actionReason, setActionReason] = useState("");

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await getAdminDeliveryVerificationDetail(id);
      setData(res);
    } catch (err) {
      console.error("Error loading delivery partner verification detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return <div className="admin-portal-page"><div className="shimmer-card-skeleton" style={{ height: "400px", borderRadius: "12px" }}></div></div>;
  }

  const v = data?.verification;
  const history = data?.history || [];
  const checks = v?.verificationChecks || [];
  const docs = v?.documents || [];

  const passedCount = checks.filter((c) => c.status === "Passed").length;
  const totalCount = checks.length;
  const canApprove = totalCount > 0 && passedCount === totalCount;

  const handleApprove = async () => {
    if (!canApprove) {
      alert(`Cannot approve delivery partner. Required verification checks pending (${passedCount}/${totalCount} passed).`);
      return;
    }

    if (!window.confirm("Are you sure you want to approve this delivery partner application?")) return;

    setActionLoading(true);
    try {
      await approveDeliveryVerification(id);
      alert("Delivery partner has been approved successfully.");
      fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to approve delivery partner.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleModalSubmit = async () => {
    if (!actionReason.trim()) {
      alert("Please provide a specific reason.");
      return;
    }

    setActionLoading(true);
    try {
      if (actionModalType === "REJECT") {
        await rejectDeliveryVerification(id, actionReason);
        alert("Delivery partner application has been rejected.");
      } else if (actionModalType === "CORRECTION") {
        await requestDeliveryCorrection(id, actionReason);
        alert("Correction request sent to delivery partner.");
      }
      setActionModalType(null);
      setActionReason("");
      fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to execute review action.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-portal-page">
      <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate("/admin/verification/delivery")} style={{ marginBottom: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
        <ArrowLeft size={14} aria-hidden="true" /> Back to Delivery Applications
      </button>

      {/* Header Bar */}
      <div className="page-header flex-between" style={{ marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#0F172A" }}>
              {v?.partnerName || "Delivery Partner Application"}
            </h1>
            <VerificationBadge status={v?.status} />
            <VerificationBadge expiryStatus={v?.expiryStatus} />
          </div>
          <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "#64748B" }}>
            Phone: <strong>{v?.phoneNumber}</strong> • Email: <strong>{v?.email}</strong> • Submitted: {new Date(v?.submittedDate).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Top Action Buttons Gate */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="btn btn-warning btn-sm"
            onClick={() => { setActionModalType("CORRECTION"); setActionReason(""); }}
            disabled={actionLoading}
          >
            <AlertTriangle size={14} aria-hidden="true" /> Request Correction
          </button>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => { setActionModalType("REJECT"); setActionReason(""); }}
            disabled={actionLoading}
          >
            <XCircle size={14} aria-hidden="true" /> Reject
          </button>

          <button
            type="button"
            className={`btn btn-sm ${canApprove ? "btn-success" : "btn-secondary"}`}
            onClick={handleApprove}
            disabled={!canApprove || actionLoading}
            title={!canApprove ? "Approve button disabled until all mandatory driving & vehicle checks pass." : "Approve Delivery Partner"}
          >
            <CheckCircle2 size={14} aria-hidden="true" /> Approve Partner
          </button>
        </div>
      </div>

      {!canApprove && (
        <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.84rem", color: "#B45309" }}>
          <AlertTriangle size={16} aria-hidden="true" />
          <span>
            <strong>APPROVE GATEWAY LOCKED:</strong> Mandatory DL, RC & Insurance checks are still pending ({passedCount}/{totalCount} passed). Approve button will activate automatically once all statutory checks pass.
          </span>
        </div>
      )}

      {/* 2-Column Split */}
      <div className="portal-grid-2">
        {/* Left Column: DL & Vehicle Details + Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Driving Licence & Vehicle Card */}
          <div className="admin-stat-card glass-panel" style={{ padding: "16px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}>
              <Truck size={16} style={{ color: "#2563EB" }} aria-hidden="true" /> Driving Licence & Vehicle RC Credentials
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", fontSize: "0.84rem" }}>
              <div>
                <span style={{ color: "#64748B", display: "block" }}>Driving Licence No.</span>
                <code style={{ background: "#F1F5F9", padding: "2px 6px", borderRadius: "4px", fontWeight: 700, color: "#1E293B" }}>{v?.drivingLicenceNumber}</code>
              </div>

              <div>
                <span style={{ color: "#64748B", display: "block" }}>Licence Expiry</span>
                <strong style={{ color: "#0F172A" }}>
                  {v?.licenceExpiryDate ? new Date(v?.licenceExpiryDate).toLocaleDateString("en-IN") : "Not Specified"}
                </strong>
              </div>

              <div>
                <span style={{ color: "#64748B", display: "block" }}>Vehicle RC Registration</span>
                <code style={{ background: "#F1F5F9", padding: "2px 6px", borderRadius: "4px", fontWeight: 700, color: "#1E293B" }}>{v?.vehicleRegistrationNumber}</code>
              </div>

              <div>
                <span style={{ color: "#64748B", display: "block" }}>Vehicle Class / Model</span>
                <strong style={{ color: "#0F172A" }}>{v?.vehicleClass} ({v?.vehicleModel})</strong>
              </div>

              <div>
                <span style={{ color: "#64748B", display: "block" }}>Insurance Policy Number</span>
                <code style={{ background: "#F1F5F9", padding: "2px 6px", borderRadius: "4px", fontWeight: 700, color: "#1E293B" }}>{v?.insurancePolicyNumber}</code>
              </div>

              <div>
                <span style={{ color: "#64748B", display: "block" }}>Insurance Expiry</span>
                <strong style={{ color: "#0F172A" }}>
                  {v?.insuranceExpiryDate ? new Date(v?.insuranceExpiryDate).toLocaleDateString("en-IN") : "Not Specified"}
                </strong>
              </div>
            </div>
          </div>

          {/* Itemized Verification Checklist */}
          <div className="admin-stat-card glass-panel" style={{ padding: "16px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <VerificationChecklist checks={checks} onInspectEvidence={(check) => setSelectedEvidence(check)} />
          </div>
        </div>

        {/* Right Column: Uploaded Documents & Audit Log */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Uploaded Documents */}
          <div className="admin-stat-card glass-panel" style={{ padding: "16px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}>
              <FileText size={16} style={{ color: "#2563EB" }} aria-hidden="true" /> Uploaded Proof Documents ({docs.length})
            </h3>

            {docs.length === 0 ? (
              <p className="text-muted" style={{ fontSize: "0.84rem", margin: 0 }}>No documents uploaded yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {docs.map((doc, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
                    <div>
                      <strong style={{ fontSize: "0.84rem", color: "#0F172A", display: "block" }}>{doc.documentType}</strong>
                      <span style={{ fontSize: "0.76rem", color: "#64748B" }}>{doc.documentName} ({(doc.fileSize / 1024).toFixed(1)} KB)</span>
                    </div>

                    <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                      View File
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audit History Timeline */}
          <div className="admin-stat-card glass-panel" style={{ padding: "16px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}>
              <History size={16} style={{ color: "#64748B" }} aria-hidden="true" /> Verification Audit Log
            </h3>
            <VerificationHistoryTimeline history={history} />
          </div>
        </div>
      </div>

      {/* Evidence Viewer Modal */}
      {selectedEvidence && <EvidenceViewer check={selectedEvidence} onClose={() => setSelectedEvidence(null)} />}

      {/* Action Modal (Reject / Request Correction) */}
      {actionModalType && (
        <div className="order-ack-modal-overlay" style={{ zIndex: 1200 }}>
          <div className="order-ack-modal-content glass-panel" style={{ maxWidth: "500px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: 700, color: "#0F172A" }}>
              {actionModalType === "REJECT" ? "Reject Delivery Application" : "Request Correction"}
            </h3>
            <p style={{ fontSize: "0.84rem", color: "#64748B", marginBottom: "14px" }}>
              {actionModalType === "REJECT"
                ? "State the statutory reason for rejecting this delivery partner application."
                : "Specify which Driving Licence or Vehicle document details must be updated."}
            </p>

            <textarea
              rows="4"
              className="form-control"
              placeholder="Enter detailed review remarks..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              style={{ width: "100%", marginBottom: "16px", padding: "10px", borderRadius: "8px" }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActionModalType(null)} disabled={actionLoading}>
                Cancel
              </button>
              <button
                type="button"
                className={`btn btn-sm ${actionModalType === "REJECT" ? "btn-danger" : "btn-warning"}`}
                onClick={handleModalSubmit}
                disabled={actionLoading}
              >
                {actionLoading ? "Submitting..." : actionModalType === "REJECT" ? "Confirm Rejection" : "Send Correction Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryVerificationDetail;
