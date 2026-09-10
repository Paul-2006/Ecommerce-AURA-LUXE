import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { addCart } from "../services/cartService";
import { addWishlist, removeWishlist, getLocalWishlist } from "../services/wishlistService";
import { getMediaUrl } from "../services/api";
import "../css/ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user, updateCounts } = useContext(AuthContext);
  const { t } = useLanguage();

  const [isWishlisted, setIsWishlisted] = useState(() => {
    const local = getLocalWishlist();
    return local.some((item) => item.productId === product.productId);
  });
  const [addingCart, setAddingCart] = useState(false);

  const priceVal = product.price || product.bestPrice || 999;
  const originalPrice = Math.round(priceVal * 1.35); // 35% higher MRP
  const discountPercent = Math.round(((originalPrice - priceVal) / originalPrice) * 100);

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(priceVal);

  const formattedOriginal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(originalPrice);

  const getProductImage = () => {
    if (product.image) {
      return getMediaUrl(product.image);
    }
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      await removeWishlist(product.productId);
      setIsWishlisted(false);
    } else {
      await addWishlist({
        customerId: user?.customerId || 1,
        productId: product.productId,
        productName: product.productName,
        brand: product.brand,
        price: priceVal,
        image: getProductImage()
      });
      setIsWishlisted(true);
    }
    updateCounts();
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setAddingCart(true);
    try {
      await addCart({
        cartId: localStorage.getItem("cartId") || 1,
        productId: product.productId,
        productName: product.productName,
        price: priceVal,
        quantity: 1,
        image: getProductImage()
      });
      updateCounts();
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setAddingCart(false), 500);
    }
  };

  return (
    <div className="product-card glass-panel" onClick={() => navigate(`/product/${product.productId}`)}>
      {/* Top Media, Badges & Wishlist Action */}
      <div className="product-card-media">
        <img
          src={getProductImage()}
          alt={product.productName}
          loading="lazy"
          className="product-card-img"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
          }}
        />

        {/* Wishlist Heart Action */}
        <button
          type="button"
          className={`wishlist-toggle-btn ${isWishlisted ? "active" : ""}`}
          onClick={handleToggleWishlist}
          title={isWishlisted ? "Remove from Saved" : "Save Item"}
          aria-label="Wishlist"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill={isWishlisted ? "#ef4444" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {/* Brand Pill */}
        {product.brand && <span className="product-brand-tag">{product.brand}</span>}
      </div>

      {/* Product Information Body */}
      <div className="product-card-body">
        {/* Rating & Assured Badge Row */}
        <div className="product-rating-row">
          <span className="rating-pill">
            ★ {product.rating || 4.8}
          </span>
          <span className="rating-count">({product.reviewsCount || 342})</span>
          <span className="badge-pill badge-assured">Assured</span>
        </div>

        <h3 className="product-title" title={product.productName}>
          {product.productName}
        </h3>

        <p className="product-desc">
          {product.description || "High performance specification backed by genuine manufacturer warranty."}
        </p>

        {/* Price, MRP & Discount */}
        <div className="product-pricing-cluster">
          <div className="price-primary-row">
            <span className="price-value">{formattedPrice}</span>
            <span className="price-mrp">{formattedOriginal}</span>
            <span className="price-discount-pill">{discountPercent}% {t("discount")}</span>
          </div>
          <span className="delivery-speed-tag">{t("free_delivery")}</span>
        </div>

        {/* Stock & Action Buttons */}
        <div className="product-card-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/product/${product.productId}`)}
          >
            Specs
          </button>
          <button
            type="button"
            className={`btn btn-primary btn-sm add-cart-btn ${addingCart ? "btn-success" : ""}`}
            onClick={handleAddToCart}
            disabled={addingCart}
          >
            {addingCart ? "Added" : t("add_to_cart")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
