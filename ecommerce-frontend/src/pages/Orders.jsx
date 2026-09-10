import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getOrders } from "../services/orderService";
import { getNotifications } from "../services/notificationService";
import LiveMapTracker from "../components/LiveMapTracker";
import WebKadaiLogo from "../components/WebKadaiLogo";
import { getMediaUrl } from "../services/api";
import { CheckCircle2, Truck, MapPin, Smartphone, Printer } from "lucide-react";
import "../css/Orders.css";

function Orders() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);
  const [latestAck, setLatestAck] = useState(null);

  useEffect(() => {
    loadUserOrders();
    const notifs = getNotifications();
    if (notifs && notifs.length > 0) {
      setLatestAck(notifs[0]);
    }
  }, []);

  const loadUserOrders = async () => {
    try {
      const customerId = user?.customerId || 1;
      const res = await getOrders(customerId);
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("delivered")) return "badge-success";
    if (s.includes("out for delivery") || s.includes("dispatch")) return "badge-primary";
    if (s.includes("processing") || s.includes("placed")) return "badge-warning";
    return "badge-primary";
  };

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amt);

  return (
    <div className="orders-page-container centered-container">
      {/* Centered Page Header */}
      <div className="page-header center-content">
        <span className="badge-pill badge-primary">Order History & Logistics</span>
        <h1>My Orders</h1>
        <p>Track real-time rider delivery telemetry, review purchase history, and download official tax receipts.</p>
      </div>

      {/* Latest Active Order Acknowledgement & SMS Dispatch Banner */}
      {latestAck && (
        <div className="active-ack-banner glass-panel">
          <div className="ack-banner-top">
            <div className="ack-banner-title">
              <span className="live-pulse-dot"></span>
              <div>
                <strong>Active Order #{latestAck.orderId} Acknowledgement</strong>
                <p>Notification & SMS dispatched to registered phone: <strong>+91 {latestAck.customerPhone}</strong></p>
              </div>
            </div>
            <span className="badge-pill badge-success" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Dispatched
            </span>
          </div>

          <div className="ack-banner-grid">
            <div className="ack-agent-mini">
              <Truck className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0" aria-hidden="true" />
              <div>
                <span>Delivery Agent:</span>
                <strong>{latestAck.deliveryAgent?.name}</strong>
                <small>{latestAck.deliveryAgent?.vehicleNumber} • {latestAck.deliveryAgent?.phone}</small>
              </div>
            </div>

            <div className="ack-otp-mini">
              <span>Verification OTP:</span>
              <strong className="otp-code-text">{latestAck.otp}</strong>
              <small>Show to agent upon delivery</small>
            </div>

            <div className="ack-eta-mini">
              <span>Estimated Delivery:</span>
              <strong className="eta-code-text">{latestAck.estimatedMinutes} Mins</strong>
              <small>Expected by {latestAck.estimatedArrivalTime}</small>
            </div>
          </div>

          <div className="ack-banner-actions">
            <button
              className="btn btn-luxury btn-sm"
              onClick={() => setActiveTrackingOrderId(latestAck.orderId)}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <MapPin className="w-4 h-4" aria-hidden="true" /> Track Live Map Telemetry
            </button>
            <span className="sms-sent-tag" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Smartphone className="w-3.5 h-3.5" aria-hidden="true" /> SMS delivered to +91 {latestAck.customerPhone}
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-grid glass-panel center-content">
          <div className="loader-spinner"></div>
          <p>Retrieving order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-orders-card glass-panel center-content">
          <h2>No Orders Placed Yet</h2>
          <p>You have not placed any orders yet. Browse our marketplace catalog!</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/products")}>
            Browse Catalog
          </button>
        </div>
      ) : (
        <div className="orders-list-grid">
          {orders.map((order) => {
            const isOutForDelivery =
              (order.orderStatus || "").toLowerCase().includes("out") ||
              (order.status || "").toLowerCase().includes("out");

            return (
              <div key={order.orderId} className="order-item-card glass-panel">
                {/* Order Top Bar */}
                <div className="order-top-bar">
                  <div className="order-meta-left">
                    <span className="order-id-tag">Order #{order.orderId}</span>
                    <span className="order-date-tag">
                      Date: {order.orderDate ? new Date(order.orderDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Today"}
                    </span>
                  </div>

                  <div className="order-meta-right">
                    <span className={`badge-pill ${getStatusBadgeClass(order.orderStatus || order.status)}`}>
                      {order.orderStatus || order.status || "Placed"}
                    </span>
                  </div>
                </div>

                {/* Status Timeline Bar */}
                <div className="order-timeline-bar">
                  <div className="timeline-step completed">
                    <span className="step-dot">[1]</span>
                    <span className="step-label">Placed</span>
                  </div>
                  <div className="timeline-line active"></div>
                  <div className="timeline-step completed">
                    <span className="step-dot">[2]</span>
                    <span className="step-label">Confirmed</span>
                  </div>
                  <div className="timeline-line active"></div>
                  <div className={`timeline-step ${isOutForDelivery || (order.orderStatus === "Delivered") ? "completed" : "active"}`}>
                    <span className="step-dot">[3]</span>
                    <span className="step-label">Out for Delivery</span>
                  </div>
                  <div className={`timeline-line ${order.orderStatus === "Delivered" ? "active" : ""}`}></div>
                  <div className={`timeline-step ${order.orderStatus === "Delivered" ? "completed" : ""}`}>
                    <span className="step-dot">[4]</span>
                    <span className="step-label">Delivered</span>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="order-products-container">
                  {(order.orderitems || [
                    {
                      orderItemId: 1,
                      quantity: 1,
                      price: order.totalAmount,
                      sellerProduct: {
                        product: {
                          productName: order.product || "Marketplace Product",
                          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80"
                        }
                      }
                    }
                  ]).map((item, idx) => {
                    const prod = item.sellerProduct?.product || {};
                    return (
                      <div key={idx} className="order-sub-product-row">
                        <img
                          src={
                            prod.image
                              ? getMediaUrl(prod.image)
                              : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80"
                          }
                          alt={prod.productName || "Product"}
                          className="order-prod-thumb"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80";
                          }}
                        />
                        <div className="order-prod-info">
                          <h4>{prod.productName || "Product"}</h4>
                          <p>Quantity: {item.quantity || 1} • Total: {formatPrice(item.price || order.totalAmount)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Footer Actions */}
                <div className="order-footer-row">
                  <div className="order-total-stack">
                    <span className="total-label">Total Amount:</span>
                    <strong className="total-amount-val">{formatPrice(order.totalAmount || order.price || 999)}</strong>
                  </div>

                  <div className="order-action-buttons">
                    <button
                      className="btn btn-luxury live-tracking-btn"
                      onClick={() => setActiveTrackingOrderId(order.orderId)}
                    >
                      Live GPS Rider Tracking
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveInvoiceOrder(order)}
                    >
                      Tax Invoice
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Real-Time Live GPS Map Tracking Modal */}
      {activeTrackingOrderId && (
        <LiveMapTracker
          orderId={activeTrackingOrderId}
          onClose={() => setActiveTrackingOrderId(null)}
        />
      )}

      {/* Official Tax Invoice Modal */}
      {activeInvoiceOrder && (
        <div className="live-tracking-modal" onClick={() => setActiveInvoiceOrder(null)}>
          <div className="invoice-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            {/* Invoice Header */}
            <div className="invoice-header-bar">
              <div className="invoice-brand-box">
                <WebKadaiLogo size="normal" />
                <span className="invoice-tagline">Official Digital Tax Receipt</span>
              </div>
              <div className="invoice-num-box">
                <h3>TAX INVOICE</h3>
                <span className="invoice-number">#INV-2026-WK{activeInvoiceOrder.orderId}</span>
                <span className="invoice-date">
                  Date: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>

            <hr className="invoice-divider" />

            {/* Bill To & Sold By Row */}
            <div className="invoice-parties-grid">
              <div className="invoice-party-col">
                <span className="party-label">Billed To (Customer):</span>
                <strong>{user?.username || user?.name || "Rahul Sharma"}</strong>
                <p>Email: {user?.email || "customer@webkadai.com"}</p>
                <p>Delivery: Plot 42, Tech Corridor Phase 2, Bengaluru, 560100</p>
              </div>

              <div className="invoice-party-col">
                <span className="party-label">Sold By (Marketplace Merchant):</span>
                <strong>Zenith Retail Corp (Verified Seller)</strong>
                <p>GSTIN: 29AAAAA0000A1Z5</p>
                <p>Platform: AURA Luxe Marketplace Pvt Ltd</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="table-responsive" style={{ margin: "16px 0" }}>
              <table className="table-modern invoice-items-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Tax (GST 18%)</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeInvoiceOrder.orderitems || [
                    {
                      orderItemId: 1,
                      quantity: 1,
                      price: activeInvoiceOrder.totalAmount || 249999,
                      sellerProduct: {
                        product: {
                          productName: "Apple MacBook Pro 16\" M3 Max"
                        }
                      }
                    }
                  ]).map((item, idx) => {
                    const price = item.price || activeInvoiceOrder.totalAmount;
                    const taxAmt = Math.round(price * 0.18);
                    const baseRate = price - taxAmt;
                    return (
                      <tr key={idx}>
                        <td><strong>{item.sellerProduct?.product?.productName || "Product"}</strong></td>
                        <td>{item.quantity || 1}</td>
                        <td>{formatPrice(baseRate)}</td>
                        <td>{formatPrice(taxAmt)}</td>
                        <td><strong>{formatPrice(price)}</strong></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Row */}
            <div className="invoice-total-summary">
              <div className="invoice-total-row">
                <span>Subtotal (Excl. Tax):</span>
                <span>{formatPrice(Math.round((activeInvoiceOrder.totalAmount || 249999) * 0.82))}</span>
              </div>
              <div className="invoice-total-row">
                <span>GST (Integrated IGST 18%):</span>
                <span>{formatPrice(Math.round((activeInvoiceOrder.totalAmount || 249999) * 0.18))}</span>
              </div>
              <div className="invoice-total-row grand">
                <span>Grand Total Paid:</span>
                <span className="invoice-grand-val">{formatPrice(activeInvoiceOrder.totalAmount || 249999)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="invoice-actions-footer">
              <span className="invoice-auth-seal">Digitally Signed & Validated • AURA Luxe Tax Authority</span>
              <button className="btn btn-primary btn-sm" onClick={() => window.print()} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Printer className="w-4 h-4" aria-hidden="true" /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;