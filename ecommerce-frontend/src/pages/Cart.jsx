import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import "../css/Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart, showToast } = useShop();

  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "NEXUS10") {
      const disc = cartTotal * 0.1;
      setDiscountAmount(disc);
      setAppliedCoupon("NEXUS10 (10% OFF)");
      showToast("10% Cyber Discount Applied!");
    } else if (couponCode.toUpperCase() === "AI2026") {
      const disc = cartTotal * 0.15;
      setDiscountAmount(disc);
      setAppliedCoupon("AI2026 (15% OFF)");
      showToast("15% AI Special Discount Applied!");
    } else {
      showToast("Invalid Coupon Code. Try 'NEXUS10' or 'AI2026'", "error");
    }
    setCouponCode("");
  };

  const grandTotal = Math.max(0, cartTotal - discountAmount);

  return (
    <div className="cart-page-container">
      <div className="cart-header-row">
        <h1 className="cart-title">Your Cyber Cart ({cart.length} items)</h1>
        <Link to="/products" className="back-link">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty-card glass-card">
          <ShoppingBag size={56} className="empty-cart-icon" />
          <h2>Your Cart is Empty</h2>
          <p>Explore our catalog to add state-of-the-art AR glasses, gaming gear, and wearables.</p>
          <Link to="/products" className="btn-nexus-primary">
            Browse Products <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="cart-grid-layout">
          {/* Cart Items List */}
          <div className="cart-items-col">
            {/* Free Shipping Progress Bar */}
            <div className="shipping-progress-card glass-card">
              <div className="progress-text-row">
                <Truck size={18} className="truck-cyan" />
                {cartTotal >= freeShippingThreshold ? (
                  <span className="unlocked-text"><CheckCircle2 size={16} /> Free Express Courier Unlocked!</span>
                ) : (
                  <span>Add <strong>${(freeShippingThreshold - cartTotal).toFixed(2)}</strong> more to unlock Free Express Courier</span>
                )}
              </div>
              <div className="shipping-progress-bar">
                <div className="shipping-progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            {/* List */}
            <div className="cart-items-list">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="cart-item-row glass-card">
                  <img src={product.images[0]} alt={product.name} className="cart-item-img" />

                  <div className="cart-item-details">
                    <span className="cart-item-cat">{product.category}</span>
                    <Link to={`/product/${product.id}`} className="cart-item-title">
                      {product.name}
                    </Link>
                    <span className="cart-item-price">${product.price.toFixed(2)}</span>
                  </div>

                  <div className="cart-item-qty">
                    <div className="qty-picker">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)}>-</button>
                      <span>{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
                    </div>
                  </div>

                  <div className="cart-item-subtotal">
                    <span className="subtotal-val">${(product.price * quantity).toFixed(2)}</span>
                    <button 
                      className="trash-btn"
                      onClick={() => removeFromCart(product.id)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="cart-summary-col">
            <div className="summary-card glass-card">
              <h3>Order Summary</h3>

              {/* Coupon Form */}
              <form className="coupon-form" onSubmit={handleApplyCoupon}>
                <div className="coupon-input-box">
                  <Tag size={16} className="tag-icon" />
                  <input 
                    type="text" 
                    placeholder="Enter Coupon (e.g. NEXUS10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-nexus-outline">Apply</button>
              </form>

              {appliedCoupon && (
                <div className="applied-coupon-pill">
                  <CheckCircle2 size={14} /> Coupon Applied: {appliedCoupon}
                </div>
              )}

              <div className="summary-rows">
                <div className="sum-row">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="sum-row discount-row">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="sum-row">
                  <span>Shipping</span>
                  <span>{cartTotal >= freeShippingThreshold ? "FREE" : "$15.00"}</span>
                </div>
                <div className="sum-row total-row">
                  <span>Total</span>
                  <span className="total-val">${(grandTotal + (cartTotal >= freeShippingThreshold ? 0 : 15)).toFixed(2)}</span>
                </div>
              </div>

              <button 
                className="btn-nexus-primary checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div className="checkout-guarantee">
                <ShieldCheck size={16} /> 256-Bit Encrypted Secure Checkout
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;