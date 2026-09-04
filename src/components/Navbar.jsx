import { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
          {/* Notification Bell Dropdown (In-Portal Order Acknowledgements) */}
          <div className="notification-bell-wrapper">
            <button
              type="button"
              className={`nav-icon-btn notif-bell-btn ${unreadCount > 0 ? "has-unread" : ""}`}
              onClick={handleToggleNotifications}
              title="Order Acknowledgements & Notifications"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
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
                          <span className="notif-agent-icon">🏍️</span>
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
                          <span>📲 SMS Sent to: {notif.customerPhone}</span>
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
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>{currentLangObj.nativeName}</span>
              <span className="chevron-icon">▼</span>
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

          {/* Theme Switcher Toggle Button (Light White / Dark Mode) */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={isDark ? "Switch to White / Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              // Sun Vector Icon for Light Mode
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              // Moon Vector Icon for Dark Mode
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1e293b" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          {user ? (
            <div className="user-menu-container">
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title="Account & Profile Menu"
              >
                {/* Professional Profile Vector Icon */}
                <div className="profile-avatar-circle" style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #701A75, #4A0E4E)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px", border: "1.5px solid #C5A880" }}>
                  {(user.username || user.name || "A")[0].toUpperCase()}
                </div>
                <div className="user-meta">
                  <span className="user-name">{user.username || user.name || "Account"}</span>
                  <span className="user-role-badge">{user.role || "Customer"}</span>
                </div>
                <span className="chevron-icon">▼</span>
              </button>

              {dropdownOpen && (
                <div className="user-dropdown glass-panel" onMouseLeave={() => setDropdownOpen(false)}>
                  <div className="dropdown-header" style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-light)" }}>
                    <strong style={{ fontSize: "0.95rem", color: "var(--text-main)", display: "block" }}>{user.username || user.name}</strong>
                    <span className="dropdown-user-email" style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>{user.email}</span>
                    <span className="badge-pill badge-primary" style={{ marginTop: "4px", fontSize: "0.7rem" }}>{user.role || "Customer"}</span>
                  </div>

                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span>👤</span> My Profile
                  </Link>

                  <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span>📦</span> Order History
                  </Link>

                  <Link to="/wishlist" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span>💖</span> Wishlist
                  </Link>

                  <Link to="/cart" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span>🛒</span> Cart
                  </Link>

                  <Link to="/products" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span>👁️</span> Recently Viewed
                  </Link>

                  <Link to="/profile?tab=settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span>⚙️</span> Account Settings
                  </Link>

                  <Link to={getDashboardPath()} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span>📊</span> Portal Dashboard
                  </Link>

                  <hr className="dropdown-divider" style={{ margin: "6px 0", borderTop: "1px solid var(--border-light)" }} />

                  <button className="dropdown-item logout-btn" onClick={handleLogout} style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "none", border: "none", color: "#ef4444" }}>
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm login-nav-btn">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;