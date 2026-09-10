import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ShieldCheck, UserCheck, KeyRound, LogOut, Sun, Moon, Lock, Shield } from "lucide-react";
import "../../css/Dashboard.css";

function AdminProfile() {
  const { user, logout } = useContext(AuthContext);
  const { isDark, setSpecificTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-page-container centered-container">
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <span className="badge-pill badge-danger">Security Restricted</span>
        <h1 style={{ margin: "4px 0 0 0", fontFamily: "Playfair Display, Georgia, serif" }}>Master Admin Operator Profile</h1>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>
          Security clearance information, operator credentials, and portal system settings.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: "28px", borderRadius: "16px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid var(--border-light)" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ef4444, #7f1d1d)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justify: "center",
              fontSize: "24px",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
            }}
          >
            A
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>{user?.username || user?.name || "System Administrator"}</h2>
              <span className="badge-pill badge-danger">Level 1 Clearance</span>
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Email: <strong>{user?.email || "admin@nexstore.com"}</strong> • Role: <strong>Platform Master Administrator</strong>
            </p>
          </div>
        </div>

        {/* Security Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
          <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>Access Rights</span>
            <strong style={{ fontSize: "1rem", color: "var(--text-main)" }}>Full Administrative Supervision</strong>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>Grants catalog approval, merchant risk audits, and security telemetry supervision.</p>
          </div>

          <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>Security Clearance Status</span>
            <strong style={{ fontSize: "1rem", color: "#10b981" }}>Active & Verified</strong>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>Session encrypted with token authentication.</p>
          </div>
        </div>

        {/* Display Preference Mode */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: "1px solid var(--border-light)" }}>
          <div>
            <strong>Admin Display Theme</strong>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>Select visual appearance mode for the Admin Portal Control Center.</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className={`btn ${!isDark ? "btn-primary" : "btn-secondary"} btn-sm`}
              onClick={() => setSpecificTheme("light")}
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <Sun className="w-4 h-4" aria-hidden="true" /> Crisp Light Mode
            </button>
            <button
              type="button"
              className={`btn ${isDark ? "btn-primary" : "btn-secondary"} btn-sm`}
              onClick={() => setSpecificTheme("dark")}
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <Moon className="w-4 h-4" aria-hidden="true" /> Obsidian Dark Mode
            </button>
          </div>
        </div>

        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn btn-danger btn-md"
            onClick={handleLogout}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <LogOut className="w-4 h-4" aria-hidden="true" /> End Security Session & Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
