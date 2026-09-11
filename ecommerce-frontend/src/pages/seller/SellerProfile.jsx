import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { User, Building2, CreditCard, ShieldCheck, Mail, Phone, MapPin, FileCheck, CheckCircle2, Save, Lock, LogOut, Edit, X } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerProfile() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const initialProfile = {
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
  };

  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Password Modal State
  const [showPassModal, setShowPassModal] = useState(false);
  const [passForm, setPassForm] = useState({ current: "", next: "", confirm: "" });
  const [passError, setPassError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedProfile(profile);
      setIsEditing(false);
      setSuccessMsg("Merchant Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 800);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPassError("");
    if (passForm.next !== passForm.confirm) {
      setPassError("New password and confirmation do not match.");
      return;
    }
    if (passForm.next.length < 6) {
      setPassError("Password must be at least 6 characters long.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setShowPassModal(false);
      setPassForm({ current: "", next: "", confirm: "" });
      setSuccessMsg("Password updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 800);
  };

  const handleLogout = () => {
    logout();
    navigate("/seller/login");
  };

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 className="seller-page-title">Merchant Profile</h1>
          <p className="seller-page-subtitle">
            Manage legal compliance, GSTIN/PAN registrations, authorized contact, and settlement bank accounts
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4" aria-hidden="true" /> Edit Profile
            </button>
          ) : (
            <>
              <button className="btn btn-outline" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" form="seller-profile-form" className="btn btn-primary" disabled={saving}>
                <Save className="w-4 h-4" aria-hidden="true" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </>
          )}
          <button className="btn btn-secondary" onClick={() => setShowPassModal(true)}>
            <Lock className="w-4 h-4" aria-hidden="true" /> Change Password
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            <LogOut className="w-4 h-4" aria-hidden="true" /> Logout
          </button>
        </div>
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
                      readOnly={!isEditing}
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
                      readOnly={!isEditing}
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
                      readOnly={!isEditing}
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
                      readOnly={!isEditing}
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
                    readOnly={!isEditing}
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
                      readOnly={!isEditing}
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
                      readOnly={!isEditing}
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
                      readOnly={!isEditing}
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
                      readOnly={!isEditing}
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
                    readOnly={!isEditing}
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
                    readOnly={!isEditing}
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
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Compliance Verification Status */}
            <div className="seller-card">
              <div className="seller-card-header">
                <h3 className="seller-card-title flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                  KYC & Compliance
                </h3>
              </div>
              <div className="seller-card-body space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded border bg-slate-50">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <FileCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span>GSTIN Verified</span>
                  </div>
                  <span className="seller-badge seller-badge-success">Passed</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded border bg-slate-50">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span>Bank Penny Test</span>
                  </div>
                  <span className="seller-badge seller-badge-success">Passed</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded border bg-slate-50">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Building2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span>Corporate KYC</span>
                  </div>
                  <span className="seller-badge seller-badge-success">Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* CHANGE PASSWORD MODAL */}
      {showPassModal && (
        <div className="seller-modal-overlay" onClick={() => setShowPassModal(false)}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>
            <div className="seller-modal-header">
              <h3 className="seller-modal-title flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                Change Password
              </h3>
              <button className="btn-icon" onClick={() => setShowPassModal(false)}><X className="w-5 h-5" aria-hidden="true" /></button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="seller-modal-body space-y-3">
                {passError && (
                  <div className="seller-alert seller-alert-danger">
                    <span>{passError}</span>
                  </div>
                )}
                <div>
                  <label className="seller-form-label">Current Password *</label>
                  <input
                    type="password"
                    className="seller-form-input"
                    value={passForm.current}
                    onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="seller-form-label">New Password *</label>
                  <input
                    type="password"
                    className="seller-form-input"
                    value={passForm.next}
                    onChange={(e) => setPassForm({ ...passForm, next: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="seller-form-label">Confirm New Password *</label>
                  <input
                    type="password"
                    className="seller-form-input"
                    value={passForm.confirm}
                    onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="seller-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowPassModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerProfile;
