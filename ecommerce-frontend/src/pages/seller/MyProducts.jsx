import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getSellerProducts, deleteSellerProduct } from "../../services/sellerService";
import { getMediaUrl } from "../../services/api";
import { Package, Search, Plus, Edit, Trash2, Eye, RefreshCw, AlertTriangle, CheckCircle2, X } from "lucide-react";
import "../../css/SellerPortal.css";

function MyProducts() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const sellerId = user?.sellerId || user?.userId || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getSellerProducts(sellerId);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error loading seller products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to deactivate product listing #${id}?`)) {
      await deleteSellerProduct(id);
      setProducts((prev) => prev.filter((p) => (p.productId || p.sellerProductId) !== id));
    }
  };

  const filteredProducts = products.filter((p) => {
    const status = p.approvalStatus || "Approved";
    const matchesFilter = approvalFilter === "All" || status.toLowerCase() === approvalFilter.toLowerCase();
    const matchesSearch =
      (p.productName || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  return (
    <div className="seller-page-container">
      {/* Header Banner */}
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <span className="badge-pill badge-secondary">Catalog Management</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Merchant Product Listings & Clearance Desk</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Manage your product catalog, monitor stock availability, review Admin approval clearances, and inspect rejection remarks.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn-secondary btn-sm" onClick={loadProducts}>
              <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh List
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/seller/add-product")}>
              <Plus className="w-4 h-4" aria-hidden="true" /> Add New Listing
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["All", "Approved", "Pending", "Rejected"].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn ${approvalFilter === st ? "btn-primary" : "btn-outline"} btn-sm`}
                onClick={() => setApprovalFilter(st)}
              >
                {st} Clearances
              </button>
            ))}
          </div>

          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search className="w-4 h-4" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--seller-text-secondary)" }} aria-hidden="true" />
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
          <p>Loading merchant catalog items...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Name & Brand</th>
                  <th>SKU / Code</th>
                  <th>List Price</th>
                  <th>Available Stock</th>
                  <th>Approval Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const id = p.productId || p.sellerProductId;
                  const status = p.approvalStatus || "Approved";
                  const stock = p.stock ?? p.stockQuantity ?? 10;
                  return (
                    <tr key={id}>
                      <td>
                        <img
                          src={p.image ? getMediaUrl(p.image) : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80"}
                          alt={p.productName}
                          style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--seller-border)" }}
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80"; }}
                        />
                      </td>
                      <td>
                        <div>
                          <strong>{p.productName}</strong>
                          <div style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)", margin: "2px 0 0 0" }}>{p.brand || "Brand"} • {p.category || "Electronics"}</div>
                        </div>
                      </td>
                      <td><strong style={{ background: "var(--seller-surface-alt)", padding: "2px 8px", borderRadius: "6px", fontSize: "0.82rem" }}>{p.sku || `SKU-${id}`}</strong></td>
                      <td><strong>{formatPrice(p.price || p.bestPrice || 999)}</strong></td>
                      <td>
                        <strong style={{ color: stock === 0 ? "var(--seller-danger)" : stock <= 5 ? "var(--seller-warning)" : "var(--seller-primary)" }}>
                          {stock} Units
                        </strong>
                      </td>
                      <td>
                        <span className={`badge-pill ${status === "Approved" ? "badge-success" : status === "Rejected" ? "badge-danger" : "badge-warning"}`}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setSelectedProduct(p)}
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate(`/seller/edit-product/${id}`)}
                            title="Edit Listing"
                          >
                            <Edit className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(id)}
                            title="Deactivate Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail / Rejection Modal */}
      {selectedProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(14, 21, 36, 0.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setSelectedProduct(null)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ padding: "24px", maxWidth: "560px", width: "100%", borderRadius: "14px", background: "var(--seller-surface)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0 }}>Product Clearance Specifications</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedProduct(null)} style={{ padding: "4px" }}>
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <img
                src={selectedProduct.image ? getMediaUrl(selectedProduct.image) : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80"}
                alt={selectedProduct.productName}
                style={{ width: "110px", height: "110px", objectFit: "cover", borderRadius: "10px", border: "1px solid var(--seller-border)" }}
              />
              <div style={{ fontSize: "0.88rem" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "var(--seller-primary)" }}>{selectedProduct.productName}</h4>
                <p style={{ margin: "2px 0", color: "var(--seller-text-secondary)" }}>Brand: <strong>{selectedProduct.brand || "Apple"}</strong> • SKU: <strong>{selectedProduct.sku || "SKU-01"}</strong></p>
                <p style={{ margin: "2px 0", color: "var(--seller-text-secondary)" }}>Price: <strong>{formatPrice(selectedProduct.price || 999)}</strong></p>
                <p style={{ margin: "2px 0", color: "var(--seller-text-secondary)" }}>Clearance Status: <span className={`badge-pill ${selectedProduct.approvalStatus === "Approved" ? "badge-success" : selectedProduct.approvalStatus === "Rejected" ? "badge-danger" : "badge-warning"}`}>{selectedProduct.approvalStatus || "Approved"}</span></p>
              </div>
            </div>

            {selectedProduct.approvalStatus === "Rejected" && (
              <div className="admin-alert admin-alert-danger" style={{ marginBottom: "16px" }}>
                <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                <div>
                  <strong>Admin Rejection Reason:</strong>
                  <div style={{ fontSize: "0.82rem", marginTop: "2px" }}>
                    "{selectedProduct.rejectionReason || "Product image resolution does not meet quality standards. Please re-upload high-resolution images."}"
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setSelectedProduct(null)}>Close</button>
              <button className="btn btn-secondary" onClick={() => { navigate(`/seller/edit-product/${selectedProduct.productId || selectedProduct.sellerProductId}`); setSelectedProduct(null); }}>Edit Listing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProducts;
