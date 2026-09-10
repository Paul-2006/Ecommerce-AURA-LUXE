import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Store, Image as ImageIcon, Save, CheckCircle2, Globe, ShieldCheck, Mail, Phone, Clock, FileText } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerStore() {
  const { user } = useContext(AuthContext);
  const sellerId = user?.sellerId || user?.userId || 1;

  const [storeData, setStoreData] = useState({
    storeName: "AURA LUXE Official Store",
    tagline: "Premium Curated Electronics & Luxury Accessories",
    description: "Welcome to our official marketplace storefront. We specialize in authentic luxury tech, studio audio monitors, and premium gadgets with manufacturer warranty.",
    logoUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200",
    bannerUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
    supportEmail: "support@auraluxestore.com",
    supportPhone: "+91 98765 43210",
    businessHours: "Mon - Sat: 9:00 AM - 8:00 PM IST",
    shippingPolicy: "Free standard express shipping on orders over ₹1,999. Dispatch within 24 working hours.",
    returnPolicy: "Hassle-free 14-day replacement & refund policy for manufacturing defects.",
    websiteUrl: "https://auraluxe.com"
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg("Store profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 800);
  };

  return (
    <div className="seller-page-container">
      {/* Page Header */}
      <div className="seller-page-header">
        <div>
          <h1 className="seller-page-title">Store Management</h1>
          <p className="seller-page-subtitle">
            Manage your merchant storefront identity, banner visuals, and buyer support policies
          </p>
        </div>
        <button type="submit" form="seller-store-form" className="btn btn-primary" disabled={saving}>
          <Save className="w-4 h-4" aria-hidden="true" />
          <span>{saving ? "Saving..." : "Save Store Changes"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="seller-alert seller-alert-success mb-4">
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}

      <form id="seller-store-form" onSubmit={handleSubmit}>
        <div className="seller-grid seller-grid-3">
          {/* Main Visual & Info Column (2 Spans) */}
          <div className="seller-col-span-2 space-y-6">
            {/* Store Preview Banner Card */}
            <div className="seller-card">
              <div className="seller-card-header">
                <h3 className="seller-card-title flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                  Store Banner & Visual Identity
                </h3>
              </div>
              <div className="seller-card-body space-y-4">
                <div
                  style={{
                    height: "160px",
                    borderRadius: "8px",
                    backgroundImage: `url(${storeData.bannerUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "16px",
                    color: "#FFFFFF",
                    boxShadow: "inset 0 -60px 40px rgba(0,0,0,0.6)"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={storeData.logoUrl}
                      alt="Store Logo"
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        border: "2px solid #B08D57"
                      }}
                    />
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF" }}>
                        {storeData.storeName || "Store Name"}
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.825rem", color: "#E0E0E0" }}>
                        {storeData.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="seller-grid seller-grid-2 gap-4">
                  <div>
                    <label className="seller-form-label">Banner Image URL</label>
                    <input
                      type="url"
                      name="bannerUrl"
                      className="seller-form-input"
                      value={storeData.bannerUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="seller-form-label">Store Logo URL</label>
                    <input
                      type="url"
                      name="logoUrl"
                      className="seller-form-input"
                      value={storeData.logoUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Store Info */}
            <div className="seller-card">
              <div className="seller-card-header">
                <h3 className="seller-card-title flex items-center gap-2">
                  <Store className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                  Store Identity & Bio
                </h3>
              </div>
              <div className="seller-card-body space-y-4">
                <div className="seller-grid seller-grid-2 gap-4">
                  <div>
                    <label className="seller-form-label">Store Name *</label>
                    <input
                      type="text"
                      name="storeName"
                      className="seller-form-input"
                      value={storeData.storeName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="seller-form-label">Store Tagline</label>
                    <input
                      type="text"
                      name="tagline"
                      className="seller-form-input"
                      value={storeData.tagline}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="seller-form-label">Store Description / About</label>
                  <textarea
                    name="description"
                    rows="4"
                    className="seller-form-textarea"
                    value={storeData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Merchant Policies */}
            <div className="seller-card">
              <div className="seller-card-header">
                <h3 className="seller-card-title flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                  Shipping & Return Policies
                </h3>
              </div>
              <div className="seller-card-body space-y-4">
                <div>
                  <label className="seller-form-label">Shipping Terms & Dispatch Policy</label>
                  <textarea
                    name="shippingPolicy"
                    rows="3"
                    className="seller-form-textarea"
                    value={storeData.shippingPolicy}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="seller-form-label">Return & Refund Terms</label>
                  <textarea
                    name="returnPolicy"
                    rows="3"
                    className="seller-form-textarea"
                    value={storeData.returnPolicy}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Side Info Column (1 Span) */}
          <div className="space-y-6">
            {/* Customer Support Contact */}
            <div className="seller-card">
              <div className="seller-card-header">
                <h3 className="seller-card-title flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                  Customer Support Contact
                </h3>
              </div>
              <div className="seller-card-body space-y-4">
                <div>
                  <label className="seller-form-label">Support Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    <input
                      type="email"
                      name="supportEmail"
                      className="seller-form-input"
                      value={storeData.supportEmail}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="seller-form-label">Support Helpline</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    <input
                      type="text"
                      name="supportPhone"
                      className="seller-form-input"
                      value={storeData.supportPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="seller-form-label">Business Hours</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    <input
                      type="text"
                      name="businessHours"
                      className="seller-form-input"
                      value={storeData.businessHours}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="seller-form-label">Official Website</label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    <input
                      type="url"
                      name="websiteUrl"
                      className="seller-form-input"
                      value={storeData.websiteUrl}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Store Verification Card */}
            <div className="seller-card" style={{ background: "rgba(176, 141, 87, 0.05)", borderColor: "rgba(176, 141, 87, 0.3)" }}>
              <div className="seller-card-body text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-muted-gold mx-auto" aria-hidden="true" />
                <h4 style={{ margin: 0, fontWeight: 700, color: "#172033" }}>Verified Merchant Badge</h4>
                <p style={{ fontSize: "0.825rem", color: "#667085" }}>
                  Your store displays the official Verified Merchant mark on all customer product listings.
                </p>
                <div className="seller-badge seller-badge-success mx-auto" style={{ width: "fit-content" }}>
                  Active Compliance
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SellerStore;
