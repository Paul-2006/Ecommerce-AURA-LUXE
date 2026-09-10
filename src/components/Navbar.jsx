import { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  Globe,
  Sun,
  Moon,
  User,
  Package,
  Heart,
  ShoppingCart,
  Eye,
  Settings,
  LayoutDashboard,
  LogOut,
  Truck,
  Smartphone,
  ChevronDown,
  LogIn
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { getNotifications, markAllNotificationsRead } from "../services/notificationService";
import WebKadaiLogo from "./WebKadaiLogo";
import "../css/Navbar.css";

function Navbar() {
  const { user, logout, isAdmin, isSeller, isWarehouse, isDelivery, cartCount, wishlistCount } = useContext(AuthContext);
  const { t, language, changeLanguage, availableLanguages } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();

  // If Admin or on Admin routes, do not render customer navigation bar
  if (isAdmin || user?.role === "Admin" || location.pathname.startsWith("/admin")) {
    return null;
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const loadNotifications = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener("notifications_updated", loadNotifications);
    return () => window.removeEventListener("notifications_updated", loadNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggleNotifications = () => {
    setNotifDropdownOpen(!notifDropdownOpen);
    if (!notifDropdownOpen && unreadCount > 0) {
      markAllNotificationsRead();
      loadNotifications();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (isAdmin) return "/admin/dashboard";
    if (isSeller) return "/seller/dashboard";
    if (isWarehouse) return "/warehouse/dashboard";
    if (isDelivery) return "/delivery/dashboard";
    return "/customer/dashboard";
  };

  const currentLangObj = availableLanguages.find((l) => l.code === language) || availableLanguages[0];

  return (
    <header className="navbar-wrapper">
      <nav className="navbar centered-container">
        {/* Brand Logo */}
        <div className="logo-container">
          <Link to="/" className="brand-logo-link" style={{ textDecoration: "none" }}>
            <WebKadaiLogo size="normal" />
          </Link>
        </div>

        {/* Main Nav Links (Translated) */}
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} end>
            {t("home")}
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            {t("products")}
          </NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            {t("wishlist")}
            {wishlistCount > 0 && <span className="nav-badge wishlist-badge">{wishlistCount}</span>}
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            {t("cart")}
            {cartCount > 0 && <span className="nav-badge cart-badge">{cartCount}</span>}
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            {t("orders")}
          </NavLink>
        </div>

        {/* Right Actions, Controls & Preferences */}
        <div className="nav-actions">
          {/* Notification Bell Dropdown */}
          <div className="notification-bell-wrapper">
            <button
              type="button"
              className={`nav-icon-btn notif-bell-btn ${unreadCount > 0 ? "has-unread" : ""}`}
              onClick={handleToggleNotifications}
              title="Order Acknowledgements & Notifications"
              aria-label="Notifications"
            >
              <Bell size={18} aria-hidden="true" />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {notifDropdownOpen && (
              <div className="notifications-dropdown-menu glass-panel" onMouseLeave={() => setNotifDropdownOpen(false)}>
                <div className="notif-dropdown-header">
                  <strong>Portal Notifications & Orders</strong>
                  <span className="notif-count-label">{notifications.length} updates</span>
                </div>

                <div className="notif-dropdown-body">
                  {notifications.length === 0 ? (
                    <div className="empty-notif-box">
                      <p>No new notifications. When you place an order, your delivery agent details, OTP, and estimated time will appear here.</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="notif-card-item" onClick={() => { setNotifDropdownOpen(false); navigate("/orders"); }}>
                        <div className="notif-card-top">
                          <span className="notif-order-tag">Order #{notif.orderId} Confirmed</span>
                          <span className="notif-time-tag">{notif.formattedTime}</span>
                        </div>

                        <div className="notif-agent-preview">
                          <Truck size={16} className="notif-agent-icon" aria-hidden="true" />
                          <div>
                            <strong>Agent: {notif.deliveryAgent?.name}</strong>
                            <small>{notif.deliveryAgent?.vehicleNumber}</small>
                          </div>
                        </div>

                        <div className="notif-meta-row">
                          <div className="notif-otp-pill">
                            <span>Delivery OTP:</span>
                            <strong>{notif.otp}</strong>
                          </div>
                          <div className="notif-est-pill">
                            <span>Est. Time:</span>
                            <strong>{notif.estimatedMinutes} Mins</strong>
                          </div>
                        </div>

                        <div className="notif-sms-pill">
                          <Smartphone size={14} aria-hidden="true" />
                          <span>SMS Sent to: {notif.customerPhone}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="notif-dropdown-footer">
                  <button type="button" className="btn btn-ghost btn-sm notif-view-all" onClick={() => { setNotifDropdownOpen(false); navigate("/orders"); }}>
                    View Live GPS Orders & Invoices →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Language Selector Dropdown */}
          <div className="language-selector-wrapper">
            <button
              type="button"
              className="lang-selector-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              title="Select Language"
              aria-label="Select Language"
            >
              <Globe size={16} aria-hidden="true" />
              <span>{currentLangObj.nativeName}</span>
              <ChevronDown size={14} className="chevron-icon" aria-hidden="true" />
            </button>

            {langDropdownOpen && (
              <div className="lang-dropdown-menu glass-panel" onMouseLeave={() => setLangDropdownOpen(false)}>
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`lang-option-btn ${language === lang.code ? "active" : ""}`}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                  >
                    <strong>{lang.nativeName}</strong>
                    <small>({lang.name})</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switcher Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={isDark ? "Switch to White / Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} style={{ color: "#f59e0b" }} aria-hidden="true" /> : <Moon size={18} style={{ color: "#0f172a" }} aria-hidden="true" />}
          </button>

          {user ? (
            <div className="user-menu-container">
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title="Account & Profile Menu"
                aria-label="User Menu"
              >
                <div className="profile-avatar-circle" style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#0f172a", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>
                  {(user.username || user.name || "A")[0].toUpperCase()}
                </div>
                <div className="user-meta">
                  <span className="user-name">{user.username || user.name || "Account"}</span>
                  <span className="user-role-badge">{user.role || "Customer"}</span>
                </div>
                <ChevronDown size={14} className="chevron-icon" aria-hidden="true" />
              </button>

              {dropdownOpen && (
                <div className="user-dropdown glass-panel" onMouseLeave={() => setDropdownOpen(false)}>
                  <div className="dropdown-header" style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-light)" }}>
                    <strong style={{ fontSize: "0.95rem", color: "var(--text-main)", display: "block" }}>{user.username || user.name}</strong>
                    <span className="dropdown-user-email" style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>{user.email}</span>
                    <span className="badge-pill badge-primary" style={{ marginTop: "4px", fontSize: "0.7rem" }}>{user.role || "Customer"}</span>
                  </div>

                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <User size={16} aria-hidden="true" /> My Profile
                  </Link>

                  <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <Package size={16} aria-hidden="true" /> Order History
                  </Link>

                  <Link to="/wishlist" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <Heart size={16} aria-hidden="true" /> Wishlist
                  </Link>

                  <Link to="/cart" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <ShoppingCart size={16} aria-hidden="true" /> Cart
                  </Link>

                  <Link to="/products" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <Eye size={16} aria-hidden="true" /> Recently Viewed
                  </Link>

                  <Link to="/profile?tab=settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <Settings size={16} aria-hidden="true" /> Account Settings
                  </Link>

                  <Link to={getDashboardPath()} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <LayoutDashboard size={16} aria-hidden="true" /> Portal Dashboard
                  </Link>

                  <hr className="dropdown-divider" style={{ margin: "6px 0", borderTop: "1px solid var(--border-light)" }} />

                  <button className="dropdown-item logout-btn" onClick={handleLogout} style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "none", border: "none", color: "#dc2626" }}>
                    <LogOut size={16} aria-hidden="true" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm login-nav-btn">
              <LogIn size={16} aria-hidden="true" /> Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;