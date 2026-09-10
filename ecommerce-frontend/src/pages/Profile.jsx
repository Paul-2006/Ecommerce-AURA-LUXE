import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { getOrders } from "../services/orderService";
import { getLocalCart } from "../services/cartService";
import { getLocalWishlist } from "../services/wishlistService";
import LiveMapTracker from "../components/LiveMapTracker";
import WebKadaiLogo from "../components/WebKadaiLogo";
import { LogOut, Package, Heart, ShoppingCart, User, Settings, MapPin, FileText, Save, Sun, Moon, X } from "lucide-react";
import "../css/Dashboard.css";
import "../css/Orders.css";

function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateUserProfile, logout } = useContext(AuthContext);
  const { t } = useLanguage();
  const { isDark, setSpecificTheme } = useTheme();

  const defaultTab = searchParams.get("tab") || "orders";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

  const [profileData, setProfileData] = useState({
    username: user?.username || user?.name || "Marketplace User",
    email: user?.email || "user@example.com",
    phoneNumber: user?.phoneNumber || user?.phone || "+91 98765 43210",
    accountStatus: user?.accountStatus || "Active Verified",
    role: user?.role || "Customer",
    createdDate: user?.createdDate ? new Date(user.createdDate).toLocaleDateString("en-IN") : "2026-01-15",
    addressLine: "Plot 42, Silicon Valley Avenue, Phase 2",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560100"
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadUserHistory();
    const savedAddress = JSON.parse(localStorage.getItem("customer_shipping_address") || "null");
    if (savedAddress) {
      setProfileData((prev) => ({
        ...prev,
        username: savedAddress.fullName || prev.username,
        email: savedAddress.email || prev.email,
        phoneNumber: savedAddress.phoneNumber || prev.phoneNumber,
        addressLine: savedAddress.addressLine || prev.addressLine,
        city: savedAddress.city || prev.city,
        state: savedAddress.state || prev.state,
        pincode: savedAddress.pincode || prev.pincode
      }));
    }
  }, [user]);

  const loadUserHistory = async () => {
    try {
      setLoadingOrders(true);
      const customerId = user?.customerId || 1;
      const res = await getOrders(customerId);
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }

    setCartItems(getLocalCart());
    setWishlistItems(getLocalWishlist());
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    localStorage.setItem(
      "customer_shipping_address",
      JSON.stringify({
        fullName: profileData.username,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        addressLine: profileData.addressLine,
        city: profileData.city,
        state: profileData.state,
        pincode: profileData.pincode
      })
    );

    if (updateUserProfile) {
      updateUserProfile({
        username: profileData.username,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber
      });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const currentActiveOrders = orders.filter((o) => {
    const s = (o.orderStatus || o.status || "").toLowerCase();
    return !s.includes("delivered") && !s.includes("cancelled");
  });

  const pastDeliveredOrders = orders.filter((o) => {
    const s = (o.orderStatus || o.status || "").toLowerCase();
    return s.includes("delivered") || s.includes("cancelled");
  });

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amt || 0);

  const userInitial = (profileData.username || "U")[0].toUpperCase();

  return (
    <div className="profile-page-container centered-container">
      {/* Classical Premium User Banner */}
      <div
        className="dashboard-welcome-banner glass-panel"
        style={{
          background: "linear-gradient(135deg, rgba(112,26,117,0.06), rgba(197,168,128,0.12))",
          border: "1px solid var(--border-medium)",
          padding: "24px 28px",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "24px"
        }}
      >
        <div
          style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #701A75, #4A0E4E)",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            fontWeight: "bold",
            border: "2.5px solid #C5A880",
            boxShadow: "0 6px 18px rgba(112, 26, 117, 0.25)"
          }}
        >
          {userInitial}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span className="badge-pill badge-primary" style={{ fontSize: "0.74rem" }}>
              {profileData.role} Profile
            </span>
            <span className="badge-pill badge-success" style={{ fontSize: "0.74rem" }}>
              Status: {profileData.accountStatus}
            </span>
          </div>
          <h2 style={{ margin: "4px 0 2px 0", fontFamily: "Playfair Display, Georgia, serif" }}>
            {profileData.username}
          </h2>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Email: <strong>{profileData.email}</strong> • Phone: <strong>{profileData.phoneNumber}</strong> • Member Since: {profileData.createdDate}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <LogOut className="w-4 h-4" aria-hidden="true" /> Logout
        </button>
      </div>

      {/* Tab Controls */}
      <div className="profile-tabs-nav glass-panel" style={{ marginBottom: "20px" }}>
        <button
          type="button"
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Package className="w-4 h-4" aria-hidden="true" /> Orders ({orders.length})
          </span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === "wishlist" ? "active" : ""}`}
          onClick={() => setActiveTab("wishlist")}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Heart className="w-4 h-4" aria-hidden="true" /> Wishlist ({wishlistItems.length})
          </span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === "cart" ? "active" : ""}`}
          onClick={() => setActiveTab("cart")}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ShoppingCart className="w-4 h-4" aria-hidden="true" /> Cart ({cartItems.length})
          </span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <User className="w-4 h-4" aria-hidden="true" /> Personal Info
          </span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Settings className="w-4 h-4" aria-hidden="true" /> Settings
          </span>
        </button>
      </div>

      {/* Tab Pane 1: Orders History */}
      {activeTab === "orders" && (
        <div className="tab-pane-content">
          {loadingOrders ? (
            <div className="loading-grid glass-panel center-content" style={{ padding: "40px" }}>
              <div className="loader-spinner"></div>
              <p>Loading your order history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state-box glass-panel center-content" style={{ padding: "48px 24px", textAlign: "center" }}>
              <h3>No history available yet.</h3>
              <p>You have not placed any orders yet. Explore our premium marketplace collection!</p>
              <button className="btn btn-primary btn-md" style={{ marginTop: "12px" }} onClick={() => navigate("/products")}>
                Explore Products
              </button>
            </div>
          ) : (
            <div className="orders-list-grid" style={{ display: "grid", gap: "16px" }}>
              {orders.map((order) => (
                <div key={order.orderId} className="order-item-card glass-panel" style={{ padding: "20px", borderRadius: "12px", border: "1px solid var(--border-medium)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px", marginBottom: "12px" }}>
                    <div>
                      <strong style={{ fontSize: "1.05rem" }}>Order #{order.orderId}</strong>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginLeft: "12px" }}>
                        Placed: {order.orderDate ? new Date(order.orderDate).toLocaleDateString("en-IN") : "Today"}
                      </span>
                    </div>
                    <span className="badge-pill badge-primary">
                      {order.orderStatus || order.status || "Processing"}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.9rem" }}>Total Amount: <strong>{formatPrice(order.totalAmount)}</strong></p>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.82rem", color: "var(--text-muted)" }}>Payment Method: Online Verified</p>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setActiveTrackingOrderId(order.orderId)}
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> Track Map
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setActiveInvoiceOrder(order)}
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <FileText className="w-3.5 h-3.5" aria-hidden="true" /> Tax Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Pane 2: Wishlist History */}
      {activeTab === "wishlist" && (
        <div className="tab-pane-content">
          {wishlistItems.length === 0 ? (
            <div className="empty-state-box glass-panel center-content" style={{ padding: "48px 24px", textAlign: "center" }}>
              <h3>No history available yet.</h3>
              <p>Your saved wishlist items will appear here.</p>
              <button className="btn btn-primary btn-md" style={{ marginTop: "12px" }} onClick={() => navigate("/products")}>
                Browse Catalog
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
              {wishlistItems.map((item, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: "14px", borderRadius: "12px", textAlign: "center" }}>
                  <img src={item.imageUrl || item.image} alt={item.name} style={{ width: "100%", height: "140px", objectFit: "contain", marginBottom: "10px" }} />
                  <strong style={{ display: "block", fontSize: "0.9rem" }}>{item.name}</strong>
                  <span style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "0.95rem" }}>{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Pane 3: Cart History */}
      {activeTab === "cart" && (
        <div className="tab-pane-content">
          {cartItems.length === 0 ? (
            <div className="empty-state-box glass-panel center-content" style={{ padding: "48px 24px", textAlign: "center" }}>
              <h3>No history available yet.</h3>
              <p>Your shopping cart is currently empty.</p>
              <button className="btn btn-primary btn-md" style={{ marginTop: "12px" }} onClick={() => navigate("/products")}>
                Shop Now
              </button>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: "20px", borderRadius: "12px" }}>
              <h4>Active Cart Items ({cartItems.length})</h4>
              {cartItems.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border-light)" }}>
                  <span>{item.name || "Marketplace Product"} (Qty: {item.quantity || 1})</span>
                  <strong>{formatPrice((item.price || 999) * (item.quantity || 1))}</strong>
                </div>
              ))}
              <button className="btn btn-primary btn-md" style={{ marginTop: "16px" }} onClick={() => navigate("/cart")}>
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab Pane 4: Personal Information Form */}
      {activeTab === "info" && (
        <div className="tab-pane-content">
          <form className="profile-form-card glass-panel" onSubmit={handleSaveProfile} style={{ padding: "24px", borderRadius: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>Personal Profile Information</h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.84rem", color: "var(--text-muted)" }}>Update your personal contact details and postal shipping address.</p>
              </div>
              {savedSuccess && <span className="badge-pill badge-success">Saved Successfully!</span>}
            </div>

            <div className="profile-inputs-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="username" value={profileData.username} onChange={handleProfileChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" name="phoneNumber" value={profileData.phoneNumber} onChange={handleProfileChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Postal Code (Pincode)</label>
                <input type="text" name="pincode" value={profileData.pincode} onChange={handleProfileChange} required />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Shipping Address</label>
                <textarea name="addressLine" value={profileData.addressLine} onChange={handleProfileChange} rows="3" required></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" name="city" value={profileData.city} onChange={handleProfileChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <input type="text" name="state" value={profileData.state} onChange={handleProfileChange} required />
              </div>
            </div>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button type="submit" className="btn btn-save btn-md" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Save className="w-4 h-4" aria-hidden="true" /> Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Pane 5: Account Settings */}
      {activeTab === "settings" && (
        <div className="tab-pane-content">
          <div className="profile-form-card glass-panel" style={{ padding: "24px", borderRadius: "16px" }}>
            <h3 style={{ margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>Account & Display Preferences</h3>
            <p style={{ margin: "2px 0 20px 0", fontSize: "0.84rem", color: "var(--text-muted)" }}>Manage visual appearance theme and account preferences.</p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid var(--border-light)" }}>
              <div>
                <strong>Display Theme Mode</strong>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>Toggle between daytime crisp Light White theme and sleek obsidian Dark Mode.</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" className={`btn ${!isDark ? "btn-primary" : "btn-secondary"} btn-sm`} onClick={() => setSpecificTheme("light")} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Sun className="w-4 h-4" aria-hidden="true" /> Light Mode
                </button>
                <button type="button" className={`btn ${isDark ? "btn-primary" : "btn-secondary"} btn-sm`} onClick={() => setSpecificTheme("dark")} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Moon className="w-4 h-4" aria-hidden="true" /> Dark Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Map Tracking Modal */}
      {activeTrackingOrderId && (
        <LiveMapTracker orderId={activeTrackingOrderId} onClose={() => setActiveTrackingOrderId(null)} />
      )}

      {/* Tax Invoice Modal */}
      {activeInvoiceOrder && (
        <div className="modal-overlay" onClick={() => setActiveInvoiceOrder(null)}>
          <div className="invoice-modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ padding: "28px", maxWidth: "600px" }}>
            <div className="invoice-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <div className="invoice-brand-block">
                <WebKadaiLogo size="small" />
                <span className="invoice-tax-badge" style={{ marginLeft: "10px", fontSize: "0.75rem", background: "#701A75", color: "#fff", padding: "3px 8px", borderRadius: "4px" }}>OFFICIAL TAX INVOICE</span>
              </div>
              <button className="close-modal-btn" onClick={() => setActiveInvoiceOrder(null)}>
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div style={{ padding: "14px", background: "var(--bg-surface)", borderRadius: "8px", marginBottom: "16px", fontSize: "0.88rem" }}>
              <div><strong>Invoice #:</strong> INV-AURA-{activeInvoiceOrder.orderId}-2026</div>
              <div><strong>Order Date:</strong> {activeInvoiceOrder.orderDate ? new Date(activeInvoiceOrder.orderDate).toLocaleDateString("en-IN") : "Today"}</div>
              <div><strong>Billed To:</strong> {profileData.username} ({profileData.email})</div>
            </div>

            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>Print Invoice</button>
              <button className="btn btn-primary btn-sm" style={{ marginLeft: "10px" }} onClick={() => setActiveInvoiceOrder(null)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;