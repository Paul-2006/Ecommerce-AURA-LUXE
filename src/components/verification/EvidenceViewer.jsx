import React from "react";
import { ShieldCheck, Server, AlertTriangle, X } from "lucide-react";

export function EvidenceViewer({ check, onClose }) {
  if (!check) return null;

  const isMock = check.provider === "DEMO / MOCK VERIFICATION" || check.provider === "MOCK";

  return (
    <div className="order-ack-modal-overlay" style={{ zIndex: 1100 }}>
      <div className="order-ack-modal-content glass-panel" style={{ maxWidth: "600px", padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", borderBottom: "1px solid #E2E8F0", paddingBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck size={20} style={{ color: "#2563EB" }} aria-hidden="true" />
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0F172A" }}>Verification Evidence Details</h3>
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose} style={{ padding: "4px 8px" }}>
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Mock/Demo Provider Alert Warning Banner if credentials absent */}
        {isMock && (
          <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "8px", padding: "10px 12px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "#B45309" }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} aria-hidden="true" />
            <span>
              <strong>DEMO / MOCK VERIFICATION:</strong> Backend API credentials are not currently configured for this gateway. Verification result generated via Development Service Provider.
            </span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.86rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: "6px" }}>
            <span style={{ color: "#64748B", fontWeight: 600 }}>Check Code:</span>
            <strong style={{ color: "#0F172A" }}>{check.checkCode}</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: "6px" }}>
            <span style={{ color: "#64748B", fontWeight: 600 }}>Verification Name:</span>
            <strong style={{ color: "#0F172A" }}>{check.checkName}</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: "6px" }}>
            <span style={{ color: "#64748B", fontWeight: 600 }}>Verification Status:</span>
            <strong style={{ color: check.status === "Passed" ? "#16A34A" : "#DC2626" }}>{check.status.toUpperCase()}</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#F8FAFC", borderRadius: "6px" }}>
            <span style={{ color: "#64748B", fontWeight: 600 }}>Provider Gateway:</span>
            <span className="badge-pill badge-primary" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Server size={12} aria-hidden="true" /> {check.provider}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "10px 12px", background: "#F8FAFC", borderRadius: "6px" }}>
            <span style={{ color: "#64748B", fontWeight: 600 }}>Evidence Summary:</span>
            <p style={{ margin: 0, color: "#334155", lineHeight: 1.4 }}>{check.evidenceSummary || "Verified via statutory record matching."}</p>
          </div>
        </div>

        <div style={{ marginTop: "18px", textAlign: "right" }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Close Evidence Window
          </button>
        </div>
      </div>
    </div>
  );
}

export default EvidenceViewer;
