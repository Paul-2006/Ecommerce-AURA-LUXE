import React from "react";
import { Clock, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from "lucide-react";

export function VerificationHistoryTimeline({ history = [] }) {
  if (!history || history.length === 0) {
    return <div className="text-muted font-sans" style={{ fontSize: "0.85rem", padding: "12px 0" }}>No verification history recorded yet.</div>;
  }

  return (
    <div className="verification-history-timeline" style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "2px solid #E2E8F0", paddingLeft: "16px", marginLeft: "8px" }}>
      {history.map((item, idx) => {
        const isApproved = item.action === "APPROVED" || item.status === "Verified";
        const isRejected = item.action === "REJECTED" || item.status === "Failed";
        const isCorrection = item.action === "CORRECTION_REQUESTED" || item.status === "NeedsCorrection";

        return (
          <div key={idx} className="timeline-event-item" style={{ position: "relative" }}>
            {/* Timeline Dot Indicator */}
            <div style={{ position: "absolute", left: "-23px", top: "2px", width: "12px", height: "12px", borderRadius: "50%", background: isApproved ? "#16A34A" : isRejected ? "#DC2626" : isCorrection ? "#F59E0B" : "#2563EB", border: "2px solid #FFFFFF" }}></div>

            <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>{item.action}</span>
              <span style={{ fontSize: "0.74rem", color: "#64748B", fontWeight: 500 }}>
                • {new Date(item.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>

            <div style={{ fontSize: "0.8rem", color: "#334155", marginTop: "2px" }}>
              {item.reason || "Status updated by verification system."}
            </div>

            <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: "2px" }}>
              Provider: <strong style={{ color: "#475569" }}>{item.provider}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default VerificationHistoryTimeline;
