import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getSellerOrders, updateOrderStatus as apiUpdateOrderStatus } from "../../services/sellerService";
import { ShoppingBag, RefreshCw, Search, Eye, Truck, CheckCircle2, Clock, X, PackageCheck, FileText, User, MapPin, Printer } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerOrders() {
  const { user } = useContext(AuthContext);
  const sellerId = user?.sellerId || user?.userId || 1;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerModal, setCustomerModal] = useState(null);
  const [trackingModal, setTrackingModal] = useState(null);
  const [invoiceModal, setInvoiceModal] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrdersList();
  }, []);

  const loadOrdersList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getSellerOrders(sellerId);
      const raw = res.data || [];
      setOrders(
        raw.map((o) => ({
          orderId: o.orderId || o.id,
          date: o.date || o.orderDate || new Date().toISOString(),
          customer: o.customer || o.customerName || "Rahul Sharma",
          email: o.email || "customer@example.com",
          phone: o.phone || o.customerPhone || "+91 98765 43210",
          address: o.address || o.shippingAddress || "Flat 402, Sunshine Apts, Indiranagar, Bengaluru - 560038",
          items: o.items || [{ name: "Apple MacBook Pro 16\" M3 Max", qty: 1, price: o.totalAmount || 249999 }],
          totalAmount: o.totalAmount || 249999,
          sellerEarnings: o.sellerEarnings || Math.floor((o.totalAmount || 249999) * 0.95),
          platformFee: o.platformFee || Math.floor((o.totalAmount || 249999) * 0.05),
          paymentStatus: o.paymentStatus || "Paid",
          paymentMethod: o.paymentMethod || "Online Verified",
          status: o.status || "Processing",
          carrier: o.carrier || "Express Rider #401",
          trackingNumber: `TRK-${(o.orderId || o.id) * 9871}`
        }))
      );
    } catch (err) {
      console.error("Error loading seller orders:", err);
      setError("Failed to load merchant orders feed.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await apiUpdateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch {
      alert("Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (st) => {
    const s = (st || "").toLowerCase();
    if (s.includes("delivered")) return <span className="seller-badge seller-badge-success">Delivered</span>;
    if (s.includes("shipped") || s.includes("out")) return <span className="seller-badge seller-badge-info">Shipped</span>;
    if (s.includes("packed")) return <span className="seller-badge seller-badge-secondary">Packed</span>;
    if (s.includes("processing") || s.includes("confirmed")) return <span className="seller-badge seller-badge-warning">Processing</span>;
    if (s.includes("cancel") || s.includes("refund")) return <span className="seller-badge seller-badge-danger">Cancelled</span>;
    return <span className="seller-badge seller-badge-secondary">{st}</span>;
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      statusFilter === "All" || o.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesSearch =
      o.orderId.toString().includes(search) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      (o.items && o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase())));
    return matchesStatus && matchesSearch;
  });

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  return (
    <div className="seller-page-container">
      {/* Header Banner */}
      <div className="seller-page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 className="seller-page-title">Orders & Fulfillment Desk</h1>
          <p className="seller-page-subtitle">
            Manage customer orders, package inventory items, trigger logistics dispatch, and generate invoices
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadOrdersList}>
          <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Orders Feed
        </button>
      </div>

      {error && (
        <div className="seller-alert seller-alert-danger mb-4">
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          <span>{error}</span>
          <button className="btn btn-primary btn-sm ml-auto" onClick={loadOrdersList}>Retry</button>
        </div>
      )}

      {/* Main Table Card */}
      <div className="seller-card">
        <div className="seller-card-header flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            {["All", "Pending", "Processing", "Packed", "Shipped", "Delivered", "Cancelled"].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn ${statusFilter === st ? "btn-primary" : "btn-outline"} btn-sm`}
                onClick={() => setStatusFilter(st)}
              >
                {st} Orders
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search Order ID, Customer, Product..."
              className="seller-form-input pl-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="seller-card-body p-0">
          {loading ? (
            <div className="text-center py-12 text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-gold mb-2" aria-hidden="true" />
              Loading merchant order pipeline...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-2" aria-hidden="true" />
              <h3 className="font-semibold text-slate-700">No Orders Found</h3>
              <p className="text-sm text-slate-500">No customer transactions match your status filter or search text.</p>
            </div>
          ) : (
            <div className="seller-table-container">
              <table className="seller-table">
                <thead>
                  <tr>
                    <th>Order ID & Date</th>
                    <th>Customer Name</th>
                    <th>Product Items</th>
                    <th>Order Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Status Action</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o.orderId}>
                      <td>
                        <strong className="block text-sm text-navy">#{o.orderId}</strong>
                        <span className="text-xs text-slate-500">{new Date(o.date).toLocaleDateString("en-IN")}</span>
                      </td>
                      <td>
                        <button
                          className="text-sm font-semibold text-slate-900 hover:text-muted-gold text-left"
                          onClick={() => setCustomerModal(o)}
                        >
                          {o.customer}
                        </button>
                        <div className="text-xs text-slate-500">{o.phone}</div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {o.items.map((i, idx) => (
                            <div key={idx}>
                              {i.name} <span className="text-xs font-semibold text-slate-500">(x{i.qty})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong className="text-sm text-slate-900">{formatPrice(o.totalAmount)}</strong>
                        <div className="text-xs text-emerald-700">Earnings: {formatPrice(o.sellerEarnings)}</div>
                      </td>
                      <td>
                        <span className="seller-badge seller-badge-success">{o.paymentStatus}</span>
                      </td>
                      <td>{getStatusBadge(o.status)}</td>
                      <td>
                        <select
                          className="seller-form-input text-xs"
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.orderId, e.target.value)}
                          disabled={updating}
                          style={{ width: "130px", padding: "4px 8px" }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button className="btn btn-outline btn-sm p-1.5" onClick={() => setSelectedOrder(o)} title="View Order Details">
                            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button className="btn btn-outline btn-sm p-1.5" onClick={() => setTrackingModal(o)} title="Track Delivery">
                            <Truck className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button className="btn btn-outline btn-sm p-1.5" onClick={() => setInvoiceModal(o)} title="View Invoice">
                            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
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
      </div>

      {/* VIEW ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="seller-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "580px" }}>
            <div className="seller-modal-header">
              <h3 className="seller-modal-title">Order Details — #{selectedOrder.orderId}</h3>
              <button className="btn-icon" onClick={() => setSelectedOrder(null)}><X className="w-5 h-5" aria-hidden="true" /></button>
            </div>
            <div className="seller-modal-body space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded">
                <div>
                  <div className="text-xs text-slate-500">Order Date</div>
                  <div className="text-sm font-semibold">{new Date(selectedOrder.date).toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Status</div>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 text-uppercase mb-2">Customer & Delivery Address</h4>
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded space-y-1">
                  <div><strong>Name:</strong> {selectedOrder.customer}</div>
                  <div><strong>Phone:</strong> {selectedOrder.phone}</div>
                  <div><strong>Shipping Address:</strong> {selectedOrder.address}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 text-uppercase mb-2">Items Summary</h4>
                <div className="border rounded">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 border-b last:border-0 text-xs">
                      <div>
                        <strong>{it.name}</strong>
                        <div className="text-slate-500">Qty: {it.qty}</div>
                      </div>
                      <div className="font-bold">{formatPrice(it.price * it.qty)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs border-t">
                <span>Platform Fee (5%): {formatPrice(selectedOrder.platformFee)}</span>
                <strong className="text-sm text-navy">Net Seller Payout: {formatPrice(selectedOrder.sellerEarnings)}</strong>
              </div>
            </div>
            <div className="seller-modal-footer">
              {selectedOrder.status === "Pending" && (
                <>
                  <button className="btn btn-danger" onClick={() => handleStatusChange(selectedOrder.orderId, "Cancelled")}>Reject Order</button>
                  <button className="btn btn-primary" onClick={() => handleStatusChange(selectedOrder.orderId, "Processing")}>Accept Order</button>
                </>
              )}
              {selectedOrder.status === "Processing" && (
                <button className="btn btn-primary" onClick={() => handleStatusChange(selectedOrder.orderId, "Packed")}>Mark Packed</button>
              )}
              {selectedOrder.status === "Packed" && (
                <button className="btn btn-primary" onClick={() => handleStatusChange(selectedOrder.orderId, "Shipped")}>Mark Ready for Shipment</button>
              )}
              <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER DETAILS MODAL */}
      {customerModal && (
        <div className="seller-modal-overlay" onClick={() => setCustomerModal(null)}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px" }}>
            <div className="seller-modal-header">
              <h3 className="seller-modal-title flex items-center gap-2">
                <User className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                Customer Contact Details
              </h3>
              <button className="btn-icon" onClick={() => setCustomerModal(null)}><X className="w-5 h-5" aria-hidden="true" /></button>
            </div>
            <div className="seller-modal-body space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded space-y-2">
                <div><strong>Customer Name:</strong> {customerModal.customer}</div>
                <div><strong>Helpline Mobile:</strong> {customerModal.phone}</div>
                <div><strong>Delivery Address:</strong> {customerModal.address}</div>
                <div><strong>Payment Verification:</strong> {customerModal.paymentStatus} ({customerModal.paymentMethod})</div>
              </div>
            </div>
            <div className="seller-modal-footer">
              <button className="btn btn-secondary" onClick={() => setCustomerModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* TRACKING MODAL */}
      {trackingModal && (
        <div className="seller-modal-overlay" onClick={() => setTrackingModal(null)}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "460px" }}>
            <div className="seller-modal-header">
              <h3 className="seller-modal-title flex items-center gap-2">
                <Truck className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                Logistics Delivery Tracking
              </h3>
              <button className="btn-icon" onClick={() => setTrackingModal(null)}><X className="w-5 h-5" aria-hidden="true" /></button>
            </div>
            <div className="seller-modal-body space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded space-y-1">
                <div><strong>Order ID:</strong> #{trackingModal.orderId}</div>
                <div><strong>Carrier Partner:</strong> {trackingModal.carrier}</div>
                <div><strong>Waybill / Tracking No:</strong> <code>{trackingModal.trackingNumber}</code></div>
                <div><strong>Current Stage:</strong> {trackingModal.status}</div>
              </div>

              <div className="space-y-2 pl-4 border-l-2 border-muted-gold">
                <div><strong>Order Placed:</strong> Payment verified by gateway</div>
                <div><strong>Warehouse Packing:</strong> Package processed and sealed</div>
                <div><strong>Logistics Dispatch:</strong> Handed to courier partner</div>
                <div><strong>Destination Hub:</strong> Dispatched to customer pincode</div>
              </div>
            </div>
            <div className="seller-modal-footer">
              <button className="btn btn-secondary" onClick={() => setTrackingModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE SUMMARY MODAL */}
      {invoiceModal && (
        <div className="seller-modal-overlay" onClick={() => setInvoiceModal(null)}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
            <div className="seller-modal-header">
              <h3 className="seller-modal-title flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                Tax Invoice Summary — #{invoiceModal.orderId}
              </h3>
              <button className="btn-icon" onClick={() => setInvoiceModal(null)}><X className="w-5 h-5" aria-hidden="true" /></button>
            </div>
            <div className="seller-modal-body space-y-4 text-xs">
              <div className="flex justify-between border-b pb-2">
                <div>
                  <strong>AURA LUXE MERCHANT STORE</strong>
                  <div>GSTIN: 27AAACA0000A1Z5</div>
                </div>
                <div className="text-right">
                  <div>Date: {new Date(invoiceModal.date).toLocaleDateString()}</div>
                  <div>Invoice #: INV-{invoiceModal.orderId}</div>
                </div>
              </div>

              <div>
                <strong>Billed To:</strong>
                <div>{invoiceModal.customer}</div>
                <div>{invoiceModal.address}</div>
              </div>

              <table className="w-full border text-xs">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 text-left">Item</th>
                    <th className="p-2 text-right">Qty</th>
                    <th className="p-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceModal.items.map((i, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{i.name}</td>
                      <td className="p-2 text-right">{i.qty}</td>
                      <td className="p-2 text-right">{formatPrice(i.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center font-bold text-sm pt-2">
                <span>Grand Total:</span>
                <span>{formatPrice(invoiceModal.totalAmount)}</span>
              </div>
            </div>
            <div className="seller-modal-footer">
              <button className="btn btn-outline" onClick={() => window.print()}>
                <Printer className="w-4 h-4" aria-hidden="true" /> Print Invoice
              </button>
              <button className="btn btn-secondary" onClick={() => setInvoiceModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerOrders;