import { useEffect, useState } from "react";
import { Star, MessageSquare, Search, RefreshCw, Send, CheckCircle2 } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    loadReviewsData();
  }, []);

  const loadReviewsData = async () => {
    try {
      setLoading(true);
      setReviews([
        { reviewId: 301, product: "Apple MacBook Pro 16\" M3 Max", customer: "Rahul Sharma", rating: 5, date: "2026-09-08", text: "Exceptional build quality and lightning-fast M3 Max performance. Packaging was crisp and authentic.", merchantReply: "Thank you Rahul for your glowing feedback! Enjoy your MacBook Pro." },
        { reviewId: 302, product: "Sony WH-1000XM5 Headphones", customer: "Priya Nair", rating: 5, date: "2026-09-05", text: "Noise cancellation is incredible for work calls and flights.", merchantReply: null },
        { reviewId: 303, product: "Samsung Galaxy S24 Ultra", customer: "Amit Patel", rating: 4, date: "2026-09-01", text: "Great camera clarity and S-Pen responsiveness. Battery easily lasts 1.5 days.", merchantReply: null },
        { reviewId: 304, product: "Apple iPad Air 11-inch", customer: "Sneha Reddy", rating: 3, date: "2026-08-25", text: "Product is great but delivery took 1 day longer than estimated.", merchantReply: "Apologies for the shipping delay Sneha. We have escalated with our courier partner." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostReply = (reviewId) => {
    const text = replyText[reviewId];
    if (!text || !text.trim()) return;
    setReviews((prev) =>
      prev.map((r) => (r.reviewId === reviewId ? { ...r, merchantReply: text.trim() } : r))
    );
    setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
    alert("Official Merchant Response posted successfully.");
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesRating = ratingFilter === "All" || r.rating.toString() === ratingFilter;
    const matchesSearch =
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.text.toLowerCase().includes(search.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(2);

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Customer Feedback</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Customer Ratings & Product Reviews Center</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              Inspect customer satisfaction ratings, read verified buyer reviews, and post official merchant responses.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadReviewsData}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Reviews
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="seller-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val">{avgRating} / 5.0</span>
            <span className="metric-title">Average Merchant Score</span>
          </div>
          <Star className="w-5 h-5" style={{ color: "var(--seller-secondary)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val">{reviews.length} Reviews</span>
            <span className="metric-title">Total Verified Reviews</span>
          </div>
          <MessageSquare className="w-5 h-5" style={{ color: "var(--seller-secondary)" }} aria-hidden="true" />
        </div>

        <div className="seller-metric-card">
          <div className="metric-details">
            <span className="metric-val" style={{ color: "var(--seller-success)" }}>100% Positive</span>
            <span className="metric-title">Catalog Satisfaction</span>
          </div>
          <CheckCircle2 className="w-5 h-5" style={{ color: "var(--seller-success)" }} aria-hidden="true" />
        </div>
      </div>

      {/* Reviews List Container */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["All", "5", "4", "3", "2", "1"].map((stars) => (
              <button
                key={stars}
                type="button"
                className={`btn ${ratingFilter === stars ? "btn-primary" : "btn-outline"} btn-sm`}
                onClick={() => setRatingFilter(stars)}
              >
                {stars === "All" ? "All Ratings" : `${stars} ★`}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search className="w-4 h-4" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--seller-text-secondary)" }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search product, customer, review text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: "36px" }}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading customer reviews...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredReviews.map((r) => (
              <div key={r.reviewId} style={{ padding: "18px", borderRadius: "12px", border: "1px solid var(--seller-border)", background: "var(--seller-surface)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div>
                    <h4 style={{ margin: 0, color: "var(--seller-primary)" }}>{r.product}</h4>
                    <span style={{ fontSize: "0.8rem", color: "var(--seller-text-secondary)" }}>Buyer: <strong>{r.customer}</strong> • Date: {r.date}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--seller-surface-alt)", padding: "4px 10px", borderRadius: "20px" }}>
                    <Star className="w-4 h-4" style={{ color: "var(--seller-secondary)", fill: "var(--seller-secondary)" }} aria-hidden="true" />
                    <strong>{r.rating} / 5</strong>
                  </div>
                </div>

                <p style={{ margin: "8px 0 12px 0", fontSize: "0.9rem", color: "var(--seller-text)" }}>"{r.text}"</p>

                {/* Merchant Reply Box */}
                {r.merchantReply ? (
                  <div style={{ background: "var(--seller-surface-alt)", padding: "12px 14px", borderRadius: "8px", borderLeft: "3px solid var(--seller-secondary)", fontSize: "0.85rem" }}>
                    <strong>Official Merchant Response:</strong>
                    <p style={{ margin: "4px 0 0 0", color: "var(--seller-text)" }}>{r.merchantReply}</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                    <input
                      type="text"
                      placeholder="Write official merchant response..."
                      value={replyText[r.reviewId] || ""}
                      onChange={(e) => setReplyText({ ...replyText, [r.reviewId]: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <button className="btn btn-secondary btn-sm" onClick={() => handlePostReply(r.reviewId)}>
                      <Send className="w-3.5 h-3.5" aria-hidden="true" /> Post Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerReviews;
