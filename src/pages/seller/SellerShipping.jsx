import { useEffect, useState } from "react";
import { Truck, Package, Clock, CheckCircle2, RefreshCw, MapPin } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerShipping() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      setLoading(true);
      setShipments([
        { shipmentId: "SHP-8821", orderId: 1049, customer: "Rahul Sharma", destination: "Bengaluru, KA", items: 2, status: "Packed - Awaiting Pickup", carrier: "Express Rider #401", estDelivery: "2026-09-11" },
        { shipmentId: "SHP-8818", orderId: 1047, customer: "Amit Patel", destination: "Ahmedabad, GJ", items: 1, status: "In Transit", carrier: "BlueDart Express (AWB: 994821)", estDelivery: "2026-09-12" },
        { shipmentId: "SHP-8810", orderId: 1045, customer: "Priya Nair", destination: "Chennai, TN", items: 1, status: "Out for Delivery", carrier: "Suresh Kumar (KA-01-EA-9988)", estDelivery: "2026-09-10" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-page-container">
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Logistics Telemetry</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Logistics Dispatch & Carrier Delivery Tracking</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Track order fulfillment packages from warehouse packing to carrier dispatch and final customer dropoff.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadShipments}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Telemetry
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ margin: "0 0 16px 0" }}>Active Logistics Dispatch Line</h3>

        {loading ? (
          <p>Loading carrier shipments...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Order Reference</th>
                  <th>Customer & Destination</th>
                  <th>Logistics Carrier</th>
                  <th>Estimated Delivery</th>
                  <th>Tracking Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s.shipmentId}>
                    <td><strong>{s.shipmentId}</strong></td>
                    <td><strong>Order #{s.orderId}</strong></td>
                    <td>
                      <div>
                        <strong>{s.customer}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)" }}>{s.destination}</div>
                      </div>
                    </td>
                    <td>{s.carrier}</td>
                    <td>{s.estDelivery}</td>
                    <td>
                      <span className={`badge-pill ${s.status.includes("Delivered") ? "badge-success" : "badge-secondary"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => alert(`Tracking updates requested for shipment ${s.shipmentId}.`)}>
                        Track Package
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerShipping;
