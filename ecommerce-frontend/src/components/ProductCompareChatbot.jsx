import React from "react";
import { Layers, X, Sparkles, ShoppingBag, Check, AlertCircle } from "lucide-react";
import { useShop } from "../context/ShopContext";
import "../css/ProductCompareChatbot.css";

const ProductCompareChatbot = () => {
  const { compareList, toggleCompare, isCompareOpen, setIsCompareOpen, addToCart } = useShop();

  if (!isCompareOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="compare-modal-card glass-card">
        {/* Header */}
        <div className="compare-header">
          <div className="compare-header-title">
            <Layers size={22} className="compare-icon-glow" />
            <span>AI Multi-Product Comparison Matrix ({compareList.length}/4)</span>
          </div>
          <button className="modal-close-btn" onClick={() => setIsCompareOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {compareList.length === 0 ? (
          <div className="compare-empty-box">
            <AlertCircle size={40} className="empty-icon" />
            <h3>No products selected for comparison</h3>
            <p>Click the compare icon (<Layers size={14} />) on any product card to add up to 4 items into this AI spec matrix.</p>
          </div>
        ) : (
          <div className="compare-content">
            {/* Spec Matrix Table */}
            <div className="compare-matrix-scroll">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th className="spec-label-col">Specification</th>
                    {compareList.map(p => (
                      <th key={p.id} className="prod-col">
                        <div className="table-prod-header">
                          <button 
                            className="remove-compare-btn"
                            onClick={() => toggleCompare(p)}
                            title="Remove item"
                          >
                            <X size={14} />
                          </button>
                          <img src={p.images[0]} alt={p.name} />
                          <span className="matrix-prod-name">{p.name}</span>
                          <span className="matrix-prod-price">${p.price}</span>
                          <button 
                            className="btn-nexus-primary matrix-add-btn"
                            onClick={() => addToCart(p)}
                          >
                            <ShoppingBag size={14} /> Add
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="spec-label-col">Rating & Satisfaction</td>
                    {compareList.map(p => (
                      <td key={p.id}>
                        <span className="matrix-stat-highlight">⭐ {p.rating} / 5</span>
                        <div className="matrix-stat-sub">({p.reviewsCount} reviews)</div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="spec-label-col">AI Sentiment Score</td>
                    {compareList.map(p => (
                      <td key={p.id}>
                        {p.aiSummary ? (
                          <span className="badge-cyan-score">{p.aiSummary.positivePercentage}% Positive</span>
                        ) : "N/A"}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="spec-label-col">Key Highlights</td>
                    {compareList.map(p => (
                      <td key={p.id}>
                        {p.aiSummary ? (
                          <ul className="matrix-bullets">
                            {p.aiSummary.pros.map((pro, idx) => (
                              <li key={idx}><Check size={12} className="check-green" /> {pro}</li>
                            ))}
                          </ul>
                        ) : "Standard Warranty & Support"}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="spec-label-col">Battery / Power</td>
                    {compareList.map(p => (
                      <td key={p.id}>
                        {p.specs?.Battery || p.specs?.Playtime || "High-Capacity Power Pack"}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="spec-label-col">AI Verdict Summary</td>
                    {compareList.map(p => (
                      <td key={p.id} className="verdict-cell">
                        <div className="verdict-card">
                          <Sparkles size={14} className="sparkle-purple" />
                          <p>{p.aiSummary?.verdict || "Excellent performer in its class."}</p>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCompareChatbot;
