import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Store, Search, Filter, RefreshCw, Eye, ShieldCheck, ArrowLeft } from "lucide-react";
import { getAdminSellerVerificationList } from "../../services/verificationService";
import VerificationBadge from "../../components/verification/VerificationBadge";
import "../../css/AdminPortal.css";

export function SellerVerificationList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await getAdminSellerVerificationList(statusFilter, search);
      setList(data);
    } catch (err) {
      console.error("Error loading seller verifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchList();
  };

  return (
    <div className="admin-portal-page">
      <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate("/admin/verification")} style={{ marginBottom: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
        <ArrowLeft size={14} aria-hidden="true" /> Back to Verification Center
      </button>

      <div className="page-header flex-between" style={{ marginBottom: "16px" }}>
        <div>
          <span className="badge-pill badge-primary">Merchant Statutory Verification</span>
          <h1 style={{ margin: "4px 0 0 0", fontSize: "1.4rem", fontWeight: 800, color: "#0F172A" }}>
            Seller Verification Applications
          </h1>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B" }}>
            Review merchant statutory details, GSTIN, PAN, Bank Payout evidence, and documents.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="table-filter-bar glass-panel" style={{ padding: "12px 16px", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: "flex", gap: "8px", minWidth: "260px" }}>
          <div className="input-with-icon" style={{ flex: 1 }}>
            <Search size={16} className="input-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by Seller Name, Business, or GSTIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">Search</button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Filter size={16} style={{ color: "#64748B" }} aria-hidden="true" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select" style={{ width: "160px" }}>
            <option value="ALL">All Statuses</option>
            <option value="InProgress">Under Review</option>
            <option value="Verified">Approved</option>
            <option value="NeedsCorrection">Needs Correction</option>
            <option value="Failed">Failed / Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Data Table */}
      {loading ? (
        <div className="shimmer-card-skeleton" style={{ height: "300px", borderRadius: "8px" }}></div>
      ) : list.length === 0 ? (
        <div className="card-empty-state text-center" style={{ padding: "40px 20px" }}>
          <Store size={36} style={{ color: "#94A3B8", marginBottom: "8px" }} aria-hidden="true" />
          <h3>No Seller Applications Found</h3>
          <p>No seller verification records match the selected status or search filter.</p>
        </div>
      ) : (
        <div className="table-responsive glass-panel" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #E2E8F0" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Seller & Business</th>
                <th>GSTIN</th>
                <th>PAN</th>
                <th>Statutory Checks</th>
                <th>Status</th>
                <th>Submitted Date</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.verificationId}>
                  <td>
                    <strong style={{ color: "#0F172A", display: "block" }}>{item.businessName || "Registered Merchant"}</strong>
                    <span style={{ fontSize: "0.78rem", color: "#64748B" }}>{item.sellerName} ({item.email})</span>
                  </td>
                  <td>
                    <code style={{ background: "#F1F5F9", padding: "2px 6px", borderRadius: "4px", fontSize: "0.82rem", fontWeight: 700, color: "#1E293B" }}>
                      {item.gstnumber || "NOT_PROVIDED"}
                    </code>
                  </td>
                  <td>
                    <code style={{ background: "#F1F5F9", padding: "2px 6px", borderRadius: "4px", fontSize: "0.82rem", fontWeight: 700, color: "#1E293B" }}>
                      {item.pannumber || "NOT_PROVIDED"}
                    </code>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: item.passedChecksCount === item.totalRequiredChecks ? "#16A34A" : "#D97706" }}>
                      {item.passedChecksCount} / {item.totalRequiredChecks} Passed
                    </span>
                  </td>
                  <td>
                    <VerificationBadge status={item.status} />
                  </td>
                  <td style={{ fontSize: "0.82rem", color: "#64748B" }}>
                    {new Date(item.submittedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="text-right">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate(`/admin/verification/seller/${item.verificationId}`)}>
                      <Eye size={14} aria-hidden="true" /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SellerVerificationList;
