import { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { getProducts, DEMO_PRODUCTS } from "../services/productService";
import { addCart } from "../services/cartService";
import { queryBackendAiAssistant, compareProductsBackend } from "../services/aiBackendService";
import { queryGroqAuraAI, getGroqApiKey, setGroqApiKey } from "../services/groqService";
import "../css/ProductCompareChatbot.css";

function ProductCompareChatbot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCustomer, isAdmin, isSeller, isWarehouse, isDelivery } = useContext(AuthContext);
  const { language } = useLanguage();
  const { isDark, toggleTheme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // API Key Config Modal State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGroqApiKey() || "");

  // Alternating Girl / Boy Voice State
  const voiceTurnCounter = useRef(0);
  const [activeVoiceTag, setActiveVoiceTag] = useState("Priya (Girl Voice)");

  // Voice Interaction & Cancel State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceStatusText, setVoiceStatusText] = useState("");
  const recognitionRef = useRef(null);

  const initialGreeting =
    "Hello and a very warm welcome to AURA Luxe! I'm Aura AI, your personal luxury shopping concierge powered by Google Gemini and ASP.NET Core backend.\n\n" +
    "💬 Ask me anything like:\n" +
    "• 'Show me phones under 30000'\n" +
    "• 'I need a laptop for programming'\n" +
    "• 'Which product has the best rating?'\n" +
    "• 'Compare these two products'\n" +
    "• 'Suggest a product for a college student'\n\n" +
    "How can I assist your shopping today?";

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: initialGreeting,
      voiceTag: "Priya (Girl Voice)",
      actions: [
        { label: "📱 Phones under 30000", prompt: "Show me phones under 30000" },
        { label: "💻 Laptop for programming", prompt: "I need a laptop for programming" },
        { label: "⭐ Best rated products", prompt: "Which product has the best rating?" },
        { label: "🛍️ View Products", prompt: "Go to products" }
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  // Restrict to customer routes
  const isOperatorRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/seller") ||
    location.pathname.startsWith("/warehouse") ||
    location.pathname.startsWith("/delivery");

  const showCustomerAI = isCustomer && !isOperatorRoute;

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatusText("Listening in English... Speak your shopping command");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setVoiceStatusText("");
        handleAiAssistantQuery(transcript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        setVoiceStatusText("");
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceStatusText("");
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  useEffect(() => {
    if (open && products.length === 0) {
      loadProducts();
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(DEMO_PRODUCTS);
      }
    } catch {
      setProducts(DEMO_PRODUCTS);
    }
  };

  // Text-to-Speech TalkBack with Voice Cancellation
  const speakTextAlternatingGender = (textToSpeak) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const cleanText = textToSpeak
      .replace(/[#*`_~]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = voiceTurnCounter.current % 2 === 0 ? 1.25 : 0.95; // Girl vs Boy Pitch

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const englishVoices = voices.filter((v) => v.lang.includes("en"));
      if (englishVoices.length > 0) {
        const selectedVoice = englishVoices[voiceTurnCounter.current % englishVoices.length];
        utterance.voice = selectedVoice;
      }
    }

    voiceTurnCounter.current += 1;
    const currentTag = voiceTurnCounter.current % 2 === 0 ? "Priya (Girl Voice)" : "Rahul (Boy Voice)";
    setActiveVoiceTag(currentTag);

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeechTalkBack = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (!open) setOpen(true);
      stopSpeechTalkBack();
      try {
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 200);
      }
    }
  };

  // -------------------------------------------------------------
  // AI ASSISTANT QUERY ENGINE (ASP.NET CORE BACKEND + GEMINI AI)
  // -------------------------------------------------------------
  const handleAiAssistantQuery = async (userInput) => {
    if (!userInput || !userInput.trim()) return;

    const raw = userInput.toLowerCase().trim();

    // 1. Instant Cancel / Quiet Command
    if (
      raw === "cancel" ||
      raw === "stop" ||
      raw === "quiet" ||
      raw === "mute" ||
      raw.includes("stop talking") ||
      raw.includes("silence")
    ) {
      stopSpeechTalkBack();
      const reply = "Understood! I've silenced audio playback. How else can I assist your shopping today?";
      addBotMessage(userInput, reply, null, activeVoiceTag);
      return;
    }

    // 2. Direct Navigation Commands
    if (raw.includes("take me to products") || raw.includes("go to products") || raw.includes("open shop")) {
      navigate("/products");
      addBotMessage(userInput, "Opening the products catalog for you now!", null, activeVoiceTag);
      return;
    }
    if (raw.includes("go to cart") || raw.includes("open cart")) {
      navigate("/cart");
      addBotMessage(userInput, "Taking you to your shopping cart!", null, activeVoiceTag);
      return;
    }
    if (raw.includes("track my orders") || raw.includes("go to orders")) {
      navigate("/orders");
      addBotMessage(userInput, "Navigating to your live orders and GPS tracking!", null, activeVoiceTag);
      return;
    }

    setLoading(true);

    try {
      // Query ASP.NET Core Backend Gemini AI Endpoint
      const aiResponse = await queryBackendAiAssistant({
        query: userInput,
        history: messages.slice(-4).map(m => ({ sender: m.from, text: m.text }))
      });

      const isGirl = voiceTurnCounter.current % 2 === 0;
      const currentSpeaker = isGirl ? "Priya (Girl Voice)" : "Rahul (Boy Voice)";

      const recommendedCards = aiResponse.recommendedProducts || [];

      addBotMessage(
        userInput,
        aiResponse.answer,
        [
          { label: "🛍️ Browse Products", prompt: "Go to products" },
          { label: "🛒 Open Cart", prompt: "Go to cart" },
          { label: "📍 Track Orders", prompt: "Track my orders" }
        ],
        currentSpeaker,
        recommendedCards
      );

      speakTextAlternatingGender(aiResponse.answer);
    } catch (err) {
      console.error("Aura AI Assistant Backend error:", err);
      const fallbackReply = "I am truly sorry, but I couldn't connect to our backend AI service right now. Would you like to explore our products catalog or cart directly?";
      addBotMessage(userInput, fallbackReply, null, activeVoiceTag);
      speakTextAlternatingGender(fallbackReply);
    } finally {
      setLoading(false);
    }
  };

  const addBotMessage = (userText, botText, actionButtons = null, speakerTag = null, recommendedProducts = []) => {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: userText },
      {
        from: "bot",
        text: botText,
        actions: actionButtons,
        voiceTag: speakerTag || activeVoiceTag,
        recommendedProducts
      }
    ]);
  };

  const toggleProduct = (productId) => {
    if (selectedIds.includes(productId)) {
      setSelectedIds(selectedIds.filter((id) => id !== productId));
    } else {
      if (selectedIds.length < 4) {
        const updated = [...selectedIds, productId];
        setSelectedIds(updated);
        if (updated.length >= 2) {
          const prods = (products.length > 0 ? products : DEMO_PRODUCTS).filter((p) => updated.includes(p.productId));
          const pNames = prods.map((p) => p.productName).join(" vs ");
          handleAiAssistantQuery(`Compare these products: ${pNames}`);
        }
      }
    }
  };

  const handleAddToCartFromAi = async (product) => {
    await addCart({
      productId: product.productId,
      quantity: 1,
      productName: product.productName,
      price: product.price,
      image: product.imageUrl || product.image
    });
    alert(`Added ${product.productName} to your cart!`);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (query.trim() === "" && selectedIds.length === 0) return;
    handleAiAssistantQuery(query);
    setQuery("");
  };

  const handleSaveGroqKey = () => {
    setGroqApiKey(apiKeyInput);
    setShowKeyModal(false);
    alert("Groq API Key saved successfully!");
  };

  if (!showCustomerAI) {
    return null;
  }

  return (
    <div className="compare-chatbot-root">
      {open ? (
        <div className="compare-panel aura-theme glass-panel">
          {/* Header */}
          <div className="compare-header aura-header">
            <div className="compare-header-title">
              <span className="annachi-symbol-badge">A</span>
              <div>
                <strong>Aura AI Concierge</strong>
                <span className="online-indicator">● Gemini Powered (.NET Backend)</span>
              </div>
            </div>

            <div className="header-controls">
              {isSpeaking && (
                <button type="button" className="cancel-speaking-btn" onClick={stopSpeechTalkBack} title="Stop Speech">
                  <span className="stop-square">■</span> Stop
                </button>
              )}

              <button
                type="button"
                className={`voice-toggle-btn ${voiceEnabled ? "active" : ""}`}
                onClick={() => {
                  stopSpeechTalkBack();
                  setVoiceEnabled(!voiceEnabled);
                }}
                title={voiceEnabled ? "Mute Voice Speech" : "Enable Voice Speech"}
              >
                {voiceEnabled ? "🔊" : "🔇"}
              </button>

              <button type="button" className="compare-close-btn" onClick={() => setOpen(false)} title="Close Assistant">
                ✕
              </button>
            </div>
          </div>

          {/* Voice Hints Bar */}
          <div className="voice-hints-bar aura-bar">
            <span>Try asking:</span>
            <div className="voice-hints-scroll">
              <button type="button" className="hint-chip" onClick={() => handleAiAssistantQuery("Show me phones under 30000")}>
                📱 Phones under 30k
              </button>
              <button type="button" className="hint-chip" onClick={() => handleAiAssistantQuery("I need a laptop for programming")}>
                💻 Programming Laptop
              </button>
              <button type="button" className="hint-chip" onClick={() => handleAiAssistantQuery("Which product has the best rating?")}>
                ⭐ Best Rating
              </button>
              <button type="button" className="hint-chip cancel-chip" onClick={() => handleAiAssistantQuery("cancel")}>
                🛑 Quiet
              </button>
            </div>
          </div>

          {/* Listening State Banner */}
          {isListening && (
            <div className="voice-listening-banner aura-listening">
              <div className="sound-wave">
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
              </div>
              <span>{voiceStatusText || "Listening in English..."}</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={toggleListening}>
                Stop
              </button>
            </div>
          )}

          {/* Active Speaking Indicator Bar */}
          {isSpeaking && (
            <div className="voice-speaking-indicator-bar" onClick={stopSpeechTalkBack}>
              <span className="speaking-pulse-dot"></span>
              <span>
                {voiceTurnCounter.current % 2 === 0 ? "👧 Priya (Girl Voice)" : "👦 Rahul (Boy Voice)"} is speaking...
              </span>
              <button type="button" className="btn btn-danger btn-sm stop-btn" onClick={(e) => { e.stopPropagation(); stopSpeechTalkBack(); }}>
                Cancel Audio
              </button>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="compare-messages-body aura-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-row ${msg.from}`}>
                <div className={`chat-bubble ${msg.from} aura-bubble`}>
                  {/* Voice Speaker Badge */}
                  {msg.from === "bot" && msg.voiceTag && (
                    <div className="voice-speaker-badge">
                      <span>{msg.voiceTag.includes("Girl") ? "👧" : "👦"} {msg.voiceTag}</span>
                    </div>
                  )}

                  <p className="chat-bubble-text">{msg.text}</p>

                  {/* Grounded Recommended Product Cards */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="ai-recommended-cards-grid">
                      {msg.recommendedProducts.map((prod) => (
                        <div key={prod.productId} className="ai-product-card-item">
                          <img
                            src={prod.imageUrl || prod.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"}
                            alt={prod.productName}
                            className="ai-card-img"
                          />
                          <div className="ai-card-info">
                            <span className="ai-card-brand">{prod.brand || "AURA Luxe"}</span>
                            <h5 className="ai-card-title">{prod.productName}</h5>
                            <div className="ai-card-price-row">
                              <strong className="ai-card-price">₹{prod.price?.toLocaleString("en-IN")}</strong>
                              {prod.originalPrice > prod.price && (
                                <span className="ai-card-mrp">₹{prod.originalPrice?.toLocaleString("en-IN")}</span>
                              )}
                            </div>
                            <div className="ai-card-meta">
                              <span className="rating-pill">★ {prod.rating || 4.7}</span>
                              <span className="badge-pill badge-success">In Stock</span>
                            </div>
                            <div className="ai-card-actions">
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => { setOpen(false); navigate(`/product/${prod.productId}`); }}
                              >
                                View
                              </button>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => handleAddToCartFromAi(prod)}
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interactive Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="bubble-actions-row">
                      {msg.actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          type="button"
                          className="btn btn-secondary btn-sm bubble-action-btn"
                          onClick={() => {
                            if (act.action) act.action();
                            else if (act.prompt) handleAiAssistantQuery(act.prompt);
                          }}
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble-row bot">
                <div className="chat-bubble bot typing aura-typing">
                  <span>Aura AI is processing your request via Gemini API...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Select Product Chips */}
          <div className="compare-chips-section aura-chips">
            <span className="chips-title">Select catalog products to compare ({selectedIds.length}/4):</span>
            <div className="chips-scroll">
              {products.slice(0, 8).map((prod) => {
                const isSelected = selectedIds.includes(prod.productId);
                return (
                  <button
                    key={prod.productId}
                    type="button"
                    className={`product-chip ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleProduct(prod.productId)}
                  >
                    {isSelected ? "Selected: " : "+ "}
                    {prod.productName?.split(" ").slice(0, 3).join(" ")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="compare-input-form aura-input">
            <button
              type="button"
              className={`voice-mic-btn aura-mic ${isListening ? "listening" : ""}`}
              onClick={toggleListening}
              title="Speak voice command in English"
            >
              🎙️
            </button>
            <input
              type="text"
              className="compare-input-field aura-field"
              placeholder="e.g. 'Show phones under 30000', 'Laptop for programming'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-gold btn-sm send-btn aura-send" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="compare-launcher-group">
          <button
            type="button"
            className="compare-launcher-btn annachi-launcher"
            onClick={() => setOpen(true)}
            aria-label="Open Aura AI Shopping Assistant"
          >
            <span className="annachi-symbol-badge">A</span>
            <span className="launcher-text">Aura AI Assistant</span>
          </button>

          <button
            type="button"
            className={`quick-floating-mic annachi-quick-mic ${isListening ? "listening" : ""}`}
            onClick={toggleListening}
            title="Speak in English with Aura AI (Alternating Voice & Navigation)"
            aria-label="Aura Voice Command"
          >
            🎙️
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductCompareChatbot;
