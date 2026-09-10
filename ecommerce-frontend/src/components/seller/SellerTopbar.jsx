import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Search, Bell, Menu, Store, ShieldCheck } from "lucide-react";

function SellerTopbar({ onToggleSidebar }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case "/seller/dashboard":
        return "Merchant Operations & Sales Dashboard";
      case "/seller/products":
        return "Product Catalog & Clearance Management";
      case "/seller/add-product":
        return "Add New Product Listing";
      case "/seller/inventory":
        return "Inventory Stock Control & Replenishment Telemetry";
      case "/seller/orders":
        return "Merchant Orders Fulfillment & Audit Center";
      case "/seller/returns":
        return "Returns & Refunds Management Desk";
      case "/seller/customers":
        return "Customer Buyer Directory & Order History";
      case "/seller/reviews":
        return "Customer Product Ratings & Reviews Center";
      case "/seller/complaints":
        return "Seller Disputes & Customer Complaint Desk";
      case "/seller/analytics":
        return "Merchant Sales Analytics & Growth Telemetry";
      case "/seller/payments":
        return "Payments, Earnings & Settlement Statements";
      case "/seller/shipping":
        return "Logistics Dispatch & Carrier Delivery Tracking";
      case "/seller/notifications":
        return "Merchant System & Order Notifications";
      case "/seller/reports":
        return "Merchant Business Intelligence Reports";
      case "/seller/store":
        return "Storefront Branding & Policy Settings";
      case "/seller/profile":
        return "Merchant Business Profile & GSTIN Verification";
      case "/seller/settings":
        return "Merchant Account Security & Portal Settings";
      default:
        return "Merchant Business Control Center";
    }
  };

  return (
    <header className="seller-topbar">
      <div className="seller-topbar-left">
        <button
          type="button"
          className="seller-mobile-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        <h2 className="seller-page-header-title">{getPageTitle(location.pathname)}</h2>
      </div>

      <div className="seller-topbar-right">
        {/* Search Box */}
        <div className="seller-topbar-search">
          <Search className="w-4 h-4" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search SKUs, orders, customers..."
            aria-label="Search records"
          />
        </div>

        {/* Notification Pill */}
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          style={{ padding: "8px", borderRadius: "10px", position: "relative" }}
          title="Merchant Notifications"
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
              backgroundColor: "var(--seller-warning)"
            }}
          />
        </button>

        {/* Profile Badge */}
        <div className="seller-topbar-badge">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--seller-secondary)" }} aria-hidden="true" />
            <strong>{user?.username || user?.name || "Zenith Merchant"}</strong>
          </span>
        </div>
      </div>
    </header>
  );
}

export default SellerTopbar;
