import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, Store, ShoppingBag, Truck, Building2, AlertTriangle, CheckSquare, Printer } from "lucide-react";
import "../../css/Dashboard.css";

function AdminReports() {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Generate marketplace level report analytics
    setReportData({
      totalRevenue: 2450000,
      totalOrders: 148,
      completedOrders: 124,
      cancelledOrders: 8,
      activeCustomers: 412,
      activeSellers: 28,
      pendingProductApprovals: 6,
      approvedProducts: 84,
      lowStockSkus: 4,
      onTimeDeliveryRate: 98.2,
      resolvedComplaintsPct: 92.5
    });
  }, []);

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  if (!reportData) return <div className="admin-page-container centered-container"><p>Generating marketplace intelligence reports...</p></div>;

  return (
    <div className="admin-page-container centered-container">
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-primary">Marketplace Executive Analytics</span>
            <h1 style={{ margin: "4px 0 0 0", fontFamily: "Playfair Display, Georgia, serif" }}>Platform Intelligence & Performance Reports</h1>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Comprehensive performance report spanning gross revenue, order fulfillment rates, merchant compliance, and fleet metrics.
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Printer className="w-4 h-4" aria-hidden="true" /> Print Executive Summary
          </button>
        </div>
      </div>

      {/* Summary Highlights */}
      <div className="admin-metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val">{formatPrice(reportData.totalRevenue)}</span>
            <span className="metric-title">Gross Merchandise Value (GMV)</span>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val">{reportData.totalOrders} Transactions</span>
            <span className="metric-title">Order Processing Volume</span>
          </div>
          <ShoppingBag className="w-5 h-5 text-indigo-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val">{reportData.onTimeDeliveryRate}%</span>
            <span className="metric-title">On-Time Delivery Success Rate</span>
          </div>
          <Truck className="w-5 h-5 text-sky-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val">{reportData.resolvedComplaintsPct}%</span>
            <span className="metric-title">Dispute Resolution Rate</span>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />
        </div>
      </div>

      {/* Analytical Report Sections */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Section 1: Merchant & Product Approval Metrics */}
        <div className="glass-panel" style={{ padding: "24px", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <CheckSquare className="w-5 h-5 text-indigo-400" aria-hidden="true" />
            <h3 style={{ margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>Merchant & Product Approvals</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-light)" }}>
              <span>Active Verified Merchants:</span>
              <strong>{reportData.activeSellers} Sellers</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-light)" }}>
              <span>Approved Catalog Products:</span>
              <strong className="text-success">{reportData.approvedProducts} Products</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-light)" }}>
              <span>Pending Product Approval Queue:</span>
              <strong style={{ color: "#f59e0b" }}>{reportData.pendingProductApprovals} Submissions</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
              <span>Catalog Approval Clearance Rate:</span>
              <strong>93.3% Approved</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Warehouse Stock & Fleet Logistics Report */}
        <div className="glass-panel" style={{ padding: "24px", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <Building2 className="w-5 h-5 text-sky-400" aria-hidden="true" />
            <h3 style={{ margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>Warehouse & Fleet Logistics</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-light)" }}>
              <span>Total Successfully Delivered Drops:</span>
              <strong className="text-success">{reportData.completedOrders} Orders</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-light)" }}>
              <span>Order Cancellation Rate:</span>
              <span>5.4% ({reportData.cancelledOrders} Cancelled)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-light)" }}>
              <span>Critical Low-Stock SKUs (&lt; 5):</span>
              <strong style={{ color: "#f59e0b" }}>{reportData.lowStockSkus} SKUs</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
              <span>Average Order Fulfillment Time:</span>
              <strong>34 Minutes (Hub-to-Doorstep)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
