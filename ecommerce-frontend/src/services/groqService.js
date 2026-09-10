// Groq API Service for Aura AI (Ultra-fast LLM Inference & Action Navigation)

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile"; // High-precision 70B model on Groq

export const getGroqApiKey = () => {
  return (
    import.meta.env.VITE_GROQ_API_KEY ||
    localStorage.getItem("groq_api_key") ||
    ""
  );
};

export const setGroqApiKey = (key) => {
  if (key) {
    localStorage.setItem("groq_api_key", key.trim());
  } else {
    localStorage.removeItem("groq_api_key");
  }
};

/**
 * Calls Groq Cloud API with full product catalog context & action navigation instructions
 */
export const queryGroqAuraAI = async ({ prompt, activeProducts = [], customerContext = {} }) => {
  const apiKey = getGroqApiKey();

  // Prepare system prompt with exact product database
  const catalogContext = activeProducts.map((p) => ({
    productId: p.productId,
    name: p.productName,
    priceINR: p.price,
    brand: p.brand || "Brand",
    category: p.category || "Electronics",
    rating: p.rating || 4.8,
    reviews: p.reviewsCount || 100,
    warranty: p.warranty || "1 Year Standard",
    stock: p.stock ?? 10,
    highlights: p.description || ""
  }));

  const systemInstructions = `
You are "Kiva AI", a warm, highly intelligent, and helpful AI shopping assistant for the "AURA Luxe" e-commerce marketplace.

Always respond in clean, articulate, and natural English.

YOUR IDENTITY & PERSONA:
- Name: "Kiva AI"
- Role: Intelligent Shopping Concierge and Product Comparison Specialist on AURA Luxe.
- When asked "What is your name?", "Who are you?", or "Introduce yourself":
  Proudly introduce yourself as "Kiva AI", your personal shopping assistant on AURA Luxe. Explain that you are here to help navigate products, compare specifications, and assist with orders.

PRODUCT CATALOG CURRENTLY AVAILABLE IN WEB KADAI:
${JSON.stringify(catalogContext, null, 2)}

AVAILABLE PORTAL & PAGE ROUTES:
- Home: "/"
- Products / Shop Catalog: "/products"
- Cart: "/cart"
- Wishlist: "/wishlist"
- Checkout / Payment: "/checkout"
- Orders & Live GPS Tracking: "/orders"
- Profile & Settings: "/profile"
- Seller Portal: "/seller/dashboard" (or "/seller/login")
- Admin Security Portal: "/admin/dashboard" (or "/admin/login")
- Warehouse Scanner Terminal: "/warehouse/dashboard" (or "/warehouse/login")
- Delivery Rider Portal: "/delivery/dashboard" (or "/delivery/login")

CORE RULES & BEHAVIORS:
1. WARM GEMINI-STYLE CONVERSATION:
   - Greet warmly and naturally, just like Gemini.
   - Speak with empathy, clarity, and thoughtful phrasing.

2. NAME & IDENTITY INQUIRIES:
   - When asked for your name or identity, clearly say your name is "Aura AI" and offer your assistance.

3. UNRELATED / UNLISTED TOPICS:
   - If the user asks about ANY topic or product not in our catalog, reply gracefully:
     "I am truly sorry, but I can't quite relate to or find that in our marketplace catalog right now. As your AURA Luxe shopping companion, I would love to help you navigate between pages (like Home, Shop, Cart, or Orders), compare our electronics, or check your deliveries. How can I help you explore today?"

4. VOICE & PAGE NAVIGATION COMMANDS:
   - If the user asks to navigate to any page or scroll, output an ACTION tag on line 1:
     ACTION:{"type":"NAVIGATE","path":"/path"} or ACTION:{"type":"SCROLL","target":"top|down|bottom|categories|products|trust"} or ACTION:{"type":"THEME","mode":"dark|light"} or ACTION:{"type":"ADD_CART","productId":number}
   - Follow it with a pleasant conversational confirmation.

5. EXACT PRODUCT COMPARISON:
   - Compare ONLY the exact same products requested by the user. Do not bring in unrelated or random products.
   - Contrast exact prices in ₹ (INR), specs, ratings, and provide a clear recommendation.

6. CANCEL SPEECH:
   - If the user says "Cancel" or "Stop", immediately acknowledge speech cancellation pleasantly.
`;

  if (!apiKey) {
    // If no Groq API Key is configured, use our human-like local Groq fallback
    return localGroqFallback(prompt, activeProducts, customerContext);
  }

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemInstructions },
          { role: "user", content: prompt }
        ],
        temperature: 0.25,
        max_tokens: 800
      })
    });

    if (!res.ok) {
      console.warn("Groq API returned HTTP status:", res.status);
      return localGroqFallback(prompt, activeProducts, customerContext);
    }

    const data = await res.json();
    const replyText = data.choices?.[0]?.message?.content || "";

    return parseGroqResponse(replyText, activeProducts);
  } catch (err) {
    console.warn("Groq API fetch error:", err.message);
    return localGroqFallback(prompt, activeProducts, customerContext);
  }
};

