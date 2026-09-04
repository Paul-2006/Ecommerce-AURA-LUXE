import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Search, 
  ShoppingBag, 
  Heart, 
  Bot, 
  Camera, 
  Layers, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  ShieldAlert,
  Truck,
  Store
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import "../css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { 
    cartCount, 
    wishlist, 
    compareList,
    searchQuery, 
    setSearchQuery, 
    setIsAiAssistantOpen, 
    setIsVisualSearchOpen,
    setIsCompareOpen 
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="nexus-navbar-wrapper">
      {/* Top Banner Ticker */}
      <div className="nexus-top-ticker">
        <div className="ticker-content">
          <span>⚡ <strong>NEXUS AI SALE:</strong> Up to 30% OFF Next-Gen Cyber Gear & AR Vision Specs!</span>
          <span className="ticker-divider">•</span>
          <span>🤖 Instant AI Voice & Visual Search active</span>
          <span className="ticker-divider">•</span>
          <span>🚀 Free Express Shipping over $150</span>
        </div>
      </div>

      <nav className="nexus-navbar">
        <div className="navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand">
            <div className="logo-icon-box">
              <Sparkles className="logo-sparkle" size={24} />
            </div>
            <div className="logo-text-box">
              <span className="brand-name">NEXUS<span className="brand-dot">AI</span></span>
              <span className="brand-tagline">MARKETPLACE</span>
            </div>
          </Link>

          {/* AI-Powered Smart Search Bar */}
          <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Ask AI or search products (e.g., '4K AR glasses', 'Gaming laptop')..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {/* Visual Search AI Trigger Button */}
            <button 
              type="button" 
              className="search-ai-cam-btn" 
              title="Search with AI Visual Image Scanner"
              onClick={() => setIsVisualSearchOpen(true)}
            >
              <Camera size={16} />
              <span className="cam-tooltip">AI Visual Search</span>
            </button>
          </form>

          {/* Action Links & Icons */}
          <div className="navbar-actions">
            {/* AI Assistant Floating Toggle */}
            <button 
              className="action-btn ai-assistant-trigger"
              onClick={() => setIsAiAssistantOpen(prev => !prev)}
              title="Open Nexus AI Shopping Assistant"
            >
              <Bot size={20} className="ai-bot-pulse" />
              <span className="action-label">AI Concierge</span>
              <span className="ai-live-dot"></span>
            </button>

            {/* Compare Matrix Trigger */}
            <button 
              className="action-btn"
              onClick={() => setIsCompareOpen(true)}
              title="Compare Products Matrix"
            >
              <div className="icon-with-badge">
                <Layers size={20} />
                {compareList.length > 0 && (
                  <span className="badge-count count-purple">{compareList.length}</span>
                )}
              </div>
              <span className="action-label">Compare</span>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="action-btn" title="View Saved Wishlist">
              <div className="icon-with-badge">
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="badge-count count-pink">{wishlist.length}</span>
                )}
              </div>
              <span className="action-label">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="action-btn cart-btn-glow" title="View Cart">
              <div className="icon-with-badge">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="badge-count count-cyan">{cartCount}</span>
                )}
              </div>
              <span className="action-label">Cart</span>
            </Link>

            {/* User / Portal Switcher Dropdown */}
            <div className="portal-dropdown-wrapper">
              <button 
                className="portal-user-btn"
                onClick={() => setPortalDropdownOpen(prev => !prev)}
              >
                <div className="user-avatar-circle">
                  <User size={18} />
                </div>
                <span className="user-name-text">
                  {currentUser ? currentUser.username || "Account" : "Portals"}
                </span>
                <ChevronDown size={14} />
              </button>

              {portalDropdownOpen && (
                <div className="portal-dropdown-menu">
                  <div className="dropdown-header">
                    <span>Select Workspace Portal</span>
                  </div>
                  <Link to="/customer/dashboard" className="dropdown-item" onClick={() => setPortalDropdownOpen(false)}>
                    <User size={16} /> Customer Portal
                  </Link>
                  <Link to="/seller/dashboard" className="dropdown-item" onClick={() => setPortalDropdownOpen(false)}>
                    <Store size={16} /> Seller Studio
                  </Link>
                  <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setPortalDropdownOpen(false)}>
                    <ShieldAlert size={16} /> Admin Command
                  </Link>
                  <Link to="/delivery/dashboard" className="dropdown-item" onClick={() => setPortalDropdownOpen(false)}>
                    <Truck size={16} /> Delivery Logistics
                  </Link>
                  
                  <div className="dropdown-divider"></div>

                  {currentUser ? (
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <LogOut size={16} /> Logout ({currentUser.username})
                    </button>
                  ) : (
                    <Link to="/login" className="dropdown-item login-item" onClick={() => setPortalDropdownOpen(false)}>
                      <User size={16} /> Sign In / Register
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button 
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(prev => !prev)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="navbar-subnav">
          <div className="subnav-container">
            <Link to="/products" className="subnav-link highlight-link">
              <Sparkles size={14} /> All Cyber Gear
            </Link>
            <Link to="/products?category=wearables" className="subnav-link">Smart Wearables</Link>
            <Link to="/products?category=electronics" className="subnav-link">Cyber Electronics</Link>
            <Link to="/products?category=gaming" className="subnav-link">Esports Gaming</Link>
            <Link to="/products?category=audio" className="subnav-link">Spatial Audio</Link>
            <Link to="/orders" className="subnav-link orders-link">
              <Truck size={14} /> Track Orders
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;