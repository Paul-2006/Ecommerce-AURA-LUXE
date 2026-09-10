import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, Store, ShoppingBag, Truck, Building2, AlertTriangle, CheckSquare, Printer } from "lucide-react";
import "../../css/AdminPortal.css";

function AdminReports() {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
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

  if (!reportData) return <div className="admin-page-container"><p>Generating marketplace intelligence reports...</p></div>;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Marketplace Executive Analytics</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Platform Intelligence & Performance Reports</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Comprehensive performance report spanning gross revenue, order fulfillment rates, merchant compliance, and fleet metrics.
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" aria-hidden="true" /> Print Executive Summary
          </button>
        </div>
      </div>

      {/* Summary Highlights */}
      <div className="admin-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val">{formatPrice(reportData.totalRevenue)}</span>
            <span className="metric-title">Gross Merchandise Value (GMV)</span>
          </div>
          <TrendingUp className="w-5 h-5" style={{ color: "var(--admin-success)" }} aria-hidden="true" />
        </div>

        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val">{reportData.totalOrders} Transactions</span>
            <span className="metric-title">Order Processing Volume</span>
          </div>
          <ShoppingBag className="w-5 h-5" style={{ color: "var(--admin-secondary)" }} aria-hidden="true" />
        </div>

        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val">{reportData.onTimeDeliveryRate}% Rate</span>
            <span className="metric-title">Fleet On-Time SLA</span>
          </div>
          <Truck className="w-5 h-5" style={{ color: "var(--admin-secondary)" }} aria-hidden="true" />
        </div>

        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val">{reportData.resolvedComplaintsPct}%</span>
            <span className="metric-title">Dispute Resolution Rate</span>
          </div>
          <BarChart3 className="w-5 h-5" style={{ color: "var(--admin-success)" }} aria-hidden="true" />
        </div>
      </div>

      {/* Detailed Breakdown Card Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <Users className="w-4 h-4" style={{ color: "var(--admin-secondary)" }} /> User Directory & Account Stats
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--admin-border)", paddingBottom: "8px" }}>
              <span>Registered Customer Accounts:</span>
              <strong style={{ color: "var(--admin-primary)" }}>{reportData.activeCustomers}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--admin-border)", paddingBottom: "8px" }}>
              <span>Approved Merchants & Sellers:</span>
              <strong style={{ color: "var(--admin-primary)" }}>{reportData.activeSellers}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Platform Clearance Rate:</span>
              <span className="badge-pill badge-success">96.4% Compliance</span>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckSquare className="w-4 h-4" style={{ color: "var(--admin-secondary)" }} /> Catalog & Quality Controls
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--admin-border)", paddingBottom: "8px" }}>
              <span>Active Approved Catalog Items:</span>
              <strong style={{ color: "var(--admin-primary)" }}>{reportData.approvedProducts}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--admin-border)", paddingBottom: "8px" }}>
              <span>Pending Product Approvals:</span>
              <strong style={{ color: "var(--admin-warning)" }}>{reportData.pendingProductApprovals} Pending</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Low Stock Warning SKUs:</span>
              <span className="badge-pill badge-warning">{reportData.lowStockSkus} SKUs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
