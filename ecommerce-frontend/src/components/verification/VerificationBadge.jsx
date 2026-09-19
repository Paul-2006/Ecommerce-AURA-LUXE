import React from "react";
import { CheckCircle2, Clock, AlertTriangle, XCircle, FileSpreadsheet, ShieldAlert } from "lucide-react";

export function VerificationBadge({ status, expiryStatus }) {
  if (expiryStatus === "EXPIRED") {
    return (
      <span className="badge-pill badge-danger" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
        <XCircle size={13} aria-hidden="true" /> EXPIRED
      </span>
    );
  }

  if (expiryStatus === "EXPIRING_SOON") {
    return (
      <span className="badge-pill badge-warning" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
        <AlertTriangle size={13} aria-hidden="true" /> EXPIRING SOON
      </span>
    );
  }

  switch (status) {
    case "Verified":
    case "Approved":
    case "Passed":
      return (
        <span className="badge-pill badge-success" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <CheckCircle2 size={13} aria-hidden="true" /> VERIFIED
        </span>
      );

    case "InProgress":
    case "UnderReview":
      return (
        <span className="badge-pill badge-info" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <Clock size={13} aria-hidden="true" /> UNDER REVIEW
        </span>
      );

    case "NeedsCorrection":
      return (
        <span className="badge-pill badge-warning" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <AlertTriangle size={13} aria-hidden="true" /> NEEDS CORRECTION
        </span>
      );

    case "Failed":
    case "Rejected":
      return (
        <span className="badge-pill badge-danger" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <ShieldAlert size={13} aria-hidden="true" /> REJECTED / FAILED
        </span>
      );

    case "Pending":
    default:
      return (
        <span className="badge-pill badge-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <Clock size={13} aria-hidden="true" /> PENDING
        </span>
      );
  }
}

export default VerificationBadge;
