import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Dashboard.css";

function PackingOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([
    {
      orderId: 101,
      customer: "Rahul Sharma",
      items: "Apple MacBook Pro 16\" (x1)",
      boxType: "Heavy-Duty Fragile Pack",
      status: "Ready to Pack",
      dest: "Bengaluru Central (Zone 4)"
    },
    {
      orderId: 102,
      customer: "Priya Patel",
      items: "Sony WH-1000XM5 (x1)",
      boxType: "Standard Box #2",
      status: "Packed & Labelled",
      dest: "Bengaluru South (Zone 2)"
    },
    {
      orderId: 103,
      customer: "Anand Verma",
      items: "Samsung Galaxy S24 Ultra (x1)",
      boxType: "Tamper-Evident Express Pouch",
      status: "Ready to Pack",
      dest: "Bengaluru East (Zone 1)"
    }
  ]);

  const handleMarkPacked = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === id ? { ...o, status: "Packed & Handed to Rider" } : o))
    );
    alert(`Order #${id} marked as Packed. Barcode label dispatched to delivery partner.`);
  };

  return (
    <div className="packing-orders-container centered-container">
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Warehouse Order Packing & Labeling Line</h1>
          <p>Verify box contents, affix shipping barcode labels, and assign packages to delivery motorbike riders.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px", marginTop: "24px" }}>
        <div className="table-header-bar">
          <h3>Active Packaging Queue</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/warehouse/inventory")}>
            Open Barcode Scanner
          </button>
        </div>

        <div className="table-responsive">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items to Pack</th>
                <th>Packaging Box</th>
                <th>Destination Hub</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderId}>
                  <td><strong>#{o.orderId}</strong></td>
                  <td>{o.customer}</td>
                  <td><strong>{o.items}</strong></td>
                  <td><span className="badge-pill badge-primary">{o.boxType}</span></td>
                  <td>{o.dest}</td>
                  <td>
                    <span className={`badge-pill ${o.status.includes("Packed") ? "badge-success" : "badge-warning"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>
                    {o.status.includes("Packed") ? (
                      <button className="btn btn-ghost btn-sm" disabled>
                        Ready for Rider
                      </button>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => handleMarkPacked(o.orderId)}>
                        Affix Label & Pack
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PackingOrders;