/**
 * Parses Groq response text and extracts optional ACTION metadata
 */
const parseGroqResponse = (rawText, activeProducts) => {
  let cleanText = rawText.trim();
  let action = null;

  if (cleanText.startsWith("ACTION:")) {
    const firstLineEnd = cleanText.indexOf("\n");
    const actionLine = firstLineEnd !== -1 ? cleanText.substring(0, firstLineEnd) : cleanText;
    cleanText = firstLineEnd !== -1 ? cleanText.substring(firstLineEnd + 1).trim() : "";

    try {
      const jsonStr = actionLine.replace("ACTION:", "").trim();
      action = JSON.parse(jsonStr);
    } catch (e) {
      console.warn("Failed to parse Groq ACTION json:", e);
    }
  }

  return {
    text: cleanText,
    action,
    source: "groq-cloud"
  };
};

/**
 * Intelligent Local Deterministic Fallback Engine matching Groq standard
 */
const localGroqFallback = (prompt, activeProducts, customerContext) => {
  const raw = (prompt || "").toLowerCase().trim();
  const formatINR = (amt) => "₹" + Number(amt || 0).toLocaleString("en-IN");

  // 1. Identity & Name Questions ("What is your name?", "Who are you?", "Tell me about yourself")
  if (
    raw.includes("what is your name") ||
    raw.includes("what's your name") ||
    raw.includes("whats your name") ||
    raw.includes("your name") ||
    raw.includes("who are you") ||
    raw.includes("tell me your name") ||
    raw.includes("introduce yourself") ||
    raw.includes("who created you") ||
    raw.includes("who made you") ||
    raw === "name"
  ) {
    return {
      text: "Hello! My name is Aura AI. I am your intelligent shopping assistant and voice navigation copilot for AURA Luxe, inspired by Gemini. I can guide you to any page across our store, compare gadgets and electronics with exact precision, answer your questions, and assist your checkout with live GPS delivery tracking. How may I assist you today?",
      source: "local-groq-engine"
    };
  }

  // 2. Greetings & Welcome ("Hi", "Hello", "Hey", "Good morning", "Good afternoon", "Good evening")
  if (
    raw === "hi" ||
    raw === "hello" ||
    raw === "hey" ||
    raw.includes("good morning") ||
    raw.includes("good afternoon") ||
    raw.includes("good evening") ||
    raw.includes("how are you") ||
    raw.includes("nice to meet you")
  ) {
    return {
      text: "Hello and a warm welcome! I'm Aura AI, your personal shopping companion on AURA Luxe. Whether you'd like to explore our latest tech, compare products side-by-side, or navigate between pages using voice, I'm here to help. What can I do for you today?",
      source: "local-groq-engine"
    };
  }

  // 3. Voice In-Page Scrolling Commands
  if (raw.includes("scroll to top") || raw === "go to top" || raw === "scroll top" || raw.includes("top of page")) {
    return {
      text: "Certainly! I've smoothly scrolled you right to the top of the page.",
      action: { type: "SCROLL", target: "top" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("scroll down") || raw === "scroll down" || raw === "page down") {
    return {
      text: "Sure thing! Scrolling down the page for you.",
      action: { type: "SCROLL", target: "down" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("scroll to bottom") || raw === "go to bottom" || raw.includes("bottom of page")) {
    return {
      text: "Right away! I've scrolled down to the footer of the page.",
      action: { type: "SCROLL", target: "bottom" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("show categories") || raw.includes("scroll to categories") || raw.includes("categories")) {
    return {
      text: "Here are our product categories! Taking you straight to them.",
      action: { type: "SCROLL", target: "categories" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("show featured") || raw.includes("show products") || raw.includes("scroll to products")) {
    return {
      text: "Taking you to our featured gadgets and products grid right away.",
      action: { type: "SCROLL", target: "products" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("show trust") || raw.includes("scroll to trust") || raw.includes("guarantee")) {
    return {
      text: "Here is our customer trust, warranty, and fast delivery assurance section.",
      action: { type: "SCROLL", target: "trust" },
      source: "local-groq-engine"
    };
  }

  // 4. Full Page & Portal Routing
  if (raw === "home" || raw.includes("go to home") || raw.includes("take me home") || raw.includes("main page") || raw.includes("homepage")) {
    return {
      text: "Taking you to the AURA Luxe homepage right now. Let me know what you'd like to explore!",
      action: { type: "NAVIGATE", path: "/" },
      source: "local-groq-engine"
    };
  }
  if (
    raw.includes("go to products") ||
    raw.includes("open products") ||
    raw.includes("open shop") ||
    raw.includes("catalog") ||
    raw.includes("browse products") ||
    raw.includes("show catalog")
  ) {
    return {
      text: "Opening our full electronics and gadgets catalog for you. Happy browsing!",
      action: { type: "NAVIGATE", path: "/products" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("go to cart") || raw.includes("open cart") || raw.includes("view cart") || raw === "cart" || raw.includes("shopping bag")) {
    return {
      text: "Opening your shopping cart now so you can review your selected items.",
      action: { type: "NAVIGATE", path: "/cart" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("go to wishlist") || raw.includes("open wishlist") || raw === "wishlist" || raw.includes("saved items")) {
    return {
      text: "Opening your saved wishlist. All your favorite items are safely kept here.",
      action: { type: "NAVIGATE", path: "/wishlist" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("go to checkout") || raw.includes("open checkout") || raw.includes("proceed to payment") || raw === "checkout" || raw.includes("buy now")) {
    return {
      text: "Proceeding straight to our fast, secure checkout. Please confirm your delivery details.",
      action: { type: "NAVIGATE", path: "/checkout" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("go to orders") || raw.includes("open orders") || raw.includes("track my order") || raw === "orders" || raw.includes("order status")) {
    return {
      text: "Opening your Orders page with real-time GPS delivery tracking, verification OTP, and tax invoices.",
      action: { type: "NAVIGATE", path: "/orders" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("open profile") || raw.includes("go to profile") || raw.includes("open settings") || raw === "profile" || raw.includes("my account")) {
    return {
      text: "Opening your Customer Profile and Account Settings.",
      action: { type: "NAVIGATE", path: "/profile" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("seller portal") || raw.includes("seller dashboard") || raw.includes("merchant")) {
    return {
      text: "Navigating to the Seller & Merchant Portal...",
      action: { type: "NAVIGATE", path: customerContext.isSeller ? "/seller/dashboard" : "/seller/login" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("admin portal") || raw.includes("admin security") || raw.includes("admin dashboard")) {
    return {
      text: "Navigating to the Admin Security & Operations Portal...",
      action: { type: "NAVIGATE", path: customerContext.isAdmin ? "/admin/dashboard" : "/admin/login" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("warehouse portal") || raw.includes("warehouse scanner") || raw.includes("inventory")) {
    return {
      text: "Navigating to the Warehouse Barcode Scanning Terminal...",
      action: { type: "NAVIGATE", path: customerContext.isWarehouse ? "/warehouse/dashboard" : "/warehouse/login" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("delivery portal") || raw.includes("rider portal") || raw.includes("dispatch")) {
    return {
      text: "Navigating to the Delivery Agent & Rider Dispatch Portal...",
      action: { type: "NAVIGATE", path: customerContext.isDelivery ? "/delivery/dashboard" : "/delivery/login" },
      source: "local-groq-engine"
    };
  }

  // 5. Theme Toggling
  if (raw.includes("dark mode") || raw.includes("dark theme") || raw.includes("switch to dark")) {
    return {
      text: "I've switched the marketplace theme to Dark Mode for comfortable, high-contrast viewing.",
      action: { type: "THEME", mode: "dark" },
      source: "local-groq-engine"
    };
  }
  if (raw.includes("light mode") || raw.includes("white theme") || raw.includes("switch to light")) {
    return {
      text: "I've switched the marketplace theme to Clean White / Light Mode.",
      action: { type: "THEME", mode: "light" },
      source: "local-groq-engine"
    };
  }

  // 6. Exact Specific Product Comparison
  const isCompareRequest =
    raw.includes("compare") ||
    raw.includes("vs") ||
    raw.includes("versus") ||
    raw.includes("difference") ||
    raw.includes("which is better");

  const matched = [];
  const list = activeProducts.length > 0 ? activeProducts : [];

  const addMatch = (p) => {
    if (p && !matched.some((m) => m.productId === p.productId)) {
      matched.push(p);
    }
  };

  if (raw.includes("macbook") || raw.includes("apple laptop") || raw.includes("m3")) {
    addMatch(list.find((p) => p.productName.toLowerCase().includes("macbook")));
  }
  if (raw.includes("dell") || raw.includes("xps")) {
    addMatch(list.find((p) => p.productName.toLowerCase().includes("dell")));
  }
  if (raw.includes("sony") || raw.includes("xm5") || raw.includes("headphone") || raw.includes("wh-1000")) {
    addMatch(list.find((p) => p.productName.toLowerCase().includes("sony")));
  }
  if (raw.includes("samsung") || raw.includes("galaxy") || raw.includes("s24") || raw.includes("smartphone")) {
    addMatch(list.find((p) => p.productName.toLowerCase().includes("samsung")));
  }
  if (raw.includes("watch") || raw.includes("apple watch") || raw.includes("ultra 2")) {
    addMatch(list.find((p) => p.productName.toLowerCase().includes("watch")));
  }
  if (raw.includes("mouse") || raw.includes("mx master") || raw.includes("logitech")) {
    addMatch(list.find((p) => p.productName.toLowerCase().includes("mouse")));
  }

  // If explicit compare request was made and products matched
  if (isCompareRequest || matched.length >= 2) {
    if (matched.length === 1) {
      const p1 = matched[0];
      const rival = list.find((p) => p.productId !== p1.productId && p.category === p1.category) ||
                    list.find((p) => p.productId !== p1.productId);
      if (rival) addMatch(rival);
    }

    if (matched.length >= 2) {
      const itemA = matched[0];
      const itemB = matched[1];
      const priceDiff = Math.abs((itemA.price || 0) - (itemB.price || 0));
      const cheaper = (itemA.price || 0) < (itemB.price || 0) ? itemA : itemB;
      const higherRated = (itemA.rating || 0) >= (itemB.rating || 0) ? itemA : itemB;

      const comparisonText =
        `Here is my exact, side-by-side comparison for the products you requested:\n\n` +
        `1. ${itemA.productName} (${itemA.brand || "Brand"})\n` +
        `   • Price: ${formatINR(itemA.price)}\n` +
        `   • Rating: ${itemA.rating || 4.8} ★ (${itemA.reviewsCount || 100}+ customer reviews)\n` +
        `   • Warranty: ${itemA.warranty || "1 Year Standard"}\n` +
        `   • Key Features: ${itemA.description}\n\n` +
        `2. ${itemB.productName} (${itemB.brand || "Brand"})\n` +
        `   • Price: ${formatINR(itemB.price)}\n` +
        `   • Rating: ${itemB.rating || 4.7} ★ (${itemB.reviewsCount || 100}+ customer reviews)\n` +
        `   • Warranty: ${itemB.warranty || "1 Year Standard"}\n` +
        `   • Key Features: ${itemB.description}\n\n` +
        `My Personal Recommendation:\n` +
        `• Value: ${cheaper.productName} is more budget-friendly, saving you ${formatINR(priceDiff)}.\n` +
        `• Customer Favorite: ${higherRated.productName} has the highest rating at ${higherRated.rating || 4.8} ★.\n` +
        `• Which should you pick: If you want top-tier performance for pro workflows, go with ${itemA.productName}; otherwise, ${itemB.productName} is an outstanding choice.`;

      return {
        text: comparisonText,
        matchedProducts: [itemA, itemB],
        source: "local-groq-engine"
      };
    }
  }

  // 7. If user asks for a single product that IS present in store
  if (matched.length === 1) {
    const p = matched[0];
    return {
      text: `I found ${p.productName} in our catalog! It is priced at ${formatINR(p.price)} with a ${p.rating || 4.8} ★ rating. Highlights: ${p.description}. Would you like me to add it to your cart or compare it with another model?`,
      source: "local-groq-engine"
    };
  }

  // 8. UNRELATED / UNKNOWN TOPICS HANDLING (Polite, Warm, Pleasant Human Tone)
  return {
    text: "I am truly sorry, but I can't quite relate to or find that in our marketplace catalog right now. As your AURA Luxe shopping companion, I would love to help you navigate between our pages (like Home, Products Catalog, Shopping Cart, or Live Orders), compare our electronics, or check your deliveries. Could you let me know what gadget or section you'd like to explore?",
    source: "local-groq-engine"
  };
};
