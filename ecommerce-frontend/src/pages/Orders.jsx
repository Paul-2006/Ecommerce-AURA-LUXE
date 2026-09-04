import React from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  MapPin, 
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import "../css/Orders.css";

const Orders = () => {
  const { orders } = useShop();

  const getStatusStepClass = (currentCode, stepCode) => {
    if (currentCode > stepCode) return "step-completed";
    if (currentCode === stepCode) return "step-active";
    return "step-pending";
  };

  return (
    <div className="orders-page-container">
      <div className="orders-header">
        <h1 className="orders-title">Track & Manage Orders ({orders.length})</h1>
        <p className="orders-sub">Real-time drone dispatch & courier tracking updates</p>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty-card glass-card">
          <Package size={56} className="empty-pkg-icon" />
          <h2>No Past Orders Placed Yet</h2>
          <p>Once you make a purchase, your real-time shipment map and courier updates will appear here.</p>
          <Link to="/products" className="btn-nexus-primary">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="orders-list-col">
          {orders.map(order => (
            <div key={order.id} className="order-item-card glass-card">
              {/* Order Top Summary Header */}
              <div className="order-card-header">
                <div className="order-id-group">
                  <span className="order-ref-code">{order.id}</span>
                  <span className="order-date-text">Placed on {order.date}</span>
                </div>

                <div className="order-status-badge">
                  <Sparkles size={14} className="sparkle-cyan" />
                  <span>{order.status}</span>
                </div>
              </div>

              {/* Step-by-Step Shipment Tracking Pipeline */}
              <div className="shipment-pipeline-card">
                <div className="pipeline-steps">
                  <div className={`pipeline-step ${getStatusStepClass(order.statusCode, 1)}`}>
                    <div className="step-circle"><CheckCircle2 size={16} /></div>
                    <span>Order Placed</span>
                  </div>

                  <div className="pipeline-line"></div>

                  <div className={`pipeline-step ${getStatusStepClass(order.statusCode, 2)}`}>
                    <div className="step-circle"><Package size={16} /></div>
                    <span>Packed & QC</span>
                  </div>

                  <div className="pipeline-line"></div>

                  <div className={`pipeline-step ${getStatusStepClass(order.statusCode, 3)}`}>
                    <div className="step-circle"><Truck size={16} /></div>
                    <span>Out for Delivery</span>
                  </div>

                  <div className="pipeline-line"></div>

                  <div className={`pipeline-step ${getStatusStepClass(order.statusCode, 4)}`}>
                    <div className="step-circle"><CheckCircle2 size={16} /></div>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>

              {/* Items & Shipping Details */}
              <div className="order-card-body">
                <div className="order-items-grid">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-prod-row">
                      <img src={item.image} alt={item.name} />
                      <div className="order-prod-info">
                        <span className="prod-title">{item.name}</span>
                        <span className="prod-qty-price">Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-meta-info">
                  <div className="meta-line">
                    <MapPin size={14} className="meta-icon" />
                    <span>{order.shippingAddress}</span>
                  </div>
                  <div className="meta-line">
                    <Truck size={14} className="meta-icon" />
                    <span>Tracking Number: <strong>{order.trackingId}</strong></span>
                  </div>
                  <div className="meta-line">
                    <Clock size={14} className="meta-icon" />
                    <span>Estimated Arrival: <strong>{order.estimatedDelivery}</strong></span>
                  </div>
                  <div className="order-total-badge">
                    <span>Total: <strong>${order.total.toFixed(2)}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;