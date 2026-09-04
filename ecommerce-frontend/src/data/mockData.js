export const mockCategories = [
  { id: "all", name: "All Collections", icon: "Sparkles", count: 12 },
  { id: "electronics", name: "Cyber Electronics", icon: "Cpu", count: 4 },
  { id: "wearables", name: "Smart Wearables", icon: "Watch", count: 3 },
  { id: "gaming", name: "Gaming Gear", icon: "Gamepad2", count: 3 },
  { id: "audio", name: "Audio & Sound", icon: "Headphones", count: 2 },
];

export const mockProducts = [
  {
    id: 101,
    name: "Nexus Vision Pro AR Glass",
    category: "wearables",
    price: 899.99,
    originalPrice: 1099.99,
    rating: 4.9,
    reviewsCount: 142,
    badge: "AI Top Pick",
    isFlashSale: true,
    discount: 18,
    stock: 14,
    images: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Next-generation augmented reality smart glasses powered by Nexus AI Engine. Features real-time heads-up translation, neural gesture tracking, 4K Micro-OLED dual displays, and 12-hour battery life.",
    specs: {
      Display: "Dual 4K Micro-OLED (3840 x 2160 per eye)",
      Processor: "Neural Bionic X2 Coprocessor",
      Battery: "12 Hours Active / Fast Charge 80% in 20 min",
      Weight: "74g Ergonomic Titanium Alloy",
      Connectivity: "Wi-Fi 7, Bluetooth 5.4, Low-latency Ultra-wideband"
    },
    aiSummary: {
      sentimentScore: 96,
      positivePercentage: 94,
      neutralPercentage: 4,
      negativePercentage: 2,
      pros: ["Ultra-crisp 4K displays", "Zero light leakage & comfortable fit", "Instant translation overlay works like magic"],
      cons: ["Requires initial neural calibration", "Premium price point"],
      verdict: "The absolute gold standard for AR spatial computing. Essential for tech enthusiasts."
    },
    reviews: [
      { id: 1, user: "Alex Vance", rating: 5, date: "2026-08-01", comment: "Mind-blowing experience! The real-time HUD translation made my Tokyo trip smooth and effortless." },
      { id: 2, user: "Sarah Lin", rating: 5, date: "2026-07-28", comment: "Comfortable to wear all day. The neural gesture controls respond instantly." }
    ]
  },
  {
    id: 102,
    name: "CyberPulse ANC Headphones",
    category: "audio",
    price: 349.99,
    originalPrice: 429.99,
    rating: 4.8,
    reviewsCount: 98,
    badge: "Bestseller",
    isFlashSale: true,
    discount: 18,
    stock: 22,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Studio-grade wireless headphones featuring AI Adaptive Active Noise Cancellation, custom 50mm beryllium drivers, magnetic memory foam cushions, and dynamic spatialize-audio tuning.",
    specs: {
      Drivers: "50mm Beryllium Composite",
      NoiseCancellation: "AI Adaptive ANC (-48dB)",
      Playtime: "65 Hours ANC Off / 45 Hours ANC On",
      Microphones: "8-Microphone Beamforming Array",
      CodecSupport: "LDAC, aptX Lossless, AAC, SBC"
    },
    aiSummary: {
      sentimentScore: 92,
      positivePercentage: 90,
      neutralPercentage: 7,
      negativePercentage: 3,
      pros: ["Exceptional sound clarity and deep punchy bass", "Best-in-class noise suppression", "Extreme 65h battery life"],
      cons: ["Case is slightly bulky"],
      verdict: "Top recommendation for audiophiles and travelers seeking silence and fidelity."
    },
    reviews: [
      { id: 1, user: "David Miller", rating: 5, date: "2026-07-15", comment: "The noise cancellation isolates airplane noise completely. Sound stage is wide and rich." },
      { id: 2, user: "Elena Rostova", rating: 4, date: "2026-07-10", comment: "Superb battery life and extremely soft earpads." }
    ]
  },
  {
    id: 103,
    name: "QuantumBlade X1 Gaming Laptop",
    category: "gaming",
    price: 2199.99,
    originalPrice: 2499.99,
    rating: 4.95,
    reviewsCount: 64,
    badge: "Ultimate Performance",
    isFlashSale: false,
    discount: 12,
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Unleash peak gaming frame rates with QuantumBlade X1. Powered by RTX 5090 GPU, Intel Core i9-14900HX, 240Hz Mini-LED Display, and liquid metal cooling chamber.",
    specs: {
      GPU: "NVIDIA GeForce RTX 5090 16GB GDDR7",
      CPU: "Intel Core i9-14900HX (24 Cores)",
      RAM: "64GB DDR5 6000MHz",
      Storage: "2TB NVMe PCIe Gen5 SSD",
      Display: "16.0\" QHD+ 240Hz Mini-LED HDR 1000"
    },
    aiSummary: {
      sentimentScore: 98,
      positivePercentage: 97,
      neutralPercentage: 2,
      negativePercentage: 1,
      pros: ["Unstoppable gaming FPS at 4K", "Mini-LED screen colors look stunning", "Cool temps under load"],
      cons: ["Power brick is heavy"],
      verdict: "A powerhouse machine built for competitive gamers and creative professionals who demand perfection."
    },
    reviews: [
      { id: 1, user: "Marcus Wright", rating: 5, date: "2026-08-04", comment: "Runs Cyberpunk 2077 with full Path Tracing at 140+ FPS smoothly!" }
    ]
  },
  {
    id: 104,
    name: "Aura Glow Smart Ring",
    category: "wearables",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviewsCount: 112,
    badge: "Health AI",
    isFlashSale: true,
    discount: 20,
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Sleek biometric smart ring crafted from aerospace grade titanium. Tracks sleep readiness, heart rate variability, stress levels, and blood oxygen with predictive AI health alerts.",
    specs: {
      Material: "Grade 5 Aerospace Titanium with DLC Coating",
      Sensors: "Infrared Photoplethysmography, Temperature, 3D Accelerometer",
      WaterResistance: "100m (10 ATM)",
      Battery: "7 Days on Single Charge",
      Weight: "4.2g lightweight"
    },
    aiSummary: {
      sentimentScore: 91,
      positivePercentage: 88,
      neutralPercentage: 9,
      negativePercentage: 3,
      pros: ["Zero weight feeling on finger", "Accurate sleep stage tracking", "No subscription fees"],
      cons: ["Sizing kit recommended first"],
      verdict: "Subtle, stylish, and incredibly precise health tracker that disappears on your hand."
    },
    reviews: [
      { id: 1, user: "Chloe Bennett", rating: 5, date: "2026-07-29", comment: "I stopped wearing my smartwatch to bed. Aura Ring is so comfortable and battery lasts a full week!" }
    ]
  },
  {
    id: 105,
    name: "Chronos CyberWatch Ultra",
    category: "wearables",
    price: 499.99,
    originalPrice: 599.99,
    rating: 4.85,
    reviewsCount: 87,
    badge: "Popular",
    isFlashSale: false,
    discount: 16,
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Rugged smartwatch with Sapphire glass, dual-frequency GPS, ECG monitor, solar charging sapphire lens, and AI workout coach.",
    specs: {
      Case: "49mm Sapphire & Ceramic Bezel",
      Display: "1.92\" Always-On Retina OLED (3000 nits)",
      Battery: "up to 8 Days / Solar Unlimited in Saver Mode",
      GPS: "Dual-Frequency Precision L1 + L5",
      Sensors: "ECG, SpO2, Skin Temp, Altimeter, Depth Gauge"
    },
    aiSummary: {
      sentimentScore: 94,
      positivePercentage: 92,
      neutralPercentage: 6,
      negativePercentage: 2,
      pros: ["Brilliant sunlight outdoor visibility", "Indestructible chassis", "AI coach advice is surprisingly accurate"],
      cons: ["Large on small wrists"],
      verdict: "Built for extreme adventure and fitness data junkies."
    },
    reviews: [
      { id: 1, user: "Jason Reed", rating: 5, date: "2026-08-02", comment: "Survived my 50-mile trail run through rain and mud with 60% battery remaining!" }
    ]
  },
  {
    id: 106,
    name: "Apex CyberDeck Mechanical Keyboard",
    category: "gaming",
    price: 189.99,
    originalPrice: 229.99,
    rating: 4.88,
    reviewsCount: 156,
    badge: "Hot Deal",
    isFlashSale: true,
    discount: 17,
    stock: 29,
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Gasket-mounted hot-swappable mechanical keyboard featuring magnetic hall effect rapid trigger switches, custom OLED telemetry screen, and per-key RGB reactive glow.",
    specs: {
      Switches: "Magnetic Hall Effect (0.1mm - 4.0mm adjustable actuation)",
      Keycaps: "Double-shot PBT Cherry Profile",
      Connectivity: "Tri-mode (2.4GHz Wireless, Bluetooth 5.2, USB-C)",
      PollingRate: "8000Hz Ultra-fast response",
      Screen: "1.3\" Custom GIF & Status OLED Display"
    },
    aiSummary: {
      sentimentScore: 95,
      positivePercentage: 94,
      neutralPercentage: 4,
      negativePercentage: 2,
      pros: ["Rapid trigger gives noticeable competitive edge", "Creamy acoustic sound profile", "Custom OLED is super fun"],
      cons: ["Keycaps could have brighter shine-through font"],
      verdict: "The definitive rapid-trigger keyboard for esports and typing speed demons."
    },
    reviews: [
      { id: 1, user: "Tyson Vance", rating: 5, date: "2026-07-22", comment: "The sound out of the box is incredible! Rapid trigger response feels like cheat codes in Valorant." }
    ]
  },
  {
    id: 107,
    name: "Nebula AI Smart Home Hub",
    category: "electronics",
    price: 149.99,
    originalPrice: 179.99,
    rating: 4.65,
    reviewsCount: 73,
    badge: "Smart Living",
    isFlashSale: false,
    discount: 16,
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Central smart home command system with 8-inch floating HD touchscreen, spatial sound speaker, matter protocol support, and local offline privacy AI assistant.",
    specs: {
      Display: "8\" HD Glass Touchscreen",
      Audio: "360° Spatial Sound with 2.1 Driver System",
      Protocols: "Matter, Zigbee 3.0, Z-Wave, Thread, Wi-Fi 6E",
      Privacy: "Physical Hardware Camera & Microphone Kill Switch",
      AI: "Local Neural Processing (No Cloud Required for voice)"
    },
    aiSummary: {
      sentimentScore: 89,
      positivePercentage: 86,
      neutralPercentage: 11,
      negativePercentage: 3,
      pros: ["Local processing means commands work offline", "Matter compatibility linked all my lights instantly", "Great audio quality for desk speaker"],
      cons: ["Widget customization takes a few minutes"],
      verdict: "The ultimate privacy-first controller for modern smart homes."
    },
    reviews: [
      { id: 1, user: "Oliver Vance", rating: 5, date: "2026-07-30", comment: "Works flawlessly offline! Controlling my lights and thermostat feels instantaneous." }
    ]
  },
  {
    id: 108,
    name: "Falcon X8 Pro 4K Drone",
    category: "electronics",
    price: 1299.99,
    originalPrice: 1499.99,
    rating: 4.92,
    reviewsCount: 51,
    badge: "Pro Creator",
    isFlashSale: true,
    discount: 13,
    stock: 11,
    images: [
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Professional foldaway aerial camera drone equipped with 1-inch CMOS 4K/120fps sensor, 3-axis mechanical gimbal, 360° omnidirectional AI obstacle avoidance, and 45-minute flight duration.",
    specs: {
      Camera: "1\" CMOS Sensor 4K 120fps / 48MP Photos",
      FlightTime: "45 Minutes per battery",
      TransmissionRange: "15 KM HD Low-latency video link",
      ObstacleAvoidance: "360° Omnidirectional LiDAR & Vision Sensors",
      WindResistance: "Level 7 (Up to 38 km/h)"
    },
    aiSummary: {
      sentimentScore: 97,
      positivePercentage: 96,
      neutralPercentage: 3,
      negativePercentage: 1,
      pros: ["4K video is razor sharp with rich dynamic range", "LiDAR obstacle avoidance prevented crashes twice", "Smooth wind stabilization"],
      cons: ["Requires drone registration in most areas"],
      verdict: "A cinematic marvel for aerial photographers and filmmakers."
    },
    reviews: [
      { id: 1, user: "Liam Walker", rating: 5, date: "2026-08-05", comment: "Shot incredible footage over the coast. Signal stayed 100% solid even 3 miles away!" }
    ]
  }
];

export const mockOrders = [
  {
    id: "NEX-98214",
    date: "2026-08-08",
    status: "Out for Delivery",
    statusCode: 3,
    total: 899.99,
    items: [
      { id: 101, name: "Nexus Vision Pro AR Glass", quantity: 1, price: 899.99, image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80" }
    ],
    shippingAddress: "742 Evergreen Terrace, Cyber City, NY 10001",
    trackingId: "TRK-902834-US",
    estimatedDelivery: "Today, 5:30 PM"
  },
  {
    id: "NEX-91042",
    date: "2026-07-24",
    status: "Delivered",
    statusCode: 4,
    total: 349.99,
    items: [
      { id: 102, name: "CyberPulse ANC Headphones", quantity: 1, price: 349.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" }
    ],
    shippingAddress: "742 Evergreen Terrace, Cyber City, NY 10001",
    trackingId: "TRK-881290-US",
    estimatedDelivery: "2026-07-26"
  }
];

export const mockAIRecommendations = [
  {
    id: 101,
    reason: "Matches your interest in AR/VR and High-Tech Wearables",
    confidence: "98% Match"
  },
  {
    id: 102,
    reason: "Frequently bought together with QuantumBlade Gaming Laptop",
    confidence: "94% Match"
  },
  {
    id: 106,
    reason: "Trending #1 in Esports Gaming Gear this week",
    confidence: "91% Match"
  }
];
