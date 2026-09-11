import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Bell, CheckCircle2, AlertTriangle, ShoppingBag, CreditCard, RefreshCw, Trash2, Check, XCircle, Star, Truck } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerNotifications() {
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    setNotifications([
      { id: 1, title: "New Customer Order Received (#1049)", time: "10 mins ago", type: "order", read: false, text: "Customer Rahul Sharma placed an order for Apple MacBook Pro 16\" M3 Max (Total: ₹2,49,999)." },
      { id: 2, title: "Bank Settlement Completed (₹ 2,37,499)", time: "2 hours ago", type: "payment", read: false, text: "Payout TXN-90472 was deposited to your HDFC Bank account." },
      { id: 3, title: "Low Stock Alert: Sony WH-1000XM5", time: "5 hours ago", type: "warning", read: false, text: "Stock level reached 3 units. Replenish inventory to avoid store depletion." },
      { id: 4, title: "Product Listing Clearance Granted (#102)", time: "1 day ago", type: "approval", read: true, text: "Admin Quality Control approved your listing for iPad Pro 13-inch." },
      { id: 5, title: "Product Listing Rejected (#105)", time: "2 days ago", type: "rejection", read: true, text: "Admin rejected Bose QuietComfort Ultra Earbuds listing: Missing required BIS compliance document." },
      { id: 6, title: "New 5-Star Customer Review", time: "3 days ago", type: "review", read: true, text: "Rahul Sharma rated 5 stars for Apple MacBook Pro 16\" M3 Max." },
      { id: 7, title: "Customer Complaint Logged (#801)", time: "4 days ago", type: "complaint", read: true, text: "Rahul Sharma reported 'Damaged Outer Box Seal' for Order #1045." },
      { id: 8, title: "Carrier Pickup Dispatched (#1047)", time: "5 days ago", type: "delivery", read: true, text: "Express Rider #401 picked up shipment for delivery to Ahmedabad hub." }
    ]);
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "order": return <ShoppingBag className="w-5 h-5 text-indigo-600" aria-hidden="true" />;
      case "payment": return <CreditCard className="w-5 h-5 text-emerald-600" aria-hidden="true" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-amber-600" aria-hidden="true" />;
      case "approval": return <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />;
      case "rejection": return <XCircle className="w-5 h-5 text-rose-600" aria-hidden="true" />;
      case "review": return <Star className="w-5 h-5 text-amber-500 fill-amber-400" aria-hidden="true" />;
      case "complaint": return <AlertTriangle className="w-5 h-5 text-rose-600" aria-hidden="true" />;
      case "delivery": return <Truck className="w-5 h-5 text-blue-600" aria-hidden="true" />;
      default: return <Bell className="w-5 h-5 text-slate-500" aria-hidden="true" />;
    }
  };

  const filtered = notifications.filter((n) => {
    if (filterType === "Unread") return !n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 className="seller-page-title">Notification Center</h1>
          <p className="seller-page-subtitle">
            Real-time merchant alerts for incoming orders, payouts, catalog approvals, low stock, and reviews
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <Check className="w-4 h-4" aria-hidden="true" /> Mark All Read
          </button>
          <button className="btn btn-secondary btn-sm" onClick={loadNotifications}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Stream
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="seller-card">
        <div className="seller-card-header flex justify-between items-center">
          <div className="flex gap-2">
            <button
              type="button"
              className={`btn ${filterType === "All" ? "btn-primary" : "btn-outline"} btn-sm`}
              onClick={() => setFilterType("All")}
            >
              All Notifications ({notifications.length})
            </button>
            <button
              type="button"
              className={`btn ${filterType === "Unread" ? "btn-primary" : "btn-outline"} btn-sm`}
              onClick={() => setFilterType("Unread")}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        <div className="seller-card-body">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-slate-400 mx-auto mb-2" aria-hidden="true" />
              <h3 className="font-semibold text-slate-700">No Notifications</h3>
              <p className="text-sm text-slate-500">Your notification inbox is clean.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-lg border flex items-start gap-4 transition-all ${!n.read ? "bg-amber-50/40 border-amber-200" : "bg-white border-slate-200"}`}
                >
                  <div className="p-2 rounded-lg bg-slate-100">{getIcon(n.type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <strong className={`text-sm ${!n.read ? "text-navy font-bold" : "text-slate-800 font-semibold"}`}>
                        {n.title}
                      </strong>
                      <span className="text-xs text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{n.text}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!n.read && (
                      <button
                        className="btn btn-outline btn-sm p-1.5"
                        onClick={() => handleMarkAsRead(n.id)}
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm p-1.5"
                      onClick={() => handleDelete(n.id)}
                      title="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerNotifications;
