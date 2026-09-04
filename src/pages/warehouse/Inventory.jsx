import { useState, useEffect } from "react";
import { getProducts } from "../../services/productService";
import "../../css/Dashboard.css";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [scannedCode, setScannedCode] = useState("");
  const [scanType, setScanType] = useState("inbound"); // inbound (+), outbound (-)
  const [scanQty, setScanQty] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [lastScannedItem, setLastScannedItem] = useState(null);
  const [scanLogs, setScanLogs] = useState([
    {
      id: 1,
      sku: "SKU-MBP-16",
      name: "Apple MacBook Pro 16\"",
      type: "Inbound (+5)",
      shelf: "Shelf A-04",
      time: new Date(Date.now() - 1800000).toLocaleTimeString()
    },
    {
      id: 2,
      sku: "SKU-SNY-XM5",
      name: "Sony WH-1000XM5",
      type: "Dispatched (-2)",
      shelf: "Shelf B-12",
      time: new Date(Date.now() - 3600000).toLocaleTimeString()
    }
  ]);

  useEffect(() => {
    loadWarehouseProducts();
  }, []);

  const loadWarehouseProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleSimulateScan = (presetSku) => {
    const code = presetSku || scannedCode;
    if (!code) {
      alert("Please enter or select a Barcode / SKU code to scan.");
      return;
    }

    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      // Find matching product
      let matched = products.find(
        (p) =>
          `SKU-${p.productId}`.toLowerCase() === code.toLowerCase() ||
          p.productName.toLowerCase().includes(code.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase() === code.toLowerCase())
      );

      if (!matched) {
        matched = products[0];
      }

      const diff = scanType === "inbound" ? Number(scanQty) : -Number(scanQty);
      const newStock = Math.max(0, (matched.stock || 10) + diff);

      // Update product stock locally
      setProducts((prev) =>
        prev.map((p) => (p.productId === matched.productId ? { ...p, stock: newStock } : p))
      );

      setLastScannedItem({
        ...matched,
        stock: newStock,
        diff,
        shelf: `Shelf ${String.fromCharCode(65 + (matched.productId % 5))}-${(matched.productId * 3) % 20 + 1}`
      });

      // Add to Scan Audit Log
      setScanLogs((prev) => [
        {
          id: Date.now(),
          sku: `SKU-00${matched.productId}`,
          name: matched.productName,
          type: scanType === "inbound" ? `Inbound (+${scanQty})` : `Outbound (-${scanQty})`,
          shelf: `Shelf ${String.fromCharCode(65 + (matched.productId % 5))}-${(matched.productId * 3) % 20 + 1}`,
          time: new Date().toLocaleTimeString()
        },
        ...prev
      ]);

      setScannedCode("");
    }, 600);
  };

  return (
    <div className="warehouse-inventory-container centered-container">
      {/* Header */}
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Warehouse Stock & Barcode Scanner Console</h1>
          <p>Maintain accurate real-time inventory records by scanning barcodes, adjusting stock, and logging batches.</p>
        </div>
      </div>

      {/* Main Interactive Scanner Grid */}
      <div className="scanner-interactive-grid">
        {/* Left Column: Barcode & Optical Scanner Tool */}
        <div className="scanner-control-card glass-panel">
          <div className="scanner-header-row">
            <span className="badge-pill badge-primary">Optical Laser Scanner</span>
            <span className="live-pulse-dot"></span>
          </div>

          {/* Animated Viewport Laser Simulator */}
          <div className="scanner-camera-viewport">
            <div className={`laser-scan-line ${scanning ? "active" : ""}`}></div>
            <div className="scanner-reticle">
              <div className="reticle-corner top-left"></div>
              <div className="reticle-corner top-right"></div>
              <div className="reticle-corner bottom-left"></div>
              <div className="reticle-corner bottom-right"></div>
            </div>

            <div className="barcode-watermark">
              <span className="barcode-bars">||| | |||| | || ||| || |||</span>
              <span className="scanner-status-text">
                {scanning ? "READING BARCODE / QR CODE..." : "POSITION BARCODE IN RETICLE"}
              </span>
            </div>
          </div>

          {/* Quick SKU Barcode Presets */}
          <div className="preset-barcodes-box">
            <span className="preset-label">Quick Scan SKU Barcodes:</span>
            <div className="preset-chips-row">
              <button className="btn btn-secondary btn-sm" onClick={() => handleSimulateScan("MacBook")}>
                SKU-MBP-16
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => handleSimulateScan("Sony")}>
                SKU-SNY-XM5
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => handleSimulateScan("Samsung")}>
                SKU-S24-ULTRA
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => handleSimulateScan("Dell")}>
                SKU-DELL-XPS
              </button>
            </div>
          </div>

          {/* Scanner Input Controls */}
          <form
            className="scanner-action-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSimulateScan();
            }}
          >
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Scan Action</label>
                <select
                  value={scanType}
                  onChange={(e) => setScanType(e.target.value)}
                  className="input-modern"
                >
                  <option value="inbound">Inbound Stock (+ Receive)</option>
                  <option value="outbound">Outbound Dispatch (- Packing)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Batch Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={scanQty}
                  onChange={(e) => setScanQty(e.target.value)}
                  className="input-modern"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Manual Barcode / SKU Code</label>
              <input
                type="text"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                placeholder="Scan or type barcode (e.g., SKU-MBP-16)"
                className="input-modern"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={scanning}>
              {scanning ? "Scanning Code..." : "Trigger Optical Barcode Scan"}
            </button>
          </form>

          {/* Last Scanned Result Confirmation */}
          {lastScannedItem && (
            <div className="scan-success-alert">
              <div className="scan-alert-header">
                <strong>Scan Confirmed: {lastScannedItem.productName}</strong>
                <span className={`badge-pill ${lastScannedItem.diff > 0 ? "badge-success" : "badge-primary"}`}>
                  {lastScannedItem.diff > 0 ? `+${lastScannedItem.diff} Added` : `${lastScannedItem.diff} Deducted`}
                </span>
              </div>
              <p>Updated Shelf Stock: <strong>{lastScannedItem.stock} units</strong> • Location: <strong>{lastScannedItem.shelf}</strong></p>
            </div>
          )}
        </div>

        {/* Right Column: Scan History & Current Live Stock Table */}
        <div className="scanner-logs-column">
          {/* Scan Audit Log */}
          <div className="scanner-log-card glass-panel">
            <div className="log-card-header">
              <h3>Real-Time Barcode Scan Log</h3>
              <span className="badge-pill badge-primary">{scanLogs.length} Records</span>
            </div>

            <div className="table-responsive">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>SKU Code</th>
                    <th>Product</th>
                    <th>Movement</th>
                    <th>Shelf</th>
                  </tr>
                </thead>
                <tbody>
                  {scanLogs.map((log) => (
                    <tr key={log.id}>
                      <td><span className="log-time">{log.time}</span></td>
                      <td><strong>{log.sku}</strong></td>
                      <td>{log.name}</td>
                      <td>
                        <span className={`badge-pill ${log.type.includes("+") ? "badge-success" : "badge-warning"}`}>
                          {log.type}
                        </span>
                      </td>
                      <td><span className="shelf-tag">{log.shelf}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Current Inventory Stock Summary */}
          <div className="scanner-log-card glass-panel">
            <div className="log-card-header">
              <h3>Warehouse Stock Level Master Table</h3>
              <button className="btn btn-secondary btn-sm" onClick={loadWarehouseProducts}>
                Refresh
              </button>
            </div>

            <div className="table-responsive">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>SKU / ID</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Available Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.productId}>
                      <td><strong>SKU-00{p.productId}</strong></td>
                      <td>{p.productName}</td>
                      <td>{p.category || "Electronics"}</td>
                      <td><strong className="stock-count-val">{p.stock ?? 10} Units</strong></td>
                      <td>
                        <span className={`badge-pill ${(p.stock ?? 10) > 5 ? "badge-success" : "badge-warning"}`}>
                          {(p.stock ?? 10) > 5 ? "Optimal Stock" : "Low Stock"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;