import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CreditCard, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  QrCode, 
  Wallet 
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import "../css/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, placeOrder } = useShop();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "Alex Vance",
    email: "alex.vance@nexus.io",
    address: "742 Evergreen Terrace",
    city: "Cyber City",
    zip: "10001"
  });

  const [deliveryMethod, setDeliveryMethod] = useState("drone");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  if (cart.length === 0 && !placedOrder) {
    navigate("/cart");
    return null;
  }

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newOrder = placeOrder({
        total: cartTotal,
        address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zip}`
      });
      setPlacedOrder(newOrder);
    }, 1800);
  };

  return (
    <div className="checkout-page-container">
      <h1 className="checkout-main-title">Encrypted Checkout</h1>

      {placedOrder ? (
        <div className="order-success-card glass-card">
          <div className="success-icon-box">
            <CheckCircle2 size={56} className="check-success" />
          </div>
          <h2>Order Confirmed & Authorized! 🎉</h2>
          <p className="order-id-label">Order Reference: <strong>{placedOrder.id}</strong></p>

          <div className="order-summary-box">
            <div className="summary-line">
              <span>Estimated Delivery:</span>
              <strong>{placedOrder.estimatedDelivery}</strong>
            </div>
            <div className="summary-line">
              <span>Tracking ID:</span>
              <strong>{placedOrder.trackingId}</strong>
            </div>
            <div className="summary-line">
              <span>Total Paid:</span>
              <strong>${placedOrder.total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="success-btn-group">
            <button 
              className="btn-nexus-primary"
              onClick={() => navigate("/orders")}
            >
              Track Order Dispatch <Truck size={18} />
            </button>
            <button 
              className="btn-nexus-outline"
              onClick={() => navigate("/products")}
            >
              Return to Catalog
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrderSubmit} className="checkout-grid-layout">
          {/* Form Left Col */}
          <div className="checkout-form-col">
            {/* Step 1: Shipping Address */}
            <div className="checkout-step-card glass-card">
              <div className="step-header">
                <MapPin size={20} className="step-icon" />
                <h3>1. Shipping Address</h3>
              </div>

              <div className="form-inputs-grid">
                <div className="input-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                  />
                </div>
                <div className="input-group full-width">
                  <label>Street Address</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>ZIP / Postal Code</label>
                  <input 
                    type="text" 
                    required 
                    value={shippingInfo.zip}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Speed */}
            <div className="checkout-step-card glass-card">
              <div className="step-header">
                <Truck size={20} className="step-icon" />
                <h3>2. Select Delivery Mode</h3>
              </div>

              <div className="delivery-options-grid">
                <label className={`delivery-opt-card ${deliveryMethod === "drone" ? "selected-opt" : ""}`}>
                  <input 
                    type="radio" 
                    name="delivery" 
                    checked={deliveryMethod === "drone"}
                    onChange={() => setDeliveryMethod("drone")}
                  />
                  <div>
                    <strong>Autonomous Drone Express</strong>
                    <span>Delivered in 2 hours • $0.00</span>
                  </div>
                </label>

                <label className={`delivery-opt-card ${deliveryMethod === "standard" ? "selected-opt" : ""}`}>
                  <input 
                    type="radio" 
                    name="delivery" 
                    checked={deliveryMethod === "standard"}
                    onChange={() => setDeliveryMethod("standard")}
                  />
                  <div>
                    <strong>Hyperloop Ground Dispatch</strong>
                    <span>Delivered in 1-2 Days • $0.00</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="checkout-step-card glass-card">
              <div className="step-header">
                <CreditCard size={20} className="step-icon" />
                <h3>3. Payment Method</h3>
              </div>

              <div className="payment-tabs">
                <button 
                  type="button"
                  className={`pay-tab ${paymentMethod === "card" ? "active-pay-tab" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard size={16} /> Credit Card
                </button>
                <button 
                  type="button"
                  className={`pay-tab ${paymentMethod === "upi" ? "active-pay-tab" : ""}`}
                  onClick={() => setPaymentMethod("upi")}
                >
                  <QrCode size={16} /> Instant UPI
                </button>
                <button 
                  type="button"
                  className={`pay-tab ${paymentMethod === "crypto" ? "active-pay-tab" : ""}`}
                  onClick={() => setPaymentMethod("crypto")}
                >
                  <Wallet size={16} /> Crypto Wallet
                </button>
              </div>

              {paymentMethod === "card" && (
                <div className="card-fields-grid">
                  <div className="input-group full-width">
                    <label>Card Number</label>
                    <input type="text" placeholder="4532 •••• •••• 8912" defaultValue="4532 9012 3456 8912" />
                  </div>
                  <div className="input-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" defaultValue="08/29" />
                  </div>
                  <div className="input-group">
                    <label>CVC Security Code</label>
                    <input type="password" placeholder="•••" defaultValue="892" />
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="payment-simulation-box">
                  <QrCode size={64} className="qr-sim" />
                  <span>Scan QR code with any UPI app to authorize ${cartTotal.toFixed(2)}</span>
                </div>
              )}

              {paymentMethod === "crypto" && (
                <div className="payment-simulation-box">
                  <Wallet size={48} className="wallet-sim" />
                  <span>Connected Web3 Wallet: <strong>0x71C...82A9</strong> (USDC / ETH)</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary Col */}
          <div className="checkout-summary-col">
            <div className="checkout-order-summary glass-card">
              <h3>Order Review</h3>
              <div className="mini-item-list">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="mini-checkout-item">
                    <img src={product.images[0]} alt="" />
                    <div className="mini-info">
                      <span className="mini-title">{product.name}</span>
                      <span className="mini-qty-price">Qty: {quantity} × ${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-rows">
                <div className="sum-row">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="sum-row">
                  <span>Drone Delivery</span>
                  <span>FREE</span>
                </div>
                <div className="sum-row total-row">
                  <span>Total Amount</span>
                  <span className="total-val">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-nexus-primary pay-now-btn"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>Authorizing Payment...</>
                ) : (
                  <>Complete Order (${cartTotal.toFixed(2)}) <ArrowRight size={18} /></>
                )}
              </button>

              <div className="checkout-guarantee">
                <ShieldCheck size={16} /> Verified Quantum Security Protocol
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
