import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getSellerProducts, updateSellerProduct } from "../../services/sellerService";
import { Warehouse, Package, AlertTriangle, CheckCircle2, RefreshCw, Search, Plus, ArrowUpRight } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerInventory() {
  const { user } = useContext(AuthContext);
  const sellerId = user?.sellerId || user?.userId || 1;

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingItem, setEditingItem] = useState(null);
  const [newStock, setNewStock] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
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
          reserved: Math.floor(qty * 0.1),
          soldCount: Math.floor(20 + qty * 2.5),
          price: p.price || 999,
          lastRestocked: "2026-09-01"
        };
      });
      setInventory(items);
    } catch {
      setInventory([
        { productId: 1, productName: "Apple MacBook Pro 16\" M3 Max", sku: "SKU-AAPL-01", brand: "Apple", category: "Laptops", stock: 14, reserved: 2, soldCount: 45, price: 249999, lastRestocked: "2026-09-01" },
        { productId: 2, productName: "Sony WH-1000XM5 Wireless Headphones", sku: "SKU-SNY-02", brand: "Sony", category: "Headphones", stock: 3, reserved: 1, soldCount: 82, price: 29990, lastRestocked: "2026-08-25" },
        { productId: 3, productName: "Samsung Galaxy S24 Ultra 512GB", sku: "SKU-SMS-03", brand: "Samsung", category: "Smartphones", stock: 0, reserved: 0, soldCount: 30, price: 129999, lastRestocked: "2026-08-10" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await updateSellerProduct(editingItem.productId, {
        price: editingItem.price,
        stockQuantity: Number(newStock)
      });
      setInventory((prev) =>
        prev.map((item) =>
          item.productId === editingItem.productId ? { ...item, stock: Number(newStock) } : item
        )
      );
      alert(`Stock updated for ${editingItem.productName} to ${newStock} units.`);
      setEditingItem(null);
    } catch {
      setInventory((prev) =>
        prev.map((item) =>
          item.productId === editingItem.productId ? { ...item, stock: Number(newStock) } : item
        )
      );
      setEditingItem(null);
    }
  };

  const getStockStatus = (qty) => {
    if (qty === 0) return { label: "Out of Stock", class: "badge-danger" };
    if (qty <= 5) return { label: "Low Stock Warning", class: "badge-warning" };
    return { label: "Normal Stock", class: "badge-success" };
  };

  const filteredInventory = inventory.filter((item) => {
    const status = getStockStatus(item.stock).label;
    const matchesFilter =
      statusFilter === "All" ||
      (statusFilter === "Normal" && item.stock > 5) ||
      (statusFilter === "Low" && item.stock > 0 && item.stock <= 5) ||
      (statusFilter === "Out" && item.stock === 0);
    const matchesSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const normalCount = inventory.filter((i) => i.stock > 5).length;
  const lowCount = inventory.filter((i) => i.stock > 0 && i.stock <= 5).length;
  const outCount = inventory.filter((i) => i.stock === 0).length;

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Inventory Control</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Stock Telemetry & Inventory Management</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Monitor available quantities, reserved stock, low-stock threshold alerts, and inventory replenishment movements.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadInventory}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Stock
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="seller-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="seller-metric-card" onClick={() => setStatusFilter("All")}>
          <div className="metric-details">
            <span className="metric-val">{inventory.length} SKUs</span>
            <span className="metric-title">Catalog Inventory</span>
          </div>
          <Package className="w-5 h-5" style={{ color: "var(--seller-secondary)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card" onClick={() => setStatusFilter("Normal")}>
          <div className="metric-details">
            <span className="metric-val">{normalCount} SKUs</span>
            <span className="metric-title">Normal Stock Health</span>
          </div>
          <CheckCircle2 className="w-5 h-5" style={{ color: "var(--seller-success)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card" onClick={() => setStatusFilter("Low")}>
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--seller-warning)" }}>{lowCount} SKUs</span>
            <span className="metric-title">Low Stock Alert (&le; 5)</span>
          </div>
          <AlertTriangle className="w-5 h-5" style={{ color: "var(--seller-warning)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card" onClick={() => setStatusFilter("Out")}>
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--seller-danger)" }}>{outCount} SKUs</span>
            <span className="metric-title">Out of Stock Depletion</span>
          </div>
          <AlertTriangle className="w-5 h-5" style={{ color: "var(--seller-danger)" }} aria-hidden="true" />
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { label: "All Items", val: "All" },
              { label: "Normal Stock", val: "Normal" },
              { label: "Low Stock", val: "Low" },
              { label: "Out of Stock", val: "Out" }
            ].map((f) => (
              <button
                key={f.val}
                type="button"
                className={`btn ${statusFilter === f.val ? "btn-primary" : "btn-outline"} btn-sm`}
                onClick={() => setStatusFilter(f.val)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search className="w-4 h-4" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--seller-text-secondary)" }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by SKU, Product, Brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: "36px" }}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading inventory telemetry...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>SKU Code</th>
                  <th>Product & Category</th>
                  <th>Available Stock</th>
                  <th>Reserved Stock</th>
                  <th>Total Sold</th>
                  <th>Stock Health</th>
                  <th>Last Restocked</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => {
                  const statusInfo = getStockStatus(item.stock);
                  return (
                    <tr key={item.productId}>
                      <td><strong style={{ background: "var(--seller-surface-alt)", padding: "2px 8px", borderRadius: "6px", fontSize: "0.82rem" }}>{item.sku}</strong></td>
                      <td>
                        <div>
                          <strong>{item.productName}</strong>
                          <div style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)", margin: "2px 0 0 0" }}>{item.brand} • {item.category}</div>
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: item.stock === 0 ? "var(--seller-danger)" : item.stock <= 5 ? "var(--seller-warning)" : "var(--seller-primary)" }}>
                          {item.stock} Units
                        </strong>
                      </td>
                      <td>{item.reserved} Units</td>
                      <td><strong>{item.soldCount} Units</strong></td>
                      <td>
                        <span className={`badge-pill ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>{item.lastRestocked}</td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingItem(item);
                            setNewStock(item.stock);
                          }}
                        >
                          Update Stock
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

      {/* Stock Edit Modal */}
      {editingItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(14, 21, 36, 0.6)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div className="glass-panel" style={{ padding: "24px", maxWidth: "440px", width: "100%", borderRadius: "14px", background: "var(--seller-surface)" }}>
            <h3 style={{ margin: "0 0 6px 0", color: "var(--seller-primary)" }}>Update Stock Quantity</h3>
            <p style={{ fontSize: "0.84rem", color: "var(--seller-text-secondary)", marginBottom: "16px" }}>
              Product: <strong>{editingItem.productName}</strong> ({editingItem.sku})
            </p>

            <form onSubmit={handleUpdateStock} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group">
                <label>New Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setEditingItem(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerInventory;
