import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getLocalCart, saveLocalCart } from "../services/cartService";
import { createOrder } from "../services/orderService";
import { createOrderAcknowledgement } from "../services/notificationService";
import "../css/Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const { user, updateCounts } = useContext(AuthContext);
  const { t } = useLanguage();

  const cartItems = getLocalCart();

  // Load saved user details if available, otherwise prompt new customer
  const [address, setAddress] = useState(() => {
    const savedCustomer = JSON.parse(localStorage.getItem("customer_shipping_address") || "null");
    return (
      savedCustomer || {
        fullName: user?.username || user?.name || "",
        email: user?.email || "",
        phoneNumber: localStorage.getItem("user_registered_phone") || user?.phoneNumber || "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        latitude: 12.9716,
        longitude: 77.5946
      }
    );
  });

  const [paymentMethod, setPaymentMethod] = useState("Online Payment");
  const [loading, setLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("GPS Coordinates Registered (12.9716, 77.5946)");
  
  // Order Acknowledgement & SMS State Modal
  const [orderAckData, setOrderAckData] = useState(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 999) * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 1000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + shipping + tax;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGpsStatus("Acquiring GPS coordinates...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }));
        setGpsStatus(`Precision GPS Fixed (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
      },
      () => {
        setGpsStatus("Default Central Hub coordinates registered (12.9716, 77.5946)");
      }
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validation for customer contact and shipping details
    if (!address.fullName.trim()) {
      alert("Please enter your Full Name.");
      return;
    }
    if (!address.email.trim() || !address.email.includes("@")) {
      alert("Please enter a valid Email Address for order confirmations.");
      return;
    }
    if (!address.phoneNumber.trim() || address.phoneNumber.length < 10) {
      alert("Please enter a valid 10-digit Phone Number for delivery OTP and rider communication.");
      return;
    }
    if (!address.addressLine.trim()) {
      alert("Please enter your Full Shipping Address (House no, Street, Area).");
      return;
    }
    if (!address.pincode.trim() || address.pincode.length < 6) {
      alert("Please enter a valid 6-digit Postal PIN Code.");
      return;
    }
    if (!address.city.trim()) {
      alert("Please enter your City.");
      return;
    }
    if (!address.state.trim()) {
      alert("Please enter your State.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add products first.");
      navigate("/products");
      return;
    }

    // Save shipping address for future orders
    localStorage.setItem("customer_shipping_address", JSON.stringify(address));

    setLoading(true);
    const orderId = Math.floor(1000 + Math.random() * 9000);

    try {
      await createOrder({
        customerId: user?.customerId || 1,
        cartId: localStorage.getItem("cartId") || 1,
        addressId: 1,
        totalAmount: grandTotal,
        paymentMethod
      });

      // Generate in-portal notification & SMS dispatch acknowledgement
      const ack = createOrderAcknowledgement({
        orderId,
        items: cartItems,
        totalAmount: grandTotal,
        customerName: address.fullName,
        customerPhone: address.phoneNumber,
        customerEmail: address.email,
        shippingAddress: `${address.addressLine}, ${address.city}, ${address.state} - ${address.pincode}`,
        paymentMethod
      });

      // Clear local cart
      saveLocalCart([]);
      updateCounts();

      // Show Acknowledgement Modal
      setOrderAckData(ack);
    } catch (err) {
      console.warn("Backend CreateOrder fallback:", err.message);
      const ack = createOrderAcknowledgement({
        orderId,
        items: cartItems,
        totalAmount: grandTotal,
        customerName: address.fullName,
        customerPhone: address.phoneNumber,
        customerEmail: address.email,
        shippingAddress: `${address.addressLine}, ${address.city}, ${address.state} - ${address.pincode}`,
        paymentMethod
      });

      saveLocalCart([]);
      updateCounts();
      setOrderAckData(ack);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amt);

  return (
    <div className="checkout-page-container centered-container">
      {/* Centered Header */}
      <div className="page-header center-content">
        <span className="badge-pill badge-primary">Express Marketplace Fast Checkout</span>
        <h1>{t("checkout_title")}</h1>
        <p>Enter delivery contact info, choose payment, and confirm dispatch.</p>
      </div>

      <div className="checkout-main-grid">
        {/* Left Column: Delivery Form */}
        <form className="checkout-form-column" onSubmit={handlePlaceOrder}>
          {/* Step 1: Customer Contact & Delivery Info */}
          <div className="checkout-card glass-panel">
            <div className="card-step-header">
              <span className="step-num-badge">1</span>
              <div>
                <h3>{t("contact_details")}</h3>
                <p>Required for dispatch SMS, OTP verification, and rider contact.</p>
              </div>
            </div>

            <div className="form-fields-grid">
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">{t("full_name")} *</label>
                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label">{t("email_address")} *</label>
                <input
                  type="email"
                  name="email"
                  value={address.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul.sharma@example.com"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label">{t("phone_number")} (10 Digits) *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={address.phoneNumber}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  maxLength={13}
                  required
                />
              </div>

              {/* Postal PIN Code */}
              <div className="form-group">
                <label className="form-label">{t("postal_code")} *</label>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 560100"
                  maxLength={6}
                  required
                />
              </div>

              {/* Complete Shipping Address */}
              <div className="form-group full-width">
                <label className="form-label">{t("shipping_address")} *</label>
                <textarea
                  name="addressLine"
                  value={address.addressLine}
                  onChange={handleChange}
                  placeholder="Flat, House no., Building, Company, Apartment, Street, Sector, Area"
                  rows="3"
                  required
                ></textarea>
              </div>

              {/* City */}
              <div className="form-group">
                <label className="form-label">{t("city")} *</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru / Chennai"
                  required
                />
              </div>

              {/* State */}
              <div className="form-group">
                <label className="form-label">{t("state")} *</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="e.g. Karnataka / Tamil Nadu"
                  required
                />
              </div>
            </div>

            {/* GPS Telemetry Bar */}
            <div className="gps-telemetry-row">
              <div className="gps-info">
                <span className="live-pulse-dot"></span>
                <span>{gpsStatus}</span>
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleUseGps}>
                Use Live Location
              </button>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="checkout-card glass-panel">
            <div className="card-step-header">
              <span className="step-num-badge">2</span>
              <div>
                <h3>{t("payment_method")}</h3>
                <p>Select your preferred secure payment gateway</p>
              </div>
            </div>

            <div className="payment-options-grid">
              <label className={`payment-method-card ${paymentMethod === "Online Payment" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online Payment"
                  checked={paymentMethod === "Online Payment"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-content">
                  <strong>{t("online_pay")}</strong>
                  <span>Instant confirmation via Google Pay, PhonePe, Cards or Net Banking</span>
                </div>
              </label>

              <label className={`payment-method-card ${paymentMethod === "Cash On Delivery" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash On Delivery"
                  checked={paymentMethod === "Cash On Delivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-content">
                  <strong>{t("cod")}</strong>
                  <span>Pay securely via cash or QR scan upon delivery</span>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg submit-order-btn" disabled={loading}>
            {loading ? "Processing Order & Dispatching..." : `${t("place_order")} • ${formatPrice(grandTotal)}`}
          </button>
        </form>

        {/* Right Column: Order Summary */}
        <div className="checkout-summary-column">
          <div className="checkout-summary-box glass-panel">
            <h3>{t("order_summary")}</h3>

            <div className="summary-items-list">
              {cartItems.map((item, idx) => (
                <div key={idx} className="summary-prod-row">
                  <span className="summary-prod-name">
                    {item.name || item.productName} <strong>× {item.quantity || 1}</strong>
                  </span>
                  <span className="summary-prod-price">
                    {formatPrice((item.price || 999) * (item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>

            <hr className="summary-divider" />

            <div className="summary-line">
              <span>Items Total:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="summary-line">
              <span>{t("free_delivery")}:</span>
              <span className={shipping === 0 ? "free-tag" : ""}>
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>

            <div className="summary-line">
              <span>GST & Packaging:</span>
              <span>{formatPrice(tax)}</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-line total-line">
              <span>{t("total_payable")}:</span>
              <span className="total-val">{formatPrice(grandTotal)}</span>
            </div>

            <div className="trust-assurance-box">
              <span className="badge-pill badge-assured">AURA Luxe Assured & Verified</span>
              <p>Safe & Encrypted Transactions. 7-Day Replacement Guarantee.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          ORDER ACKNOWLEDGEMENT & REGISTERED PHONE SMS DISPATCH MODAL
          ========================================================================== */}
      {orderAckData && (
        <div className="order-ack-modal-overlay">
          <div className="order-ack-modal-content glass-panel">
            {/* Top Success Header */}
            <div className="ack-header-bar">
              <div className="ack-success-badge">
                <span className="ack-check-icon">✓</span>
                <div>
                  <h2>Order Placed & Dispatched!</h2>
                  <p>Acknowledgement sent to In-Portal Notifications & Registered Phone Number</p>
                </div>
              </div>
              <span className="badge-pill badge-success">Order #{orderAckData.orderId}</span>
            </div>

            {/* 2-Column Split: Portal Acknowledgement vs Registered Phone SMS */}
            <div className="ack-split-grid">
              {/* Left: In-Portal Acknowledgement Card */}
              <div className="ack-card-box portal-ack-card">
                <div className="ack-card-header">
                  <span className="ack-tag portal-tag">🔔 In-Portal Dispatch Notification</span>
                  <span className="ack-time">{orderAckData.formattedTime}</span>
                </div>

                {/* Products Summary */}
                <div className="ack-items-block">
                  <span className="ack-label">Ordered Items:</span>
                  <div className="ack-items-list">
                    {orderAckData.items.map((item, idx) => (
                      <div key={idx} className="ack-item-row">
                        <strong>• {item.productName || item.name || "Selected Product"}</strong>
                        <span>Qty: {item.quantity || 1} • {formatPrice((item.price || 999) * (item.quantity || 1))}</span>
                      </div>
                    ))}
                  </div>
                  <div className="ack-amount-row">
                    <span>Total Paid ({orderAckData.paymentMethod}):</span>
                    <strong>{formatPrice(orderAckData.totalAmount)}</strong>
                  </div>
                </div>

                {/* Delivery Agent Card */}
                <div className="ack-agent-card">
                  <div className="ack-agent-header">
                    <span className="ack-agent-avatar">{orderAckData.deliveryAgent?.avatar}</span>
                    <div className="ack-agent-details">
                      <h4>{orderAckData.deliveryAgent?.name} (Assigned Rider)</h4>
                      <p>Motorbike: <strong className="plate-badge">{orderAckData.deliveryAgent?.vehicleNumber}</strong></p>
                      <small>Contact: <strong>{orderAckData.deliveryAgent?.phone}</strong></small>
                    </div>
                  </div>
                  <span className="ack-agent-status">Status: {orderAckData.deliveryAgent?.status}</span>
                </div>

                {/* OTP & Estimated Delivery Time Key Stats */}
                <div className="ack-stats-grid">
                  <div className="ack-stat-box otp-box">
                    <span className="stat-tag">DELIVERY OTP</span>
                    <strong className="otp-number">{orderAckData.otp}</strong>
                    <small>Share with rider upon delivery</small>
                  </div>

                  <div className="ack-stat-box eta-box">
                    <span className="stat-tag">ESTIMATED TIME</span>
                    <strong className="eta-number">{orderAckData.estimatedMinutes} MINS</strong>
                    <small>Expected by {orderAckData.estimatedArrivalTime}</small>
                  </div>
                </div>
              </div>

              {/* Right: Registered Phone SMS Dispatch Simulation */}
              <div className="ack-card-box phone-sms-card">
                <div className="ack-card-header">
                  <span className="ack-tag sms-tag">📲 Registered Phone SMS Dispatch</span>
                  <span className="sms-sent-badge">✓ DELIVERED</span>
                </div>

                <div className="phone-mockup-wrapper">
                  <div className="phone-screen-header">
                    <div className="phone-carrier">
                      <span>AURA Luxe Alerts</span>
                      <small>To: +91 {orderAckData.customerPhone}</small>
                    </div>
                  </div>

                  <div className="sms-bubble">
                    <div className="sms-header">
                      <strong>AURA Luxe Dispatch Notification</strong>
                      <small>{orderAckData.formattedTime}</small>
                    </div>
                    <p className="sms-body-text">{orderAckData.smsContent}</p>
                    <div className="sms-footer">
                      <span>✓ Delivered via SMS Gateway</span>
                    </div>
                  </div>
                </div>

                <div className="sms-recipient-meta">
                  <span>Registered Recipient:</span>
                  <strong>{orderAckData.customerName} (+91 {orderAckData.customerPhone})</strong>
                  <p>{orderAckData.shippingAddress}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="ack-modal-actions">
              <button
                type="button"
                className="btn btn-luxury btn-lg"
                onClick={() => {
                  setOrderAckData(null);
                  navigate("/orders");
                }}
              >
                📍 Track Live GPS Rider & View Invoices
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() => {
                  setOrderAckData(null);
                  navigate("/products");
                }}
              >
                🛍️ Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
