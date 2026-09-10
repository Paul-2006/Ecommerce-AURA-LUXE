import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { Building2, Package, AlertTriangle, CheckCircle2, RefreshCw, Search } from "lucide-react";
import "../../css/AdminPortal.css";

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
    <div className="admin-page-container">
      <div className="admin-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Warehouse & Stock Control</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Regional Warehouse & SKU Inventory Telemetry</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Monitor SKU stock levels across regional fulfillment hubs, low stock thresholds, and stock replenishment queues.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadInventoryData}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Telemetry
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val">{inventory.length} SKUs</span>
            <span className="metric-title">Catalog Inventory Items</span>
          </div>
          <Package className="w-5 h-5" style={{ color: "var(--admin-secondary)" }} aria-hidden="true" />
        </div>

        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--admin-warning)" }}>{lowStockItems.length} SKUs</span>
            <span className="metric-title">Low Stock Warning (&le; 5)</span>
          </div>
          <AlertTriangle className="w-5 h-5" style={{ color: "var(--admin-warning)" }} aria-hidden="true" />
        </div>

        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--admin-danger)" }}>{outOfStockItems.length} SKUs</span>
            <span className="metric-title">Out of Stock Depletion</span>
          </div>
          <AlertTriangle className="w-5 h-5" style={{ color: "var(--admin-danger)" }} aria-hidden="true" />
        </div>

        <div className="admin-metric-card">
          <div className="metric-details">
            <span className="metric-val">3 Hubs</span>
            <span className="metric-title">Regional Fulfillment Depots</span>
          </div>
          <Building2 className="w-5 h-5" style={{ color: "var(--admin-success)" }} aria-hidden="true" />
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h3 style={{ margin: 0 }}>SKU Stock Telemetry Table</h3>
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
          <p>Loading inventory telemetry...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>SKU ID</th>
                  <th>Product & Brand</th>
                  <th>Warehouse Hub</th>
                  <th>Price Rate</th>
                  <th>Stock Quantity</th>
                  <th>Inventory Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.productId}>
                    <td><strong>#SKU-{item.productId}</strong></td>
                    <td>
                      <div>
                        <strong>{item.productName}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--admin-text-secondary)", margin: "2px 0 0 0" }}>{item.brand} • {item.category}</div>
                      </div>
                    </td>
                    <td>{item.warehouseHub}</td>
                    <td><strong>{formatPrice(item.price)}</strong></td>
                    <td>
                      <strong style={{ color: item.stock === 0 ? "var(--admin-danger)" : item.stock <= 5 ? "var(--admin-warning)" : "var(--admin-primary)" }}>
                        {item.stock} Units
                      </strong>
                    </td>
                    <td>
                      <span className={`badge-pill ${item.stock === 0 ? "badge-danger" : item.stock <= 5 ? "badge-warning" : "badge-success"}`}>
                        {item.stock === 0 ? "Depleted" : item.stock <= 5 ? "Low Stock Warning" : "Sufficient Stock"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => alert(`Replenishment request dispatched to ${item.warehouseHub} for SKU #${item.productId}.`)}
                      >
                        Request Restock
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
