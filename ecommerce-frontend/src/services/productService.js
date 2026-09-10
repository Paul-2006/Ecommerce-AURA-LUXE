import api from "./api";

// Expanded 20+ product catalog for rich marketplace experience
export const DEMO_PRODUCTS = [
  {
    productId: 1,
    sellerProductId: 1,
    productName: "Apple MacBook Pro 16\" M3 Max",
    brand: "Apple",
    description: "Liquid Retina XDR display, 36GB unified memory, 1TB SSD storage with extreme performance for developers and creators.",
    price: 249999,
    stock: 14,
    warranty: "1 Year AppleCare+",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 128,
    category: "Laptops"
  },
  {
    productId: 2,
    sellerProductId: 2,
    productName: "Sony WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    description: "Industry-leading noise cancellation, crystal clear hands-free calling, and 30-hour battery life.",
    price: 29990,
    stock: 25,
    warranty: "1 Year Manufacturer Warranty",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 340,
    category: "Electronics"
  },
  {
    productId: 3,
    sellerProductId: 3,
    productName: "Samsung Galaxy S24 Ultra 5G",
    brand: "Samsung",
    description: "Galaxy AI features, 200MP camera, built-in S-Pen, and Snapdragon 8 Gen 3 processor.",
    price: 129999,
    stock: 18,
    warranty: "1 Year Comprehensive Warranty",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 215,
    category: "Mobiles"
  },
  {
    productId: 4,
    sellerProductId: 4,
    productName: "Dell XPS 15 OLED Touch",
    brand: "Dell",
    description: "13th Gen Intel Core i9, NVIDIA RTX 4070, 3.5K OLED InfinityEdge touch screen.",
    price: 189990,
    stock: 8,
    warranty: "2 Years On-Site Support",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 94,
    category: "Laptops"
  },
  {
    productId: 5,
    sellerProductId: 5,
    productName: "Apple Watch Ultra 2 GPS + Cellular",
    brand: "Apple",
    description: "Rugged 49mm titanium case, precision dual-frequency GPS, up to 72 hours in Low Power Mode.",
    price: 89900,
    stock: 12,
    warranty: "1 Year Apple Warranty",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 88,
    category: "Accessories"
  },
  {
    productId: 6,
    sellerProductId: 6,
    productName: "Logitech MX Master 3S Wireless Mouse",
    brand: "Logitech",
    description: "Quiet clicks, 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling.",
    price: 8995,
    stock: 40,
    warranty: "2 Years Replacement Warranty",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 512,
    category: "Accessories"
  },
  {
    productId: 7,
    sellerProductId: 7,
    productName: "Asus ROG Zephyrus G16 Gaming Laptop",
    brand: "Asus",
    description: "Intel Core Ultra 9 processor, NVIDIA RTX 4080, OLED 240Hz Nebula Display.",
    price: 219990,
    stock: 6,
    warranty: "2 Years ROG International Warranty",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 76,
    category: "Laptops"
  },
  {
    productId: 8,
    sellerProductId: 8,
    productName: "iPhone 15 Pro Max 256GB Titanium",
    brand: "Apple",
    description: "A17 Pro chip with 6-core GPU, 5x Telephoto camera, Action button, USB-C 3 speed.",
    price: 149900,
    stock: 15,
    warranty: "1 Year AppleCare+",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 420,
    category: "Mobiles"
  },
  {
    productId: 9,
    sellerProductId: 9,
    productName: "Bose QuietComfort Ultra Earbuds",
    brand: "Bose",
    description: "Spatial audio immersive listening, CustomTune technology, 6-hour playback + wireless case.",
    price: 25900,
    stock: 30,
    warranty: "1 Year Bose Warranty",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 160,
    category: "Electronics"
  },
  {
    productId: 10,
    sellerProductId: 10,
    productName: "LG C3 55-inch OLED 4K Smart TV",
    brand: "LG",
    description: "α9 AI Processor Gen6, Brightness Booster, Dolby Vision & Atmos, 120Hz gaming support.",
    price: 139990,
    stock: 5,
    warranty: "3 Years LG Panel Warranty",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 110,
    category: "Electronics"
  },
  {
    productId: 11,
    sellerProductId: 11,
    productName: "Sony PlayStation 5 Slim Console",
    brand: "Sony",
    description: "1TB SSD ultra-high speed storage, DualSense wireless controller, 4K 120Hz gaming output.",
    price: 54990,
    stock: 20,
    warranty: "1 Year Sony Warranty",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 640,
    category: "Electronics"
  },
  {
    productId: 12,
    sellerProductId: 12,
    productName: "Canon EOS R6 Mark II Mirrorless Camera",
    brand: "Canon",
    description: "24.2 MP CMOS sensor, 40 fps continuous shooting, 4K 60p uncropped video recording.",
    price: 215995,
    stock: 4,
    warranty: "2 Years Canon India Warranty",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 52,
    category: "Electronics"
  },
  {
    productId: 13,
    sellerProductId: 13,
    productName: "Samsung Odyssey OLED G9 49\" Gaming Monitor",
    brand: "Samsung",
    description: "Dual QHD 240Hz 0.03ms GTG gaming curved display with Neo Quantum Processor Pro.",
    price: 129990,
    stock: 7,
    warranty: "3 Years On-Site Support",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 45,
    category: "Accessories"
  },
  {
    productId: 14,
    sellerProductId: 14,
    productName: "Keychron Q1 Pro Mechanical Keyboard",
    brand: "Keychron",
    description: "75% layout QMK/VIA wireless custom mechanical keyboard with CNC aluminum body.",
    price: 16990,
    stock: 22,
    warranty: "1 Year Replacement Warranty",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 198,
    category: "Accessories"
  },
  {
    productId: 15,
    sellerProductId: 15,
    productName: "Samsung 990 PRO 2TB NVMe PCIe 4.0 SSD",
    brand: "Samsung",
    description: "Sequential read speeds up to 7,450 MB/s, optimal power efficiency and heatsink thermal control.",
    price: 18999,
    stock: 35,
    warranty: "5 Years Limited Warranty",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 310,
    category: "Accessories"
  },
  {
    productId: 16,
    sellerProductId: 16,
    productName: "iPad Pro 12.9-inch M2 Chip 256GB",
    brand: "Apple",
    description: "Liquid Retina XDR display, Apple Pencil hover feature, Wi-Fi 6E ultra-fast connectivity.",
    price: 112900,
    stock: 10,
    warranty: "1 Year Apple Warranty",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 175,
    category: "Mobiles"
  },
  {
    productId: 17,
    sellerProductId: 17,
    productName: "Marshall Stanmore III Bluetooth Speaker",
    brand: "Marshall",
    description: "Wider soundstage stereo audio, iconic vintage design, Dynamic Loudness technology.",
    price: 31999,
    stock: 16,
    warranty: "1 Year Official Warranty",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 89,
    category: "Electronics"
  },
  {
    productId: 18,
    sellerProductId: 18,
    productName: "Dyson V15 Detect Cordless Vacuum Cleaner",
    brand: "Dyson",
    description: "Laser reveals microscopic dust, piezo sensor counts dust particles, up to 60 min run time.",
    price: 65900,
    stock: 9,
    warranty: "2 Years Dyson Warranty",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 142,
    category: "Electronics"
  },
  {
    productId: 19,
    sellerProductId: 19,
    productName: "Nespresso Vertuo Pop Coffee Machine",
    brand: "Nespresso",
    description: "Centrifusion extraction technology, 4 cup sizes, fast 30-second heat-up system.",
    price: 16500,
    stock: 28,
    warranty: "2 Years Nespresso Warranty",
    image: "https://images.unsplash.com/photo-1517668808822-9e428824603b?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 205,
    category: "Electronics"
  },
  {
    productId: 20,
    sellerProductId: 20,
    productName: "Garmin Fenix 7X Pro Solar Smartwatch",
    brand: "Garmin",
    description: "Power Sapphire solar charging lens, built-in LED flashlight, advanced training metrics.",
    price: 98990,
    stock: 11,
    warranty: "2 Years Garmin Warranty",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 96,
    category: "Accessories"
  }
];

// Get all products
export const getProducts = async () => {
  try {
    const response = await api.get("/Product");
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    return DEMO_PRODUCTS;
  } catch (err) {
    console.warn("Backend /Product call failed, using expanded marketplace catalog fallback:", err.message);
    return DEMO_PRODUCTS;
  }
};

// Get product details by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/Product/${id}`);
    if (response.data) return response.data;
  } catch (err) {
    console.warn("Backend /Product/{id} call failed:", err.message);
  }
  const pid = Number(id);
  return DEMO_PRODUCTS.find((p) => p.productId === pid) || DEMO_PRODUCTS[0];
};