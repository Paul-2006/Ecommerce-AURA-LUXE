import { useEffect, useState } from "react";
import { TrendingUp, BarChart3, Calendar, ShoppingBag, ArrowUpRight, DollarSign } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerAnalytics() {
  const [timeRange, setTimeRange] = useState("30days");
  const [data, setData] = useState(null);

  useEffect(() => {
    // Generate analytics dataset
    setData({
      totalRevenue: 489980,
      totalOrders: 28,
      avgOrderValue: 17499,
      salesGrowth: "+18.4%",
      bestCategory: "Laptops & Computers (62% of GMV)",
      topProduct: "Apple MacBook Pro 16\" M3 Max",
      dailyBreakdown: [
        { day: "Mon", revenue: 45000, orders: 3 },
        { day: "Tue", revenue: 89900, orders: 5 },
        { day: "Wed", revenue: 129990, orders: 7 },
        { day: "Thu", revenue: 65000, orders: 4 },
        { day: "Fri", revenue: 98000, orders: 6 },
        { day: "Sat", revenue: 32000, orders: 2 },
        { day: "Sun", revenue: 30090, orders: 1 }
      ]
    });
  }, [timeRange]);

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  if (!data) return <div className="seller-page-container"><p>Loading sales analytics...</p></div>;

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <span className="badge-pill badge-secondary">Business Telemetry</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Merchant Sales Analytics & Growth Telemetry</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Track revenue velocity, order volumes, average basket sizes, and category sales performance over time.
            </p>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {[
              { label: "Today", val: "today" },
              { label: "7 Days", val: "7days" },
              { label: "30 Days", val: "30days" },
              { label: "This Year", val: "year" }
            ].map((f) => (
              <button
                key={f.val}
                type="button"
                className={`btn ${timeRange === f.val ? "btn-primary" : "btn-outline"} btn-sm`}
                onClick={() => setTimeRange(f.val)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="seller-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val">{formatPrice(data.totalRevenue)}</span>
            <span className="metric-title">Gross Revenue ({timeRange})</span>
          </div>
          <TrendingUp className="w-5 h-5" style={{ color: "var(--seller-success)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val">{data.totalOrders} Orders</span>
            <span className="metric-title">Order Processing Volume</span>
          </div>
          <ShoppingBag className="w-5 h-5" style={{ color: "var(--seller-secondary)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val">{formatPrice(data.avgOrderValue)}</span>
            <span className="metric-title">Average Order Value (AOV)</span>
          </div>
          <DollarSign className="w-5 h-5" style={{ color: "var(--seller-secondary)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--seller-success)" }}>{data.salesGrowth}</span>
            <span className="metric-title">Growth vs Previous Period</span>
          </div>
          <ArrowUpRight className="w-5 h-5" style={{ color: "var(--seller-success)" }} aria-hidden="true" />
        </div>
      </div>

      {/* Visual Revenue Breakdown & Top Categories */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ margin: "0 0 16px 0" }}>Daily Sales Revenue Trend</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {data.dailyBreakdown.map((item) => (
              <div key={item.day} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "40px", fontSize: "0.85rem", fontWeight: 700, color: "var(--seller-primary)" }}>{item.day}</span>
                <div style={{ flex: 1, height: "12px", background: "var(--seller-surface-alt)", borderRadius: "6px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(item.revenue / 130000) * 100}%`, background: "var(--seller-secondary)", borderRadius: "6px" }} />
                </div>
                <strong style={{ fontSize: "0.85rem", minWidth: "90px", textAlign: "right" }}>{formatPrice(item.revenue)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ margin: "0 0 16px 0" }}>Top Performing Catalog Items</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.9rem" }}>
            <div style={{ borderBottom: "1px solid var(--seller-border)", paddingBottom: "10px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--seller-text-secondary)" }}>#1 Top Seller:</span>
              <strong style={{ display: "block", color: "var(--seller-primary)", marginTop: "2px" }}>{data.topProduct}</strong>
              <span style={{ fontSize: "0.8rem", color: "var(--seller-success)" }}>14 Units Sold • ₹ 34,99,980 GMV</span>
            </div>

            <div style={{ borderBottom: "1px solid var(--seller-border)", paddingBottom: "10px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--seller-text-secondary)" }}>#2 Top Category:</span>
              <strong style={{ display: "block", color: "var(--seller-primary)", marginTop: "2px" }}>{data.bestCategory}</strong>
            </div>

            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--seller-text-secondary)" }}>Merchant Fulfillment SLA:</span>
              <strong style={{ display: "block", color: "var(--seller-success)", marginTop: "2px" }}>98.6% On-Time Fulfillment</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerAnalytics;
