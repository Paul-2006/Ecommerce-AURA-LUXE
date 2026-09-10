import { useState } from "react";
import { BarChart3, Printer, Download, Calendar } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerReports() {
  const [reportType, setReportType] = useState("Sales");

  const reports = [
    { title: "Sales Revenue & GMV Summary Report", code: "REP-SLS-2026", date: "Sep 2026", status: "Ready for Export" },
    { title: "Order Fulfillment & Delivery SLA Report", code: "REP-ORD-2026", date: "Sep 2026", status: "Ready for Export" },
    { title: "Inventory SKU Depletion & Restock Report", code: "REP-INV-2026", date: "Sep 2026", status: "Ready for Export" },
    { title: "Financial Settlements & Tax Ledger Report", code: "REP-FIN-2026", date: "Sep 2026", status: "Ready for Export" }
  ];

  return (
    <div className="seller-page-container">
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Executive Intelligence</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Merchant Business Intelligence & Financial Reports</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Export merchant sales ledgers, inventory depletion logs, GST tax statements, and return rate audits.
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" aria-hidden="true" /> Print Report Suite
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {["Sales", "Inventory", "Orders", "Payments", "Returns"].map((type) => (
            <button
              key={type}
              type="button"
              className={`btn ${reportType === type ? "btn-primary" : "btn-outline"} btn-sm`}
              onClick={() => setReportType(type)}
            >
              {type} Reports
            </button>
          ))}
        </div>

        <div className="table-responsive">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Report Code</th>
                <th>Report Title</th>
                <th>Period</th>
                <th>Export Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.code}>
                  <td><strong>{r.code}</strong></td>
                  <td><strong>{r.title}</strong></td>
                  <td>{r.date}</td>
                  <td><span className="badge-pill badge-success">{r.status}</span></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => alert(`Exporting ${r.title} to CSV...`)}>
                      <Download className="w-3.5 h-3.5" aria-hidden="true" /> Download CSV
                    </button>
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

export default SellerReports;
