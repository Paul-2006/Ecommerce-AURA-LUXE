import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginSeller } from "../../services/authService";
import { Zap } from "lucide-react";
import "../../css/Auth.css";

function SellerLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState(() => localStorage.getItem("user_registered_email") || "");
  const [password, setPassword] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [documentVerified, setDocumentVerified] = useState(false);
  const [uploadedDocName, setUploadedDocName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSellerLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Please enter your registered seller email address.");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your seller password.");
      return;
    }

    setLoading(true);
    try {
      const authData = await loginSeller({ email: cleanEmail, password });

      login({
        token: authData.token,
        userId: authData.userId,
        sellerId: authData.sellerId || authData.userId,
        username: authData.username || cleanEmail.split("@")[0],
        email: authData.email || cleanEmail,
        role: "Seller",
        roleId: 2,
        gstNumber: gstNumber.trim() || "29AAAAA0000A1Z5",
        verificationStatus: "Approved",
        documentName: uploadedDocName || "GST_Certificate.pdf"
      });

      alert(`Seller Login Successful! Welcome ${authData.username || cleanEmail}.`);
      navigate("/seller/dashboard");
    } catch (err) {
      console.error("Seller login error:", err);
      const respData = err.response?.data;
      const msg = typeof respData === "string" ? respData : respData?.message || err.message || "Seller authentication failed. Please check your credentials.";
      setErrorMsg(msg);
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
      alert(`Document "${file.name}" uploaded for seller record.`);
    }
  };

  return (
    <div className="auth-page-container centered-container">
      <div className="auth-card-wrapper glass-panel">
        <div className="auth-header">
          <span className="badge-pill badge-warning">Merchant Access</span>
          <h2>Merchant Seller Login</h2>
          <p>Sign in to your merchant dashboard to manage products, pricing, and orders.</p>
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
            <label className="form-label">GST Number (Optional / Onboarding)</label>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              placeholder="e.g. 29AAAAA0000A1Z5"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? "Authenticating Seller..." : "Authenticate Seller"}
          </button>

          <div style={{ marginTop: "12px", textAlign: "center" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-block"
              onClick={() => {
                setEmail("seller@webkadai.com");
                setPassword("Seller@123!");
                setGstNumber("29AAAAA0000A1Z5");
              }}
              style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#f59e0b", width: "100%", padding: "10px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              <Zap className="w-4 h-4 mr-2" aria-hidden="true" /> Fill Quick Demo Credentials (seller@webkadai.com)
            </button>
          </div>
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