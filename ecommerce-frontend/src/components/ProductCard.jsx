import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingBag, Eye, Layers, Sparkles, Zap } from "lucide-react";
import { useShop } from "../context/ShopContext";
import QuickViewModal from "./QuickViewModal";
import "../css/ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, compareList, toggleCompare, setActiveNegotiatingProduct } = useShop();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.some(p => p.id === product.id);

  return (
    <>
      <div className="nexus-product-card glass-card">
        {/* Card Header & Badges */}
        <div className="card-media-wrapper">
          <Link to={`/product/${product.id}`}>
            <img src={product.images[0]} alt={product.name} className="product-image" />
          </Link>

          {/* Floating Badges */}
          <div className="card-top-badges">
            {product.badge && (
              <span className={`nexus-badge ${product.badge.includes("AI") ? "nexus-badge-cyan" : "nexus-badge-purple"}`}>
                <Sparkles size={11} /> {product.badge}
              </span>
            )}
            {product.discount > 0 && (
              <span className="nexus-badge nexus-badge-pink">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Quick Action Overlay Floating Bar */}
          <div className="card-overlay-actions">
            <button 
              className={`overlay-icon-btn ${isWishlisted ? "active-pink" : ""}`}
              onClick={() => toggleWishlist(product)}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
            </button>

            <button 
              className={`overlay-icon-btn ${isCompared ? "active-purple" : ""}`}
              onClick={() => toggleCompare(product)}
              title={isCompared ? "In Compare Matrix" : "Add to Compare"}
            >
              <Layers size={16} />
            </button>

            <button 
              className="overlay-icon-btn"
              onClick={() => setIsQuickViewOpen(true)}
              title="Quick Preview"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Card Details Body */}
        <div className="card-info-body">
          <div className="card-category-row">
            <span className="category-tag">{product.category}</span>
            <div className="rating-pill">
              <Star size={13} className="star-gold" fill="currentColor" />
              <span>{product.rating}</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="product-title-link">
            <h3 className="product-title">{product.name}</h3>
          </Link>

          {/* AI Sentiment Score Meter */}
          {product.aiSummary && (
            <div className="ai-sentiment-mini">
              <div className="sentiment-bar">
                <div 
                  className="sentiment-fill" 
                  style={{ width: `${product.aiSummary.positivePercentage}%` }}
                ></div>
              </div>
              <span className="sentiment-text">
                <Zap size={11} className="zap-purple" /> {product.aiSummary.positivePercentage}% Buyer Satisfaction
              </span>
            </div>
          )}

          {/* Price & Action Row */}
          <div className="card-price-row">
            <div className="price-box">
              <span className="current-price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="card-action-btns">
              {/* Negotiate Discount Trigger */}
              <button 
                className="bargain-btn"
                onClick={() => setActiveNegotiatingProduct(product)}
                title="Bargain price with AI negotiator"
              >
                AI Offer
              </button>

              {/* Add to Cart */}
              <button 
                className="add-cart-btn-primary"
                onClick={() => addToCart(product)}
              >
                <ShoppingBag size={16} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal 
          product={product} 
          onClose={() => setIsQuickViewOpen(false)} 
        />
      )}
    </>
  );
};

export default ProductCard;
