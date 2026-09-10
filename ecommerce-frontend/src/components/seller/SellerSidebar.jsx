import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingBag,
  RotateCcw,
  Users,
  Star,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Truck,
  Bell,
  BarChart3,
  Store,
  User,
  Settings,
  LogOut,
  ShieldCheck
} from "lucide-react";

function SellerSidebar({ isOpen, onClose }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/seller/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/seller/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/seller/products", icon: Package },
    { label: "Inventory", path: "/seller/inventory", icon: Warehouse },
    { label: "Orders", path: "/seller/orders", icon: ShoppingBag },
    { label: "Returns & Refunds", path: "/seller/returns", icon: RotateCcw },
    { label: "Customers", path: "/seller/customers", icon: Users },
    { label: "Reviews", path: "/seller/reviews", icon: Star },
    { label: "Complaints", path: "/seller/complaints", icon: AlertTriangle },
    { label: "Sales Analytics", path: "/seller/analytics", icon: TrendingUp },
    { label: "Payments & Earnings", path: "/seller/payments", icon: CreditCard },
    { label: "Shipping", path: "/seller/shipping", icon: Truck },
    { label: "Notifications", path: "/seller/notifications", icon: Bell },
    { label: "Reports", path: "/seller/reports", icon: BarChart3 },
    { label: "Store Management", path: "/seller/store", icon: Store },
    { label: "Seller Profile", path: "/seller/profile", icon: User },
    { label: "Settings", path: "/seller/settings", icon: Settings }
  ];

  return (
    <>
      {isOpen && <div className="seller-sidebar-overlay" onClick={onClose} />}
      <aside className={`seller-sidebar ${isOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className="seller-sidebar-header">
          <div className="seller-sidebar-brand">
            <div className="seller-brand-icon">
              <Store className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="seller-brand-text">
              <span className="seller-brand-title">MERCHANT</span>
              <span className="seller-brand-subtitle">Seller Center</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="seller-sidebar-nav">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `seller-nav-item ${isActive ? "active" : ""}`
                }
              >
                <IconComponent className="w-4 h-4" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Operator Info & Logout */}
        <div className="seller-sidebar-footer">
          <div className="seller-operator-card">
            <div className="seller-operator-avatar">
              {(user?.username || user?.name || "M")[0].toUpperCase()}
            </div>
            <div className="seller-operator-info">
              <span className="seller-operator-name">
                {user?.username || user?.name || "Zenith Merchant"}
              </span>
              <span className="seller-operator-role">Verified Seller Account</span>
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

export default SellerSidebar;
