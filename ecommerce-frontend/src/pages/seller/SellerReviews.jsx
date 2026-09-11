import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Star, MessageSquare, Search, RefreshCw, Send, CheckCircle2, Eye, X, CornerDownRight } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerReviews() {
  const { user } = useContext(AuthContext);
  const sellerId = user?.sellerId || user?.userId || 1;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    loadReviewsData();
  }, []);

  const loadReviewsData = async () => {
    try {
      setLoading(true);
      setError("");
      // Seed verified reviews list
      setReviews([
        { reviewId: 301, product: "Apple MacBook Pro 16\" M3 Max", customer: "Rahul Sharma", rating: 5, date: "2026-09-08", text: "Exceptional build quality and lightning-fast M3 Max performance. Packaging was crisp and authentic.", merchantReply: "Thank you Rahul for your glowing feedback! Enjoy your MacBook Pro." },
        { reviewId: 302, product: "Sony WH-1000XM5 Headphones", customer: "Priya Nair", rating: 5, date: "2026-09-05", text: "Noise cancellation is incredible for work calls and flights.", merchantReply: null },
        { reviewId: 303, product: "Samsung Galaxy S24 Ultra", customer: "Amit Patel", rating: 4, date: "2026-09-01", text: "Great camera clarity and S-Pen responsiveness. Battery easily lasts 1.5 days.", merchantReply: null },
        { reviewId: 304, product: "Apple iPad Air 11-inch", customer: "Sneha Reddy", rating: 3, date: "2026-08-25", text: "Product is great but delivery took 1 day longer than estimated.", merchantReply: "Apologies for the shipping delay Sneha. We have escalated with our courier partner." }
      ]);
    } catch {
      setError("Failed to load customer reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostReply = (reviewId) => {
    const text = replyInputs[reviewId];
    if (!text || !text.trim()) return;

    setReviews((prev) =>
      prev.map((r) => (r.reviewId === reviewId ? { ...r, merchantReply: text.trim() } : r))
    );
    setReplyInputs((prev) => ({ ...prev, [reviewId]: "" }));
    if (selectedReview && selectedReview.reviewId === reviewId) {
      setSelectedReview((prev) => ({ ...prev, merchantReply: text.trim() }));
    }
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

  const totalCount = reviews.length || 1;
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1);

  // Distribution calculation
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => { if (counts[r.rating] !== undefined) counts[r.rating] += 1; });

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 className="seller-page-title">Customer Ratings & Reviews</h1>
          <p className="seller-page-subtitle">
            Inspect verified buyer reviews, monitor star ratings distribution, and post official merchant responses
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadReviewsData}>
          <RefreshCw className="w-4 h-4" aria-hidden="true" /> Refresh Reviews
        </button>
      </div>

      {error && (
        <div className="seller-alert seller-alert-danger mb-4">
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Average Score & Distribution Row */}
      <div className="seller-grid seller-grid-3 gap-6 mb-6">
        <div className="seller-card p-6 text-center flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-navy">{avgRating}</div>
          <div className="flex justify-center gap-1 text-amber-500 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-5 h-5 ${s <= Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} aria-hidden="true" />
            ))}
          </div>
          <span className="text-xs text-slate-500 font-medium">Based on {reviews.length} verified buyer ratings</span>
        </div>

        <div className="seller-col-span-2 seller-card p-6 space-y-2">
          <h4 className="text-xs font-bold text-slate-700 text-uppercase mb-2">Rating Distribution</h4>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = counts[star];
            const pct = Math.round((count / totalCount) * 100);
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-semibold text-slate-700">{star} Stars</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div style={{ width: `${pct}%` }} className="bg-muted-gold h-full rounded-full" />
                </div>
                <span className="w-10 text-right text-slate-500 font-medium">{count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews Desk Card */}
      <div className="seller-card">
        <div className="seller-card-header flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-2 flex-wrap">
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

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search product, customer, text..."
              className="seller-form-input pl-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="seller-card-body">
          {loading ? (
            <div className="text-center py-12 text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-gold mb-2" aria-hidden="true" />
              Loading product reviews...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-2" aria-hidden="true" />
              <h3 className="font-semibold text-slate-700">No Reviews Found</h3>
              <p className="text-sm text-slate-500">No customer reviews match your rating filter or search text.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((r) => (
                <div key={r.reviewId} className="p-4 border border-slate-200 rounded-lg bg-white space-y-3">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-navy">{r.product}</h4>
                      <div className="text-xs text-slate-500">
                        Buyer: <strong>{r.customer}</strong> • Verified Purchase • {r.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                      {r.rating} / 5
                    </div>
                  </div>

                  <p className="text-sm text-slate-800 italic">"{r.text}"</p>

                  {/* Official Merchant Response Box */}
                  {r.merchantReply ? (
                    <div className="bg-slate-50 border-l-4 border-muted-gold p-3 rounded text-xs space-y-1">
                      <strong className="text-navy flex items-center gap-1">
                        <CornerDownRight className="w-3.5 h-3.5 text-muted-gold" aria-hidden="true" />
                        Official Merchant Response:
                      </strong>
                      <p className="text-slate-700 m-0">{r.merchantReply}</p>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <input
                        type="text"
                        placeholder="Write official merchant response..."
                        className="seller-form-input text-xs flex-1"
                        value={replyInputs[r.reviewId] || ""}
                        onChange={(e) => setReplyInputs({ ...replyInputs, [r.reviewId]: e.target.value })}
                      />
                      <button className="btn btn-primary btn-sm" onClick={() => handlePostReply(r.reviewId)}>
                        <Send className="w-3.5 h-3.5" aria-hidden="true" /> Post Response
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerReviews;
