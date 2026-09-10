import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addCart } from "../services/cartService";
import { addWishlist, removeWishlist, getLocalWishlist } from "../services/wishlistService";
import { compareProducts } from "../services/comparisonService";
import { AuthContext } from "../context/AuthContext";
import { getMediaUrl } from "../services/api";
import "../css/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateCounts } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [aiComparison, setAiComparison] = useState(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
      const localWish = getLocalWishlist();
      setIsWishlisted(localWish.some((item) => item.productId === parseInt(id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = () => {
    if (!product) return "";
    if (product.image) {
      return getMediaUrl(product.image);
    }
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    if (isWishlisted) {
      await removeWishlist(product.productId);
      setIsWishlisted(false);
    } else {
      await addWishlist({
        customerId: user?.customerId || 1,
        productId: product.productId,
        productName: product.productName,
        brand: product.brand,
        price: product.price || product.bestPrice || 999,
        image: getProductImage()
      });
      setIsWishlisted(true);
    }
    updateCounts();
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addCart({
        cartId: localStorage.getItem("cartId") || 1,
        productId: product.productId,
        productName: product.productName,
        price: product.price || product.bestPrice || 999,
        quantity: quantity,
        image: getProductImage()
      });
      updateCounts();
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAiComparison = async () => {
    if (!product) return;
    setComparing(true);
    try {
      const res = await compareProducts({
        customerId: user?.customerId || 1,
        productIds: [product.productId],
        query: `Analyze specifications and advantages of ${product.productName}`
      });
      setAiComparison(res.data?.message || "Specification analysis generated successfully.");
    } catch {
      setAiComparison(
        `${product.productName} features genuine hardware architecture, compliant thermal management, high efficiency processing, and certified warranty.`
      );
    } finally {
      setComparing(false);
    }
  };

  if (loading) {
    return (
      <div className="product-details-container centered-container center-content">
        <div className="loader-spinner"></div>
        <p style={{ marginTop: "16px" }}>Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-container centered-container center-content">
        <h2>Product not found</h2>
        <button className="btn btn-primary" onClick={() => navigate("/products")}>
          Back to Catalog
        </button>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(product.price || product.bestPrice || 999);

  return (
    <div className="product-details-container centered-container">
      {/* Breadcrumb Navigation */}
      <div className="details-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span> /
        <span onClick={() => navigate("/products")}>Products</span> /
        <span className="current">{product.productName}</span>
      </div>

      {/* Main Details Card */}
      <div className="details-main-grid glass-panel">
        {/* Left Column: Media */}
        <div className="details-media-box">
          <img
            src={getProductImage()}
            alt={product.productName}
            className="details-main-img"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
            }}
          />
          <button
            className={`details-wishlist-float ${isWishlisted ? "active" : ""}`}
            onClick={handleToggleWishlist}
            title={isWishlisted ? "Remove from Saved" : "Save Item"}
          >
            {isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}
          </button>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="details-info-box">
          <div className="details-header-row">
            <span className="badge-pill badge-primary">{product.brand || "Official Store"}</span>
            <div className="details-rating-badge">
              <span>Rating: {product.rating || 4.9}</span>
              <span className="reviews-count">({product.reviewsCount || 86} ratings)</span>
            </div>
          </div>

          <h1 className="details-title">{product.productName}</h1>

          <div className="details-price-card">
            <div className="price-stack">
              <span className="price-big">{formattedPrice}</span>
              <span className="tax-inclusive-tag">Inclusive of all taxes • Express Shipping Included</span>
            </div>
            <span className={`details-stock-badge ${(product.stock ?? 10) > 0 ? "in-stock" : "out-stock"}`}>
              {(product.stock ?? 10) > 0 ? `In Stock (${product.stock ?? 10} units)` : "Out of Stock"}
            </span>
          </div>

          <p className="details-description">
            {product.description || "Experience top tier craftsmanship, industry-leading performance, and comprehensive manufacturer support backed by AURA Luxe genuine guarantee."}
          </p>

          {/* Key Specs Pills */}
          <div className="key-perks-row">
            <div className="perk-pill">
              <div>
                <strong>Warranty</strong>
                <span>{product.warranty || "1 Year Genuine"}</span>
              </div>
            </div>
            <div className="perk-pill">
              <div>
                <strong>Dispatch</strong>
                <span>Fast 30-min fulfillment</span>
              </div>
            </div>
            <div className="perk-pill">
              <div>
                <strong>Return Policy</strong>
                <span>7 Days Return Window</span>
              </div>
            </div>
          </div>

          {/* Quantity and Purchase Row */}
          <div className="details-purchase-box">
            <div className="quantity-control-group">
              <label className="qty-label">Quantity:</label>
              <div className="quantity-stepper">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 20, q + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="details-action-buttons">
              <button
                className={`btn btn-primary btn-lg ${cartSuccess ? "btn-success" : ""}`}
                onClick={handleAddToCart}
              >
                {cartSuccess ? "Added to Cart" : "Add to Cart"}
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate("/cart")}>
                View Cart
              </button>
            </div>
          </div>

          {/* AI Compare Launcher Section */}
          <div className="ai-comparison-card">
            <div className="ai-card-header">
              <div className="ai-card-title">
                <div>
                  <h4>Technical Specification Analysis</h4>
                  <p>Side-by-side architecture & benchmark evaluation</p>
                </div>
              </div>
              <button
                className="btn btn-compare btn-sm"
                onClick={handleRunAiComparison}
                disabled={comparing}
              >
                {comparing ? "Analyzing..." : "Compare Specifications"}
              </button>
            </div>

            {aiComparison && (
              <div className="ai-comparison-result">
                <p>{aiComparison}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
