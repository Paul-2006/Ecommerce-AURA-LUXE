import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Store, Truck, Clock, AlertTriangle, CheckCircle2, XCircle, ChevronRight, RefreshCw } from "lucide-react";
import { getAdminVerificationSummary } from "../../services/verificationService";
import "../../css/AdminPortal.css";

export function AdminVerificationCenter() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await getAdminVerificationSummary();
      setSummary(data);
    } catch (err) {
      console.error("Error loading verification summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="admin-portal-page">
      {/* Executive Header */}
      <div className="page-header flex-between" style={{ marginBottom: "20px" }}>
        <div>
          <span className="badge-pill badge-primary">Enterprise Verification Management</span>
          <h1 style={{ margin: "4px 0 0 0", fontSize: "1.5rem", fontWeight: 800, color: "#0F172A" }}>
            Admin Verification Center
          </h1>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#64748B" }}>
            Review merchant sellers and delivery partner statutory applications, evidence checks, and compliance status.
          </p>
        </div>

        <button type="button" className="btn btn-secondary btn-sm" onClick={fetchSummary} disabled={loading} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} aria-hidden="true" /> Refresh Dashboard
        </button>
      </div>

      {loading ? (
        <div className="shimmer-card-skeleton" style={{ height: "220px", borderRadius: "12px" }}></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Top 2 Executive Verification Desk Containers */}
          <div className="portal-grid-2">
            {/* Merchant Sellers Desk Card */}
            <div className="admin-stat-card glass-panel" style={{ padding: "20px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "#FFFFFF" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Store size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0F172A" }}>Seller Onboarding Verifications</h3>
                    <span style={{ fontSize: "0.8rem", color: "#64748B" }}>GSTIN, PAN, Bank Payout & Business Proofs</span>
                  </div>
                </div>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate("/admin/verification/sellers")}>
                  Manage Sellers <ChevronRight size={14} aria-hidden="true" />
                </button>
              </div>

              {/* Status Breakdown Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                <div style={{ padding: "12px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "8px", textAlign: "center" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#B45309" }}>UNDER REVIEW</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#B45309", marginTop: "2px" }}>
                    {summary?.sellers?.inProgress || 0}
                  </div>
                </div>

                <div style={{ padding: "12px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "8px", textAlign: "center" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#15803D" }}>APPROVED</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#15803D", marginTop: "2px" }}>
                    {summary?.sellers?.verified || 0}
                  </div>
                </div>

                <div style={{ padding: "12px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "8px", textAlign: "center" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#B91C1C" }}>NEEDS CORRECTION</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#B91C1C", marginTop: "2px" }}>
                    {summary?.sellers?.needsCorrection || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Partners Desk Card */}
            <div className="admin-stat-card glass-panel" style={{ padding: "20px", borderRadius: "12px", border: "1px solid #E2E8F0", background: "#FFFFFF" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#F0FDF4", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Truck size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0F172A" }}>Delivery Partner Verifications</h3>
                    <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Driving Licence, Vehicle RC & Insurance Validity</span>
                  </div>
                </div>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate("/admin/verification/delivery")}>
                  Manage Partners <ChevronRight size={14} aria-hidden="true" />
                </button>
              </div>

              {/* Status Breakdown Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                <div style={{ padding: "12px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "8px", textAlign: "center" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#B45309" }}>UNDER REVIEW</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#B45309", marginTop: "2px" }}>
                    {summary?.deliveryPartners?.inProgress || 0}
                  </div>
                </div>

                <div style={{ padding: "12px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "8px", textAlign: "center" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#15803D" }}>APPROVED</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#15803D", marginTop: "2px" }}>
                    {summary?.deliveryPartners?.verified || 0}
                  </div>
                </div>

                <div style={{ padding: "12px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "8px", textAlign: "center" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#B91C1C" }}>EXPIRING SOON / EXPIRED</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#B91C1C", marginTop: "2px" }}>
                    {(summary?.deliveryPartners?.expiringSoon || 0) + (summary?.deliveryPartners?.expired || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            <div className="clickable-panel" onClick={() => navigate("/admin/verification/sellers")} style={{ padding: "16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <strong style={{ fontSize: "0.95rem", color: "#0F172A", display: "block" }}>Open Seller Verification Applications List</strong>
                <span style={{ fontSize: "0.82rem", color: "#64748B" }}>Inspect GSTIN, PAN matching results, documents, and trigger approvals</span>
              </div>
              <ChevronRight size={18} style={{ color: "#2563EB" }} aria-hidden="true" />
            </div>

            <div className="clickable-panel" onClick={() => navigate("/admin/verification/delivery")} style={{ padding: "16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <strong style={{ fontSize: "0.95rem", color: "#0F172A", display: "block" }}>Open Delivery Partner Verification Applications List</strong>
                <span style={{ fontSize: "0.82rem", color: "#64748B" }}>Inspect Driving Licences, RC certificates, insurance policies, and expiry alerts</span>
              </div>
              <ChevronRight size={18} style={{ color: "#2563EB" }} aria-hidden="true" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVerificationCenter;
