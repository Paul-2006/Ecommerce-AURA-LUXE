import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginAdmin } from "../../services/authService";
import "../../css/Auth.css";

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState(() => localStorage.getItem("user_registered_email") || "");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmailFormat = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val?.trim());
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanEmail = email.trim();
    if (!validateEmailFormat(cleanEmail)) {
      setErrorMsg("Please enter a valid administrator email address.");
      return;
    }

    setLoading(true);

    try {
      const authData = await loginAdmin({
        email: cleanEmail,
        password
      });

      login({
        token: authData.token,
        userId: authData.userId || "admin-01",
        username: authData.username || "System Administrator",
        email: authData.email || cleanEmail,
        role: "Admin",
        roleId: 1
      });

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      const respData = err.response?.data;
      const msg = typeof respData === "string" ? respData : respData?.message || err.message || "Admin authorization failed. Please check your credentials.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container centered-container">
      <div className="auth-card-wrapper glass-panel">
        <div className="auth-header">
          <span className="badge-pill badge-danger">Security Restricted</span>
          <h2>System Admin Security Console</h2>
          <p className="security-notice">
            Restricted Access: Authorized administrator authentication required.
          </p>
        </div>

        {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleAdminLogin}>
          <div className="form-group">
            <label className="form-label">Administrator Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@domain.com"
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter administrator password"
              autoComplete="off"
              required
            />
          </div>

          <button type="submit" className="btn btn-luxury btn-lg btn-block" disabled={loading}>
            {loading ? "Verifying Clearance..." : "Authenticate Admin Clearance"}
          </button>

          <div style={{ marginTop: "12px", textAlign: "center" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-block"
              onClick={() => {
                setEmail("admin@nexstore.com");
                setPassword("Admin@123!");
              }}
              style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#f87171", width: "100%", padding: "10px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
            >
              ⚡ Fill Quick Demo Credentials (admin@nexstore.com)
            </button>
          </div>
        </form>

        <div className="auth-footer-links">
          <Link to="/login" className="back-link">
            Return to Portal Chooser
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;