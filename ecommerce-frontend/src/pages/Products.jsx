import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import "../css/Products.css";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("featured");

  // Useful Quick Toggle Filters
  const [inStockOnly, setInStockOnly] = useState(false);
  const [highRatingOnly, setHighRatingOnly] = useState(false);
  const [under50kOnly, setUnder50kOnly] = useState(false);

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      const [prodData, catData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Synchronize with URL query params
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlCategory = searchParams.get("category");
    if (urlSearch !== null) setSearch(urlSearch);
    if (urlCategory !== null) setSelectedCategory(urlCategory);
  }, [searchParams]);

  // Compute Category Counts for Quick Pills
  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    products.forEach((p) => {
      const cat = p.category || "Electronics";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();

    let result = products.filter((p) => {
      const matchesSearch =
        !term ||
        p.productName?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term);

      const matchesCat =
        selectedCategory === "All" ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        p.productName?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        p.description?.toLowerCase().includes(selectedCategory.toLowerCase());

      const stock = p.stock ?? p.stockQuantity ?? 10;
      const matchesStock = !inStockOnly || stock > 0;

      const rating = p.rating || 4.8;
      const matchesRating = !highRatingOnly || rating >= 4.7;

      const price = p.price || p.bestPrice || 0;
      const matchesUnder50k = !under50kOnly || price <= 50000;

      return matchesSearch && matchesCat && matchesStock && matchesRating && matchesUnder50k;
    });

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => (a.price || a.bestPrice || 0) - (b.price || b.bestPrice || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.price || b.bestPrice || 0) - (a.price || a.bestPrice || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.productName.localeCompare(b.productName));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
    }

    return result;
  }, [products, search, selectedCategory, sortBy, inStockOnly, highRatingOnly, under50kOnly]);

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    if (catName === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", catName);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortBy("featured");
    setInStockOnly(false);
    setHighRatingOnly(false);
    setUnder50kOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    search ||
    selectedCategory !== "All" ||
    sortBy !== "featured" ||
    inStockOnly ||
    highRatingOnly ||
    under50kOnly;

  return (
    <div className="products-page-container centered-container">
      {/* Compact Integrated Header Bar & Search Controls */}
      <div className="catalog-hero-bar glass-panel">
        <div className="catalog-title-block">
          <span className="badge-pill badge-primary">AURA Luxe Showcase</span>
          <h2>Explore Electronics & Hardware</h2>
        </div>

        {/* Compact Search & Sort Toolbar */}
        <div className="catalog-controls-group">
          <div className="toolbar-search">
            <span className="search-symbol">🔍</span>
            <input
              type="text"
              placeholder="Search products, brands, specs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="toolbar-search-input"
            />
            {search && (
              <button className="clear-search-btn" onClick={() => setSearch("")}>✕</button>
            )}
          </div>

          <div className="toolbar-sort">
            <label className="sort-label">Sort:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="featured">Featured Order</option>
              <option value="rating">Top Rated (4.8★+)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Useful Quick Filter Toggles & Marketplace Assurance Bar */}
      <div className="useful-tools-bar">
        {/* Useful Quick Filters */}
        <div className="quick-toggles-row">
          <button
            type="button"
            className={`useful-toggle-btn ${inStockOnly ? "active" : ""}`}
            onClick={() => setInStockOnly(!inStockOnly)}
          >
            ⚡ In Stock Only
          </button>
          <button
            type="button"
            className={`useful-toggle-btn ${highRatingOnly ? "active" : ""}`}
            onClick={() => setHighRatingOnly(!highRatingOnly)}
          >
            🏆 Top Rated (4.7★+)
          </button>
          <button
            type="button"
            className={`useful-toggle-btn ${under50kOnly ? "active" : ""}`}
            onClick={() => setUnder50kOnly(!under50kOnly)}
          >
            💰 Under ₹50,000
          </button>
        </div>

        {/* Marketplace Trust Features Strip */}
        <div className="useful-trust-strip">
          <span>🛡️ GST Verified Sellers</span>
          <span>⚡ Same-Day Express Dispatch</span>
          <span>🔄 7-Day Easy Replacement</span>
        </div>
      </div>

      {/* Category Pills Bar with Stock Counts */}
      <div className="category-pills-bar">
        <button
          className={`category-pill ${selectedCategory === "All" ? "active" : ""}`}
          onClick={() => handleCategorySelect("All")}
        >
          All Items ({categoryCounts.All || 0})
        </button>
        {categories.map((cat) => {
          const catName = cat.categoryName || cat;
          const count = categoryCounts[catName] || 0;
          return (
            <button
              key={cat.categoryId || catName}
              className={`category-pill ${selectedCategory === catName ? "active" : ""}`}
              onClick={() => handleCategorySelect(catName)}
            >
              {catName} ({count})
            </button>
          );
        })}
      </div>

      {/* Results Meta Info */}
      <div className="results-meta-row">
        <p className="results-count-text">
          Showing <strong>{filteredProducts.length}</strong> of {products.length} products
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
        </p>

        {hasActiveFilters && (
          <button className="clear-filter-btn" onClick={handleResetFilters}>
            Reset All Filters
          </button>
        )}
      </div>

      {/* Product Grid or Empty State */}
      {loading ? (
        <div className="loading-container glass-panel">
          <div className="loader-spinner"></div>
          <p>Loading catalog items...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-results-box glass-panel">
          <h3>No matching products found</h3>
          <p>Try refining your search keyword or reset active filter options.</p>
          <button className="btn btn-primary btn-sm" onClick={handleResetFilters}>
            View All Products
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.sellerProductId || prod.productId} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
