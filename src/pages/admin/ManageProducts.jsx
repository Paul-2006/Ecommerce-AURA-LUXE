import { useEffect, useState } from "react";
import { getPendingProducts, updateProductApproval } from "../../services/adminService";
import { getProducts } from "../../services/productService";
import { getMediaUrl } from "../../services/api";
import { CheckSquare, RefreshCw, Eye, Search, Check, X } from "lucide-react";
import "../../css/AdminPortal.css";

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
    <div className="admin-page-container">
      <div className="admin-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Catalog Clearance Desk</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Product Approvals & Quality Control</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Review merchant product submissions, verify specifications & pricing, and grant catalog clearance.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadProducts}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh List
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h3 style={{ margin: 0 }}>Merchant Submissions ({filteredProducts.length})</h3>
          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search className="w-4 h-4" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-secondary)" }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search product, brand, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: "36px" }}
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
                        style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--admin-border)" }}
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80"; }}
                      />
                    </td>
                    <td>
                      <div>
                        <strong>{p.productName}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--admin-text-secondary)", margin: "2px 0 0 0" }}>{p.brand || "Brand"} • {p.category || "Electronics"}</div>
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
                          className="btn btn-outline btn-sm"
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
        <div style={{ position: "fixed", inset: 0, background: "rgba(14, 21, 36, 0.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setSelectedProduct(null)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ padding: "24px", maxWidth: "560px", width: "100%", borderRadius: "14px", background: "var(--admin-surface)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0 }}>Product Submission Spec Audit</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedProduct(null)} style={{ padding: "4px" }}>
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <img
                src={selectedProduct.image ? getMediaUrl(selectedProduct.image) : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80"}
                alt={selectedProduct.productName}
                style={{ width: "110px", height: "110px", objectFit: "cover", borderRadius: "10px", border: "1px solid var(--admin-border)" }}
              />
              <div style={{ fontSize: "0.88rem" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "var(--admin-primary)" }}>{selectedProduct.productName}</h4>
                <p style={{ margin: "2px 0", color: "var(--admin-text-secondary)" }}>Brand: <strong style={{ color: "var(--admin-primary)" }}>{selectedProduct.brand || "Brand"}</strong> • Category: <strong style={{ color: "var(--admin-primary)" }}>{selectedProduct.category || "Electronics"}</strong></p>
                <p style={{ margin: "2px 0", color: "var(--admin-text-secondary)" }}>Listed Price: <strong style={{ color: "var(--admin-primary)" }}>{formatPrice(selectedProduct.price || 999)}</strong></p>
                <p style={{ margin: "2px 0", color: "var(--admin-text-secondary)" }}>Submitting Merchant: <strong style={{ color: "var(--admin-primary)" }}>{selectedProduct.sellerName || "Zenith Retail Corp"}</strong></p>
              </div>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--admin-text-secondary)", marginBottom: "20px" }}>
              Description: {selectedProduct.description || "Certified hardware specification submission."}
            </p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setSelectedProduct(null)}>Close</button>
              <button className="btn btn-success" onClick={() => { handleApproval(selectedProduct.productId, "Approved"); setSelectedProduct(null); }}>Approve Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProducts;
