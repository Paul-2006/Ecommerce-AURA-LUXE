import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ShieldCheck, UserCheck, LogOut, Shield } from "lucide-react";
import "../../css/AdminPortal.css";

function AdminProfile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <span className="badge-pill badge-danger">Security Restricted</span>
        <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Master Admin Operator Profile</h1>
        <p style={{ margin: 0, fontSize: "0.86rem" }}>
          Security clearance information, operator credentials, and portal system settings.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: "28px", borderRadius: "14px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid var(--admin-border)" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "14px",
              background: "var(--admin-secondary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(176, 141, 87, 0.3)"
            }}
          >
            {(user?.username || user?.name || "A")[0].toUpperCase()}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ margin: 0, color: "var(--admin-primary)" }}>{user?.username || user?.name || "System Administrator"}</h2>
              <span className="badge-pill badge-danger">Level 1 Clearance</span>
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.88rem", color: "var(--admin-text-secondary)" }}>
              Email: <strong>{user?.email || "admin@webkadai.com"}</strong> • Role: <strong>Platform Master Administrator</strong>
            </p>
          </div>
        </div>

        {/* Security Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
          <div style={{ padding: "16px", background: "var(--admin-surface-alt)", borderRadius: "10px", border: "1px solid var(--admin-border)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--admin-text-secondary)", display: "block" }}>Access Rights</span>
            <strong style={{ fontSize: "1rem", color: "var(--admin-primary)" }}>Full Administrative Supervision</strong>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-secondary)" }}>Grants catalog clearance, merchant risk audits, and security telemetry supervision.</p>
          </div>

          <div style={{ padding: "16px", background: "var(--admin-surface-alt)", borderRadius: "10px", border: "1px solid var(--admin-border)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--admin-text-secondary)", display: "block" }}>Security Clearance Status</span>
            <strong style={{ fontSize: "1rem", color: "var(--admin-success)" }}>Active & Verified</strong>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "var(--admin-text-secondary)" }}>Session encrypted with JWT token authentication.</p>
          </div>
        </div>

        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--admin-border)", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" aria-hidden="true" /> End Security Session & Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
