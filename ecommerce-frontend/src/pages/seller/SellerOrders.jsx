import { useState } from "react";
import "../../css/Dashboard.css";

function SellerOrders() {
  const [orders, setOrders] = useState([
    {
      id: 101,
      customer: "Rahul Sharma",
      product: "Apple MacBook Pro 16\" M3 Max",
      qty: 1,
      total: 249999,
      status: "Dispatched",
      date: "Today, 14:30"
    },
    {
      id: 102,
      customer: "Priya Patel",
      product: "Sony WH-1000XM5 Wireless Headphones",
      qty: 1,
      total: 29990,
      status: "Delivered",
      date: "Yesterday"
    },
    {
      id: 104,
      customer: "Deepak Joshi",
      product: "Logitech MX Master 3S",
      qty: 2,
      total: 17990,
      status: "Processing",
      date: "Today, 18:15"
    }
  ]);

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amt);

  return (
    <div className="seller-orders-container centered-container">
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Merchant Sales & Customer Orders</h1>
          <p>Review customer orders containing your products and track dispatch handoffs.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px", marginTop: "24px" }}>
        <div className="table-header-bar">
          <h3>Customer Orders History</h3>
          <span className="badge-pill badge-primary">{orders.length} Active Orders</span>
        </div>

        <div className="table-responsive">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Volume</th>
                <th>Status</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id}>
                  <td><strong>#{ord.id}</strong></td>
                  <td>{ord.customer}</td>
                  <td><strong>{ord.product}</strong></td>
                  <td>{ord.qty} Unit(s)</td>
                  <td><strong>{formatPrice(ord.total)}</strong></td>
                  <td>
                    <span className={`badge-pill ${ord.status === "Delivered" ? "badge-success" : ord.status === "Dispatched" ? "badge-primary" : "badge-warning"}`}>
                      {ord.status}
                    </span>
                  </td>
                  <td>{ord.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SellerOrders;