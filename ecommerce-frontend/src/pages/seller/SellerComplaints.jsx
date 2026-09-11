import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { AlertTriangle, CheckCircle2, RefreshCw, Search, ShieldAlert, FileText, Eye, X, Send } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerComplaints() {
  const { user } = useContext(AuthContext);
  const sellerId = user?.sellerId || user?.userId || 1;

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionInput, setResolutionInput] = useState("");
  const [newStatus, setNewStatus] = useState("Under Review");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      setComplaints([
        {
          complaintId: 801,
          orderId: 1045,
          customer: "Rahul Sharma",
          product: "Apple MacBook Pro 16\" M3 Max",
          reason: "Damaged Outer Box Seal",
          description: "Product outer seal arrived partially loose during delivery.",
          date: "2026-09-09",
          severity: "Medium",
          status: "Under Review",
          adminAction: "Merchant Clarification Requested",
          resolution: null
        },
        {
          complaintId: 802,
          orderId: 1046,
          customer: "Sneha Reddy",
          product: "Apple iPad Air 11-inch M2",
          reason: "Delivery Speed Delay",
          description: "Package arrived 1 day after promised express SLA.",
          date: "2026-09-07",
          severity: "Low",
          status: "Resolved",
          adminAction: "Closed by Customer Support",
          resolution: "Courier SLA delay credit approved."
        }
      ]);
    } catch {
      setError("Failed to load seller disputes feed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComplaint = (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setUpdating(true);

    setComplaints((prev) =>
      prev.map((c) =>
        c.complaintId === selectedComplaint.complaintId
          ? { ...c, status: newStatus, resolution: resolutionInput.trim() || c.resolution }
          : c
      )
    );

    setSelectedComplaint(null);
    setUpdating(false);
    alert("Dispute status & merchant resolution updated successfully.");
  };

  const getStatusBadge = (st) => {
    const s = (st || "").toLowerCase();
    if (s.includes("resolved")) return <span className="seller-badge seller-badge-success">Resolved</span>;
    if (s.includes("review") || s.includes("pending")) return <span className="seller-badge seller-badge-warning">Under Review</span>;
    if (s.includes("reject")) return <span className="seller-badge seller-badge-danger">Rejected</span>;
    return <span className="seller-badge seller-badge-secondary">{st}</span>;
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus =
      statusFilter === "All" || c.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesSearch =
      c.complaintId.toString().includes(search) ||
      c.orderId.toString().includes(search) ||
      c.customer.toLowerCase().includes(search.toLowerCase()) ||
      c.product.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 className="seller-page-title">Disputes & Customer Complaints</h1>
          <p className="seller-page-subtitle">
            Monitor customer claim escalations, submit official merchant statements, and track dispute resolutions
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadComplaints}>
          <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Telemetry
        </button>
      </div>

      {error && (
        <div className="seller-alert seller-alert-danger mb-4">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="seller-card">
        <div className="seller-card-header flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            {["All", "Under Review", "Resolved"].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn ${statusFilter === st ? "btn-primary" : "btn-outline"} btn-sm`}
                onClick={() => setStatusFilter(st)}
              >
                {st} Claims
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search Claim ID, Order, Product..."
              className="seller-form-input pl-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="seller-card-body p-0">
          {loading ? (
            <div className="text-center py-12 text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-gold mb-2" aria-hidden="true" />
              Loading complaints queue...
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" aria-hidden="true" />
              <h3 className="font-semibold text-slate-700">No Active Complaints</h3>
              <p className="text-sm text-slate-500">Your merchant account is in good standing with zero open claim disputes.</p>
            </div>
          ) : (
            <div className="seller-table-container">
              <table className="seller-table">
                <thead>
                  <tr>
                    <th>Claim ID</th>
                    <th>Order & Date</th>
                    <th>Customer Name</th>
                    <th>Product & Dispute Reason</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((c) => (
                    <tr key={c.complaintId}>
                      <td><strong className="text-xs text-navy">#CMP-{c.complaintId}</strong></td>
                      <td>
                        <strong className="block text-xs text-slate-900">Order #{c.orderId}</strong>
                        <span className="text-xs text-slate-500">{c.date}</span>
                      </td>
                      <td><strong className="text-sm text-slate-900">{c.customer}</strong></td>
                      <td>
                        <strong className="block text-xs text-slate-900">{c.product}</strong>
                        <span className="text-xs text-slate-600">"{c.reason}"</span>
                      </td>
                      <td>
                        <span className={`seller-badge ${c.severity === "High" ? "seller-badge-danger" : "seller-badge-warning"}`}>
                          {c.severity}
                        </span>
                      </td>
                      <td>{getStatusBadge(c.status)}</td>
                      <td>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setSelectedComplaint(c);
                            setResolutionInput(c.resolution || "");
                            setNewStatus(c.status || "Under Review");
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" /> Inspect & Respond
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

      {/* DISPUTE RESOLUTION MODAL */}
      {selectedComplaint && (
        <div className="seller-modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
            <div className="seller-modal-header">
              <h3 className="seller-modal-title flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
                Claim Resolution — #CMP-{selectedComplaint.complaintId}
              </h3>
              <button className="btn-icon" onClick={() => setSelectedComplaint(null)}><X className="w-5 h-5" aria-hidden="true" /></button>
            </div>
            <form onSubmit={handleUpdateComplaint}>
              <div className="seller-modal-body space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded space-y-1">
                  <div><strong>Customer:</strong> {selectedComplaint.customer} (Order #{selectedComplaint.orderId})</div>
                  <div><strong>Product:</strong> {selectedComplaint.product}</div>
                  <div><strong>Reported Reason:</strong> {selectedComplaint.reason}</div>
                  <div><strong>Customer Description:</strong> "{selectedComplaint.description}"</div>
                </div>

                <div>
                  <label className="seller-form-label">Update Dispute Status</label>
                  <select
                    className="seller-form-input text-xs"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="seller-form-label">Merchant Statement / Resolution Text</label>
                  <textarea
                    rows="3"
                    className="seller-form-textarea text-xs"
                    placeholder="Provide official merchant response for customer and Admin review..."
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                  />
                </div>
              </div>
              <div className="seller-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setSelectedComplaint(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  <Send className="w-3.5 h-3.5" aria-hidden="true" /> Save Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerComplaints;
