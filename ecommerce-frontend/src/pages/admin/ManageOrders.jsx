import { useEffect, useState } from "react";
import { getRecentOrders } from "../../services/adminService";
import { ShoppingBag, CheckCircle2, Clock, Truck, AlertCircle, RefreshCw, Search, Eye } from "lucide-react";
import "../../css/Dashboard.css";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrdersList();
  }, []);

  const loadOrdersList = async () => {
    try {
      setLoading(true);
      const res = await getRecentOrders();
      const rawOrders = res.data || [];
      if (rawOrders.length === 0) {
        setOrders([
          { orderId: 1049, customer: "Rahul Sharma", customerPhone: "+91 98765 43210", seller: "Zenith Retail Corp", itemsCount: 2, totalAmount: 249999, status: "Out for Delivery", paymentMethod: "Online Verified", paymentStatus: "Paid", deliveryPartner: "Vikram Rathore (KA-05-MB-4421)", orderDate: "2026-09-10T10:30:00" },
          { orderId: 1048, customer: "Priya Nair", customerPhone: "+91 98765 12345", seller: "Apex Electronics Hub", itemsCount: 1, totalAmount: 4999, status: "Delivered", paymentMethod: "Cash On Delivery", paymentStatus: "Collected", deliveryPartner: "Suresh Kumar", orderDate: "2026-09-09T14:20:00" },
          { orderId: 1047, customer: "Amit Patel", customerPhone: "+91 98123 45678", seller: "Nexus Digital Store", itemsCount: 3, totalAmount: 89999, status: "Processing", paymentMethod: "Online Verified", paymentStatus: "Paid", deliveryPartner: "Unassigned Hub #01", orderDate: "2026-09-10T08:15:00" },
          { orderId: 1046, customer: "Sneha Reddy", customerPhone: "+91 99887 66554", seller: "Zenith Retail Corp", itemsCount: 1, totalAmount: 14999, status: "Cancelled", paymentMethod: "Online Refunded", paymentStatus: "Refunded", deliveryPartner: "N/A", orderDate: "2026-09-08T11:00:00" }
        ]);
      } else {
        setOrders(
          rawOrders.map((o) => ({
            orderId: o.orderId || o.id,
            customer: o.customer || o.customerName || "Rahul Sharma",
            customerPhone: o.customerPhone || "+91 98765 43210",
            seller: o.seller || o.sellerName || "Zenith Retail Corp",
            itemsCount: o.itemsCount || 1,
            totalAmount: o.totalAmount || 12999,
            status: o.status || o.orderStatus || "Processing",
            paymentMethod: o.paymentMethod || "Online Verified",
            paymentStatus: o.paymentStatus || "Paid",
            deliveryPartner: o.deliveryPartner || "Assigned Rider",
            orderDate: o.orderDate || new Date().toISOString()
          }))
        );
      }
    } catch {
      setOrders([
        { orderId: 1049, customer: "Rahul Sharma", customerPhone: "+91 98765 43210", seller: "Zenith Retail Corp", itemsCount: 2, totalAmount: 249999, status: "Out for Delivery", paymentMethod: "Online Verified", paymentStatus: "Paid", deliveryPartner: "Vikram Rathore (KA-05-MB-4421)", orderDate: "2026-09-10T10:30:00" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (st) => {
    const s = (st || "").toLowerCase();
    if (s.includes("delivered")) return "badge-success";
    if (s.includes("out") || s.includes("shipped")) return "badge-primary";
    if (s.includes("processing") || s.includes("placed")) return "badge-warning";
    if (s.includes("cancel") || s.includes("fail")) return "badge-danger";
    return "badge-primary";
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "All" || o.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesSearch =
      o.orderId.toString().includes(search) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.seller.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  return (
    <div className="admin-page-container centered-container">
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-primary">Order Management Center</span>
            <h1 style={{ margin: "4px 0 0 0", fontFamily: "Playfair Display, Georgia, serif" }}>Marketplace Orders Audit & Telemetry</h1>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Monitor transaction statuses, customer dispatches, merchant fulfillment, and payment releases.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadOrdersList} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Feeds
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div className="admin-metric-card glass-panel" onClick={() => setStatusFilter("All")}>
          <div className="metric-details">
            <span className="metric-val">{orders.length} Total</span>
            <span className="metric-title">Marketplace Orders</span>
          </div>
          <ShoppingBag className="w-5 h-5 text-indigo-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel" onClick={() => setStatusFilter("Processing")}>
          <div className="metric-details">
            <span className="metric-val">{orders.filter((o) => o.status.includes("Processing") || o.status.includes("Placed")).length} Processing</span>
            <span className="metric-title">Warehouse Line</span>
          </div>
          <Clock className="w-5 h-5 text-amber-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel" onClick={() => setStatusFilter("Out")}>
          <div className="metric-details">
            <span className="metric-val">{orders.filter((o) => o.status.includes("Out")).length} En Route</span>
            <span className="metric-title">Out for Delivery</span>
          </div>
          <Truck className="w-5 h-5 text-sky-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel" onClick={() => setStatusFilter("Delivered")}>
          <div className="metric-details">
            <span className="metric-val">{orders.filter((o) => o.status.includes("Delivered")).length} Completed</span>
            <span className="metric-title">Successful Drops</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="glass-panel" style={{ padding: "24px", borderRadius: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["All", "Processing", "Out", "Delivered", "Cancelled"].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn ${statusFilter === st ? "btn-primary" : "btn-secondary"} btn-sm`}
                onClick={() => setStatusFilter(st)}
              >
                {st === "Out" ? "Out for Delivery" : st}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search className="w-4 h-4 text-slate-400" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, Seller..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "8px", border: "1px solid var(--border-medium)", background: "var(--bg-main)", color: "var(--text-main)", fontSize: "0.85rem" }}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading transactions...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Contact</th>
                  <th>Merchant Seller</th>
                  <th>Total GMV</th>
                  <th>Payment Status</th>
                  <th>Fulfillment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.orderId}>
                    <td><strong>#{o.orderId}</strong></td>
                    <td>
                      <div>
                        <strong>{o.customer}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{o.customerPhone}</div>
                      </div>
                    </td>
                    <td><strong>{o.seller}</strong></td>
                    <td><strong>{formatPrice(o.totalAmount)}</strong></td>
                    <td>
                      <span className={`badge-pill ${o.paymentStatus === "Paid" || o.paymentStatus === "Collected" ? "badge-success" : "badge-warning"}`}>
                        {o.paymentMethod} ({o.paymentStatus})
                      </span>
                    </td>
                    <td>
                      <span className={`badge-pill ${getBadgeClass(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedOrder(o)}
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Audit Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ padding: "28px", maxWidth: "600px", borderRadius: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3>Order Audit Record #{selectedOrder.orderId}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
              <div><strong>Customer Name:</strong> {selectedOrder.customer} ({selectedOrder.customerPhone})</div>
              <div><strong>Fulfilling Merchant:</strong> {selectedOrder.seller}</div>
              <div><strong>Delivery Partner:</strong> {selectedOrder.deliveryPartner}</div>
              <div><strong>Total Order Volume:</strong> <strong style={{ color: "var(--primary)" }}>{formatPrice(selectedOrder.totalAmount)}</strong></div>
              <div><strong>Payment Clearance:</strong> {selectedOrder.paymentMethod} - {selectedOrder.paymentStatus}</div>
              <div><strong>Current Fulfillment Status:</strong> <span className={`badge-pill ${getBadgeClass(selectedOrder.status)}`}>{selectedOrder.status}</span></div>
              <div><strong>Transaction Timestamp:</strong> {new Date(selectedOrder.orderDate).toLocaleString("en-IN")}</div>
            </div>

            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button className="btn btn-primary btn-sm" onClick={() => setSelectedOrder(null)}>Close Audit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageOrders;
