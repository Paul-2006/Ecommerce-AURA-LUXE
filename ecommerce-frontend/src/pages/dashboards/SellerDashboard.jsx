import React from "react";
import { Link } from "react-router-dom";
import { Store, PlusCircle, DollarSign, Package, TrendingUp, Sparkles, Edit, Trash2 } from "lucide-react";
import { useShop } from "../../context/ShopContext";
import "../../css/Dashboard.css";

const SellerDashboard = () => {
  const { products, setProducts, showToast } = useShop();

  const totalInventory = products.reduce((sum, p) => sum + (p.stock || 10), 0);
  const totalValuation = products.reduce((sum, p) => sum + p.price * (p.stock || 10), 0);

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Item removed from store inventory", "info");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header glass-card">
        <div className="dash-user-info">
          <div className="dash-avatar avatar-purple">
            <Store size={32} />
          </div>
          <div>
            <h1>Seller Studio & Analytics</h1>
            <span>Store: <strong>CyberTech Global Official</strong></span>
          </div>
        </div>

        <Link to="/seller/add-product" className="btn-nexus-purple">
          <PlusCircle size={18} /> Add Product (AI Copy)
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card glass-card">
          <div className="metric-icon metric-purple"><DollarSign size={24} /></div>
          <div>
            <span className="metric-value">${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="metric-label">Total Store Inventory Value</span>
          </div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-icon metric-cyan"><Package size={24} /></div>
          <div>
            <span className="metric-value">{products.length}</span>
            <span className="metric-label">Active Listed Products</span>
          </div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-icon metric-emerald"><TrendingUp size={24} /></div>
          <div>
            <span className="metric-value">+28.4%</span>
            <span className="metric-label">Monthly Revenue Growth</span>
          </div>
        </div>
      </div>

      {/* Sales Graph Visual Simulation */}
      <div className="dash-section-card glass-card">
        <div className="dash-sec-header">
          <h3><TrendingUp size={18} /> Sales Revenue Visualizer</h3>
          <span className="nexus-badge nexus-badge-purple"><Sparkles size={12} /> AI Forecast</span>
        </div>

        <div className="sales-chart-simulation">
          <div className="chart-bar-col">
            <div className="bar-fill" style={{ height: '40%' }}></div>
            <span>Mon</span>
          </div>
          <div className="chart-bar-col">
            <div className="bar-fill" style={{ height: '65%' }}></div>
            <span>Tue</span>
          </div>
          <div className="chart-bar-col">
            <div className="bar-fill" style={{ height: '55%' }}></div>
            <span>Wed</span>
          </div>
          <div className="chart-bar-col">
            <div className="bar-fill" style={{ height: '85%' }}></div>
            <span>Thu</span>
          </div>
          <div className="chart-bar-col">
            <div className="bar-fill" style={{ height: '70%' }}></div>
            <span>Fri</span>
          </div>
          <div className="chart-bar-col">
            <div className="bar-fill high-fill" style={{ height: '100%' }}></div>
            <span>Sat</span>
          </div>
          <div className="chart-bar-col">
            <div className="bar-fill" style={{ height: '90%' }}></div>
            <span>Sun</span>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="dash-section-card glass-card">
        <div className="dash-sec-header">
          <h3>Manage Inventory ({products.length})</h3>
        </div>

        <div className="inventory-table-scroll">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="inv-prod-cell">
                      <img src={p.images[0]} alt="" />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td><span className="inv-cat-pill">{p.category}</span></td>
                  <td><strong>${p.price.toFixed(2)}</strong></td>
                  <td>{p.stock || 15} units</td>
                  <td>⭐ {p.rating}</td>
                  <td>
                    <button 
                      className="inv-action-btn delete-inv"
                      onClick={() => handleDeleteProduct(p.id)}
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
