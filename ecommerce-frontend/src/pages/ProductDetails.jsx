import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Truck, 
  Bot, 
  Zap, 
  ThumbsUp, 
  MessageSquare,
  ArrowLeft,
  DollarSign
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import "../css/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart, toggleWishlist, wishlist, setActiveNegotiatingProduct } = useShop();

  const product = products.find(p => p.id === parseInt(id)) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview"); // overview, specs, reviews, ai

  // Review Form state
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState(product.reviews || []);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev = {
      id: Date.now(),
      user: "Current User",
      rating: newReviewRating,
      date: new Date().toISOString().split("T")[0],
      comment: newReviewText
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewText("");
  };

  const relatedProducts = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);

  return (
    <div className="product-details-container">
      {/* Back Link */}
      <Link to="/products" className="back-link">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      {/* Main Details Grid */}
      <div className="details-main-grid glass-card">
        {/* Gallery Column */}
        <div className="details-gallery-col">
          <div className="details-main-img-box">
            <img src={product.images[selectedImageIndex]} alt={product.name} />
            {product.badge && (
              <span className="nexus-badge nexus-badge-cyan gallery-badge">
                <Sparkles size={12} /> {product.badge}
              </span>
            )}
          </div>

          <div className="details-thumbnails-row">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                className={`thumb-btn ${idx === selectedImageIndex ? "active-thumb" : ""}`}
                onClick={() => setSelectedImageIndex(idx)}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Column */}
        <div className="details-info-col">
          <span className="details-cat-tag">{product.category}</span>
          <h1 className="details-title">{product.name}</h1>

          <div className="details-rating-row">
            <div className="rating-pill-gold">
              <Star size={15} fill="currentColor" />
              <span>{product.rating}</span>
            </div>
            <span className="rating-count-text">({reviewsList.length} reviews)</span>
            <span className="stock-check"><Check size={14} /> In Stock ({product.stock} units)</span>
          </div>

          <div className="details-price-row">
            <span className="details-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="details-orig-price">${product.originalPrice.toFixed(2)}</span>
            )}
            {product.discount > 0 && (
              <span className="nexus-badge nexus-badge-pink">Save {product.discount}%</span>
            )}
          </div>

          <p className="details-description">{product.description}</p>

          {/* AI Bargain Banner Button */}
          <div className="ai-bargain-banner glass-card">
            <div className="banner-left">
              <Bot size={22} className="bot-purple" />
              <div>
                <strong>AI Price Bargaining Active</strong>
                <span>Propose a custom offer to Nexus AI agent</span>
              </div>
            </div>
            <button 
              className="btn-nexus-purple"
              onClick={() => setActiveNegotiatingProduct(product)}
            >
              <DollarSign size={16} /> Negotiate Offer
            </button>
          </div>

          {/* Actions Row */}
          <div className="details-actions-row">
            <div className="qty-picker">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <button 
              className="btn-nexus-primary flex-1-btn"
              onClick={() => addToCart(product, quantity)}
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>

            <button 
              className={`wishlist-toggle-btn ${isWishlisted ? "wishlisted" : ""}`}
              onClick={() => toggleWishlist(product)}
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Guarantees */}
          <div className="details-perks-row">
            <span><Truck size={16} /> Express Drone Delivery</span>
            <span><ShieldCheck size={16} /> 2-Year Hardware Warranty</span>
          </div>
        </div>
      </div>

      {/* Tabs Section: AI Sentiment & Specs */}
      <div className="details-tabs-container glass-card">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === "overview" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <Sparkles size={16} /> AI Sentiment Breakdown
          </button>
          <button 
            className={`tab-btn ${activeTab === "specs" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("specs")}
          >
            Technical Specifications
          </button>
          <button 
            className={`tab-btn ${activeTab === "reviews" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Customer Reviews ({reviewsList.length})
          </button>
        </div>

        <div className="tab-content-body">
          {activeTab === "overview" && (
            <div className="ai-sentiment-tab-content">
              {product.aiSummary ? (
                <div className="sentiment-analytics-grid">
                  {/* Gauge */}
                  <div className="sentiment-gauge-card glass-card">
                    <div className="gauge-score-circle">
                      <span className="gauge-num">{product.aiSummary.positivePercentage}%</span>
                      <span className="gauge-label">Positive Sentiment</span>
                    </div>
                    <div className="sentiment-bars-group">
                      <div className="s-bar-row">
                        <span>Positive ({product.aiSummary.positivePercentage}%)</span>
                        <div className="s-bar"><div className="s-fill pos" style={{ width: `${product.aiSummary.positivePercentage}%` }}></div></div>
                      </div>
                      <div className="s-bar-row">
                        <span>Neutral ({product.aiSummary.neutralPercentage}%)</span>
                        <div className="s-bar"><div className="s-fill neu" style={{ width: `${product.aiSummary.neutralPercentage}%` }}></div></div>
                      </div>
                      <div className="s-bar-row">
                        <span>Negative ({product.aiSummary.negativePercentage}%)</span>
                        <div className="s-bar"><div className="s-fill neg" style={{ width: `${product.aiSummary.negativePercentage}%` }}></div></div>
                      </div>
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="pros-cons-card glass-card">
                    <h4>Key Highlights Extracted By AI</h4>
                    <div className="pros-list">
                      {product.aiSummary.pros.map((pro, idx) => (
                        <div key={idx} className="pro-chip">
                          <ThumbsUp size={14} className="thumb-green" /> {pro}
                        </div>
                      ))}
                    </div>

                    <div className="ai-verdict-box">
                      <Bot size={18} className="bot-cyan" />
                      <p><strong>AI Executive Summary:</strong> {product.aiSummary.verdict}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>AI Sentiment analysis data loading...</p>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="specs-table-box">
              <table className="specs-table">
                <tbody>
                  {product.specs && Object.entries(product.specs).map(([key, val], idx) => (
                    <tr key={idx}>
                      <td className="spec-name">{key}</td>
                      <td className="spec-val">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="reviews-tab-content">
              {/* Add Review Form */}
              <form className="add-review-form glass-card" onSubmit={handleAddReview}>
                <h4>Write a Customer Review</h4>
                <div className="rating-select-row">
                  <span>Rating:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      type="button" 
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                    >
                      <Star size={18} fill={star <= newReviewRating ? "#f59e0b" : "none"} color="#f59e0b" />
                    </button>
                  ))}
                </div>
                <textarea 
                  rows="3" 
                  placeholder="Share your experience with this product..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                />
                <button type="submit" className="btn-nexus-primary">
                  <MessageSquare size={16} /> Submit Review
                </button>
              </form>

              {/* Existing Reviews */}
              <div className="reviews-list">
                {reviewsList.map(rev => (
                  <div key={rev.id} className="review-card glass-card">
                    <div className="rev-header">
                      <span className="rev-user">{rev.user}</span>
                      <span className="rev-date">{rev.date}</span>
                    </div>
                    <div className="rev-stars">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <p className="rev-comment">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Slider */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2>Related Cyber Gear</h2>
          <div className="products-grid-3">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
