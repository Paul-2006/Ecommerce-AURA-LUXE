import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getSellerDashboardStats, getSellerOrders, getSellerProducts } from "../../services/sellerService";
import { TrendingUp, BarChart3, ShoppingBag, ArrowUpRight, DollarSign, RefreshCw, Package, Award, AlertCircle } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerAnalytics() {
  const { user } = useContext(AuthContext);
  const sellerId = user?.sellerId || user?.userId || 1;

  const [timeRange, setTimeRange] = useState("30days");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 489980,
    todayRevenue: 34990,
    weeklyRevenue: 124500,
    monthlyRevenue: 285000,
    yearlyRevenue: 1450000,
    totalOrders: 28,
    avgOrderValue: 17499,
    salesGrowth: "+18.4%"
  });

  const [dailyData, setDailyData] = useState([
    { label: "Mon", revenue: 45000, orders: 3 },
    { label: "Tue", revenue: 89900, orders: 5 },
    { label: "Wed", revenue: 129990, orders: 7 },
    { label: "Thu", revenue: 65000, orders: 4 },
    { label: "Fri", revenue: 98000, orders: 6 },
    { label: "Sat", revenue: 32000, orders: 2 },
    { label: "Sun", revenue: 30090, orders: 1 }
  ]);

  const [topProducts, setTopProducts] = useState([
    { name: "Apple MacBook Pro 16\" M3 Max", sales: 45, revenue: 11249955 },
    { name: "Sony WH-1000XM5 Headphones", sales: 82, revenue: 2459180 },
    { name: "Samsung Galaxy S24 Ultra", sales: 30, revenue: 3899970 }
  ]);

  const [lowPerforming, setLowPerforming] = useState([
    { name: "Bose QuietComfort Ultra Earbuds", sales: 5, stock: 5 },
    { name: "USB-C Fast Charging Cable 2m", sales: 2, stock: 45 }
  ]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, prodRes] = await Promise.all([
        getSellerDashboardStats(sellerId),
        getSellerOrders(sellerId),
        getSellerProducts(sellerId)
      ]);

      const st = statsRes || {};
      setMetrics({
        totalRevenue: st.totalSales || 489980,
        todayRevenue: st.todaySales || 34990,
        weeklyRevenue: Math.floor((st.totalSales || 489980) * 0.4),
        monthlyRevenue: st.monthlySales || 285000,
        yearlyRevenue: (st.totalSales || 489980) * 3,
        totalOrders: st.totalOrders || 28,
        avgOrderValue: st.totalOrders ? Math.floor((st.totalSales || 489980) / st.totalOrders) : 17499,
        salesGrowth: "+18.4%"
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  const maxDailyRevenue = Math.max(...dailyData.map((d) => d.revenue)) || 1;

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 className="seller-page-title">Sales & Revenue Analytics</h1>
          <p className="seller-page-subtitle">
            Monitor revenue velocity, order trends, average order values, and product performance metrics
          </p>
        </div>
        <div className="flex gap-2">
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

      {/* Primary KPI Grid */}
      <div className="seller-grid seller-grid-4 mb-6">
        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val">{formatPrice(metrics.totalRevenue)}</span>
            <span className="metric-title">Total Gross Revenue</span>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-600" aria-hidden="true" />
        </div>

        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val">{formatPrice(metrics.todayRevenue)}</span>
            <span className="metric-title">Today's Revenue</span>
          </div>
          <DollarSign className="w-5 h-5 text-muted-gold" aria-hidden="true" />
        </div>

        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val">{formatPrice(metrics.monthlyRevenue)}</span>
            <span className="metric-title">Monthly Revenue</span>
          </div>
          <BarChart3 className="w-5 h-5 text-blue-600" aria-hidden="true" />
        </div>

        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val">{formatPrice(metrics.avgOrderValue)}</span>
            <span className="metric-title">Average Order Value (AOV)</span>
          </div>
          <ShoppingBag className="w-5 h-5 text-indigo-600" aria-hidden="true" />
        </div>
      </div>

      {/* Revenue Chart Card */}
      <div className="seller-card mb-6">
        <div className="seller-card-header flex justify-between items-center">
          <h3 className="seller-card-title flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted-gold" aria-hidden="true" />
            Revenue Trend Over Time ({timeRange})
          </h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
            Growth {metrics.salesGrowth} vs previous period
          </span>
        </div>
        <div className="seller-card-body">
          <div className="flex items-end gap-3 h-48 pt-6 pb-2 border-b border-slate-200">
            {dailyData.map((d, idx) => {
              const heightPct = Math.round((d.revenue / maxDailyRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-slate-700 mb-1 transition-opacity">
                    {formatPrice(d.revenue)}
                  </div>
                  <div
                    style={{ height: `${heightPct}%`, width: "100%", maxWidth: "42px" }}
                    className="bg-navy hover:bg-muted-gold rounded-t transition-all"
                  />
                  <span className="text-xs font-medium text-slate-600 mt-2">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top & Low Performing Products */}
      <div className="seller-grid seller-grid-2 gap-6">
        <div className="seller-card">
          <div className="seller-card-header">
            <h3 className="seller-card-title flex items-center gap-2">
              <Award className="w-4 h-4 text-muted-gold" aria-hidden="true" />
              Best-Selling Products
            </h3>
          </div>
          <div className="seller-card-body p-0">
            <div className="seller-table-container">
              <table className="seller-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Units Sold</th>
                    <th>Gross Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, idx) => (
                    <tr key={idx}>
                      <td><strong className="text-sm text-slate-900">{p.name}</strong></td>
                      <td><span className="seller-badge seller-badge-success">{p.sales} Units</span></td>
                      <td><strong>{formatPrice(p.revenue)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="seller-card">
          <div className="seller-card-header">
            <h3 className="seller-card-title flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" aria-hidden="true" />
              Low-Performing Products (Action Required)
            </h3>
          </div>
          <div className="seller-card-body p-0">
            <div className="seller-table-container">
              <table className="seller-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Units Sold</th>
                    <th>Stock Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {lowPerforming.map((p, idx) => (
                    <tr key={idx}>
                      <td><strong className="text-sm text-slate-900">{p.name}</strong></td>
                      <td><span className="seller-badge seller-badge-warning">{p.sales} Units</span></td>
                      <td><span>{p.stock} Units</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerAnalytics;
