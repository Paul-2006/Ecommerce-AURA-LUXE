import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getSellerProducts, deleteSellerProduct } from "../../services/sellerService";
import "../../css/Dashboard.css";

function MyProducts() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const sellerId = user?.sellerId || 1;
      const res = await getSellerProducts(sellerId);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this stock listing?")) return;
    await deleteSellerProduct(id);
    setProducts((prev) => prev.filter((p) => p.sellerProductId !== id));
    alert("Listing removed from store.");
  };

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amt);

  return (
    <div className="my-products-container centered-container">
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Merchant Inventory & Stock Control</h1>
          <p>Manage active listings, update stock thresholds, and adjust unit pricing.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/seller/add-product")}>
          Add New Listing
        </button>
      </div>

      <div className="glass-panel" style={{ padding: "24px", marginTop: "24px" }}>
        <div className="table-header-bar">
          <h3>Your Active Product Catalog</h3>
          <button className="btn btn-secondary btn-sm" onClick={loadListings}>
            Refresh Listings
          </button>
        </div>

        {loading ? (
          <p>Loading inventory listings...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Listing ID</th>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Unit Price</th>
                  <th>Live Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.sellerProductId || p.productId}>
                    <td><strong>#SP-{p.sellerProductId || p.productId}</strong></td>
                    <td><strong>{p.productName}</strong></td>
                    <td><span className="badge-pill badge-primary">{p.brand || "Brand"}</span></td>
                    <td><strong>{formatPrice(p.price || 999)}</strong></td>
                    <td>
                      <span className={`badge-pill ${(p.stock ?? 10) > 0 ? "badge-success" : "badge-danger"}`}>
                        {(p.stock ?? 10) > 0 ? `${p.stock ?? 10} In Stock` : "Out of Stock"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/seller/edit-product/${p.sellerProductId || p.productId}`)}
                        >
                          Edit Stock
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemove(p.sellerProductId || p.productId)}
                        >
                          Remove
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
  );
}

export default MyProducts;
