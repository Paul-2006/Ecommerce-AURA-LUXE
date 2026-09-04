import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from "lucide-react";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import "../css/Wishlist.css";

const Wishlist = () => {
  const { products, wishlist, toggleWishlist } = useShop();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="wishlist-page-container">
      <div className="wishlist-header">
        <h1 className="wishlist-title">Your Saved Wishlist ({wishlistedProducts.length})</h1>
        <p className="wishlist-sub">Items saved for future acquisition & price alerts</p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="wishlist-empty-card glass-card">
          <Heart size={56} className="empty-heart-icon" />
          <h2>Your Wishlist is Empty</h2>
          <p>Click the heart icon on any product to save it to your wishlist!</p>
          <Link to="/products" className="btn-nexus-primary">
            Explore Marketplace <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="products-grid-4">
          {wishlistedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;