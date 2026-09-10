import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { Search, X, Zap, Trophy, Tag, ShieldCheck, RefreshCw, Lightbulb, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import "../css/Products.css";

// Helper function: Levenshtein distance for fuzzy matching
function levenshteinDistance(a, b) {
  if (!a || !b) return (a || b || "").length;
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

// Check if search query fuzzy-matches target string
function isFuzzyMatch(query, targetStr) {
  if (!query || !targetStr) return false;
  const q = query.toLowerCase().trim();
  const target = targetStr.toLowerCase().trim();

  if (target.includes(q)) return true;

  const qWords = q.split(/\s+/);
  const targetWords = target.split(/\s+/);

  return qWords.every((qWord) => {
    if (qWord.length <= 2) return target.includes(qWord);
    return targetWords.some((tWord) => {
      if (tWord.includes(qWord) || qWord.includes(tWord)) return true;
      const maxDist = qWord.length <= 4 ? 1 : qWord.length <= 7 ? 2 : 3;
      return levenshteinDistance(qWord, tWord) <= maxDist;
    });
  });
}

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

  // Calculate Exact & Fuzzy Matches + Suggested Corrections + Alternative Recommendations
  const { filteredProducts, isFuzzyResult, suggestedCorrection, fallbackProducts, availableBrands } = useMemo(() => {
    const term = search.toLowerCase().trim();

    // Collect available brands for alternative brand chips
    const brandSet = new Set();
    products.forEach((p) => {
      if (p.brand) brandSet.add(p.brand);
    });
    const availableBrandsList = Array.from(brandSet);

    const sortProducts = (arr, mode) => {
      if (mode === "price-low") {
        arr.sort((a, b) => (a.price || a.bestPrice || 0) - (b.price || b.bestPrice || 0));
      } else if (mode === "price-high") {
        arr.sort((a, b) => (b.price || b.bestPrice || 0) - (a.price || a.bestPrice || 0));
      } else if (mode === "name") {
        arr.sort((a, b) => (a.productName || "").localeCompare(b.productName || ""));
      } else if (mode === "rating") {
        arr.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
      }
    };

    if (!term) {
      let result = products.filter((p) => {
        const matchesCat =
          selectedCategory === "All" ||
          p.category?.toLowerCase() === selectedCategory.toLowerCase();
        const stock = p.stock ?? p.stockQuantity ?? 10;
        const matchesStock = !inStockOnly || stock > 0;
        const rating = p.rating || 4.8;
        const matchesRating = !highRatingOnly || rating >= 4.7;
        const price = p.price || p.bestPrice || 0;
        const matchesUnder50k = !under50kOnly || price <= 50000;
        return matchesCat && matchesStock && matchesRating && matchesUnder50k;
      });

      sortProducts(result, sortBy);
      return {
        filteredProducts: result,
        isFuzzyResult: false,
        suggestedCorrection: null,
        fallbackProducts: [],
        availableBrands: availableBrandsList
      };
    }

    // 1. Pass 1: Exact Substring Matching
    let exactMatches = products.filter((p) => {
      const matchesSearch =
        p.productName?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term);

      const matchesCat =
        selectedCategory === "All" ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const stock = p.stock ?? p.stockQuantity ?? 10;
      const matchesStock = !inStockOnly || stock > 0;
      const rating = p.rating || 4.8;
      const matchesRating = !highRatingOnly || rating >= 4.7;
      const price = p.price || p.bestPrice || 0;
      const matchesUnder50k = !under50kOnly || price <= 50000;

      return matchesSearch && matchesCat && matchesStock && matchesRating && matchesUnder50k;
    });

    if (exactMatches.length > 0) {
      sortProducts(exactMatches, sortBy);
      return {
        filteredProducts: exactMatches,
        isFuzzyResult: false,
        suggestedCorrection: null,
        fallbackProducts: [],
        availableBrands: availableBrandsList
      };
    }

    // 2. Pass 2: Fuzzy Matching (Typo Tolerance)
    let fuzzyMatches = products.filter((p) => {
      const fuzzySearch =
        isFuzzyMatch(term, p.productName || "") ||
        isFuzzyMatch(term, p.brand || "") ||
        isFuzzyMatch(term, p.category || "") ||
        isFuzzyMatch(term, p.description || "");

      const matchesCat =
        selectedCategory === "All" ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase();

      return fuzzySearch && matchesCat;
    });

    // Find best correction term for "Did you mean?" banner
    let bestCorrection = null;
    let minDistance = Infinity;
    const knownTerms = new Set();
    products.forEach((p) => {
      if (p.brand) knownTerms.add(p.brand);
      if (p.category) knownTerms.add(p.category);
      if (p.productName) p.productName.split(/\s+/).forEach((w) => {
        if (w.length >= 3) knownTerms.add(w);
      });
    });

    knownTerms.forEach((kTerm) => {
      const dist = levenshteinDistance(term, kTerm);
      if (dist < minDistance && dist <= (term.length <= 4 ? 1 : 2)) {
        minDistance = dist;
        bestCorrection = kTerm;
      }
    });

    if (fuzzyMatches.length > 0) {
      sortProducts(fuzzyMatches, sortBy);
      return {
        filteredProducts: fuzzyMatches,
        isFuzzyResult: true,
        suggestedCorrection: bestCorrection,
        fallbackProducts: [],
        availableBrands: availableBrandsList
      };
    }

    // 3. Pass 3: Fallback & Alternative Brand Recommendations
    // If no exact or fuzzy match is available for search term, select top items from other brands
    let alternatives = [...products];
    if (selectedCategory !== "All") {
      alternatives = alternatives.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (alternatives.length === 0) alternatives = [...products];
    sortProducts(alternatives, "rating");

    return {
      filteredProducts: [],
      isFuzzyResult: false,
      suggestedCorrection: bestCorrection,
      fallbackProducts: alternatives.slice(0, 8),
      availableBrands: availableBrandsList
    };
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
            <Search className="w-4 h-4 text-slate-400 search-symbol" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search products, brands, specs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="toolbar-search-input"
            />
            {search && (
              <button className="clear-search-btn" onClick={() => setSearch("")}>
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="toolbar-sort">
            <label className="sort-label">Sort:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="featured">Featured Order</option>
              <option value="rating">Top Rated (4.8+)</option>
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
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Zap className="w-4 h-4" aria-hidden="true" /> In Stock Only
          </button>
          <button
            type="button"
            className={`useful-toggle-btn ${highRatingOnly ? "active" : ""}`}
            onClick={() => setHighRatingOnly(!highRatingOnly)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Trophy className="w-4 h-4" aria-hidden="true" /> Top Rated (4.7+)
          </button>
          <button
            type="button"
            className={`useful-toggle-btn ${under50kOnly ? "active" : ""}`}
            onClick={() => setUnder50kOnly(!under50kOnly)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Tag className="w-4 h-4" aria-hidden="true" /> Under ₹50,000
          </button>
        </div>

        {/* Marketplace Trust Features Strip */}
        <div className="useful-trust-strip">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck className="w-4 h-4" aria-hidden="true" /> GST Verified Sellers
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Zap className="w-4 h-4" aria-hidden="true" /> Same-Day Express Dispatch
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> 7-Day Easy Replacement
          </span>
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

      {/* Typo Correction & Fuzzy Suggestion Banner */}
      {search && suggestedCorrection && suggestedCorrection.toLowerCase() !== search.toLowerCase() && (
        <div
          className="glass-panel"
          style={{
            padding: "12px 18px",
            marginBottom: "16px",
            borderRadius: "12px",
            border: "1px solid var(--border-medium)",
            display: "flex",
            alignItems: "center",
            justify: "space-between",
            gap: "12px",
            background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(99,102,241,0.08))"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Lightbulb className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <span>
              Did you mean <strong style={{ color: "var(--primary)" }}>"{suggestedCorrection}"</strong>?
              {isFuzzyResult && " Showing fuzzy matching results below."}
            </span>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSearch(suggestedCorrection)}
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            Search "{suggestedCorrection}" <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Results Meta Info */}
      <div className="results-meta-row">
        <p className="results-count-text">
          Showing <strong>{filteredProducts.length > 0 ? filteredProducts.length : fallbackProducts.length}</strong> {filteredProducts.length === 0 ? "suggested alternative" : ""} products
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {search && ` for "${search}"`}
        </p>

        {hasActiveFilters && (
          <button className="clear-filter-btn" onClick={handleResetFilters}>
            Reset All Filters
          </button>
        )}
      </div>

      {/* Product Grid or Smart Alternative Recommendations */}
      {loading ? (
        <div className="loading-container glass-panel">
          <div className="loader-spinner"></div>
          <p>Loading catalog items...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.sellerProductId || prod.productId} product={prod} />
          ))}
        </div>
      ) : (
        /* Alternative Brand & Related Products Recommendation Section */
        <div className="fallback-recommendations-wrapper">
          <div
            className="glass-panel"
            style={{
              padding: "24px",
              borderRadius: "16px",
              marginBottom: "24px",
              border: "1px solid var(--border-medium)",
              background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(16,185,129,0.06))"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <HelpCircle className="w-6 h-6 text-indigo-500" aria-hidden="true" />
              <div>
                <h3 style={{ margin: 0 }}>No exact match found for "{search}"</h3>
                <p style={{ margin: "2px 0 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  The requested item may be temporarily unavailable or misspelled. Explore top-rated products and alternative items from other leading brands below:
                </p>
              </div>
            </div>

            {/* Quick Brand Explorer Chips */}
            {availableBrands.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  Explore Top Brands:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSearch(brand)}
                      style={{ borderRadius: "20px", padding: "4px 14px", fontSize: "0.82rem" }}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <h3 style={{ margin: 0 }}>Recommended Alternative Products</h3>
          </div>

          <div className="products-grid">
            {fallbackProducts.map((prod) => (
              <ProductCard key={prod.sellerProductId || prod.productId} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;

