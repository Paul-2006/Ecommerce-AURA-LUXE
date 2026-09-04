import React, { useState } from "react";
import { DollarSign, Bot, X, Sparkles, CheckCircle2, ShoppingBag, ShieldCheck } from "lucide-react";
import { useShop } from "../context/ShopContext";
import "../css/AIPriceNegotiatorModal.css";

const AIPriceNegotiatorModal = () => {
  const { activeNegotiatingProduct, setActiveNegotiatingProduct, addToCart } = useShop();

  const [offerPrice, setOfferPrice] = useState("");
  const [aiStatus, setAiStatus] = useState("idle"); // idle, negotiating, accepted, counter
  const [counterPrice, setCounterPrice] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(null);

  if (!activeNegotiatingProduct) return null;

  const product = activeNegotiatingProduct;

  const handleNegotiate = () => {
    const numericOffer = parseFloat(offerPrice);
    if (!numericOffer || numericOffer <= 0) return;

    setAiStatus("negotiating");

    setTimeout(() => {
      const minAcceptable = product.price * 0.82; // Max 18% discount acceptable
      if (numericOffer >= minAcceptable) {
        setAiStatus("accepted");
        setDiscountPercent(Math.round(((product.price - numericOffer) / product.price) * 100));
      } else {
        const fairCounter = Math.round((product.price * 0.88) * 100) / 100;
        setCounterPrice(fairCounter);
        setDiscountPercent(12);
        setAiStatus("counter");
      }
    }, 1200);
  };

  const handleAcceptDiscount = (finalPrice) => {
    const discountedProduct = {
      ...product,
      price: finalPrice,
      name: `${product.name} (AI Negotiated Deal)`
    };
    addToCart(discountedProduct, 1);
    setActiveNegotiatingProduct(null);
  };

  return (
    <div className="modal-overlay">
      <div className="negotiator-card glass-card">
        <button className="modal-close-btn" onClick={() => setActiveNegotiatingProduct(null)}>
          <X size={20} />
        </button>

        <div className="negotiator-header">
          <div className="bot-avatar-box">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="negotiator-title">Nexus AI Price Negotiator</h3>
            <span className="negotiator-sub">Pitch your counter-offer to unlock instant dynamic discounts!</span>
          </div>
        </div>

        <div className="negotiator-product-summary">
          <img src={product.images[0]} alt={product.name} />
          <div className="summary-info">
            <span className="summary-name">{product.name}</span>
            <span className="summary-list-price">List Price: ${product.price.toFixed(2)}</span>
          </div>
        </div>

        {aiStatus === "idle" && (
          <div className="negotiator-input-area">
            <label>What is your target budget for this item?</label>
            <div className="price-input-wrapper">
              <DollarSign size={18} className="dollar-icon" />
              <input 
                type="number" 
                placeholder={`e.g. ${(product.price * 0.85).toFixed(0)}`}
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
              />
            </div>
            <button className="btn-nexus-purple full-btn" onClick={handleNegotiate}>
              <Sparkles size={16} /> Submit AI Counter-Offer
            </button>
          </div>
        )}

        {aiStatus === "negotiating" && (
          <div className="negotiating-state">
            <Bot size={36} className="bot-spin-glow" />
            <p>Evaluating inventory margin & loyalty algorithm...</p>
          </div>
        )}

        {aiStatus === "accepted" && (
          <div className="negotiate-result-box accepted-box">
            <CheckCircle2 size={36} className="check-emerald" />
            <h4>Deal Accepted by AI Agent! 🎉</h4>
            <p>Your offer of <strong>${parseFloat(offerPrice).toFixed(2)}</strong> ({discountPercent}% OFF) has been approved for instant checkout!</p>
            <button 
              className="btn-nexus-primary full-btn"
              onClick={() => handleAcceptDiscount(parseFloat(offerPrice))}
            >
              <ShoppingBag size={16} /> Claim Deal & Add to Cart
            </button>
          </div>
        )}

        {aiStatus === "counter" && (
          <div className="negotiate-result-box counter-box">
            <Sparkles size={36} className="sparkle-amber" />
            <h4>AI Counter-Offer Proposed!</h4>
            <p>Your target was slightly below floor, but Nexus AI approves a special <strong>12% Discount</strong> deal at <strong>${counterPrice.toFixed(2)}</strong>!</p>
            <button 
              className="btn-nexus-primary full-btn"
              onClick={() => handleAcceptDiscount(counterPrice)}
            >
              <ShoppingBag size={16} /> Accept ${counterPrice.toFixed(2)} Deal
            </button>
          </div>
        )}

        <div className="negotiator-guarantee">
          <ShieldCheck size={14} /> Instant automated authorization code generated upon acceptance
        </div>
      </div>
    </div>
  );
};

export default AIPriceNegotiatorModal;
