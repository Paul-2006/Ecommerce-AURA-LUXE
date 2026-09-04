import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Filter, 
  Sparkles, 
  LayoutGrid, 
  List, 
  Camera, 
  Search, 
  RotateCcw,
  SlidersHorizontal
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import "../css/Products.css";

const Products = () => {
  const { products, setIsVisualSearchOpen } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("aiMatch");
  const [viewMode, setViewMode] = useState("grid");

  // Dynamic Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      // Search filter
      if (searchTerm.trim() && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      // Price filter
      if (p.price > maxPrice) return false;
      // Rating filter
      if (p.rating < minRating) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "priceLow") return a.price - b.price;
      if (sortBy === "priceHigh") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "sentiment") return (b.aiSummary?.positivePercentage || 0) - (a.aiSummary?.positivePercentage || 0);
      return b.id - a.id; // AI Match default
    });
  }, [products, selectedCategory, searchTerm, maxPrice, minRating, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setMaxPrice(2500);
    setMinRating(0);
    setSortBy("aiMatch");
    setSearchParams({});
  };

  return (
    <div className="products-page-container">
      {/* Header */}
      <div className="catalog-header-banner glass-card">
        <div>
          <span className="nexus-badge nexus-badge-cyan mb-2">
            <Sparkles size={12} /> Neural Catalog
          </span>
          <h1 className="catalog-title">Explore Cyber Marketplace</h1>
          <p className="catalog-subtitle">Filter by specs, rating, price, or use AI Visual Scanner</p>
        </div>

        <button 
          className="btn-nexus-purple"
          onClick={() => setIsVisualSearchOpen(true)}
        >
          <Camera size={16} /> AI Visual Search
        </button>
      </div>

      <div className="catalog-main-layout">
        {/* Filter Sidebar */}
        <aside className="filter-sidebar glass-card">
          <div className="sidebar-title-row">
            <h3><SlidersHorizontal size={18} /> Filters</h3>
            <button className="reset-btn" onClick={resetFilters} title="Reset all filters">
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label>Search Keywords</label>
            <div className="filter-search-box">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Filter catalog..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category */}
          <div className="filter-group">
            <label>Category</label>
            <div className="cat-options-list">
              {[
                { id: "all", label: "All Items" },
                { id: "wearables", label: "Smart Wearables" },
                { id: "electronics", label: "Cyber Electronics" },
                { id: "gaming", label: "Esports Gaming" },
                { id: "audio", label: "Spatial Audio" }
              ].map(cat => (
                <button
                  key={cat.id}
                  className={`cat-chip-btn ${selectedCategory === cat.id ? "active-chip" : ""}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="filter-group">
            <div className="label-row">
              <label>Max Price</label>
              <span className="price-val">${maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="2500" 
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="range-slider"
            />
          </div>

          {/* Min Rating */}
          <div className="filter-group">
            <label>Minimum Rating</label>
            <select 
              value={minRating} 
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="filter-select"
            >
              <option value={0}>All Ratings</option>
              <option value={4.5}>4.5+ Stars ⭐</option>
              <option value={4.8}>4.8+ Stars ⭐</option>
            </select>
          </div>
        </aside>

        {/* Catalog Main View */}
        <main className="catalog-content-col">
          {/* Top Control Bar */}
          <div className="catalog-control-bar glass-card">
            <span className="results-count-text">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>

            <div className="controls-right">
              {/* Sort Dropdown */}
              <div className="sort-box">
                <label>Sort By:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="aiMatch">⚡ AI Best Match</option>
                  <option value="sentiment">🔥 Buyer Sentiment Score</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="view-mode-toggle">
                <button 
                  className={`view-btn ${viewMode === "grid" ? "active-view" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  className={`view-btn ${viewMode === "list" ? "active-view" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Items Grid / List */}
          {filteredProducts.length === 0 ? (
            <div className="no-products-box glass-card">
              <Sparkles size={48} className="no-prod-icon" />
              <h3>No matching products found</h3>
              <p>Try resetting filters or expanding price boundaries.</p>
              <button className="btn-nexus-primary" onClick={resetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "products-grid-3" : "products-list-view"}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
