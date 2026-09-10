import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { useLanguage } from "../context/LanguageContext";
import { AuthContext } from "../context/AuthContext";
import "../css/Home.css";

function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [catData, prodData] = await Promise.all([
        getCategories(),
        getProducts()
      ]);
      setCategories(catData);
      setFeaturedProducts(prodData.slice(0, 8));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <div className="home-page centered-container">
      {/* 1. Dynamic Hero Banner */}
      <section className="hero-section glass-panel">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pill badge-assured">AURA Luxe Assured & Express Fast</span>
          </div>
          <h1 className="hero-title">
            {t("hero_title")}
          </h1>
          <p className="hero-subtitle">
            {t("hero_sub")}
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate("/products")}>
              {t("shop_now")}
            </button>
            <button className="btn btn-compare btn-lg" onClick={() => navigate("/products")}>
              {t("explore_deals")}
            </button>
          </div>

          {/* Direct Portal Switcher Buttons (Only shown for unauthenticated visitors) */}
          {!user && (
            <div className="home-portal-buttons-bar">
              <span className="portal-bar-label">Operational Portal Access:</span>
              <div className="portal-buttons-group">
                <button className="btn btn-secondary btn-sm" onClick={() => navigate("/seller/login")}>
                  Seller Portal
                </button>
                <button className="btn btn-luxury btn-sm" onClick={() => navigate("/admin/login")}>
                  Admin Security
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate("/warehouse/login")}>
                  Warehouse Scanner
                </button>
                <button className="btn btn-success btn-sm" onClick={() => navigate("/delivery/login")}>
                  Delivery Dispatch
                </button>
              </div>
            </div>
          )}

          {/* Trust Metrics */}
          <div className="hero-stats-row">
            <div className="stat-item">
              <span className="stat-num">50,000+</span>
              <span className="stat-label">Delivered Orders</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-num">100%</span>
              <span className="stat-label">GST Verified Merchants</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-num">24 Hours</span>
              <span className="stat-label">Express Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search Box */}
      <section className="home-search-section">
        <form className="search-form-card glass-panel" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            {t("search_btn")}
          </button>
        </form>
      </section>

      {/* 3. Shop by Category Section */}
      <section className="home-section center-content">
        <div className="section-heading-box">
          <span className="badge-pill badge-primary">{t("featured_categories")}</span>
          <h2>Explore By Hardware Category</h2>
          <p>Explore laptops, smartphones, accessories, audio systems, and appliances</p>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.categoryId || cat.categoryName}
              className="category-card glass-panel"
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.categoryName)}`)}
            >
              <h3 className="category-name">{cat.categoryName}</h3>
              <p className="category-desc">{cat.description || "Authorized manufacturer products"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Trending & Featured Products */}
      <section className="home-section center-content">
        <div className="section-heading-box">
          <span className="badge-pill badge-success">{t("trending_products")}</span>
          <h2>Featured Deals & Genuine Electronics</h2>
          <p>Direct manufacturer warranty with instant stock fulfillment and same-day dispatch</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading catalog items...</p>
          </div>
        ) : (
          <div className="featured-products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.sellerProductId || product.productId} product={product} />
            ))}
          </div>
        )}

        <div className="view-all-btn-box">
          <button className="btn btn-secondary btn-lg" onClick={() => navigate("/products")}>
            View All Products
          </button>
        </div>
      </section>

      {/* 5. Promotional Mega Festival Offer Banner */}
      <section className="offer-banner-section glass-panel">
        <div className="offer-banner-content">
          <span className="offer-tag">Mega Savings Festival</span>
          <h2>Electronics & Hardware Deals up to 40% OFF</h2>
          <p>Apply voucher code <strong className="promo-code">WEBSAVE2026</strong> at checkout for instant cash discount & free delivery.</p>
          <button className="btn btn-luxury btn-lg" onClick={() => navigate("/products")}>
            {t("explore_deals")}
          </button>
        </div>
      </section>

      {/* 6. Marketplace Standards & Trust Grid */}
      <section className="trust-features-grid">
        <div className="trust-card glass-panel">
          <h3>24-Hour Express Delivery</h3>
          <p>Warehouse order barcode scanning with live motorbike GPS route telemetry.</p>
        </div>
        <div className="trust-card glass-panel">
          <h3>100% Genuine Products</h3>
          <p>Mandatory business trade license and GSTIN verification by system administrators.</p>
        </div>
        <div className="trust-card glass-panel">
          <h3>Grok Voice AI Assistant</h3>
          <p>Navigate and compare hardware specifications hands-free using real-time voice.</p>
        </div>
        <div className="trust-card glass-panel">
          <h3>Secure Contactless OTP</h3>
          <p>Contactless handoffs validated by 4-digit recipient verification security codes.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;