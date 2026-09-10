import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginDelivery } from "../../services/authService";
import { Zap } from "lucide-react";
import "../../css/Auth.css";

function DeliveryLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState(() => localStorage.getItem("user_registered_email") || "");
  const [password, setPassword] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [licenseScanned, setLicenseScanned] = useState(false);
  const [licenseDocName, setLicenseDocName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDeliveryLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Please enter your delivery partner email.");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const authData = await loginDelivery({ email: cleanEmail, password });

      login({
        token: authData.token,
        userId: authData.userId,
        deliveryPartnerId: authData.deliveryPartnerId || authData.userId,
        username: authData.username || cleanEmail.split("@")[0],
        email: authData.email || cleanEmail,
        role: "Delivery",
        roleId: 4,
        vehicleNumber: vehicleNumber.trim().toUpperCase() || "KA-01-EA-9988",
        licenseDocName: licenseDocName || "Drivers_License.pdf",
        isOnline: true
      });

      alert(`Delivery Partner Authenticated! Welcome ${authData.username || cleanEmail}.`);
      navigate("/delivery/dashboard");
    } catch (err) {
      console.error("Delivery login error:", err);
      const respData = err.response?.data;
      const msg = typeof respData === "string" ? respData : respData?.message || err.message || "Delivery partner authentication failed. Please check your credentials.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLicenseUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseDocName(file.name);
      setLicenseScanned(true);
      setErrorMsg("");
    }
  };

  return (
    <div className="auth-page-container centered-container">
      <div className="auth-card-wrapper glass-panel">
        <div className="auth-header">
          <span className="badge-pill badge-success">Partner Dispatch</span>
          <h2>Delivery Partner Login</h2>
          <p>Sign in to receive assigned delivery routes with real-time GPS telemetry and customer OTP handoffs.</p>
        </div>

        {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleDeliveryLogin}>
          <div className="form-group">
            <label className="form-label">Delivery Partner Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rider@delivery.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Motorbike Registration Plate (Optional)</label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="e.g. KA-05-MB-4421"
            />
          </div>

          <button type="submit" className="btn btn-success btn-lg btn-block" disabled={loading}>
            {loading ? "Verifying Credentials..." : "Authenticate & Go Online"}
          </button>

          <div style={{ marginTop: "12px", textAlign: "center" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-block"
              onClick={() => {
                setEmail("delivery@webkadai.com");
                setPassword("Delivery@123!");
                setVehicleNumber("KA-05-MB-4421");
              }}
              style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#34d399", width: "100%", padding: "10px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              <Zap className="w-4 h-4 mr-2" aria-hidden="true" /> Fill Quick Demo Credentials (delivery@webkadai.com)
            </button>
          </div>
        </form>

        <div className="auth-footer-links">
          <Link to="/register" className="auth-link-text">
            Need to register as a Delivery Agent? <strong>Register here</strong>
          </Link>
          <Link to="/login" className="back-link">
            Return to Portal Chooser
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DeliveryLogin;