import React, { useState } from "react";
import { Camera, UploadCloud, X, Sparkles, CheckCircle2, ShoppingBag } from "lucide-react";
import { useShop } from "../context/ShopContext";
import "../css/AIVisualSearchModal.css";

const AIVisualSearchModal = () => {
  const { isVisualSearchOpen, setIsVisualSearchOpen, products, addToCart } = useShop();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  if (!isVisualSearchOpen) return null;

  const samplePhotos = [
    { name: "AR Glasses", url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80", matchId: 101 },
    { name: "ANC Headphones", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80", matchId: 102 },
    { name: "Gaming Laptop", url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=400&q=80", matchId: 103 },
    { name: "Smart Ring", url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80", matchId: 104 }
  ];

  const handleSelectSample = (sample) => {
    setSelectedImage(sample.url);
    triggerAiScan(sample.matchId);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      triggerAiScan(101); // Default match simulation
    }
  };

  const triggerAiScan = (matchId) => {
    setIsScanning(true);
    setSearchResults(null);

    setTimeout(() => {
      setIsScanning(false);
      const matchedProd = products.find(p => p.id === matchId) || products[0];
      const otherProds = products.filter(p => p.id !== matchedProd.id).slice(0, 2);

      setSearchResults([
        { product: matchedProd, matchPercentage: 98.4, features: ["Frame Shape", "Color Hue", "Material Texture"] },
        { product: otherProds[0], matchPercentage: 86.2, features: ["Category Similarity", "Tech Spec Match"] },
        { product: otherProds[1], matchPercentage: 74.8, features: ["Brand Aesthetic"] }
      ]);
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="visual-search-card glass-card">
        {/* Modal Header */}
        <div className="visual-search-header">
          <div className="header-title">
            <Camera size={22} className="header-icon-glow" />
            <span>AI Neural Visual Search</span>
          </div>
          <button className="modal-close-btn" onClick={() => setIsVisualSearchOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="visual-search-body">
          <p className="scanner-desc">
            Upload any image or click a sample photo to find visually identical items across our inventory.
          </p>

          {/* Upload Dropzone */}
          <div className="upload-dropzone">
            <input type="file" accept="image/*" onChange={handleFileUpload} id="visual-file-input" hidden />
            <label htmlFor="visual-file-input" className="dropzone-label">
              <UploadCloud size={36} className="upload-icon" />
              <span>Drag & Drop or <strong>Browse Image</strong></span>
              <span className="file-hint">PNG, JPG, WEBP up to 10MB</span>
            </label>
          </div>

          {/* Quick Sample Selector */}
          <div className="sample-photos-section">
            <span className="sample-title">Or test with demo sample images:</span>
            <div className="sample-grid">
              {samplePhotos.map((s, idx) => (
                <div key={idx} className="sample-card" onClick={() => handleSelectSample(s)}>
                  <img src={s.url} alt={s.name} />
                  <span>{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scanner Simulation Active Animation */}
          {isScanning && (
            <div className="ai-scanning-overlay">
              <div className="scanner-preview-box">
                <img src={selectedImage} alt="Scanning" />
                <div className="laser-scan-line"></div>
              </div>
              <div className="scanning-status-text">
                <Sparkles size={18} className="sparkle-spin" />
                <span>Extracting 1024-dim Vector Feature Embeddings...</span>
              </div>
            </div>
          )}

          {/* Search Results Display */}
          {searchResults && (
            <div className="ai-visual-results">
              <h3><CheckCircle2 size={18} className="check-green" /> AI Match Results Found</h3>
              <div className="results-list">
                {searchResults.map((res, i) => (
                  <div key={i} className="visual-match-row">
                    <img src={res.product.images[0]} alt={res.product.name} />
                    <div className="match-details">
                      <span className="match-name">{res.product.name}</span>
                      <div className="match-tags">
                        {res.features.map((f, j) => (
                          <span key={j} className="match-tag-pill">{f}</span>
                        ))}
                      </div>
                    </div>
                    <div className="match-score-box">
                      <span className="match-percent">{res.matchPercentage}%</span>
                      <span className="match-label">Visual Match</span>
                    </div>
                    <button className="match-add-btn" onClick={() => addToCart(res.product)}>
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIVisualSearchModal;
