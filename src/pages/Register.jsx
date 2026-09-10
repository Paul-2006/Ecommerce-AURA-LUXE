import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../css/Auth.css";

function Register() {
  const navigate = useNavigate();

  const [roleId, setRoleId] = useState(5); // Default: Customer (5)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Seller Specific Business Documents
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [gstDocName, setGstDocName] = useState("");
  const [panDocName, setPanDocName] = useState("");
  const [tradeLicenseDocName, setTradeLicenseDocName] = useState("");
  const [bankDocName, setBankDocName] = useState("");
  const [addressProofDocName, setAddressProofDocName] = useState("");

  // Delivery Agent Specific Driver & Vehicle Documents
  const [dlNumber, setDlNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [insuranceNumber, setInsuranceNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [dlDocName, setDlDocName] = useState("");
  const [rcDocName, setRcDocName] = useState("");
  const [insuranceDocName, setInsuranceDocName] = useState("");
  const [aadhaarDocName, setAadhaarDocName] = useState("");
  const [payoutDocName, setPayoutDocName] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Email format validation
    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg("Please enter a valid email address (e.g. user@example.com).");
      return;
    }

    // Phone number format validation
    const cleanPhone = phoneNumber.trim();
    const phoneDigits = cleanPhone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setErrorMsg("Please enter a valid phone number containing 10 to 15 digits.");
      return;
    }

    // Password length validation
    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    // Validation for Seller Business Documents
    if (roleId === 2) {
      if (!gstNumber.trim() || gstNumber.length < 15) {
        setErrorMsg("SELLER ONBOARDING: Valid 15-character GSTIN number is required (e.g. 29AAAAA0000A1Z5).");
        return;
      }
      if (!panNumber.trim() || panNumber.length < 10) {
        setErrorMsg("SELLER ONBOARDING: Valid 10-character Business PAN number is required (e.g. ABCDE1234F).");
        return;
      }
      if (!gstDocName || !panDocName || !tradeLicenseDocName || !bankDocName) {
        setErrorMsg("SELLER ONBOARDING: Mandatory documents required (GST Certificate, Business PAN, Trade License, and Bank Account Proof).");
        return;
      }
    }

    // Validation for Delivery Agent Driver & Vehicle Documents
    if (roleId === 4) {
      if (!dlNumber.trim()) {
        setErrorMsg("DELIVERY AGENT ONBOARDING: Valid Driver's License (DL) Number is required.");
        return;
      }
      if (!vehicleNumber.trim()) {
        setErrorMsg("DELIVERY AGENT ONBOARDING: Motorbike vehicle registration plate number is required (e.g. KA-01-EA-9988).");
        return;
      }
      if (!aadhaarNumber.trim() || aadhaarNumber.length < 12) {
        setErrorMsg("DELIVERY AGENT ONBOARDING: Valid 12-digit Aadhaar / Government ID number is required.");
        return;
      }
      if (!dlDocName || !rcDocName || !insuranceDocName || !aadhaarDocName) {
        setErrorMsg("DELIVERY AGENT ONBOARDING: Mandatory documents required (Driver's License, Vehicle RC Book, Insurance Certificate, and Aadhaar Card Scan).");
        return;
      }
    }

    setLoading(true);
    try {
      const regRes = await registerUser({
        username: username.trim(),
        email: cleanEmail,
        password,
        roleId,
        phoneNumber: cleanPhone,
        gstNumber: roleId === 2 ? gstNumber : undefined,
        panNumber: roleId === 2 ? panNumber : undefined,
        vehicleNumber: roleId === 4 ? vehicleNumber : undefined,
        dlNumber: roleId === 4 ? dlNumber : undefined,
        documents: {
          gstDoc: gstDocName,
          panDoc: panDocName,
          tradeDoc: tradeLicenseDocName,
          bankDoc: bankDocName,
          dlDoc: dlDocName,
          rcDoc: rcDocName,
          insuranceDoc: insuranceDocName,
          aadhaarDoc: aadhaarDocName
        }
      });

      if (cleanEmail) {
        localStorage.setItem("user_registered_email", cleanEmail);
      }
      if (cleanPhone) {
        localStorage.setItem("user_registered_phone", cleanPhone);
      }

      const roleTitle = roleId === 2 ? "Seller Business" : roleId === 4 ? "Delivery Driver" : roleId === 3 ? "Warehouse Staff" : "Customer";
      const offlineNote = regRes?.isOfflineMode ? " (Saved locally in Offline Mode)" : "";
      alert(`Account Created Successfully!${offlineNote}\n\nYour ${roleTitle} credentials (${cleanEmail}) are registered. Please log in to continue.`);
      
      const targetLoginPath = roleId === 2 ? "/seller/login" : roleId === 4 ? "/delivery/login" : roleId === 3 ? "/warehouse/login" : "/customer/login";
      navigate(targetLoginPath);
    } catch (err) {
      console.error("Registration error:", err);
      const respData = err.response?.data;
      const respMsg =
        respData?.message ||
        (typeof respData === "string" ? respData : null) ||
        (respData?.errors ? Object.values(respData.errors).flat().join(" ") : null) ||
        respData?.title;

      setErrorMsg(respMsg || err.message || "Registration failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container centered-container">
      <div className="auth-card-wrapper glass-panel" style={{ maxWidth: roleId === 2 || roleId === 4 ? "720px" : "480px" }}>
        <div className="auth-header">
          <span className="badge-pill badge-primary">Account Registration</span>
          <h2>Create AURA Luxe Account</h2>
          <p>Join our marketplace as a customer, merchant seller, or verified delivery partner.</p>
        </div>

        {/* Role Type Selector Tabs */}
        <div className="role-selector-tabs">
          <button
            type="button"
            className={`role-tab ${roleId === 5 ? "active" : ""}`}
            onClick={() => setRoleId(5)}
          >
            Customer
          </button>
          <button
            type="button"
            className={`role-tab ${roleId === 2 ? "active" : ""}`}
            onClick={() => setRoleId(2)}
          >
            Seller (Merchant)
          </button>
          <button
            type="button"
            className={`role-tab ${roleId === 4 ? "active" : ""}`}
            onClick={() => setRoleId(4)}
          >
            Delivery Agent
          </button>
          <button
            type="button"
            className={`role-tab ${roleId === 3 ? "active" : ""}`}
            onClick={() => setRoleId(3)}
          >
            Warehouse
          </button>
        </div>

        {errorMsg && (
          <div className="auth-error-alert" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span>{errorMsg}</span>
            {(errorMsg.toLowerCase().includes("already registered") || errorMsg.toLowerCase().includes("already exists") || errorMsg.toLowerCase().includes("already")) && (
              <button
                type="button"
                className="btn btn-luxury btn-sm"
                onClick={() => {
                  localStorage.setItem("user_registered_email", email.trim());
                  navigate(roleId === 2 ? "/seller/login" : roleId === 4 ? "/delivery/login" : roleId === 3 ? "/warehouse/login" : "/customer/login");
                }}
                style={{ marginTop: "4px", width: "100%" }}
              >
                🔑 Log In & Retrieve Existing Account →
              </button>
            )}
          </div>
        )}

        <form className="auth-form" onSubmit={handleRegister}>
          {/* Basic Account Info Grid */}
          <div className="form-fields-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group" style={{ gridColumn: roleId === 5 ? "1 / -1" : "auto" }}>
              <label className="form-label">{roleId === 2 ? "Registered Business / Store Name *" : "Full Legal Name *"}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={roleId === 2 ? "e.g. Acme Electronics Pvt Ltd" : "e.g. Rahul Sharma"}
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: roleId === 5 ? "1 / -1" : "auto" }}>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: roleId === 5 ? "1 / -1" : "auto" }}>
              <label className="form-label">Phone Number (10 Digits) *</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                maxLength={13}
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: roleId === 5 ? "1 / -1" : "auto" }}>
              <label className="form-label">Create Password (min 8 chars) *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create strong password"
                required
              />
            </div>
          </div>

          {/* =========================================================================
              SELLER MANDATORY BUSINESS DOCUMENTS SECTION
              ========================================================================= */}
          {roleId === 2 && (
            <div className="role-specific-inputs glass-panel" style={{ marginTop: "16px", padding: "20px", borderRadius: "16px", border: "1.5px solid var(--border-medium)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <span style={{ fontSize: "1.3rem" }}>📋</span>
                <div>
                  <strong style={{ fontSize: "1rem", color: "var(--text-main)", display: "block" }}>Seller Business Verification Documents</strong>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Mandatory documents required for merchant GST & tax clearance</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {/* 1. GSTIN & Document */}
                <div className="form-group">
                  <label className="form-label">1. GSTIN Number (15 Digits) *</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. 29AAAAA0000A1Z5"
                    maxLength={15}
                    required
                  />
                  <label className="form-label" style={{ marginTop: "6px", fontSize: "0.76rem" }}>Upload GST Certificate (.pdf/.png/.jpg) *</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setGstDocName(e.target.files[0]?.name || "")} required />
                  {gstDocName && <small className="doc-ok" style={{ color: "var(--success)", display: "block", marginTop: "2px" }}>✓ {gstDocName}</small>}
                </div>

                {/* 2. Business PAN & Document */}
                <div className="form-group">
                  <label className="form-label">2. Company / Business PAN *</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    maxLength={10}
                    required
                  />
                  <label className="form-label" style={{ marginTop: "6px", fontSize: "0.76rem" }}>Upload PAN Card Scan (.pdf/.png/.jpg) *</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setPanDocName(e.target.files[0]?.name || "")} required />
                  {panDocName && <small className="doc-ok" style={{ color: "var(--success)", display: "block", marginTop: "2px" }}>✓ {panDocName}</small>}
                </div>

                {/* 3. Trade License / Establishment License */}
                <div className="form-group">
                  <label className="form-label">3. Trade / Shop License *</label>
                  <label className="form-label" style={{ fontSize: "0.76rem" }}>Upload Business Trade License Document *</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setTradeLicenseDocName(e.target.files[0]?.name || "")} required />
                  {tradeLicenseDocName && <small className="doc-ok" style={{ color: "var(--success)", display: "block", marginTop: "2px" }}>✓ {tradeLicenseDocName}</small>}
                </div>

                {/* 4. Bank Account & Cancelled Cheque */}
                <div className="form-group">
                  <label className="form-label">4. Bank Account & Payout Proof *</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="Bank Account Number"
                    style={{ marginBottom: "6px" }}
                    required
                  />
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    placeholder="Bank IFSC Code (e.g. HDFC0001234)"
                    style={{ marginBottom: "6px" }}
                    required
                  />
                  <label className="form-label" style={{ fontSize: "0.76rem" }}>Upload Cancelled Cheque / Bank Passbook *</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setBankDocName(e.target.files[0]?.name || "")} required />
                  {bankDocName && <small className="doc-ok" style={{ color: "var(--success)", display: "block", marginTop: "2px" }}>✓ {bankDocName}</small>}
                </div>

                {/* 5. Address Proof */}
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">5. Registered Business Address Proof (Electricity Bill / Lease) *</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setAddressProofDocName(e.target.files[0]?.name || "")} required />
                  {addressProofDocName && <small className="doc-ok" style={{ color: "var(--success)", display: "block", marginTop: "2px" }}>✓ {addressProofDocName}</small>}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              DELIVERY AGENT MANDATORY DRIVER & VEHICLE DOCUMENTS SECTION
              ========================================================================= */}
          {roleId === 4 && (
            <div className="role-specific-inputs glass-panel" style={{ marginTop: "16px", padding: "20px", borderRadius: "16px", border: "1.5px solid var(--border-medium)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <span style={{ fontSize: "1.3rem" }}>🏍️</span>
                <div>
                  <strong style={{ fontSize: "1rem", color: "var(--text-main)", display: "block" }}>Delivery Driver & Vehicle Verification Documents</strong>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Mandatory documents required for rider clearance and delivery dispatch</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {/* 1. Driver's License */}
                <div className="form-group">
                  <label className="form-label">1. Driver's License (DL) Number *</label>
                  <input
                    type="text"
                    value={dlNumber}
                    onChange={(e) => setDlNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. KA0120220004567"
                    required
                  />
                  <label className="form-label" style={{ marginTop: "6px", fontSize: "0.76rem" }}>Upload Driver's License Document Scan *</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setDlDocName(e.target.files[0]?.name || "")} required />
                  {dlDocName && <small className="doc-ok" style={{ color: "var(--success)", display: "block", marginTop: "2px" }}>✓ {dlDocName}</small>}
                </div>

                {/* 2. Vehicle Registration Plate & RC Book */}
                <div className="form-group">
                  <label className="form-label">2. Motorbike Registration Number *</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. KA-01-EA-9988"
                    required
                  />
                  <label className="form-label" style={{ marginTop: "6px", fontSize: "0.76rem" }}>Upload Vehicle RC Book Scan *</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setRcDocName(e.target.files[0]?.name || "")} required />
                  {rcDocName && <small className="doc-ok" style={{ color: "var(--success)", display: "block", marginTop: "2px" }}>✓ {rcDocName}</small>}
                </div>

                {/* 3. Vehicle Insurance */}
                <div className="form-group">
                  <label className="form-label">3. Motorbike Insurance Policy Number *</label>
                  <input
                    type="text"
                    value={insuranceNumber}
                    onChange={(e) => setInsuranceNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. POL-998822-2026"
                    required
                  />
                  <label className="form-label" style={{ marginTop: "6px", fontSize: "0.76rem" }}>Upload Valid Insurance Certificate Scan *</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setInsuranceDocName(e.target.files[0]?.name || "")} required />
                  {insuranceDocName && <small className="doc-ok" style={{ color: "var(--success)", display: "block", marginTop: "2px" }}>✓ {insuranceDocName}</small>}
                </div>

                {/* 4. Aadhaar Card Scan */}
                <div className="form-group">
                  <label className="form-label">4. Aadhaar Card Number (12 Digits) *</label>
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="e.g. 1234 5678 9012"
                    maxLength={12}
                    required
                  />
                  <label className="form-label" style={{ marginTop: "6px", fontSize: "0.76rem" }}>Upload Aadhaar Card Scan *</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setAadhaarDocName(e.target.files[0]?.name || "")} required />
                  {aadhaarDocName && <small className="doc-ok" style={{ color: "var(--success)", display: "block", marginTop: "2px" }}>✓ {aadhaarDocName}</small>}
                </div>

                {/* 5. Payout Bank / UPI ID */}
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">5. Payout Passbook / UPI QR Document Upload *</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setPayoutDocName(e.target.files[0]?.name || "")} required />
                  {payoutDocName && <small className="doc-ok" style={{ color: "var(--success)", display: "block", marginTop: "2px" }}>✓ {payoutDocName}</small>}
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg btn-block" style={{ marginTop: "16px" }} disabled={loading}>
            {loading ? "Verifying & Registering..." : "Submit Documents & Create Account"}
          </button>
        </form>

        <div className="auth-footer-links">
          <Link to="/login" className="auth-link-text">
            Already registered? <strong>Login here</strong>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;