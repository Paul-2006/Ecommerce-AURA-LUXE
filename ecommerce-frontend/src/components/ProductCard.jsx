import { useState, useContext, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart, CheckCircle2, Zap } from "lucide-react";
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
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const priceVal = product.price || product.bestPrice || 999;
  const originalPrice = Math.round(priceVal * 1.35); // 35% higher MRP
  const discountPercent = Math.round(((originalPrice - priceVal) / originalPrice) * 100);
  const isOutOfStock = (product.stock ?? product.stockQuantity ?? 10) <= 0;

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
    if (!user) {
      alert("Please log in to add products to your wishlist.");
      navigate("/customer/login");
      return;
    }

    if (loadingWishlist) return;
    setLoadingWishlist(true);

    try {
      if (isWishlisted) {
        await removeWishlist(product.productId);
        setIsWishlisted(false);
      } else {
        await addWishlist({
          customerId: user?.customerId || user?.userId || 1,
          productId: product.productId,
          productName: product.productName,
          brand: product.brand,
          price: priceVal,
          image: getProductImage()
        });
        setIsWishlisted(true);
      }
      updateCounts();
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    } finally {
      setLoadingWishlist(false);
    }
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

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (isOutOfStock) {
      alert("This product is currently out of stock.");
      return;
    }

    if (!user) {
      alert("Please log in to purchase products.");
      navigate("/customer/login");
      return;
    }

    const directItem = {
      productId: product.productId,
      productName: product.productName,
      price: priceVal,
      quantity: 1,
      image: getProductImage(),
      sellerProductId: product.sellerProductId || product.productId
    };

    sessionStorage.setItem("buy_now_direct_item", JSON.stringify(directItem));
    navigate("/checkout");
  };

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.productId}`)}>
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
          disabled={loadingWishlist}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist"
        >
          <Heart size={16} fill={isWishlisted ? "#DC2626" : "none"} stroke={isWishlisted ? "#DC2626" : "#64748B"} aria-hidden="true" />
        </button>

        {/* Brand Pill */}
        {product.brand && <span className="product-brand-tag">{product.brand}</span>}
      </div>

      {/* Product Information Body */}
      <div className="product-card-body">
        {/* Rating & Assured Badge Row */}
        <div className="product-rating-row">
          <span className="rating-pill">
            <Star size={12} fill="currentColor" stroke="none" aria-hidden="true" />
            {product.rating || 4.8}
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

        {/* Action Buttons */}
        <div className="product-card-actions" onClick={(e) => e.stopPropagation()}>
          <div className="actions-top-row">
            <button
              type="button"
              className="btn btn-outline btn-sm btn-specs"
              onClick={() => navigate(`/product/${product.productId}`)}
            >
              Specs
            </button>
            <button
              type="button"
              className={`btn btn-secondary btn-sm add-cart-btn ${addingCart ? "btn-success" : ""}`}
              onClick={handleAddToCart}
              disabled={addingCart || isOutOfStock}
            >
              {addingCart ? (
                <>
                  <CheckCircle2 size={14} aria-hidden="true" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart size={14} aria-hidden="true" /> {t("add_to_cart")}
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm btn-buy-now"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? (
              "Out of Stock"
            ) : (
              <>
                <Zap size={15} aria-hidden="true" /> Buy Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
