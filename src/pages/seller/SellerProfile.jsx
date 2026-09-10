import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { User, Building2, CreditCard, ShieldCheck, Mail, Phone, MapPin, FileCheck, CheckCircle2, Save } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerProfile() {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    legalName: "Aura Luxe Merchant Solutions Private Limited",
    tradeName: "AURA LUXE Official",
    gstin: "27AAACA0000A1Z5",
    panNumber: "AAACA0000A",
    contactName: user?.username || user?.name || "Zenith Merchant",
    email: user?.email || "merchant@auraluxe.com",
    phone: "+91 98765 43210",
    registeredAddress: "Plot 42, Tech Park Sector 5, Bandra Kurla Complex, Mumbai, Maharashtra - 400051",
    bankName: "HDFC Bank Ltd.",
    accountNumber: "50100239847102",
    ifscCode: "HDFC0000128",
    accountHolder: "Aura Luxe Merchant Solutions Pvt Ltd",
    verificationStatus: "Fully Verified"
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg("Merchant Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 800);
  };

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header">
        <div>
          <h1 className="seller-page-title">Seller Profile</h1>
          <p className="seller-page-subtitle">
            Manage your legal entity compliance details, tax registrations, and payout bank parameters
          </p>
        </div>
        <button type="submit" form="seller-profile-form" className="btn btn-primary" disabled={saving}>
          <Save className="w-4 h-4" aria-hidden="true" />
          <span>{saving ? "Saving..." : "Save Profile"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="seller-alert seller-alert-success mb-4">
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}

      <form id="seller-profile-form" onSubmit={handleSubmit}>
        <div className="seller-grid seller-grid-3">
          {/* Main 2 Spans */}
          <div className="seller-col-span-2 space-y-6">
            {/* Legal Entity & Tax Info */}
            <div className="seller-card">
              <div className="seller-card-header">
                <h3 className="seller-card-title flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                  Legal Business Information
                </h3>
              </div>
              <div className="seller-card-body space-y-4">
                <div className="seller-grid seller-grid-2 gap-4">
                  <div>
                    <label className="seller-form-label">Registered Legal Name *</label>
                    <input
                      type="text"
                      name="legalName"
                      className="seller-form-input"
                      value={profile.legalName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="seller-form-label">Trade / Brand Name *</label>
                    <input
                      type="text"
                      name="tradeName"
                      className="seller-form-input"
                      value={profile.tradeName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="seller-grid seller-grid-2 gap-4">
                  <div>
                    <label className="seller-form-label">GSTIN / Tax Identification</label>
                    <input
                      type="text"
                      name="gstin"
                      className="seller-form-input"
                      value={profile.gstin}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="seller-form-label">PAN Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      className="seller-form-input"
                      value={profile.panNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="seller-form-label">Registered Corporate Address</label>
                  <textarea
                    name="registeredAddress"
                    rows="3"
                    className="seller-form-textarea"
                    value={profile.registeredAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Payout Bank Account Details */}
            <div className="seller-card">
              <div className="seller-card-header">
                <h3 className="seller-card-title flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                  Settlement & Bank Payout Details
                </h3>
              </div>
              <div className="seller-card-body space-y-4">
                <div className="seller-grid seller-grid-2 gap-4">
                  <div>
                    <label className="seller-form-label">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      className="seller-form-input"
                      value={profile.bankName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="seller-form-label">Account Holder Name</label>
                    <input
                      type="text"
                      name="accountHolder"
                      className="seller-form-input"
                      value={profile.accountHolder}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="seller-grid seller-grid-2 gap-4">
                  <div>
                    <label className="seller-form-label">Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      className="seller-form-input"
                      value={profile.accountNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="seller-form-label">IFSC / SWIFT Code</label>
                    <input
                      type="text"
                      name="ifscCode"
                      className="seller-form-input"
                      value={profile.ifscCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Column 1 Span */}
          <div className="space-y-6">
            {/* Primary Contact Person */}
            <div className="seller-card">
              <div className="seller-card-header">
                <h3 className="seller-card-title flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                  Primary Contact Person
                </h3>
              </div>
              <div className="seller-card-body space-y-4">
                <div>
                  <label className="seller-form-label">Authorized Signatory Name</label>
                  <input
                    type="text"
                    name="contactName"
                    className="seller-form-input"
                    value={profile.contactName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="seller-form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="seller-form-input"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="seller-form-label">Mobile Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="seller-form-input"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Compliance Verification Status */}
            <div className="seller-card">
              <div className="seller-card-header">
                <h3 className="seller-card-title flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                  KYC & Tax Compliance
                </h3>
              </div>
              <div className="seller-card-body space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded border" style={{ backgroundColor: "#F8FAF9" }}>
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>GSTIN Verified</span>
                  </div>
                  <span className="seller-badge seller-badge-success">Passed</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded border" style={{ backgroundColor: "#F8FAF9" }}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Bank Account Penny Test</span>
                  </div>
                  <span className="seller-badge seller-badge-success">Passed</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded border" style={{ backgroundColor: "#F8FAF9" }}>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Corporate KYC</span>
                  </div>
                  <span className="seller-badge seller-badge-success">Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SellerProfile;
