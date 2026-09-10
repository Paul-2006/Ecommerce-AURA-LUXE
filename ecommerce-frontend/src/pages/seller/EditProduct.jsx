import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getSellerProducts, updateSellerProduct } from "../../services/sellerService";
import "../../css/Dashboard.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [listing, setListing] = useState({
    sellerId: user?.sellerId || 1,
    productId: "",
    productName: "Loading...",
    price: "",
    stockQuantity: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      const res = await getSellerProducts(user?.sellerId || 1);
      const matched = res.data.find(
        (i) => i.sellerProductId === Number(id) || i.productId === Number(id)
      );
      if (matched) {
        setListing({
          sellerId: user?.sellerId || 1,
          productId: matched.productId,
          productName: matched.productName,
          price: matched.price,
          stockQuantity: matched.stock
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
    <div className="edit-product-container centered-container">
      <div className="auth-card-wrapper glass-panel center-content" style={{ margin: "40px auto" }}>
        <h2>Edit Stock & Pricing</h2>
        <p>Product: <strong>{listing.productName}</strong></p>

        <form className="auth-form" onSubmit={handleSave} style={{ width: "100%" }}>
          <div className="form-group">
            <label className="form-label">Selling Price (₹ INR)</label>
            <input
              type="number"
              step="1"
              value={listing.price}
              onChange={(e) => setListing({ ...listing, price: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Available Stock Units</label>
            <input
              type="number"
              min="0"
              value={listing.stockQuantity}
              onChange={(e) => setListing({ ...listing, stockQuantity: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block">
            Save Stock Changes
          </button>
        </form>

        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/seller/products")}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditProduct;
