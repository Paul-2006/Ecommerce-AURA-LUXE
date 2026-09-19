import React from "react";
import { CheckCircle2, XCircle, Clock, ShieldCheck, Server } from "lucide-react";

export function VerificationChecklist({ checks = [], onInspectEvidence }) {
  if (!checks || checks.length === 0) {
    return <div className="text-muted font-sans" style={{ fontSize: "0.85rem", padding: "12px 0" }}>No verification checks generated yet.</div>;
  }

  const passedCount = checks.filter((c) => c.status === "Passed").length;
  const totalCount = checks.length;
  const isFullyPassed = passedCount === totalCount && totalCount > 0;

  return (
    <div className="verification-checklist-container">
      <div className="checklist-summary-bar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", padding: "10px 14px", background: isFullyPassed ? "#EFF6FF" : "#F8FAFC", borderRadius: "8px", border: `1px solid ${isFullyPassed ? "#BFDBFE" : "#E2E8F0"}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShieldCheck size={18} style={{ color: isFullyPassed ? "#2563EB" : "#64748B" }} aria-hidden="true" />
          <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "#0F172A" }}>
            STATUTORY VERIFICATION CHECKS ({passedCount} / {totalCount} PASSED)
          </span>
        </div>
        <span className={`badge-pill ${isFullyPassed ? "badge-success" : "badge-warning"}`}>
          {isFullyPassed ? "ALL CHECKS PASSED" : "REVIEW PENDING"}
        </span>
      </div>

      <div className="checklist-items-grid" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {checks.map((check, idx) => {
          const isPassed = check.status === "Passed";
          const isFailed = check.status === "Failed";
          const isMock = check.provider === "DEMO / MOCK VERIFICATION" || check.provider === "MOCK";

          return (
            <div key={idx} className="checklist-item-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {isPassed ? (
                  <CheckCircle2 size={18} style={{ color: "#16A34A", flexShrink: 0 }} aria-hidden="true" />
                ) : isFailed ? (
                  <XCircle size={18} style={{ color: "#DC2626", flexShrink: 0 }} aria-hidden="true" />
                ) : (
                  <Clock size={18} style={{ color: "#F59E0B", flexShrink: 0 }} aria-hidden="true" />
                )}

                <div>
                  <div style={{ fontSize: "0.86rem", fontWeight: "700", color: "#0F172A" }}>{check.checkName}</div>
                  <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "2px" }}>{check.evidenceSummary || "Verified through statutory records."}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className={`badge-pill ${isMock ? "badge-warning" : "badge-primary"}`} style={{ fontSize: "0.7rem", textTransform: "uppercase" }}>
                  <Server size={10} style={{ marginRight: "3px" }} aria-hidden="true" />
                  {check.provider}
                </span>

                {onInspectEvidence && (
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => onInspectEvidence(check)} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
                    Evidence
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VerificationChecklist;
