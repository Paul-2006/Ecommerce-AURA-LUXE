import React from "react";
import { Link } from "react-router-dom";
import { User, Package, Heart, Sparkles, MapPin, ShieldCheck, ShoppingBag, ArrowRight } from "lucide-react";
import { useShop } from "../../context/ShopContext";
import "../../css/Dashboard.css";

const CustomerDashboard = () => {
  const { orders, wishlist, products } = useShop();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header glass-card">
        <div className="dash-user-info">
          <div className="dash-avatar">
            <User size={32} />
          </div>
          <div>
            <h1>Customer Portal Command</h1>
            <span>Welcome back, Alex Vance • Membership Status: <strong>Cyber Prime VIP</strong></span>
          </div>
        </div>

        <Link to="/products" className="btn-nexus-primary">
          Explore Catalog <ArrowRight size={16} />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card glass-card">
          <div className="metric-icon metric-cyan"><Package size={24} /></div>
          <div>
            <span className="metric-value">{orders.length}</span>
            <span className="metric-label">Active Orders</span>
          </div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-icon metric-pink"><Heart size={24} /></div>
          <div>
            <span className="metric-value">{wishlistedProducts.length}</span>
            <span className="metric-label">Saved Items</span>
          </div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-icon metric-purple"><Sparkles size={24} /></div>
          <div>
            <span className="metric-value">1,420</span>
            <span className="metric-label">Nexus AI Reward Points</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-main-grid">
        {/* Recent Orders */}
        <div className="dash-section-card glass-card">
          <div className="dash-sec-header">
            <h3><Package size={18} /> Recent Order Status</h3>
            <Link to="/orders" className="dash-link">View All</Link>
          </div>

          <div className="recent-orders-list">
            {orders.slice(0, 3).map(order => (
              <div key={order.id} className="dash-order-row">
                <div className="dash-order-left">
                  <strong>{order.id}</strong>
                  <span>{order.date} • {order.items.length} items</span>
                </div>
                <div className="dash-order-right">
                  <span className="status-chip">{order.status}</span>
                  <span className="price-text">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address & AI Profile */}
        <div className="dash-section-card glass-card">
          <div className="dash-sec-header">
            <h3><MapPin size={18} /> Primary Address & Security</h3>
          </div>

          <div className="address-box">
            <strong>742 Evergreen Terrace</strong>
            <span>Cyber City, NY 10001</span>
            <span>United States</span>
          </div>

          <div className="security-status">
            <ShieldCheck size={16} className="check-green" /> 2-Factor Neural Auth Active
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;