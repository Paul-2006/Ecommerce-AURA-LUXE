import { useEffect, useState } from "react";
import { RotateCcw, RefreshCw, Search, CheckCircle2, AlertTriangle, X } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadReturnsData();
  }, []);

  const loadReturnsData = async () => {
    try {
      setLoading(true);
      setReturns([
        { returnId: 701, orderId: 1042, requestDate: "2026-09-08", customer: "Priya Nair", product: "Sony WH-1000XM5 Headphones", amount: 29990, reason: "Defective Audio Balance", status: "Requested", refundStatus: "Pending Pickup" },
        { returnId: 702, orderId: 1035, requestDate: "2026-09-05", customer: "Amit Patel", product: "Samsung Galaxy S24 Ultra", amount: 129999, reason: "Wrong Color Delivered", status: "Approved", refundStatus: "Refund Initiated" },
        { returnId: 703, orderId: 1021, requestDate: "2026-08-28", customer: "Sneha Reddy", product: "Apple iPad Air 11-inch", amount: 59900, reason: "Changed Mind", status: "Rejected", refundStatus: "Not Applicable" },
        { returnId: 704, orderId: 1010, requestDate: "2026-08-20", customer: "Rahul Sharma", product: "MacBook Pro M3 Max", amount: 249999, reason: "Damaged Outer Box", status: "Returned", refundStatus: "Refund Completed" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (returnId, newStatus, newRefundStatus) => {
    setReturns((prev) =>
      prev.map((r) => (r.returnId === returnId ? { ...r, status: newStatus, refundStatus: newRefundStatus } : r))
    );
    alert(`Return Request #${returnId} set to "${newStatus}".`);
  };

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  const filteredReturns = returns.filter((r) => {
    const matchesStatus = statusFilter === "All" || r.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesSearch =
      r.returnId.toString().includes(search) ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="seller-page-container">
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Post-Purchase Management</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Customer Returns & Refund Claims Desk</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Inspect customer return requests, verify return reasons, authorize reverse pickups, and manage refund settlements.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadReturnsData}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Claims
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["All", "Requested", "Approved", "Returned", "Rejected"].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn ${statusFilter === st ? "btn-primary" : "btn-outline"} btn-sm`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search className="w-4 h-4" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--seller-text-secondary)" }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search Return ID, Customer, Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: "36px" }}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading return claims...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Return ID</th>
                  <th>Order & Date</th>
                  <th>Customer</th>
                  <th>Product & Claimed Reason</th>
                  <th>Refund Volume</th>
                  <th>Return Status</th>
                  <th>Refund Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.map((r) => (
                  <tr key={r.returnId}>
                    <td><strong>#RET-{r.returnId}</strong></td>
                    <td>
                      <div>
                        <strong>Order #{r.orderId}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)", margin: "2px 0 0 0" }}>{r.requestDate}</div>
                      </div>
                    </td>
                    <td><strong>{r.customer}</strong></td>
                    <td>
                      <div>
                        <strong>{r.product}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)", margin: "2px 0 0 0" }}>Reason: "{r.reason}"</div>
                      </div>
                    </td>
                    <td><strong>{formatPrice(r.amount)}</strong></td>
                    <td>
                      <span className={`badge-pill ${r.status === "Approved" || r.status === "Returned" ? "badge-success" : r.status === "Rejected" ? "badge-danger" : "badge-warning"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-pill ${r.refundStatus.includes("Completed") ? "badge-success" : "badge-secondary"}`}>
                        {r.refundStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {r.status === "Requested" && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleAction(r.returnId, "Approved", "Pickup Scheduled")}>Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleAction(r.returnId, "Rejected", "Not Applicable")}>Reject</button>
                          </>
                        )}
                        {r.status !== "Requested" && (
                          <span style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)" }}>Handled</span>
                        )}
                      </div>
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

export default SellerReturns;
