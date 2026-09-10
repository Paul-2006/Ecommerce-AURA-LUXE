import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Search, Bell, Menu, Shield } from "lucide-react";

function AdminTopbar({ onToggleSidebar }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case "/admin/dashboard":
        return "Marketplace Master Control Center";
      case "/admin/customers":
        return "Customer Directory & Account Supervision";
      case "/admin/sellers":
        return "Seller Verification & Risk Management";
      case "/admin/products":
        return "Product Clearance & Catalog Approvals";
      case "/admin/orders":
        return "Marketplace Orders & Financial Audit Desk";
      case "/admin/warehouse":
        return "Regional Warehouse & SKU Stock Telemetry";
      case "/admin/delivery":
        return "Delivery Fleet & Logistics Partner Telemetry";
      case "/admin/complaints":
        return "Dispute Center & Seller 5-Complaint Warnings";
      case "/admin/reports":
        return "Executive Intelligence & GMV Analytics";
      case "/admin/login-activity":
        return "Security Audit Log & Authentication Stream";
      case "/admin/profile":
        return "Master Administrator Security Profile";
      default:
        return "Enterprise Marketplace Administration";
    }
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          type="button"
          className="admin-mobile-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar Navigation"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        <h2 className="admin-page-header-title">{getPageTitle(location.pathname)}</h2>
      </div>

      <div className="admin-topbar-right">
        {/* Search Box */}
        <div className="admin-topbar-search">
          <Search className="w-4 h-4" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search records, SKUs, orders..."
            aria-label="Search records"
          />
        </div>

        {/* Notification Pill */}
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          style={{ padding: "8px", borderRadius: "10px", position: "relative" }}
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-amber-600" aria-hidden="true" />
          <span
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "var(--admin-warning)"
            }}
          />
        </button>

        {/* Profile Pill */}
        <div className="admin-topbar-badge">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Shield className="w-3.5 h-3.5" style={{ color: "var(--admin-secondary)" }} aria-hidden="true" />
            <strong>{user?.username || user?.name || "Master Admin"}</strong>
          </span>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
