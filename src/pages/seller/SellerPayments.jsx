import { useEffect, useState } from "react";
import { CreditCard, DollarSign, ArrowDownRight, RefreshCw, CheckCircle2, FileText } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      setPayments([
        { txnId: "TXN-90481", orderId: 1048, amount: 29990, fee: 1500, netAmount: 28490, date: "2026-09-09", status: "Settled", settlementBank: "HDFC Bank (•••• 4412)" },
        { txnId: "TXN-90472", orderId: 1045, amount: 249999, fee: 12500, netAmount: 237499, date: "2026-09-08", status: "Settled", settlementBank: "HDFC Bank (•••• 4412)" },
        { txnId: "TXN-90465", orderId: 1038, amount: 129999, fee: 6500, netAmount: 123499, date: "2026-09-05", status: "Processing Settlement", settlementBank: "HDFC Bank (•••• 4412)" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Financial Settlements</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Payments, Earnings & Bank Settlement Statements</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Audit gross merchant revenue, platform commission deductions (5%), available balances, and direct bank payouts.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadPaymentHistory}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Ledger
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="seller-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val">{formatPrice(489980)}</span>
            <span className="metric-title">Gross Sales Volume</span>
          </div>
          <CreditCard className="w-5 h-5" style={{ color: "var(--seller-secondary)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--seller-success)" }}>{formatPrice(465481)}</span>
            <span className="metric-title">Total Settled Earnings</span>
          </div>
          <CheckCircle2 className="w-5 h-5" style={{ color: "var(--seller-success)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--seller-warning)" }}>{formatPrice(123499)}</span>
            <span className="metric-title">Pending Settlement</span>
          </div>
          <DollarSign className="w-5 h-5" style={{ color: "var(--seller-warning)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--seller-danger)" }}>{formatPrice(24499)}</span>
            <span className="metric-title">Platform Fees (5%)</span>
          </div>
          <ArrowDownRight className="w-5 h-5" style={{ color: "var(--seller-danger)" }} aria-hidden="true" />
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0 }}>Settlement Transaction Log</h3>
          <span className="badge-pill badge-secondary">HDFC Bank Primary Payout Account</span>
        </div>

        {loading ? (
          <p>Loading financial ledger...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Order Reference</th>
                  <th>Date</th>
                  <th>Gross Amount</th>
                  <th>Platform Fee (5%)</th>
                  <th>Net Merchant Payout</th>
                  <th>Settlement Bank</th>
                  <th>Payout Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.txnId}>
                    <td><strong>{p.txnId}</strong></td>
                    <td><strong>Order #{p.orderId}</strong></td>
                    <td>{p.date}</td>
                    <td><strong>{formatPrice(p.amount)}</strong></td>
                    <td style={{ color: "var(--seller-danger)" }}>-{formatPrice(p.fee)}</td>
                    <td><strong style={{ color: "var(--seller-success)" }}>{formatPrice(p.netAmount)}</strong></td>
                    <td>{p.settlementBank}</td>
                    <td>
                      <span className={`badge-pill ${p.status === "Settled" ? "badge-success" : "badge-warning"}`}>
                        {p.status}
                      </span>
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

export default SellerPayments;
