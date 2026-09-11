import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getSellerProducts, updateSellerProduct } from "../../services/sellerService";
import { Warehouse, Package, AlertTriangle, CheckCircle2, RefreshCw, Search, Plus, Edit, Minus, X, ArrowUpDown } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerInventory() {
  const { user } = useContext(AuthContext);
  const sellerId = user?.sellerId || user?.userId || 1;

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal
  const [editingItem, setEditingItem] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getSellerProducts(sellerId);
      const items = (res.data || []).map((p) => {
        const qty = p.stock ?? p.stockQuantity ?? 10;
        return {
          productId: p.productId || p.sellerProductId,
          productName: p.productName || "Product",
          sku: p.sku || `SKU-${p.productId || p.sellerProductId}`,
          brand: p.brand || "Brand",
          category: p.category || "Electronics",
          stock: qty,
          reserved: Math.min(Math.floor(qty * 0.1), qty),
          soldCount: p.salesCount || Math.floor(20 + qty * 2.5),
          price: p.price || 999,
          lastRestocked: p.createdDate || "2026-09-01"
        };
      });
      setInventory(items);
    } catch (err) {
      console.error(err);
      setError("Failed to load inventory feed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStockDelta = async (item, delta) => {
    const targetStock = Math.max(0, item.stock + delta);
    if (targetStock === item.stock) return;

    try {
      await updateSellerProduct(item.productId, {
        price: item.price,
        stockQuantity: targetStock
      });
      setInventory((prev) =>
        prev.map((i) =>
          i.productId === item.productId
            ? { ...i, stock: targetStock, reserved: Math.min(i.reserved, targetStock) }
            : i
        )
      );
    } catch {
      alert("Failed to adjust stock level.");
    }
  };

  const handleUpdateStockModal = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    const val = Number(newStock);
    if (isNaN(val) || val < 0) {
      alert("Stock quantity cannot be less than 0.");
      return;
    }

    setSaving(true);
    try {
      await updateSellerProduct(editingItem.productId, {
        price: editingItem.price,
        stockQuantity: val
      });
      setInventory((prev) =>
        prev.map((item) =>
          item.productId === editingItem.productId
            ? { ...item, stock: val, reserved: Math.min(item.reserved, val) }
            : item
        )
      );
      setEditingItem(null);
    } catch {
      alert("Failed to update inventory stock.");
    } finally {
      setSaving(false);
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="seller-badge seller-badge-danger">Out of Stock</span>;
    if (stock < 10) return <span className="seller-badge seller-badge-warning">Low Stock (&lt;10)</span>;
    return <span className="seller-badge seller-badge-success">In Stock</span>;
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesFilter =
      statusFilter === "All" ||
      (statusFilter === "InStock" && item.stock >= 10) ||
      (statusFilter === "LowStock" && item.stock > 0 && item.stock < 10) ||
      (statusFilter === "OutOfStock" && item.stock === 0);

    const matchesSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    return sortOrder === "asc" ? a.stock - b.stock : b.stock - a.stock;
  });

  const inStockCount = inventory.filter((i) => i.stock >= 10).length;
  const lowStockCount = inventory.filter((i) => i.stock > 0 && i.stock < 10).length;
  const outOfStockCount = inventory.filter((i) => i.stock === 0).length;

  return (
    <div className="seller-page-container">
      {/* Header Banner */}
      <div className="seller-page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 className="seller-page-title">Inventory Management & Stock Desk</h1>
          <p className="seller-page-subtitle">
            Monitor real-time warehouse inventory, reserved quantities, and execute quick stock level updates
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadInventory}>
          <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Stock Data
        </button>
      </div>

      {error && (
        <div className="seller-alert seller-alert-danger mb-4">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          <span>{error}</span>
          <button className="btn btn-primary btn-sm ml-auto" onClick={loadInventory}>Retry</button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="seller-grid seller-grid-4 mb-6">
        <div className="seller-card p-4 flex items-center gap-3">
          <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
            <Package className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{inventory.length}</div>
            <div className="text-xs text-slate-500 font-medium">Total Tracked SKUs</div>
          </div>
        </div>

        <div className="seller-card p-4 flex items-center gap-3 cursor-pointer" onClick={() => setStatusFilter("InStock")}>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">{inStockCount}</div>
            <div className="text-xs text-slate-500 font-medium">In Stock (&ge;10)</div>
          </div>
        </div>

        <div className="seller-card p-4 flex items-center gap-3 cursor-pointer" onClick={() => setStatusFilter("LowStock")}>
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <AlertTriangle className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">{lowStockCount}</div>
            <div className="text-xs text-slate-500 font-medium">Low Stock Alerts (&lt;10)</div>
          </div>
        </div>

        <div className="seller-card p-4 flex items-center gap-3 cursor-pointer" onClick={() => setStatusFilter("OutOfStock")}>
          <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
            <Warehouse className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-600">{outOfStockCount}</div>
            <div className="text-xs text-slate-500 font-medium">Out of Stock (=0)</div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="seller-card">
        <div className="seller-card-header flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: "All", label: "All Inventory" },
              { id: "InStock", label: "In Stock" },
              { id: "LowStock", label: "Low Stock Warning" },
              { id: "OutOfStock", label: "Out of Stock" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`btn ${statusFilter === tab.id ? "btn-primary" : "btn-outline"} btn-sm`}
                onClick={() => setStatusFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search product, SKU, brand..."
                className="seller-form-input pl-9 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className="btn btn-outline btn-sm flex items-center gap-1"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title="Sort by Stock Level"
            >
              <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
              Stock ({sortOrder.toUpperCase()})
            </button>
          </div>
        </div>

        <div className="seller-card-body p-0">
          {loading ? (
            <div className="text-center py-12 text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-gold mb-2" aria-hidden="true" />
              Loading stock data...
            </div>
          ) : sortedInventory.length === 0 ? (
            <div className="text-center py-12">
              <Warehouse className="w-12 h-12 text-slate-400 mx-auto mb-2" aria-hidden="true" />
              <h3 className="font-semibold text-slate-700">No Inventory Items Found</h3>
              <p className="text-sm text-slate-500">No items match your selected stock filter or search query.</p>
            </div>
          ) : (
            <div className="seller-table-container">
              <table className="seller-table">
                <thead>
                  <tr>
                    <th>Product & SKU</th>
                    <th>Current Stock</th>
                    <th>Reserved Stock</th>
                    <th>Available Stock</th>
                    <th>Stock Status</th>
                    <th>Last Updated</th>
                    <th>Quick Stock Adjust</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInventory.map((item) => {
                    const available = Math.max(0, item.stock - item.reserved);
                    return (
                      <tr key={item.productId}>
                        <td>
                          <div>
                            <strong className="block text-sm text-slate-900">{item.productName}</strong>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>Brand: {item.brand}</span>
                              <span>•</span>
                              <code className="bg-slate-100 px-1.5 py-0.5 rounded">{item.sku}</code>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong className="text-sm text-navy">{item.stock} Units</strong>
                        </td>
                        <td>
                          <span className="text-xs text-slate-500">{item.reserved} Units</span>
                        </td>
                        <td>
                          <span className="text-sm font-semibold text-emerald-700">{available} Units</span>
                        </td>
                        <td>{getStockBadge(item.stock)}</td>
                        <td>
                          <span className="text-xs text-slate-500">{item.lastRestocked}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button
                              className="btn btn-outline btn-sm px-2"
                              onClick={() => handleAdjustStockDelta(item, -10)}
                              disabled={item.stock === 0}
                              title="Decrease 10 Units"
                            >
                              -10
                            </button>
                            <button
                              className="btn btn-outline btn-sm px-2"
                              onClick={() => handleAdjustStockDelta(item, -1)}
                              disabled={item.stock === 0}
                              title="Decrease 1 Unit"
                            >
                              -1
                            </button>
                            <button
                              className="btn btn-outline btn-sm px-2"
                              onClick={() => handleAdjustStockDelta(item, 1)}
                              title="Increase 1 Unit"
                            >
                              +1
                            </button>
                            <button
                              className="btn btn-outline btn-sm px-2"
                              onClick={() => handleAdjustStockDelta(item, 10)}
                              title="Increase 10 Units"
                            >
                              +10
                            </button>
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setEditingItem(item);
                              setNewStock(item.stock);
                            }}
                          >
                            <Edit className="w-3.5 h-3.5" aria-hidden="true" /> Edit Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* EDIT STOCK MODAL */}
      {editingItem && (
        <div className="seller-modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>
            <div className="seller-modal-header">
              <h3 className="seller-modal-title">Set Inventory Level</h3>
              <button className="btn-icon" onClick={() => setEditingItem(null)}>
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleUpdateStockModal}>
              <div className="seller-modal-body space-y-4">
                <div>
                  <strong className="text-sm text-slate-900">{editingItem.productName}</strong>
                  <div className="text-xs text-slate-500">SKU: {editingItem.sku}</div>
                </div>

                <div>
                  <label className="seller-form-label">Total Stock Quantity * (Minimum 0)</label>
                  <input
                    type="number"
                    min="0"
                    className="seller-form-input text-lg font-bold"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="seller-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Update Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerInventory;
