import { useEffect, useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, ShoppingBag, CreditCard, RefreshCw } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications([
      { id: 1, title: "New Customer Order Received (#1049)", time: "10 mins ago", type: "order", text: "Customer Rahul Sharma placed an order for Apple MacBook Pro 16\" M3 Max." },
      { id: 2, title: "Bank Settlement Completed (₹ 2,37,499)", time: "2 hours ago", type: "payment", text: "Payout TXN-90472 was deposited to your HDFC Bank account." },
      { id: 3, title: "Low Stock Alert: Sony Headphones", time: "1 day ago", type: "warning", text: "Stock level reached 3 units. Replenish inventory to avoid store depletion." },
      { id: 4, title: "Product Clearance Granted (#102)", time: "2 days ago", type: "success", text: "Admin Quality Control approved your listing for iPad Pro 13-inch." }
    ]);
  }, []);

  return (
    <div className="seller-page-container">
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Merchant Activity</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Seller Activity & Operations Notifications</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Real-time notifications for incoming orders, catalog approvals, low stock alerts, and payout deposits.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => alert("All notifications marked read.")}>
            Mark All Read
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {notifications.map((n) => (
            <div key={n.id} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px", borderRadius: "10px", border: "1px solid var(--seller-border)", background: "var(--seller-surface)" }}>
              {n.type === "order" ? (
                <ShoppingBag className="w-5 h-5" style={{ color: "var(--seller-secondary)" }} />
              ) : n.type === "payment" ? (
                <CreditCard className="w-5 h-5" style={{ color: "var(--seller-success)" }} />
              ) : n.type === "warning" ? (
                <AlertTriangle className="w-5 h-5" style={{ color: "var(--seller-warning)" }} />
              ) : (
                <CheckCircle2 className="w-5 h-5" style={{ color: "var(--seller-success)" }} />
              )}

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ color: "var(--seller-primary)" }}>{n.title}</strong>
                  <span style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)" }}>{n.time}</span>
                </div>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.86rem", color: "var(--seller-text-secondary)" }}>{n.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SellerNotifications;
