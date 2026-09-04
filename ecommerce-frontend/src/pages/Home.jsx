import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Bot, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Award, 
  ArrowRight, 
  Cpu, 
  Watch, 
  Gamepad2, 
  Headphones,
  CheckCircle2
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import "../css/Home.css";

const Home = () => {
  const { products, setIsAiAssistantOpen, setIsVisualSearchOpen } = useShop();

  // Flash Sale Countdown State
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleItems = products.filter(p => p.isFlashSale);
  const aiRecommendedItems = products.slice(0, 4);

  return (
    <div className="home-page-container">
      {/* Hero Banner Section */}
      <section className="nexus-hero-section">
        <div className="hero-grid-container">
          <div className="hero-text-col">
            <span className="nexus-badge nexus-badge-cyan animate-fade-in">
              <Sparkles size={12} /> Next-Gen AI Shopping Portal 2026
            </span>

            <h1 className="hero-main-title">
              Experience The <span className="gradient-text">Future Of E-Commerce</span>
            </h1>

            <p className="hero-subtext">
              Personalized neural recommendations, live visual image search scanner, instant AI price negotiation, and spatial tech gear delivered express.
            </p>

            <div className="hero-cta-group">
              <Link to="/products" className="btn-nexus-primary">
                Explore All Products <ArrowRight size={18} />
              </Link>
              
              <button 
                className="btn-nexus-purple"
                onClick={() => setIsAiAssistantOpen(true)}
              >
                <Bot size={18} /> Ask Nexus AI
              </button>
            </div>

            {/* Live Stats */}
            <div className="hero-stats-row">
              <div className="stat-box">
                <span className="stat-number">99.8%</span>
                <span className="stat-label">AI Match Accuracy</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-box">
                <span className="stat-number">2-Hour</span>
                <span className="stat-label">Drone Express Delivery</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-box">
                <span className="stat-number">4.9/5</span>
                <span className="stat-label">Global Buyer Score</span>
              </div>
            </div>
          </div>

          {/* Hero Media Card Showcase */}
          <div className="hero-media-col">
            <div className="hero-glass-frame glass-card">
              <img 
                src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=80" 
                alt="Nexus Vision Pro AR" 
                className="hero-featured-img"
              />
              <div className="hero-overlay-tag">
                <div className="ai-tag-icon">
                  <Zap size={18} />
                </div>
                <div>
                  <span className="featured-name">Nexus Vision Pro AR</span>
                  <span className="featured-ai-score">98% Match Confidence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Icons Showcase Grid */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">Explore Tech Categories</h2>
          <Link to="/products" className="section-link">View All <ArrowRight size={14} /></Link>
        </div>

        <div className="categories-grid">
          <Link to="/products?category=wearables" className="category-card glass-card">
            <div className="cat-icon-box cat-cyan"><Watch size={28} /></div>
            <h3>Smart Wearables</h3>
            <span className="cat-count">AR Glasses & Rings</span>
          </Link>

          <Link to="/products?category=electronics" className="category-card glass-card">
            <div className="cat-icon-box cat-purple"><Cpu size={28} /></div>
            <h3>Cyber Electronics</h3>
            <span className="cat-count">Drones & AI Hubs</span>
          </Link>

          <Link to="/products?category=gaming" className="category-card glass-card">
            <div className="cat-icon-box cat-pink"><Gamepad2 size={28} /></div>
            <h3>Esports Gaming</h3>
            <span className="cat-count">Laptops & Keyboards</span>
          </Link>

          <Link to="/products?category=audio" className="category-card glass-card">
            <div className="cat-icon-box cat-emerald"><Headphones size={28} /></div>
            <h3>Spatial Audio</h3>
            <span className="cat-count">ANC Headsets</span>
          </Link>
        </div>
      </section>

      {/* Flash Sale Banner Section */}
      <section className="flash-sale-section glass-card">
        <div className="flash-sale-header">
          <div className="flash-title-box">
            <div className="flash-badge-icon">
              <Zap size={22} />
            </div>
            <div>
              <h2 className="flash-title">Cyber Flash Deals</h2>
              <span className="flash-sub">Limited quantity deals ending soon</span>
            </div>
          </div>

          <div className="countdown-timer-box">
            <Clock size={18} className="clock-icon" />
            <span className="timer-label">Ends In:</span>
            <div className="timer-digits">
              <span>{String(timeLeft.hours).padStart(2, "0")}h</span>:
              <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>:
              <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
            </div>
          </div>
        </div>

        <div className="products-grid-4">
          {flashSaleItems.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* AI Recommendation Showcase */}
      <section className="ai-recommend-section">
        <div className="section-header">
          <div>
            <span className="nexus-badge nexus-badge-purple mb-2">
              <Bot size={12} /> Neural Recommendation Engine
            </span>
            <h2 className="section-title">Picked For You By Nexus AI</h2>
          </div>
          <button 
            className="btn-nexus-outline"
            onClick={() => setIsVisualSearchOpen(true)}
          >
            Visual Image Search
          </button>
        </div>

        <div className="products-grid-4">
          {aiRecommendedItems.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="trust-banner-section glass-card">
        <div className="trust-grid">
          <div className="trust-item">
            <Truck size={32} className="trust-icon-cyan" />
            <div>
              <h4>Express Global Shipping</h4>
              <p>Free tracked courier delivery on orders over $150</p>
            </div>
          </div>

          <div className="trust-item">
            <ShieldCheck size={32} className="trust-icon-purple" />
            <div>
              <h4>Quantum Encryption</h4>
              <p>256-bit secure checkout & payment verification</p>
            </div>
          </div>

          <div className="trust-item">
            <Award size={32} className="trust-icon-emerald" />
            <div>
              <h4>2-Year Cyber Warranty</h4>
              <p>Direct manufacturer replacement guarantees</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;