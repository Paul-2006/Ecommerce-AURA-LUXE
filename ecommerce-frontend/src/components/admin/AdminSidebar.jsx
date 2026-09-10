import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Store,
  CheckSquare,
  ShoppingBag,
  Building2,
  Truck,
  AlertTriangle,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Activity,
  UserCheck,
  LogOut,
  Shield
} from "lucide-react";

function AdminSidebar({ isOpen, onClose }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Customers", path: "/admin/customers", icon: Users },
    { label: "Sellers", path: "/admin/sellers", icon: Store },
    { label: "Products Approval", path: "/admin/products", icon: CheckSquare },
    { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { label: "Warehouse", path: "/admin/warehouse", icon: Building2 },
    { label: "Delivery", path: "/admin/delivery", icon: Truck },
    { label: "Complaints", path: "/admin/complaints", icon: AlertTriangle },
    { label: "Payments", path: "/admin/reports", icon: CreditCard },
    { label: "Reports", path: "/admin/reports", icon: BarChart3 },
    { label: "Login Activity", path: "/admin/login-activity", icon: ShieldCheck },
    { label: "System Monitoring", path: "/admin/reports", icon: Activity },
    { label: "Admin Profile", path: "/admin/profile", icon: UserCheck },
  ];

  return (
    <>
      {isOpen && <div className="admin-sidebar-overlay" onClick={onClose} />}
      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <div className="admin-brand-icon">
              <Shield className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="admin-brand-text">
              <span className="admin-brand-title">MARKETPLACE</span>
              <span className="admin-brand-subtitle">Control Center</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `admin-nav-item ${isActive ? "active" : ""}`
                }
              >
                <IconComponent className="w-4 h-4" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Operator Info & Logout */}
        <div className="admin-sidebar-footer">
          <div className="admin-operator-card">
            <div className="admin-operator-avatar">
              {(user?.username || user?.name || "A")[0].toUpperCase()}
            </div>
            <div className="admin-operator-info">
              <span className="admin-operator-name">
                {user?.username || user?.name || "System Operator"}
              </span>
              <span className="admin-operator-role">Level 1 - Master Admin</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleLogout}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
