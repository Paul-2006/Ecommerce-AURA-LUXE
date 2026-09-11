import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getSellerProducts, deleteSellerProduct, toggleProductStatus, updateSellerProduct, uploadProductImage } from "../../services/sellerService";
import { getMediaUrl } from "../../services/api";
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  X,
  Star,
  ToggleLeft,
  ToggleRight,
  Upload,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from "lucide-react";
import "../../css/SellerPortal.css";

function MyProducts() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const sellerId = user?.sellerId || user?.userId || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [priceModalItem, setPriceModalItem] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [stockModalItem, setStockModalItem] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [imageModalItem, setImageModalItem] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getSellerProducts(sellerId);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error loading seller products:", err);
      setError("Failed to load products. Please check server connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete product listing #${id}?`)) {
      try {
        await deleteSellerProduct(id);
        setProducts((prev) => prev.filter((p) => (p.productId || p.sellerProductId) !== id));
      } catch {
        alert("Failed to delete product.");
      }
    }
  };

  const handleToggleStatus = async (item) => {
    const id = item.sellerProductId || item.productId;
    try {
      await toggleProductStatus(id);
      setProducts((prev) =>
        prev.map((p) => {
          if ((p.sellerProductId || p.productId) === id) {
            const current = p.productStatus || "Active";
            return { ...p, productStatus: current === "Active" ? "Inactive" : "Active" };
          }
          return p;
        })
      );
    } catch {
      alert("Failed to toggle product status.");
    }
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    if (!priceModalItem || Number(newPrice) <= 0) {
      alert("Please enter a valid price greater than 0.");
      return;
    }
    setUpdating(true);
    const id = priceModalItem.sellerProductId || priceModalItem.productId;
    try {
      await updateSellerProduct(id, {
        price: Number(newPrice),
        stockQuantity: priceModalItem.stock ?? 10
      });
      setProducts((prev) =>
        prev.map((p) => ((p.sellerProductId || p.productId) === id ? { ...p, price: Number(newPrice) } : p))
      );
      setPriceModalItem(null);
    } catch {
      alert("Failed to update price.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!stockModalItem || Number(newStock) < 0) {
      alert("Please enter a valid non-negative stock quantity.");
      return;
    }
    setUpdating(true);
    const id = stockModalItem.sellerProductId || stockModalItem.productId;
    try {
      await updateSellerProduct(id, {
        price: stockModalItem.price || 999,
        stockQuantity: Number(newStock)
      });
      setProducts((prev) =>
        prev.map((p) => ((p.sellerProductId || p.productId) === id ? { ...p, stock: Number(newStock) } : p))
      );
      setStockModalItem(null);
    } catch {
      alert("Failed to update stock.");
    } finally {
      setUpdating(false);
    }
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!imageModalItem || !selectedImageFile) return;
    setUpdating(true);
    const prodId = imageModalItem.productId || imageModalItem.sellerProductId;
    try {
      await uploadProductImage(prodId, selectedImageFile);
      setProducts((prev) =>
        prev.map((p) =>
          (p.productId || p.sellerProductId) === prodId
            ? { ...p, image: imagePreview || p.image }
            : p
        )
      );
      setImageModalItem(null);
      setSelectedImageFile(null);
      setImagePreview("");
    } catch {
      alert("Failed to upload image.");
    } finally {
      setUpdating(false);
    }
  };

  // Filter & Search Logic
  const filteredProducts = products.filter((p) => {
    const approval = p.approvalStatus || "Approved";
    const category = p.category || "Electronics";
    const matchesApproval = approvalFilter === "All" || approval.toLowerCase() === approvalFilter.toLowerCase();
    const matchesCategory = categoryFilter === "All" || category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      (p.productName || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(search.toLowerCase());
    return matchesApproval && matchesCategory && matchesSearch;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aVal = a[sortBy] ?? 0;
    let bVal = b[sortBy] ?? 0;
    if (sortBy === "name") {
      aVal = (a.productName || "").toLowerCase();
      bVal = (b.productName || "").toLowerCase();
    }
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  return (
    <div className="seller-page-container">
      {/* Page Header */}
      <div className="seller-page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 className="seller-page-title">Products Management Desk</h1>
          <p className="seller-page-subtitle">
            Manage your store catalog listings, update stock & pricing, upload product images, and inspect clearances
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm" onClick={loadProducts}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh List
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/seller/products/add")}>
            <Plus className="w-4 h-4" aria-hidden="true" /> Add Product
          </button>
        </div>
      </div>

      {error && (
        <div className="seller-alert seller-alert-danger mb-4">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          <span>{error}</span>
          <button className="btn btn-primary btn-sm ml-auto" onClick={loadProducts}>Retry</button>
        </div>
      )}

      {/* Main Card */}
      <div className="seller-card">
        <div className="seller-card-header flex flex-wrap justify-between items-center gap-4">
          {/* Approval Filters */}
          <div className="flex gap-2 flex-wrap">
            {["All", "Approved", "Pending", "Rejected"].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn ${approvalFilter === st ? "btn-primary" : "btn-outline"} btn-sm`}
                onClick={() => { setApprovalFilter(st); setCurrentPage(1); }}
              >
                {st} Clearances
              </button>
            ))}
          </div>

          {/* Search & Category & Sort Controls */}
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search name, brand, SKU..."
                className="seller-form-input pl-9 text-sm"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <select
              className="seller-form-input text-sm"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              style={{ width: "140px" }}
            >
              <option value="All">All Categories</option>
              <option value="Laptops">Laptops</option>
              <option value="Smartphones">Smartphones</option>
              <option value="Headphones">Headphones</option>
              <option value="Tablets">Tablets</option>
            </select>

            <button
              className="btn btn-outline btn-sm flex items-center gap-1"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
              {sortOrder.toUpperCase()}
            </button>
          </div>
        </div>

        <div className="seller-card-body p-0">
          {loading ? (
            <div className="text-center py-12 text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-gold mb-2" aria-hidden="true" />
              Loading products...
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-2" aria-hidden="true" />
              <h3 className="font-semibold text-slate-700">No Products Found</h3>
              <p className="text-sm text-slate-500 mb-4">No seller product listings match your current filters.</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate("/seller/products/add")}>
                <Plus className="w-4 h-4" aria-hidden="true" /> Add Product Listing
              </button>
            </div>
          ) : (
            <div className="seller-table-container">
              <table className="seller-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU & Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Approval</th>
                    <th>Rating</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((p) => {
                    const prodId = p.productId || p.sellerProductId;
                    const isInactive = p.productStatus === "Inactive";
                    return (
                      <tr key={prodId} style={{ opacity: isInactive ? 0.65 : 1 }}>
                        <td>
                          <div className="flex items-center gap-3">
                            <img
                              src={getMediaUrl(p.image) || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100"}
                              alt={p.productName}
                              style={{ width: "42px", height: "42px", borderRadius: "8px", objectFit: "cover" }}
                            />
                            <div>
                              <strong className="block text-sm text-slate-900">{p.productName}</strong>
                              <span className="text-xs text-slate-500">{p.category || "Electronics"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="text-sm">
                            <div>{p.brand || "Brand"}</div>
                            <code className="text-xs text-slate-500">{p.sku || `SKU-${prodId}`}</code>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <strong>{formatPrice(p.price)}</strong>
                            <button
                              className="btn-icon text-muted-gold hover:text-navy"
                              onClick={() => { setPriceModalItem(p); setNewPrice(p.price || ""); }}
                              title="Update Price"
                            >
                              <Edit className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <span className={(p.stock ?? 10) === 0 ? "text-rose-600 font-bold" : (p.stock ?? 10) < 10 ? "text-amber-600 font-bold" : ""}>
                              {p.stock ?? 10} Units
                            </span>
                            <button
                              className="btn-icon text-muted-gold hover:text-navy"
                              onClick={() => { setStockModalItem(p); setNewStock(p.stock ?? 10); }}
                              title="Update Stock"
                            >
                              <Edit className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="flex items-center gap-1 text-xs font-semibold"
                            onClick={() => handleToggleStatus(p)}
                            title="Click to toggle Active/Inactive"
                          >
                            {isInactive ? (
                              <>
                                <ToggleLeft className="w-5 h-5 text-slate-400" aria-hidden="true" />
                                <span className="text-slate-500">Disabled</span>
                              </>
                            ) : (
                              <>
                                <ToggleRight className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                                <span className="text-emerald-700">Active</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td>
                          <span className={`seller-badge ${p.approvalStatus === "Approved" ? "seller-badge-success" : p.approvalStatus === "Rejected" ? "seller-badge-danger" : "seller-badge-warning"}`}>
                            {p.approvalStatus || "Approved"}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                            {p.rating || 4.8} ({p.salesCount || 15} sold)
                          </div>
                        </td>
                        <td>
                          <span className="text-xs text-slate-500">{p.createdDate || "2026-08-15"}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button className="btn btn-outline btn-sm p-1.5" onClick={() => setSelectedProduct(p)} title="View Details">
                              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <button className="btn btn-outline btn-sm p-1.5" onClick={() => setImageModalItem(p)} title="Upload Image">
                              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <button className="btn btn-outline btn-sm p-1.5" onClick={() => navigate(`/seller/products/edit/${prodId}`)} title="Edit Product">
                              <Edit className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <button className="btn btn-danger btn-sm p-1.5" onClick={() => handleDelete(prodId)} title="Delete Product">
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

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Showing page {currentPage} of {totalPages} ({filteredProducts.length} total products)
              </span>
              <div className="flex gap-2">
                <button
                  className="btn btn-outline btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Previous
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                >
                  Next <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="seller-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "540px" }}>
            <div className="seller-modal-header">
              <h3 className="seller-modal-title">Product Details</h3>
              <button className="btn-icon" onClick={() => setSelectedProduct(null)}>
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="seller-modal-body space-y-4">
              <div className="flex gap-4">
                <img
                  src={getMediaUrl(selectedProduct.image) || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300"}
                  alt={selectedProduct.productName}
                  style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }}
                />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 700, color: "var(--merchant-text-heading)" }}>{selectedProduct.productName}</h4>
                  <p className="text-xs text-slate-500" style={{ margin: "2px 0 6px 0" }}>
                    Brand: {selectedProduct.brand || "Brand"} • Category: {selectedProduct.category || "Electronics"}
                  </p>
                  <div className="text-lg font-bold text-navy">{formatPrice(selectedProduct.price)}</div>
                </div>
              </div>

              <div className="seller-grid seller-grid-2 gap-3 text-xs bg-slate-50 p-3 rounded">
                <div><strong>SKU:</strong> {selectedProduct.sku || `SKU-${selectedProduct.productId}`}</div>
                <div><strong>Stock:</strong> {selectedProduct.stock ?? 10} Units</div>
                <div><strong>Warranty:</strong> {selectedProduct.warranty || "1 Year Brand Warranty"}</div>
                <div><strong>Approval:</strong> {selectedProduct.approvalStatus || "Approved"}</div>
              </div>

              <div>
                <strong className="text-xs text-slate-700">Description:</strong>
                <p className="text-xs text-slate-600 mt-1">{selectedProduct.description || "No detailed description provided."}</p>
              </div>

              {selectedProduct.rejectionReason && (
                <div className="seller-alert seller-alert-danger">
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                  <span><strong>Rejection Remark:</strong> {selectedProduct.rejectionReason}</span>
                </div>
              )}
            </div>
            <div className="seller-modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedProduct(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK PRICE UPDATE MODAL */}
      {priceModalItem && (
        <div className="seller-modal-overlay" onClick={() => setPriceModalItem(null)}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "400px" }}>
            <div className="seller-modal-header">
              <h3 className="seller-modal-title">Update Product Price</h3>
              <button className="btn-icon" onClick={() => setPriceModalItem(null)}><X className="w-5 h-5" aria-hidden="true" /></button>
            </div>
            <form onSubmit={handleUpdatePrice}>
              <div className="seller-modal-body space-y-3">
                <p className="text-xs text-slate-600">Update listing price for <strong>{priceModalItem.productName}</strong></p>
                <div>
                  <label className="seller-form-label">Price (INR ₹) *</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    className="seller-form-input"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="seller-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setPriceModalItem(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={updating}>{updating ? "Saving..." : "Save Price"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK STOCK UPDATE MODAL */}
      {stockModalItem && (
        <div className="seller-modal-overlay" onClick={() => setStockModalItem(null)}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "400px" }}>
            <div className="seller-modal-header">
              <h3 className="seller-modal-title">Update Stock Quantity</h3>
              <button className="btn-icon" onClick={() => setStockModalItem(null)}><X className="w-5 h-5" aria-hidden="true" /></button>
            </div>
            <form onSubmit={handleUpdateStock}>
              <div className="seller-modal-body space-y-3">
                <p className="text-xs text-slate-600">Update stock inventory for <strong>{stockModalItem.productName}</strong></p>
                <div>
                  <label className="seller-form-label">Available Units *</label>
                  <input
                    type="number"
                    min="0"
                    className="seller-form-input"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="seller-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setStockModalItem(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={updating}>{updating ? "Saving..." : "Save Stock"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE UPLOAD MODAL */}
      {imageModalItem && (
        <div className="seller-modal-overlay" onClick={() => setImageModalItem(null)}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px" }}>
            <div className="seller-modal-header">
              <h3 className="seller-modal-title">Upload Product Image</h3>
              <button className="btn-icon" onClick={() => setImageModalItem(null)}><X className="w-5 h-5" aria-hidden="true" /></button>
            </div>
            <form onSubmit={handleUploadImage}>
              <div className="seller-modal-body space-y-4">
                <p className="text-xs text-slate-600">Select new image file for <strong>{imageModalItem.productName}</strong></p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setSelectedImageFile(f);
                      setImagePreview(URL.createObjectURL(f));
                    }
                  }}
                  required
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px" }} />
                )}
              </div>
              <div className="seller-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setImageModalItem(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={updating}>{updating ? "Uploading..." : "Upload Image"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProducts;
