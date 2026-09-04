import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginAdmin } from "../../services/authService";
import "../../css/Auth.css";

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
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
      let authData;
      try {
        authData = await loginAdmin({
          email: cleanEmail,
          password
        });
      } catch (err) {
        const respData = err.response?.data;
        const status = err.response?.status;

        if (status === 404) {
          throw new Error("Account not found. Access denied.");
        } else if (status === 401 || status === 403) {
          throw new Error(typeof respData === "string" ? respData : "Invalid administrator credentials or access restricted.");
        } else if (status === 400) {
          throw new Error(typeof respData === "string" ? respData : "Please enter a valid administrator email address.");
        }

        throw new Error("Admin authorization failed. Please check your credentials.");
      }

      login({
        ...authData,
        username: authData.username || "System Administrator",
        email: cleanEmail,
        role: "Admin",
        roleId: 1
      });

      navigate("/admin/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Admin authentication failed.");
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