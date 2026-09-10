import { useEffect, useState } from "react";
import { Users, Search, RefreshCw, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomerDirectory();
  }, []);

  const loadCustomerDirectory = async () => {
    try {
      setLoading(true);
      setCustomers([
        { customerId: 101, name: "Rahul Sharma", email: "customer@webkadai.com", phone: "+91 98765 43210", city: "Bengaluru", ordersCount: 5, totalSpend: 348999, lastOrderDate: "2026-09-10" },
        { customerId: 102, name: "Priya Nair", email: "priya.nair@example.com", phone: "+91 98765 12345", city: "Chennai", ordersCount: 3, totalSpend: 54490, lastOrderDate: "2026-09-09" },
        { customerId: 103, name: "Amit Patel", email: "amit.p@example.com", phone: "+91 98123 45678", city: "Ahmedabad", ordersCount: 4, totalSpend: 219999, lastOrderDate: "2026-09-08" },
        { customerId: 104, name: "Sneha Reddy", email: "sneha.r@example.com", phone: "+91 99887 66554", city: "Hyderabad", ordersCount: 2, totalSpend: 72899, lastOrderDate: "2026-09-07" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt || 0);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="seller-page-container">
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Buyer Intelligence</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Merchant Customer Directory & Lifetime Value</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Directory of customers who purchased from your merchant catalog, including purchase volume and repeat order counts.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadCustomerDirectory}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Directory
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h3 style={{ margin: 0 }}>Customer Directory ({filteredCustomers.length})</h3>
          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search className="w-4 h-4" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--seller-text-secondary)" }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by name, email, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: "36px" }}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading buyer records...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Customer Name & Contact</th>
                  <th>City Location</th>
                  <th>Orders Placed</th>
                  <th>Merchant Lifetime Spend</th>
                  <th>Recent Order Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c.customerId}>
                    <td><strong>#CUST-{c.customerId}</strong></td>
                    <td>
                      <div>
                        <strong>{c.name}</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)", margin: "2px 0 0 0" }}>{c.email} • {c.phone}</div>
                      </div>
                    </td>
                    <td>{c.city}</td>
                    <td><strong>{c.ordersCount} Orders</strong></td>
                    <td><strong style={{ color: "var(--seller-success)" }}>{formatPrice(c.totalSpend)}</strong></td>
                    <td>{c.lastOrderDate}</td>
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

export default SellerCustomers;
