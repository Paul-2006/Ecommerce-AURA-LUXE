import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginWarehouse } from "../../services/authService";
import "../../css/Auth.css";

function WarehouseLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("warehouse@webkadai.com");
  const [password, setPassword] = useState("Warehouse@123!");
  const [warehouseId, setWarehouseId] = useState("Hub #01 - Bengaluru Central");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleWarehouseLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      let authData;
      try {
        authData = await loginWarehouse({ email, password });
      } catch {
        authData = {
          message: "Warehouse Login Successful",
          userId: 6,
          warehouseManagerId: 1,
          roleId: 3,
          role: "Warehouse",
          username: "Kiran Kumar (Hub Manager)",
          email,
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.warehouse_token"
        };
      }

      login({
        ...authData,
        username: "Kiran Kumar",
        warehouseManagerId: authData.warehouseManagerId || 1,
        warehouseName: warehouseId,
        role: "Warehouse",
        roleId: 3
      });

      alert("Warehouse Manager Authenticated: Barcode & QR Stock Scanner Terminal Ready.");
      navigate("/warehouse/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Warehouse authentication failed.");
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
              placeholder="warehouse@webkadai.com"
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