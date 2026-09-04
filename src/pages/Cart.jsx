import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getCart, removeCart, updateCart } from "../services/cartService";
import "../css/Cart.css";

function Cart() {
  const navigate = useNavigate();
  const { updateCounts } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const cartId = localStorage.getItem("cartId") || 1;
      const res = await getCart(cartId);
      setCartItems(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    await updateCart(itemId, newQty);
    setCartItems((prev) =>
      prev.map((i) => (i.cartItemId === itemId ? { ...i, quantity: newQty } : i))
    );
    updateCounts();
  };

  const handleRemove = async (itemId) => {
    await removeCart(itemId);
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== itemId));
    updateCounts();
  };

  const applyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "WEBSAVE2026" || couponCode.toUpperCase() === "KADAISAVE") {
      setDiscountPercent(10);
      setCouponMsg("Voucher applied: 10% Instant Discount verified.");
    } else {
      setDiscountPercent(0);
      setCouponMsg("Invalid voucher code. Try 'WEBSAVE2026'");
    }
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 999) * (item.quantity || 1),
    0
  );
  const discount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 1000 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.18);
  const grandTotal = subtotal - discount + shipping + tax;

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amt);

  return (
    <div className="cart-page-container centered-container">
      {/* Centered Page Header */}
      <div className="page-header center-content">
        <span className="badge-pill badge-primary">Order Review</span>
        <h1>Shopping Cart</h1>
        <p>Review items, apply promo vouchers, and proceed to checkout.</p>
      </div>

      {loading ? (
        <div className="loading-grid glass-panel center-content">
          <div className="loader-spinner"></div>
          <p>Loading cart items...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="empty-cart-card glass-panel center-content">
          <h2>Your Cart is Currently Empty</h2>
          <p>Explore our marketplace catalog and add items you need.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="cart-layout-grid">
          {/* Left Column: Cart Items List */}
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="cart-item-card glass-panel">
                <img
                  src={
                    item.image
                      ? item.image.startsWith("http")
                        ? item.image
                        : `http://localhost:5151${item.image}`
                      : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80"
                  }
                  alt={item.productName}
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80";
                  }}
                />

                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.productName}</h3>
                  <p className="cart-item-unit-price">{formatPrice(item.price || 999)} / unit</p>

                  <div className="cart-item-controls">
                    <div className="quantity-stepper">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => handleUpdateQty(item.cartItemId, (item.quantity || 1) - 1)}
                      >
                        -
                      </button>
                      <span className="qty-value">{item.quantity || 1}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => handleUpdateQty(item.cartItemId, (item.quantity || 1) + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="btn btn-danger btn-sm remove-cart-btn"
                      onClick={() => handleRemove(item.cartItemId)}
                      title="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  <span className="total-label">Subtotal</span>
                  <span className="total-val">
                    {formatPrice((item.price || 999) * (item.quantity || 1))}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary Box */}
          <div className="cart-summary-box glass-panel">
            <h2>Order Summary</h2>

            {/* Promo Code Form */}
            <form className="coupon-form" onSubmit={applyCoupon}>
              <input
                type="text"
                placeholder="Voucher Code (WEBSAVE2026)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                Apply
              </button>
            </form>
            {couponMsg && <p className="coupon-feedback">{couponMsg}</p>}

            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="summary-row text-success">
                  <span>Voucher Discount (10%)</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? <strong className="text-success">FREE</strong> : formatPrice(shipping)}</span>
              </div>

              <div className="summary-row">
                <span>GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>

              <hr className="summary-divider" />

              <div className="summary-row grand-total-row">
                <strong>Grand Total</strong>
                <strong className="grand-total-val">{formatPrice(grandTotal)}</strong>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg btn-block checkout-trigger-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <p className="summary-guarantee-note">
              100% Genuine Certified Hardware • Encrypted Payment Gateway
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;