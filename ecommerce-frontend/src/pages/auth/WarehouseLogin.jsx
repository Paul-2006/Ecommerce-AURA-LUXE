import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginWarehouse } from "../../services/authService";
import { Zap } from "lucide-react";
import "../../css/Auth.css";

function WarehouseLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState(() => localStorage.getItem("user_registered_email") || "");
  const [password, setPassword] = useState("");
  const [warehouseId, setWarehouseId] = useState("Hub #01 - Bengaluru Central");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleWarehouseLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Please enter your warehouse manager email.");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const authData = await loginWarehouse({ email: cleanEmail, password });

      login({
        token: authData.token,
        userId: authData.userId,
        warehouseManagerId: authData.warehouseManagerId || authData.userId,
        username: authData.username || cleanEmail.split("@")[0],
        email: authData.email || cleanEmail,
        warehouseName: warehouseId,
        role: "Warehouse",
        roleId: 3
      });

      alert(`Warehouse Manager Authenticated! Welcome ${authData.username || cleanEmail}.`);
      navigate("/warehouse/dashboard");
    } catch (err) {
      console.error("Warehouse login error:", err);
      const respData = err.response?.data;
      const msg = typeof respData === "string" ? respData : respData?.message || err.message || "Warehouse authentication failed. Please check your credentials.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container centered-container">
      <div className="auth-card-wrapper glass-panel">
        <div className="auth-header">
          <span className="badge-pill badge-primary">Warehouse Terminal</span>
          <h2>Warehouse Inventory & Scanner Login</h2>
          <p>Sign in to access barcode scanning, stock level updates, and packing order workflows.</p>
        </div>

        {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleWarehouseLogin}>
          <div className="form-group">
            <label className="form-label">Warehouse Terminal</label>
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="input-modern"
            >
              <option value="Hub #01 - Bengaluru Central">Hub #01 - Bengaluru Central Distribution Hub</option>
              <option value="Hub #02 - Electronic City Depot">Hub #02 - Electronic City Rapid Depot</option>
              <option value="Hub #03 - Whitefield Logistics Node">Hub #03 - Whitefield Logistics Node</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Manager / Staff Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="warehouse@domain.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? "Connecting to Terminal..." : "Access Barcode Scanner & Hub"}
          </button>

          <div style={{ marginTop: "12px", textAlign: "center" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-block"
              onClick={() => {
                setEmail("warehouse@webkadai.com");
                setPassword("Warehouse@123!");
              }}
              style={{ background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#60a5fa", width: "100%", padding: "10px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              <Zap className="w-4 h-4 mr-2" aria-hidden="true" /> Fill Quick Demo Credentials (warehouse@webkadai.com)
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

export default WarehouseLogin;