import React, { useState } from "react";
import { ShieldAlert, Users, Store, DollarSign, Activity, Check, X } from "lucide-react";
import { useShop } from "../../context/ShopContext";
import "../../css/Dashboard.css";

const AdminDashboard = () => {
  const { showToast } = useShop();

  const [pendingSellers, setPendingSellers] = useState([
    { id: 1, name: "Quantum Optics Lab", email: "contact@quantumoptics.io", category: "AR Glasses" },
    { id: 2, name: "Aura Health Systems", email: "info@auraring.com", category: "Biometrics" }
  ]);

  const handleApproveSeller = (id, name) => {
    setPendingSellers(prev => prev.filter(s => s.id !== id));
    showToast(`Seller "${name}" approved & granted store access! Checkmark 🎉`);
  };

  const handleRejectSeller = (id) => {
    setPendingSellers(prev => prev.filter(s => s.id !== id));
    showToast("Application rejected", "info");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header glass-card">
        <div className="dash-user-info">
          <div className="dash-avatar avatar-pink">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h1>Admin Command Center</h1>
            <span>System Role: <strong>Super Admin Administrator</strong></span>
          </div>
        </div>

        <div className="sys-status-badge">
          <Activity size={16} className="activity-green" /> AI Core Health: 99.9%
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card glass-card">
          <div className="metric-icon metric-cyan"><DollarSign size={24} /></div>
          <div>
            <span className="metric-value">$1,489,200.00</span>
            <span className="metric-label">Gross Marketplace Volume</span>
          </div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-icon metric-purple"><Users size={24} /></div>
          <div>
            <span className="metric-value">42,890</span>
            <span className="metric-label">Active Platform Users</span>
          </div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-icon metric-pink"><Store size={24} /></div>
          <div>
            <span className="metric-value">384</span>
            <span className="metric-label">Verified Cyber Sellers</span>
          </div>
        </div>
      </div>

      {/* Seller Approval Moderation */}
      <div className="dash-section-card glass-card">
        <div className="dash-sec-header">
          <h3>Pending Seller Approvals ({pendingSellers.length})</h3>
        </div>

        {pendingSellers.length === 0 ? (
          <p className="no-pending-text">All seller applications processed and up to date!</p>
        ) : (
          <div className="pending-sellers-list">
            {pendingSellers.map(seller => (
              <div key={seller.id} className="pending-seller-row">
                <div className="seller-details">
                  <strong>{seller.name}</strong>
                  <span>{seller.email} • Focus: {seller.category}</span>
                </div>
                <div className="approval-actions">
                  <button 
                    className="approve-btn"
                    onClick={() => handleApproveSeller(seller.id, seller.name)}
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleRejectSeller(seller.id)}
                  >
                    <X size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
