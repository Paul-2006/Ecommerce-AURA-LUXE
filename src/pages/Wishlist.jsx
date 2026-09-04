import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getWishlist, removeWishlist } from "../services/wishlistService";
import { addCart } from "../services/cartService";
import "../css/Wishlist.css";

function Wishlist() {
  const navigate = useNavigate();
  const { user, updateCounts } = useContext(AuthContext);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const customerId = user?.customerId || 1;
      const res = await getWishlist(customerId);
      setWishlistItems(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    await removeWishlist(productId);
    setWishlistItems((prev) => prev.filter((i) => i.productId !== productId));
    updateCounts();
  };

  const handleMoveToCart = async (item) => {
    await addCart({
      cartId: localStorage.getItem("cartId") || 1,
      productId: item.productId,
      productName: item.productName,
      price: item.price || 999,
      quantity: 1,
      image: item.image
    });
    await handleRemove(item.productId);
    updateCounts();
    alert(`Moved "${item.productName}" to shopping cart.`);
  };

  const formatPrice = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amt);

  return (
    <div className="wishlist-page-container centered-container">
      {/* Centered Page Header */}
      <div className="page-header center-content">
        <span className="badge-pill badge-primary">Saved Hardware</span>
        <h1>My Wishlist</h1>
        <p>Saved hardware bookmarks and priority items. Move items to your cart when ready.</p>
      </div>

      {loading ? (
        <div className="loading-grid glass-panel center-content">
          <div className="loader-spinner"></div>
          <p>Loading saved items...</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="empty-wishlist-card glass-panel center-content">
          <h2>Your Wishlist is Empty</h2>
          <p>Bookmark items you want to monitor from the product catalog.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/products")}>
            Browse Catalog
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item.wishlistItemId || item.productId} className="wishlist-card glass-panel">
              <img
                src={
                  item.image
                    ? item.image.startsWith("http")
                      ? item.image
                      : `http://localhost:5151${item.image}`
                    : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
                }
                alt={item.productName}
                className="wishlist-img"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
                }}
              />

              <div className="wishlist-body">
                <span className="wishlist-brand">{item.brand || "Verified Brand"}</span>
                <h3 className="wishlist-title">{item.productName}</h3>
                <span className="wishlist-price">{formatPrice(item.price || 999)}</span>

                <div className="wishlist-actions">
                  <button
                    className="btn btn-primary btn-sm btn-block"
                    onClick={() => handleMoveToCart(item)}
                  >
                    Move to Cart
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-block"
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;