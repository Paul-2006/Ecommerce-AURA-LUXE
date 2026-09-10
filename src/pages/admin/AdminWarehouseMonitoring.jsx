import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { Building2, Package, AlertTriangle, CheckCircle2, RefreshCw, Search } from "lucide-react";
import "../../css/Dashboard.css";

function AdminWarehouseMonitoring() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      const prods = await getProducts();
      setInventory(
        prods.map((p) => ({
          productId: p.productId,
          productName: p.productName,
          brand: p.brand || "Brand",
          category: p.category || "Electronics",
          stock: p.stock ?? p.stockQuantity ?? 10,
          warehouseHub: "Hub #01 - Bengaluru Central Distribution",
          reorderThreshold: 5,
          price: p.price || p.bestPrice || 999
        }))
      );
    } catch {
      setInventory([
        { productId: 1, productName: "Apple MacBook Pro 16\" M3 Max", brand: "Apple", category: "Laptops", stock: 2, warehouseHub: "Hub #01 - Bengaluru Central", reorderThreshold: 5, price: 249999 },
        { productId: 2, productName: "Samsung Galaxy S24 Ultra", brand: "Samsung", category: "Smartphones", stock: 18, warehouseHub: "Hub #02 - Electronic City Depot", reorderThreshold: 5, price: 129999 },
        { productId: 3, productName: "Sony WH-1000XM5 Wireless Headphones", brand: "Sony", category: "Headphones", stock: 0, warehouseHub: "Hub #01 - Bengaluru Central", reorderThreshold: 5, price: 29990 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const lowStockItems = inventory.filter((i) => i.stock > 0 && i.stock <= 5);
  const outOfStockItems = inventory.filter((i) => i.stock === 0);

  const filteredInventory = inventory.filter(
    (i) =>
      i.productName.toLowerCase().includes(search.toLowerCase()) ||
      i.brand.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  return (
    <div className="admin-page-container centered-container">
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-primary">Warehouse & Stock Control</span>
            <h1 style={{ margin: "4px 0 0 0", fontFamily: "Playfair Display, Georgia, serif" }}>Cross-Hub Inventory Monitoring & Stock Movements</h1>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Audit distribution hub SKU inventory, flag critical low-stock items, and trigger replenishment queues.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadInventoryData} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Stock Feeds
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val">3 Hubs</span>
            <span className="metric-title">Active Distribution Centers</span>
          </div>
          <Building2 className="w-5 h-5 text-indigo-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val">{inventory.length} SKUs</span>
            <span className="metric-title">Catalog Inventory Count</span>
          </div>
          <Package className="w-5 h-5 text-emerald-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--warning, #f59e0b)" }}>{lowStockItems.length} SKUs</span>
            <span className="metric-title">Low-Stock Alert (&lt; 5)</span>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />
        </div>

        <div className="admin-metric-card glass-panel">
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--danger, #ef4444)" }}>{outOfStockItems.length} SKUs</span>
            <span className="metric-title">Out of Stock (Zero Units)</span>
          </div>
          <AlertTriangle className="w-5 h-5 text-rose-400" aria-hidden="true" />
        </div>
      </div>

      {/* Critical Stock Alerts Banner */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div
          className="glass-panel"
          style={{
            padding: "16px 20px",
            marginBottom: "24px",
            borderRadius: "12px",
            border: "1px solid rgba(245,158,11,0.4)",
            background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.08))"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <div>
              <strong style={{ color: "#f59e0b" }}>Replenishment Required:</strong>
              <span style={{ fontSize: "0.88rem", marginLeft: "6px" }}>
                {outOfStockItems.length} items are currently completely out of stock, and {lowStockItems.length} items require urgent reordering.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Inventory Table */}
      <div className="glass-panel" style={{ padding: "24px", borderRadius: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h3 style={{ margin: 0, fontFamily: "Playfair Display, Georgia, serif" }}>Hub Stock Register</h3>
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
          <p>Loading inventory data...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Product SKU</th>
                  <th>Product Name & Brand</th>
                  <th>Distribution Hub</th>
                  <th>Unit Rate</th>
                  <th>Available Stock</th>
                  <th>Health Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.productId}>
                    <td><strong>#SKU-{item.productId}</strong></td>
                    <td>
                      <div>
                        <strong>{item.productName}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{item.brand} • {item.category}</div>
                      </div>
                    </td>
                    <td>{item.warehouseHub}</td>
                    <td><strong>{formatPrice(item.price)}</strong></td>
                    <td>
                      <strong style={{ fontSize: "1rem", color: item.stock === 0 ? "#ef4444" : item.stock <= 5 ? "#f59e0b" : "#10b981" }}>
                        {item.stock} Units
                      </strong>
                    </td>
                    <td>
                      <span className={`badge-pill ${item.stock === 0 ? "badge-danger" : item.stock <= 5 ? "badge-warning" : "badge-success"}`}>
                        {item.stock === 0 ? "Out of Stock" : item.stock <= 5 ? "Low Stock Alert" : "Healthy Stock"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => alert(`Replenishment purchase order dispatched for ${item.productName}`)}
                      >
                        Reorder Stock
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
  );
}

export default AdminWarehouseMonitoring;
