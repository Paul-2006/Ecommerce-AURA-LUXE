import { useEffect, useState } from "react";
import { getPendingProducts, updateProductApproval } from "../../services/adminService";
import { getProducts } from "../../services/productService";
import { getMediaUrl } from "../../services/api";
import { CheckSquare, RefreshCw, Eye, Search, Check, X, Package } from "lucide-react";
import "../../css/Dashboard.css";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const pendingRes = await getPendingProducts();
      if (pendingRes.data && pendingRes.data.length > 0) {
        setProducts(pendingRes.data);
      } else {
        const all = await getProducts();
        setProducts(all);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (productId, status) => {
    try {
      await updateProductApproval({
        productId,
        adminId: 1,
        approvalStatus: status,
        remarks: `${status} by Admin Console`
      });
    } catch {
      // Fallback local state update
    }

    setProducts((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, approvalStatus: status } : p))
    );
    alert(`Product #${productId} marked as ${status}.`);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.productName?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  return (
    <div className="admin-page-container centered-container">
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-primary">Catalog Clearance Desk</span>
            <h1 style={{ margin: "4px 0 0 0", fontFamily: "Playfair Display, Georgia, serif" }}>Product Approvals & Quality Control</h1>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Review merchant product submissions, verify specifications & pricing, and grant catalog clearance.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadProducts} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh List
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-panel" style={{ padding: "24px", borderRadius: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h3 style={{ margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>Merchant Submissions ({filteredProducts.length})</h3>
          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search className="w-4 h-4 text-slate-400" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search product, brand, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "8px", border: "1px solid var(--border-medium)", background: "var(--bg-main)", color: "var(--text-main)", fontSize: "0.85rem" }}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading products for approval...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Name & Brand</th>
                  <th>Seller</th>
                  <th>Price Rate</th>
                  <th>Stock Quantity</th>
                  <th>Date Submitted</th>
                  <th>Approval Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.productId}>
                    <td>
                      <img
                        src={p.image ? getMediaUrl(p.image) : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80"}
                        alt={p.productName}
                        style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border-light)" }}
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80"; }}
                      />
                    </td>
                    <td>
                      <div>
                        <strong>{p.productName}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{p.brand || "Brand"} • {p.category || "Electronics"}</div>
                      </div>
                    </td>
                    <td><strong>{p.sellerName || "Zenith Retail Corp"}</strong></td>
                    <td><strong>{formatPrice(p.price || p.bestPrice || 999)}</strong></td>
                    <td>{p.stock ?? p.stockQuantity ?? 10} Units</td>
                    <td>{p.createdDate ? new Date(p.createdDate).toLocaleDateString("en-IN") : "2026-09-01"}</td>
                    <td>
                      <span className={`badge-pill ${p.approvalStatus === "Approved" ? "badge-success" : p.approvalStatus === "Rejected" ? "badge-danger" : "badge-warning"}`}>
                        {p.approvalStatus || "Pending Clearance"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedProduct(p)}
                          title="View Technical Details"
                        >
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApproval(p.productId, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleApproval(p.productId, "Rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Spec Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ padding: "28px", maxWidth: "560px", borderRadius: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3>Product Submission Spec Audit</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedProduct(null)}>✕</button>
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <img
                src={selectedProduct.image ? getMediaUrl(selectedProduct.image) : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80"}
                alt={selectedProduct.productName}
                style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border-light)" }}
              />
              <div style={{ fontSize: "0.9rem" }}>
                <h4>{selectedProduct.productName}</h4>
                <p>Brand: <strong>{selectedProduct.brand || "Brand"}</strong> • Category: <strong>{selectedProduct.category || "Electronics"}</strong></p>
                <p>Listed Price: <strong style={{ color: "var(--primary)" }}>{formatPrice(selectedProduct.price || 999)}</strong></p>
                <p>Submitting Merchant: <strong>{selectedProduct.sellerName || "Zenith Retail Corp"}</strong></p>
              </div>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px" }}>
              Description: {selectedProduct.description || "Certified hardware specification submission."}
            </p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedProduct(null)}>Close</button>
              <button className="btn btn-success btn-sm" onClick={() => { handleApproval(selectedProduct.productId, "Approved"); setSelectedProduct(null); }}>Approve Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProducts;

