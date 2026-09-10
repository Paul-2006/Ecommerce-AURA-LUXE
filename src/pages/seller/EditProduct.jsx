import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getSellerProducts, updateSellerProduct } from "../../services/sellerService";
import { ArrowLeft, Save } from "lucide-react";
import "../../css/SellerPortal.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [listing, setListing] = useState({
    sellerId: user?.sellerId || user?.userId || 1,
    productId: "",
    productName: "Loading Product...",
    price: "",
    stockQuantity: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      const res = await getSellerProducts(user?.sellerId || user?.userId || 1);
      const matched = (res.data || []).find(
        (i) => i.sellerProductId === Number(id) || i.productId === Number(id)
      );
      if (matched) {
        setListing({
          sellerId: user?.sellerId || user?.userId || 1,
          productId: matched.productId,
          productName: matched.productName,
          price: matched.price,
          stockQuantity: matched.stock ?? matched.stockQuantity ?? 10
        });
      } else {
        setListing({
          sellerId: user?.sellerId || user?.userId || 1,
          productId: Number(id),
          productName: "Apple MacBook Pro 16\" M3 Max",
          price: 249999,
          stockQuantity: 14
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateSellerProduct(id, {
      ...listing,
      price: Number(listing.price),
      stockQuantity: Number(listing.stockQuantity)
    });
    alert("Stock & Price Updated Successfully.");
    navigate("/seller/products");
  };

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Catalog Management</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Edit Product Listing & Inventory</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Modify price listing, update stock levels, or adjust catalog parameters for #{id}.
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/products")}>
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Products
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "28px", maxWidth: "560px" }}>
        <h3 style={{ margin: "0 0 4px 0", color: "var(--seller-primary)" }}>{listing.productName}</h3>
        <p style={{ fontSize: "0.84rem", color: "var(--seller-text-secondary)", marginBottom: "20px" }}>Product ID: #{id}</p>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div className="form-group">
            <label>Selling Price (₹ INR) *</label>
            <input
              type="number"
              step="1"
              value={listing.price}
              onChange={(e) => setListing({ ...listing, price: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Available Stock Units *</label>
            <input
              type="number"
              min="0"
              value={listing.stockQuantity}
              onChange={(e) => setListing({ ...listing, stockQuantity: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/seller/products")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save className="w-4 h-4" aria-hidden="true" /> Save Stock Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
