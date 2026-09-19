import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getDeliveryVerificationStatus, submitDeliveryVerification, uploadDeliveryVerificationDocument } from "../../services/verificationService";
import VerificationBadge from "../../components/verification/VerificationBadge";
import VerificationChecklist from "../../components/verification/VerificationChecklist";
import VerificationHistoryTimeline from "../../components/verification/VerificationHistoryTimeline";
import { ShieldCheck, Truck, Upload, AlertTriangle, FileText } from "lucide-react";

export function DeliveryOnboardingVerification() {
  const { user } = useContext(AuthContext);
  const partnerId = user?.deliveryPartnerId || user?.userId || 1;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusData, setStatusData] = useState(null);

  const [formData, setFormData] = useState({
    partnerName: user?.username || user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    identityNumber: "",
    drivingLicenceNumber: "",
    vehicleClass: "LMV / Two-Wheeler",
    licenceExpiryDate: "",
    vehicleRegistrationNumber: "",
    vehicleModel: "",
    insurancePolicyNumber: "",
    insuranceExpiryDate: ""
  });

  const [docFile, setDocFile] = useState(null);
  const [docType, setDocType] = useState("DRIVING_LICENCE");
  const [docUploading, setDocUploading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await getDeliveryVerificationStatus(partnerId);
      setStatusData(res);
      if (res.hasSubmitted && res.verification) {
        const v = res.verification;
        setFormData({
          partnerName: v.partnerName || "",
          email: v.email || "",
          phoneNumber: v.phoneNumber || "",
          identityNumber: v.identityNumber || "",
          drivingLicenceNumber: v.drivingLicenceNumber || "",
          vehicleClass: v.vehicleClass || "LMV / Two-Wheeler",
          licenceExpiryDate: v.licenceExpiryDate ? v.licenceExpiryDate.split("T")[0] : "",
          vehicleRegistrationNumber: v.vehicleRegistrationNumber || "",
          vehicleModel: v.vehicleModel || "",
          insurancePolicyNumber: v.insurancePolicyNumber || "",
          insuranceExpiryDate: v.insuranceExpiryDate ? v.insuranceExpiryDate.split("T")[0] : ""
        });
      }
    } catch (err) {
      console.error("Error loading delivery partner verification status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [partnerId]);

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
      fd.append("deliveryPartnerId", partnerId);

      await uploadDeliveryVerificationDocument(fd);
      alert("Proof document uploaded successfully.");
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

    if (!formData.drivingLicenceNumber.trim() || !formData.vehicleRegistrationNumber.trim()) {
      alert("Please enter Driving Licence Number and Vehicle RC Registration.");
      return;
    }

    setSubmitting(true);
    try {
      await submitDeliveryVerification({
        deliveryPartnerId: partnerId,
        ...formData,
        licenceExpiryDate: formData.licenceExpiryDate ? new Date(formData.licenceExpiryDate).toISOString() : null,
        insuranceExpiryDate: formData.insuranceExpiryDate ? new Date(formData.insuranceExpiryDate).toISOString() : null
      });
      alert("Delivery partner verification application submitted successfully.");
      fetchStatus();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Verification submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="delivery-portal-page" style={{ padding: "20px" }}><div className="shimmer-card-skeleton" style={{ height: "350px", borderRadius: "12px" }}></div></div>;
  }

  const v = statusData?.verification;
  const history = statusData?.history || [];
  const checks = v?.verificationChecks || [];
  const docs = v?.documents || [];

  return (
    <div className="delivery-portal-page" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div className="page-header flex-between" style={{ marginBottom: "20px" }}>
        <div>
          <span className="badge-pill badge-primary">Logistics & Rider Compliance</span>
          <h1 style={{ margin: "4px 0 0 0", fontSize: "1.4rem", fontWeight: 800, color: "#0F172A" }}>
            Delivery Partner Statutory Onboarding
          </h1>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B" }}>
            Submit Driving Licence, Vehicle RC registration, Insurance policy, and proof documents for Admin approval.
          </p>
        </div>

        {v && (
          <div style={{ display: "flex", gap: "8px" }}>
            <VerificationBadge status={v.status} />
            <VerificationBadge expiryStatus={v.expiryStatus} />
          </div>
        )}
      </div>

      {v?.status === "NeedsCorrection" && (
        <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#B45309", fontSize: "0.86rem" }}>
          <strong style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <AlertTriangle size={16} aria-hidden="true" /> Admin Requested Correction:
          </strong>
          <p style={{ margin: 0 }}>{v.correctionReason || "Please update your Driving Licence or Insurance details as requested."}</p>
        </div>
      )}

      <div className="portal-grid-2">
        {/* Left Column: Form Entry */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="glass-panel" style={{ padding: "16px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}>
              <Truck size={16} style={{ color: "#2563EB" }} aria-hidden="true" /> Licence & Vehicle Credentials
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" name="partnerName" value={formData.partnerName} onChange={handleChange} required placeholder="e.g. Vikram Singh" className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">Aadhaar / Identity Ref</label>
                <input type="text" name="identityNumber" value={formData.identityNumber} onChange={handleChange} placeholder="e.g. 9876-5432-1098" className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">Driving Licence Number *</label>
                <input type="text" name="drivingLicenceNumber" value={formData.drivingLicenceNumber} onChange={handleChange} required placeholder="e.g. KA0120220012345" className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">DL Expiry Date *</label>
                <input type="date" name="licenceExpiryDate" value={formData.licenceExpiryDate} onChange={handleChange} required className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Registration (RC) *</label>
                <input type="text" name="vehicleRegistrationNumber" value={formData.vehicleRegistrationNumber} onChange={handleChange} required placeholder="e.g. KA01AB1234" className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Model</label>
                <input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} placeholder="e.g. Hero Splendor / Honda Activa" className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">Insurance Policy Number</label>
                <input type="text" name="insurancePolicyNumber" value={formData.insurancePolicyNumber} onChange={handleChange} placeholder="e.g. POL-98765432" className="form-control" />
              </div>

              <div className="form-group">
                <label className="form-label">Insurance Expiry Date</label>
                <input type="date" name="insuranceExpiryDate" value={formData.insuranceExpiryDate} onChange={handleChange} className="form-control" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? "Verifying Credentials..." : "Submit Delivery Partner Verification"}
          </button>
        </form>

        {/* Right Column: Upload Document & Verification Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <form onSubmit={handleUploadDoc} className="glass-panel" style={{ padding: "16px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: "6px" }}>
              <Upload size={16} style={{ color: "#2563EB" }} aria-hidden="true" /> Upload Licence & Vehicle Proofs
            </h3>

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <select value={docType} onChange={(e) => setDocType(e.target.value)} className="form-select" style={{ flex: 1 }}>
                <option value="DRIVING_LICENCE">Driving Licence Copy</option>
                <option value="VEHICLE_RC">Vehicle RC Certificate</option>
                <option value="INSURANCE">Insurance Policy Document</option>
              </select>

              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setDocFile(e.target.files[0])} className="form-control" style={{ flex: 1.5 }} />
            </div>

            <button type="submit" className="btn btn-secondary btn-sm" disabled={docUploading || !docFile}>
              {docUploading ? "Uploading..." : "Upload Proof File"}
            </button>
          </form>

          {checks.length > 0 && (
            <div className="glass-panel" style={{ padding: "16px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
              <VerificationChecklist checks={checks} />
            </div>
          )}

          {history.length > 0 && (
            <div className="glass-panel" style={{ padding: "16px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>Audit Status Log</h3>
              <VerificationHistoryTimeline history={history} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryOnboardingVerification;
