import { useLocation } from "react-router-dom";

function DynamicEcommerceBackground() {
  const location = useLocation();

  // Hide e-commerce background mesh blobs & shopping icons on all Admin routes
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="app-dynamic-background" aria-hidden="true">
      {/* Animated Mesh Gradients */}
      <div className="ambient-mesh-blob blob-1"></div>
      <div className="ambient-mesh-blob blob-2"></div>
      <div className="ambient-mesh-blob blob-3"></div>
      <div className="ambient-mesh-blob blob-4"></div>

      {/* Subtle Blueprint Grid Pattern */}
      <div className="ambient-grid-overlay"></div>

      {/* Floating E-Commerce Vector Icons */}
      <div className="floating-ecommerce-icons">
        {/* 1. Shopping Bag */}
        <svg className="float-icon icon-bag-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>

        {/* 2. Shopping Cart */}
        <svg className="float-icon icon-cart-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>

        {/* 3. Delivery Parcel Box */}
        <svg className="float-icon icon-box-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>

        {/* 4. Delivery Fast Van / Bike */}
        <svg className="float-icon icon-truck-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>

        {/* 5. Discount Tag / Coupon */}
        <svg className="float-icon icon-tag-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>

        {/* 6. Security Shield / Verification */}
        <svg className="float-icon icon-shield-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      </div>
    </div>
  );
}

export default DynamicEcommerceBackground;
