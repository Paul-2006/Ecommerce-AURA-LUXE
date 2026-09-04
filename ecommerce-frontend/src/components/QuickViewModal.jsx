import React, { useState } from "react";
import { X, Star, ShoppingBag, Heart, Sparkles, Check, ShieldCheck, Truck } from "lucide-react";
import { useShop } from "../context/ShopContext";
import "../css/ProductDetails.css"; // Reuse & complement styles

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="modal-overlay">
      <div className="quickview-modal-card glass-card">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="quickview-grid">
          {/* Gallery */}
          <div className="quickview-gallery">
            <div className="quickview-main-img-box">
              <img src={product.images[selectedImgIndex]} alt={product.name} />
              {product.badge && (
                <span className="nexus-badge nexus-badge-cyan quick-badge">
                  <Sparkles size={12} /> {product.badge}
                </span>
              )}
            </div>
            <div className="quickview-thumbs">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn ${idx === selectedImgIndex ? "active-thumb" : ""}`}
                  onClick={() => setSelectedImgIndex(idx)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Specs & Add */}
          <div className="quickview-details">
            <span className="quick-category">{product.category}</span>
            <h2 className="quick-title">{product.name}</h2>

            <div className="quick-rating-row">
              <div className="star-rating">
                <Star size={16} fill="currentColor" className="star-gold" />
                <span>{product.rating}</span>
              </div>
              <span className="reviews-count">({product.reviewsCount} customer reviews)</span>
              <span className="stock-status"><Check size={14} /> In Stock ({product.stock} units)</span>
            </div>

            <div className="quick-price-box">
              <span className="quick-price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="quick-orig-price">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="quick-description">{product.description}</p>

            {/* AI Summary Highlight */}
            {product.aiSummary && (
              <div className="quick-ai-box">
                <div className="ai-box-title">
                  <Sparkles size={14} className="sparkle-cyan" /> Nexus AI Verdict
                </div>
                <p className="ai-verdict">{product.aiSummary.verdict}</p>
              </div>
            )}

            {/* Actions */}
            <div className="quick-actions-row">
              <div className="qty-picker">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button
                className="btn-nexus-primary flex-1"
                onClick={() => {
                  addToCart(product, quantity);
                  onClose();
                }}
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>

              <button
                className={`quick-wishlist-btn ${isWishlisted ? "active-wish" : ""}`}
                onClick={() => toggleWishlist(product)}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="quick-perks">
              <span><Truck size={14} /> Free Express Delivery</span>
              <span><ShieldCheck size={14} /> 2-Year Cyber Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
