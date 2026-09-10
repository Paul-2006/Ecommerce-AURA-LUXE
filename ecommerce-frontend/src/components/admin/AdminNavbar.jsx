import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  LayoutDashboard,
  Users,
  Store,
  CheckSquare,
  ShoppingBag,
  Building2,
  Truck,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  UserCheck,
  LogOut,
  Sun,
  Moon,
  Shield,
  Bell
} from "lucide-react";
import WebKadaiLogo from "../WebKadaiLogo";

function AdminNavbar() {
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="admin-portal-header" style={{ background: "var(--bg-card, #0f172a)", borderBottom: "1px solid var(--border-medium, rgba(255,255,255,0.1))", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
      {/* Top Header Bar */}
      <div style={{ padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <WebKadaiLogo size="small" />
          <div style={{ height: "24px", width: "1px", background: "rgba(255,255,255,0.2)" }}></div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "700", letterSpacing: "0.5px", color: "var(--text-main, #f8fafc)" }}>
                MARKETPLACE CONTROL CENTER
              </h3>
              <span className="badge-pill badge-danger" style={{ fontSize: "0.68rem", padding: "2px 8px" }}>
                Level 1 - Master Admin
              </span>
            </div>
            <small style={{ color: "var(--text-muted, #94a3b8)", fontSize: "0.78rem" }}>
              Central Platform Monitoring & Security Console
            </small>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Operator Profile Pill */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 14px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Shield className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <div style={{ fontSize: "0.82rem" }}>
              <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.72rem" }}>Logged in as:</span>
              <strong style={{ color: "var(--text-main)" }}>{user?.username || user?.name || "System Operator"}</strong>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={toggleTheme}
            title="Toggle Visual Theme"
            style={{ borderRadius: "50%", width: "36px", height: "36px", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" /> : <Moon className="w-4 h-4 text-indigo-400" aria-hidden="true" />}
          </button>

          {/* Logout Button */}
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleLogout}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "8px" }}
          >
            <LogOut className="w-4 h-4" aria-hidden="true" /> Logout
          </button>
        </div>
      </div>

      {/* Main Admin Navigation Links Bar */}
      <nav style={{ padding: "8px 24px", overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={navItemStyle}
          >
            <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={navItemStyle}
          >
            <Users className="w-4 h-4" aria-hidden="true" /> Customers
          </NavLink>

          <NavLink
            to="/admin/sellers"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={navItemStyle}
          >
            <Store className="w-4 h-4" aria-hidden="true" /> Sellers
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={navItemStyle}
          >
            <CheckSquare className="w-4 h-4" aria-hidden="true" /> Products Approval
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={navItemStyle}
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" /> Orders
          </NavLink>

          <NavLink
            to="/admin/warehouse"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={navItemStyle}
          >
            <Building2 className="w-4 h-4" aria-hidden="true" /> Warehouse
          </NavLink>

          <NavLink
            to="/admin/delivery"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={navItemStyle}
          >
            <Truck className="w-4 h-4" aria-hidden="true" /> Delivery
          </NavLink>

          <NavLink
            to="/admin/complaints"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={navItemStyle}
          >
            <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Complaints
          </NavLink>

          <NavLink
            to="/admin/reports"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={navItemStyle}
          >
            <BarChart3 className="w-4 h-4" aria-hidden="true" /> Reports
          </NavLink>

          <NavLink
            to="/admin/login-activity"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={navItemStyle}
          >
            <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Login Activity
          </NavLink>

          <NavLink
            to="/admin/profile"
            className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            style={navItemStyle}
          >
            <UserCheck className="w-4 h-4" aria-hidden="true" /> Admin Profile
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

const navItemStyle = ({ isActive }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 14px",
  borderRadius: "8px",
  fontSize: "0.85rem",
  fontWeight: "600",
  textDecoration: "none",
  color: isActive ? "#ffffff" : "var(--text-muted, #94a3b8)",
  background: isActive ? "var(--accent-color, #6366f1)" : "transparent",
  transition: "all 0.2s ease"
});

export default AdminNavbar;
