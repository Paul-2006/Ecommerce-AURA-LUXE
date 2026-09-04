import React, { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Send, X, ShoppingBag, ArrowRight, Zap } from "lucide-react";
import { useShop } from "../context/ShopContext";
import "../css/NexusAIAssistant.css";

const NexusAIAssistant = () => {
  const { isAiAssistantOpen, setIsAiAssistantOpen, products, addToCart } = useShop();
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Greetings! I'm Nexus AI, your personal shopping advisor. How can I help you find the ultimate cyber gear today?",
      options: [
        "Recommend AR Glasses",
        "Best Gaming Laptop?",
        "Tech under $300",
        "Compare Headphones"
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  if (!isAiAssistantOpen) return null;

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery("");
    setIsTyping(true);

    // AI Intelligence simulation based on product catalog
    setTimeout(() => {
      let aiResponseText = "";
      let recommendedProducts = [];

      const lower = query.toLowerCase();

      if (lower.includes("ar") || lower.includes("glass") || lower.includes("vision")) {
        const item = products.find(p => p.id === 101);
        aiResponseText = "The **Nexus Vision Pro AR Glass** is our top recommendation for spatial computing. It features 4K Micro-OLED dual displays, neural gesture tracking, and real-time heads-up translation!";
        if (item) recommendedProducts.push(item);
      } else if (lower.includes("laptop") || lower.includes("gaming") || lower.includes("blade")) {
        const item = products.find(p => p.id === 103);
        aiResponseText = "For peak gaming performance, the **QuantumBlade X1 Gaming Laptop** reigns supreme with RTX 5090 graphics, 240Hz Mini-LED display, and liquid metal cooling.";
        if (item) recommendedProducts.push(item);
      } else if (lower.includes("headphone") || lower.includes("audio") || lower.includes("sound")) {
        const item = products.find(p => p.id === 102);
        aiResponseText = "Our top audio choice is the **CyberPulse ANC Headphones** equipped with studio-grade beryllium drivers, -48dB AI noise suppression, and 65 hours battery life!";
        if (item) recommendedProducts.push(item);
      } else if (lower.includes("under") || lower.includes("cheap") || lower.includes("budget") || lower.includes("300")) {
        recommendedProducts = products.filter(p => p.price < 350);
        aiResponseText = `Found ${recommendedProducts.length} high-tech gadgets under budget including the Aura Ring ($199.99) and Apex Mechanical Keyboard ($189.99):`;
      } else {
        recommendedProducts = [products[0], products[1]];
        aiResponseText = `Based on current neural trends, these 2 items match highest buyer satisfaction scores this week:`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: aiResponseText,
        recommendedProducts
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="nexus-ai-widget-modal">
      <div className="nexus-ai-widget-box glass-card">
        {/* Header */}
        <div className="ai-widget-header">
          <div className="ai-header-info">
            <div className="ai-header-icon">
              <Bot size={22} />
            </div>
            <div>
              <div className="ai-title">Nexus AI Concierge <Zap size={14} className="ai-zap" /></div>
              <div className="ai-status">Neural Shopping Assistant Active</div>
            </div>
          </div>
          <button 
            className="ai-close-btn"
            onClick={() => setIsAiAssistantOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="ai-chat-body">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`chat-bubble-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
            >
              {msg.sender === "ai" && (
                <div className="ai-avatar-tiny">
                  <Sparkles size={14} />
                </div>
              )}

              <div className="chat-bubble-content">
                <p>{msg.text}</p>

                {/* Quick Recommendation Product Cards */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="ai-product-suggestions">
                    {msg.recommendedProducts.map(p => (
                      <div key={p.id} className="ai-prod-mini-card">
                        <img src={p.images[0]} alt={p.name} />
                        <div className="ai-prod-mini-info">
                          <span className="mini-name">{p.name}</span>
                          <span className="mini-price">${p.price}</span>
                        </div>
                        <button 
                          className="mini-add-cart-btn"
                          onClick={() => addToCart(p)}
                        >
                          <ShoppingBag size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Prompt Options */}
                {msg.options && (
                  <div className="ai-quick-options">
                    {msg.options.map((opt, i) => (
                      <button 
                        key={i} 
                        className="quick-chip"
                        onClick={() => handleSendMessage(opt)}
                      >
                        {opt} <ArrowRight size={12} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble-row ai-row">
              <div className="ai-avatar-tiny">
                <Sparkles size={14} />
              </div>
              <div className="ai-typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="ai-input-bar">
          <input 
            type="text" 
            placeholder="Type your question or preference..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button 
            className="ai-send-btn"
            onClick={() => handleSendMessage()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NexusAIAssistant;
