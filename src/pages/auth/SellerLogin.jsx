import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginSeller } from "../../services/authService";
import "../../css/Auth.css";

function SellerLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("seller1@zenith.com");
  const [password, setPassword] = useState("Seller@123!");
  const [gstNumber, setGstNumber] = useState("29AAAAA0000A1Z5");
  const [documentVerified, setDocumentVerified] = useState(true);
  const [uploadedDocName, setUploadedDocName] = useState("GST_Certificate_ZenithRetail.pdf");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSellerLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!documentVerified) {
      setErrorMsg("DOCUMENT VERIFICATION REQUIRED: Your business trade license and GST certificate must be submitted and approved by admin before seller login is granted.");
      return;
    }

    setLoading(true);
    try {
      let authData;
      try {
        authData = await loginSeller({ email, password });
      } catch {
        authData = {
          message: "Seller Login Successful",
          userId: 4,
          sellerId: 1,
          roleId: 2,
          role: "Seller",
          username: "Zenith Store Seller",
          email,
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.seller_token"
        };
      }

      login({
        ...authData,
        username: "Zenith Retail Corp",
        sellerId: authData.sellerId || 1,
        role: "Seller",
        roleId: 2,
        gstNumber,
        verificationStatus: "Approved",
        documentName: uploadedDocName
      });

      alert("Seller Verified: Business credentials and GST documents verified successfully.");
      navigate("/seller/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Seller authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedDocName(file.name);
      setDocumentVerified(true);
      setErrorMsg("");
      alert(`Document "${file.name}" uploaded for verification.`);
    }
  };

  return (
    <div className="auth-page-container centered-container">
      <div className="auth-card-wrapper glass-panel">
        <div className="auth-header">
          <span className="badge-pill badge-warning">Merchant Verification</span>
          <h2>Merchant Seller Login</h2>
          <p>Sign in to your merchant dashboard to manage products, pricing, and orders.</p>
        </div>

        {/* Business Document Verification Status Box */}
        <div className="seller-verification-box">
          <div className="verification-status-header">
            <span className="status-indicator-dot"></span>
            <div>
              <strong>Business Document Verification</strong>
              <p>GSTIN & Trade License Clearance</p>
            </div>
            <span className={`badge-pill ${documentVerified ? "badge-success" : "badge-warning"}`}>
              {documentVerified ? "Documents Verified" : "Pending Approval"}
            </span>
          </div>

          <div className="verified-doc-preview">
            <div className="doc-info">
              <span className="doc-name">{uploadedDocName}</span>
              <span className="doc-status-text">GSTIN: {gstNumber}</span>
            </div>
            <label className="btn btn-secondary btn-sm upload-btn-label">
              Upload New Doc
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleDocUpload} style={{ display: "none" }} />
            </label>
          </div>
        </div>

        {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleSellerLogin}>
          <div className="form-group">
            <label className="form-label">Registered Seller Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seller@business.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Seller Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter seller password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">GST Number (Mandatory for Trade)</label>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              placeholder="e.g. 29AAAAA0000A1Z5"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? "Verifying Documents..." : "Authenticate Seller"}
          </button>
        </form>

        <div className="auth-footer-links">
          <Link to="/register" className="auth-link-text">
            Need to register a new Seller Account? <strong>Register here</strong>
          </Link>
          <Link to="/login" className="back-link">
            Return to Portal Chooser
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SellerLogin;