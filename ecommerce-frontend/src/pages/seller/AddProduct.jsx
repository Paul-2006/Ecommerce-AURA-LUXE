import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Bot, UploadCloud, PlusCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useShop } from "../../context/ShopContext";
import "../../css/AddProduct.css";

const AddProduct = () => {
  const { products, setProducts, showToast } = useShop();

  const [formData, setFormData] = useState({
    name: "",
    category: "wearables",
    price: "",
    originalPrice: "",
    stock: "20",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80"
  });

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAiDescription = () => {
    if (!formData.name.trim()) {
      showToast("Please enter a Product Name first to generate AI copy", "error");
      return;
    }

    setIsGeneratingAi(true);

    setTimeout(() => {
      setIsGeneratingAi(false);
      const generatedCopy = `The new ${formData.name} is a cutting-edge ${formData.category} device engineered for next-level performance. Crafted with aerospace materials, intelligent sensor integration, ultra-low latency wireless streaming, and an ergonomic fit that guarantees all-day comfort. Designed for cyber enthusiasts seeking peak productivity and style.`;
      
      setFormData(prev => ({
        ...prev,
        description: generatedCopy
      }));

      showToast("AI Marketing Description & Copy Generated! ✨");
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProd = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 299.99,
      originalPrice: parseFloat(formData.originalPrice) || 349.99,
      rating: 5.0,
      reviewsCount: 1,
      badge: "New Release",
      isFlashSale: false,
      discount: 10,
      stock: parseInt(formData.stock) || 10,
      images: [formData.imageUrl],
      description: formData.description || "State-of-the-art cyber product.",
      specs: {
        Processor: "Quantum AI Coprocessor",
        Connectivity: "Wi-Fi 7, Bluetooth 5.4",
        Warranty: "2 Years Limited"
      },
      aiSummary: {
        sentimentScore: 98,
        positivePercentage: 98,
        neutralPercentage: 2,
        negativePercentage: 0,
        pros: ["Sleek design", "Fast performance", "High reliability"],
        cons: [],
        verdict: "Top tier addition to the catalog."
      },
      reviews: []
    };

    setProducts([newProd, ...products]);
    showToast(`Product "${formData.name}" Published to Marketplace! 🚀`);
    setFormData({
      name: "",
      category: "wearables",
      price: "",
      originalPrice: "",
      stock: "20",
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80"
    });
  };

  return (
    <div className="add-product-page-container">
      <Link to="/seller/dashboard" className="back-link">
        <ArrowLeft size={16} /> Back to Seller Dashboard
      </Link>

      <div className="add-prod-card glass-card">
        <div className="add-prod-header">
          <div className="icon-header-box">
            <PlusCircle size={24} />
          </div>
          <div>
            <h2>Publish New Inventory Item</h2>
            <span>Fill in product details or use Nexus AI to auto-generate marketing descriptions</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="add-prod-form">
          <div className="form-grid-2">
            <div className="input-group">
              <label>Product Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. CyberGoggles 5K AR"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="filter-select"
              >
                <option value="wearables">Smart Wearables</option>
                <option value="electronics">Cyber Electronics</option>
                <option value="gaming">Esports Gaming</option>
                <option value="audio">Spatial Audio</option>
              </select>
            </div>

            <div className="input-group">
              <label>Selling Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                required 
                placeholder="299.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Original / List Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="349.99"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group full-width">
            <div className="label-with-ai">
              <label>Product Description & Specs</label>
              <button 
                type="button" 
                className="ai-gen-btn"
                onClick={handleGenerateAiDescription}
                disabled={isGeneratingAi}
              >
                <Bot size={14} /> {isGeneratingAi ? "Generating AI Copy..." : "Auto-Generate AI Copy"}
              </button>
            </div>
            <textarea 
              rows="4" 
              placeholder="Enter product features or click Auto-Generate AI Copy above..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="input-group full-width">
            <label>Product Image URL</label>
            <input 
              type="url" 
              required 
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-nexus-primary full-submit-btn">
            <CheckCircle2 size={18} /> Publish Item to Marketplace
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
