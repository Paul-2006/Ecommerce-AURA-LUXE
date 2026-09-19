import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getSellerVerificationStatus, submitSellerVerification, uploadSellerVerificationDocument } from "../../services/verificationService";
import VerificationBadge from "../../components/verification/VerificationBadge";
import VerificationChecklist from "../../components/verification/VerificationChecklist";
import VerificationHistoryTimeline from "../../components/verification/VerificationHistoryTimeline";
import { ShieldCheck, Building2, CreditCard, Upload, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import "../../css/SellerPortal.css";

export function SellerOnboardingVerification() {
  const { user } = useContext(AuthContext);
  const sellerId = user?.sellerId || user?.userId || 1;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusData, setStatusData] = useState(null);

  const [formData, setFormData] = useState({
    sellerName: user?.username || user?.name || "",
    businessName: "",
    legalBusinessName: "",
    tradeName: "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    gstnumber: "",
    pannumber: "",
    businessAddress: "",
    state: "Karnataka",
    district: "Bengaluru Urban",
    pincode: "560001",
    bankName: "HDFC Bank",
    bankAccountNumber: "",
    bankIfscCode: ""
  });

  const [docFile, setDocFile] = useState(null);
  const [docType, setDocType] = useState("GST_CERTIFICATE");
  const [docUploading, setDocUploading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await getSellerVerificationStatus(sellerId);
      setStatusData(res);
      if (res.hasSubmitted && res.verification) {
        const v = res.verification;
        setFormData({
          sellerName: v.sellerName || "",
          businessName: v.businessName || "",
          legalBusinessName: v.legalBusinessName || "",
          tradeName: v.tradeName || "",
          email: v.email || "",
          phoneNumber: v.phoneNumber || "",
          gstnumber: v.gstnumber || "",
          pannumber: v.pannumber || "",
          businessAddress: v.businessAddress || "",
          state: v.state || "Karnataka",
          district: v.district || "Bengaluru Urban",
          pincode: v.pincode || "560001",
          bankName: v.bankName || "HDFC Bank",
          bankAccountNumber: v.bankAccountNumber || "",
          bankIfscCode: v.bankIfscCode || ""
        });
      }
    } catch (err) {
      console.error("Error loading seller verification status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [sellerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUploadDoc = async (e) => {
    e.preventDefault();
    if (!docFile) {
      alert("Please select a document file to upload.");
      return;
    }

    setDocUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", docFile);
      fd.append("documentType", docType);
      fd.append("sellerId", sellerId);

      await uploadSellerVerificationDocument(fd);
      alert("Document uploaded and verified successfully.");
      setDocFile(null);
      fetchStatus();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Document upload failed.");
    } finally {
      setDocUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.businessName.trim() || !formData.gstnumber.trim() || !formData.pannumber.trim()) {
      alert("Please fill in Business Name, GSTIN, and PAN number.");
      return;
    }

    setSubmitting(true);
    try {
      await submitSellerVerification({
        sellerId,
        ...formData
      });
      alert("Seller onboarding verification package submitted successfully.");
      fetchStatus();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Verification submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="seller-portal-page"><div className="shimmer-card-skeleton" style={{ height: "350px", borderRadius: "12px" }}></div></div>;
  }

  const v = statusData?.verification;
  const history = statusData?.history || [];
  const checks = v?.verificationChecks || [];
  const docs = v?.documents || [];

  return (
    <div className="seller-portal-page">
      <div className="page-header flex-between" style={{ marginBottom: "20px" }}>
        <div>
          <span className="badge-pill badge-primary">Merchant Seller Compliance</span>
          <h1 style={{ margin: "4px 0 0 0", fontSize: "1.4rem", fontWeight: 800, color: "#0F172A" }}>
            Seller Verification Onboarding
          </h1>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B" }}>
            Submit statutory business details, GSTIN, PAN, Bank payout info, and proof documents for Admin verification.
          </p>
        </div>

        {v && <VerificationBadge status={v.status} />}
      </div>

      {v?.status === "NeedsCorrection" && (
        <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#B45309", fontSize: "0.86rem" }}>
          <strong style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <AlertTriangle size={16} aria-hidden="true" /> Admin Requested Correction:
          </strong>
          <p style={{ margin: 0 }}>{v.correctionReason || "Please update your details or re-upload your statutory document as requested."}</p>
        </div>
      )}

      <div className="portal-grid-2">
        {/* Left Column: Form Entry */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="seller-card glass-panel" style={{ padding: "16px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}>
              <Building2 size={16} style={{ color: "#2563EB" }} aria-hidden="true" /> Business & Statutory Info
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              <div className="form-group">
                <label className="form-label">Business / Brand Name *</label>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required placeholder="e.g. AURA Electronics" className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">Legal Company Name *</label>
                <input type="text" name="legalBusinessName" value={formData.legalBusinessName} onChange={handleChange} placeholder="e.g. AURA RETAIL PVT LTD" className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">Trade Name</label>
                <input type="text" name="tradeName" value={formData.tradeName} onChange={handleChange} placeholder="e.g. AURA Luxe Store" className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">GSTIN (15 Digits) *</label>
                <input type="text" name="gstnumber" value={formData.gstnumber} onChange={handleChange} required maxLength={15} placeholder="e.g. 29ABCDE1234F1Z5" className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">PAN Number (10 Digits) *</label>
                <input type="text" name="pannumber" value={formData.pannumber} onChange={handleChange} required maxLength={10} placeholder="e.g. ABCDE1234F" className="form-control" />
              </div>

              <div className="form-group full-width" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Complete Registered Business Address *</label>
                <textarea name="businessAddress" value={formData.businessAddress} onChange={handleChange} rows="2" required placeholder="Building, Street, Sector, Area" className="form-control" />
              </div>
            </div>
          </div>

          <div className="seller-card glass-panel" style={{ padding: "16px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}>
              <CreditCard size={16} style={{ color: "#16A34A" }} aria-hidden="true" /> Payout Bank Account Details
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="e.g. HDFC Bank" className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} placeholder="e.g. 501002345678" className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">IFSC Code</label>
                <input type="text" name="bankIfscCode" value={formData.bankIfscCode} onChange={handleChange} placeholder="e.g. HDFC0000123" className="form-control" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? "Executing Verification Checks..." : "Submit Seller Onboarding Verification"}
          </button>
        </form>

        {/* Right Column: Upload Document & Live Checks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Document Upload Form */}
          <form onSubmit={handleUploadDoc} className="seller-card glass-panel" style={{ padding: "16px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}>
              <Upload size={16} style={{ color: "#2563EB" }} aria-hidden="true" /> Upload Proof Documents
            </h3>

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <select value={docType} onChange={(e) => setDocType(e.target.value)} className="form-select" style={{ flex: 1 }}>
                <option value="GST_CERTIFICATE">GST Registration Certificate</option>
                <option value="PAN_CARD">PAN Card Copy</option>
                <option value="BANK_CHEQUE">Cancelled Cheque / Bank Statement</option>
              </select>

              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setDocFile(e.target.files[0])} className="form-control" style={{ flex: 1.5 }} />
            </div>

            <button type="submit" className="btn btn-secondary btn-sm" disabled={docUploading || !docFile}>
              {docUploading ? "Uploading & Extracting..." : "Upload & Run OCR Scan"}
            </button>
          </form>

          {/* Itemized Verification Checklist Status */}
          {checks.length > 0 && (
            <div className="seller-card glass-panel" style={{ padding: "16px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
              <VerificationChecklist checks={checks} />
            </div>
          )}

          {/* Verification Audit Timeline */}
          {history.length > 0 && (
            <div className="seller-card glass-panel" style={{ padding: "16px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>Verification Status History</h3>
              <VerificationHistoryTimeline history={history} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerOnboardingVerification;
