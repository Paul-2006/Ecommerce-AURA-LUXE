import { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageSquare, Mic, Volume2, VolumeX, X, Square, Send, Star, CheckCircle2, ShoppingCart } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { getProducts, DEMO_PRODUCTS } from "../services/productService";
import { addCart } from "../services/cartService";
import { queryBackendAiAssistant } from "../services/aiBackendService";
import { getGroqApiKey, setGroqApiKey } from "../services/groqService";
import "../css/ProductCompareChatbot.css";

function ProductCompareChatbot() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide shopping chatbot on all Admin and Seller management routes
  if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/seller")) {
    return null;
  }
  const { isCustomer } = useContext(AuthContext);
  const { language } = useLanguage();

  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Voice State
  const voiceTurnCounter = useRef(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceStatusText, setVoiceStatusText] = useState("");
  const recognitionRef = useRef(null);

  const initialGreeting = "Hello! I'm Kiva, your AI shopping assistant. How can I help you today?";

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: initialGreeting
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
        setVoiceStatusText("Listening... Speak your shopping command");
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

  const speakText = (textToSpeak) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const cleanText = textToSpeak
      .replace(/[#*`_~]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const englishVoices = voices.filter((v) => v.lang.includes("en"));
      if (englishVoices.length > 0) {
        utterance.voice = englishVoices[0];
      }
    }

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

  const handleAiAssistantQuery = async (userInput) => {
    if (!userInput || !userInput.trim()) return;

    const raw = userInput.toLowerCase().trim();

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
      addBotMessage(userInput, reply);
      return;
    }

    if (raw.includes("take me to products") || raw.includes("go to products") || raw.includes("open shop")) {
      navigate("/products");
      addBotMessage(userInput, "Opening the products catalog for you now!");
      return;
    }
    if (raw.includes("go to cart") || raw.includes("open cart")) {
      navigate("/cart");
      addBotMessage(userInput, "Taking you to your shopping cart!");
      return;
    }
    if (raw.includes("track my orders") || raw.includes("go to orders")) {
      navigate("/orders");
      addBotMessage(userInput, "Navigating to your live orders and GPS tracking!");
      return;
    }

    setLoading(true);

    try {
      const aiResponse = await queryBackendAiAssistant({
        query: userInput,
        history: messages.slice(-4).map(m => ({ sender: m.from, text: m.text }))
      });

      const recommendedCards = aiResponse.recommendedProducts || [];

      addBotMessage(
        userInput,
        aiResponse.answer,
        recommendedCards
      );

      speakText(aiResponse.answer);
    } catch (err) {
      console.error("AI Assistant error:", err);
      const fallbackReply = "I couldn't connect to our backend AI service right now. Would you like to explore our products catalog or cart directly?";
      addBotMessage(userInput, fallbackReply);
      speakText(fallbackReply);
    } finally {
      setLoading(false);
    }
  };

  const addBotMessage = (userText, botText, recommendedProducts = []) => {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: userText },
      {
        from: "bot",
        text: botText,
        recommendedProducts
      }
    ]);
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
              <MessageSquare size={20} className="text-blue-500" aria-hidden="true" />
              <div>
                <strong>Kiva AI Assistant</strong>
                <span className="online-indicator">Active</span>
              </div>
            </div>

            <div className="header-controls">
              {isSpeaking && (
                <button type="button" className="cancel-speaking-btn" onClick={stopSpeechTalkBack} title="Stop Speech">
                  <Square size={12} fill="currentColor" aria-hidden="true" /> Stop
                </button>
              )}

              <button
                type="button"
                className={`voice-toggle-btn ${voiceEnabled ? "active" : ""}`}
                onClick={() => {
                  stopSpeechTalkBack();
                  setVoiceEnabled(!voiceEnabled);
                }}
                title={voiceEnabled ? "Mute Speech" : "Enable Speech"}
                aria-label="Toggle Voice"
              >
                {voiceEnabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
              </button>

              <button type="button" className="compare-close-btn" onClick={() => setOpen(false)} title="Close Assistant" aria-label="Close Assistant">
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Listening Banner */}
          {isListening && (
            <div className="voice-listening-banner aura-listening">
              <div className="sound-wave">
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
              </div>
              <span>{voiceStatusText || "Listening..."}</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={toggleListening}>
                Stop
              </button>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="compare-messages-body aura-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-row ${msg.from}`}>
                <div className={`chat-bubble ${msg.from} aura-bubble`}>
                  <p className="chat-bubble-text">{msg.text}</p>

                  {/* Recommended Product Cards */}
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
                            </div>
                            <div className="ai-card-meta">
                              <span className="rating-pill">
                                <Star size={12} fill="currentColor" stroke="none" aria-hidden="true" /> {prod.rating || 4.7}
                              </span>
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
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble-row bot">
                <div className="chat-bubble bot typing aura-typing">
                  <span>Kiva AI is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="compare-input-form aura-input">
            <button
              type="button"
              className={`voice-mic-btn aura-mic ${isListening ? "listening" : ""}`}
              onClick={toggleListening}
              title="Speak voice command"
              aria-label="Voice Input"
            >
              <Mic size={18} aria-hidden="true" />
            </button>
            <input
              type="text"
              className="compare-input-field aura-field"
              placeholder="Ask anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm send-btn aura-send" disabled={loading} aria-label="Send Message">
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      ) : (
        <div className="compare-launcher-group">
          <button
            type="button"
            className="compare-launcher-btn annachi-launcher"
            onClick={() => setOpen(true)}
            aria-label="Open Kiva AI Shopping Assistant"
          >
            <MessageSquare size={18} aria-hidden="true" />
            <span className="launcher-text">Kiva AI</span>
          </button>

          <button
            type="button"
            className={`quick-floating-mic annachi-quick-mic ${isListening ? "listening" : ""}`}
            onClick={toggleListening}
            title="Speak voice command"
            aria-label="Kiva Voice Command"
          >
            <Mic size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductCompareChatbot;
