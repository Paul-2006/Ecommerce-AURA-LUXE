import { useNavigate } from "react-router-dom";
import "../css/PortalLogin.css";

function PortalLogin() {
  const navigate = useNavigate();

  const portals = [
    {
      id: "customer",
      name: "Customer Shopping Portal",
      desc: "Shop genuine electronics, track live rider GPS coordinates, and manage orders.",
      path: "/customer/login",
      badge: "Public Access",
      badgeClass: "badge-primary"
    },
    {
      id: "seller",
      name: "Merchant Seller Portal",
      desc: "Requires Approved Business Documents (GSTIN). Manage products, pricing, and fulfillment.",
      path: "/seller/login",
      badge: "Verified Merchants",
      badgeClass: "badge-warning"
    },
    {
      id: "admin",
      name: "Administrator Security Console",
      desc: "Restricted to 2 authorized administrators with 2FA clearance. Full audit and seller approval.",
      path: "/admin/login",
      badge: "2-Admin Security Clearance",
      badgeClass: "badge-danger"
    },
    {
      id: "warehouse",
      name: "Warehouse Scanner Terminal",
      desc: "Optical barcode & QR inventory scanner to update warehouse batch levels and dispatch queues.",
      path: "/warehouse/login",
      badge: "Scanner & Dispatch",
      badgeClass: "badge-primary"
    },
    {
      id: "delivery",
      name: "Delivery Dispatch Portal",
      desc: "Requires Motorbike Plate and Driver License verification. Real-time GPS route telemetry.",
      path: "/delivery/login",
      badge: "Partner Dispatch",
      badgeClass: "badge-success"
    }
  ];

  return (
    <div className="portal-page-container centered-container">
      {/* Centered Page Header */}
      <div className="page-header center-content">
        <span className="badge-pill badge-primary">Unified Authentication Gateway</span>
        <h1>Select Operational Portal</h1>
        <p>Choose your designated organizational role to proceed with secure clearance.</p>
      </div>

      {/* Portals Grid */}
      <div className="portals-grid">
        {portals.map((portal) => (
          <div
            key={portal.id}
            className="portal-card glass-panel"
            onClick={() => navigate(portal.path)}
          >
            <div className="portal-card-top">
              <span className={`badge-pill ${portal.badgeClass}`}>{portal.badge}</span>
            </div>

            <div className="portal-card-body">
              <h2 className="portal-name">{portal.name}</h2>
              <p className="portal-desc">{portal.desc}</p>
            </div>

            <button className="btn btn-primary btn-block portal-login-btn">
              Access Portal
            </button>
          </div>
        ))}
      </div>

      {/* Quick Registration Helper */}
      <div className="portal-register-prompt glass-panel center-content">
        <p>Need a new customer or merchant account?</p>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/register")}>
          Register Account
        </button>
      </div>
    </div>
  );
}

export default PortalLogin;