import { useNavigate } from "react-router-dom";
import "../../css/Dashboard.css";

function DeliveryHistory() {
  const navigate = useNavigate();

  const history = [
    { id: 98, date: "Yesterday, 19:40", customer: "Deepak Joshi", total: 17990, status: "Delivered (OTP 2911)", fee: 120 },
    { id: 97, date: "Yesterday, 16:15", customer: "Priya Patel", total: 29990, status: "Delivered (OTP 4826)", fee: 90 },
    { id: 95, date: "10 Aug 2026", customer: "Anita Rao", total: 89900, status: "Delivered (OTP 9012)", fee: 150 }
  ];

  return (
    <div className="delivery-history-container centered-container">
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Completed Delivery History & Payouts</h1>
          <p>Review past delivered routes, customer OTP handoffs, and rider trip commissions.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px", marginTop: "24px" }}>
        <div className="table-responsive">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Delivery Time</th>
                <th>Customer</th>
                <th>Order Total</th>
                <th>Verification Code</th>
                <th>Commission Earned</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td><strong>#{h.id}</strong></td>
                  <td>{h.date}</td>
                  <td>{h.customer}</td>
                  <td>₹ {h.total.toLocaleString("en-IN")}</td>
                  <td><span className="badge-pill badge-success">{h.status}</span></td>
                  <td><strong className="text-success">+ ₹ {h.fee}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/delivery/dashboard")} style={{ marginTop: "16px" }}>
          Back to Delivery Dashboard
        </button>
      </div>
    </div>
  );
}

export default DeliveryHistory;