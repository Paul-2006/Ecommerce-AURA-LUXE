// Notification & SMS Dispatch Service for AURA Luxe Marketplace

const NOTIFICATIONS_KEY = "webkadai_order_notifications";

export const getNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveNotifications = (notifications) => {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    // Dispatch custom event for real-time reactive navbar bell updates
    window.dispatchEvent(new Event("notifications_updated"));
  } catch (err) {
    console.error("Failed to save notifications:", err);
  }
};

export const createOrderAcknowledgement = ({
  orderId,
  items,
  totalAmount,
  customerName,
  customerPhone,
  customerEmail,
  shippingAddress,
  paymentMethod = "Online Payment"
}) => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const estimatedMins = Math.floor(30 + Math.random() * 15);
  const now = new Date();
  const estArrival = new Date(now.getTime() + estimatedMins * 60000).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const agentPool = [
    {
      name: "Ramesh Kumar",
      phone: "+91 98765 43210",
      vehicleNumber: "KA-01-EA-9988 (Hero Splendor Pro)",
      rating: "4.9 ★ (1,420 Deliveries)",
      status: "Dispatched with Security Box",
      avatar: "RK"
    },
    {
      name: "Suresh Vignesh",
      phone: "+91 98450 11223",
      vehicleNumber: "KA-04-MB-4512 (Honda Activa 6G)",
      rating: "4.8 ★ (980 Deliveries)",
      status: "Heading to Central Warehouse Hub",
      avatar: "SV"
    },
    {
      name: "Anand Natarajan",
      phone: "+91 97312 88776",
      vehicleNumber: "KA-05-ZX-3321 (TVS Raider 125)",
      rating: "4.9 ★ (2,100 Deliveries)",
      status: "Fast Express Route Active",
      avatar: "AN"
    }
  ];

  const agent = agentPool[Math.floor(Math.random() * agentPool.length)];
  const itemNames = items && items.length > 0
    ? items.map((i) => `${i.productName || "Product"} (x${i.quantity || 1})`).join(", ")
    : "Apple MacBook Pro 16\" (x1)";

  // Registered Phone SMS Message
  const smsText = `📦 [AURA Luxe] Order Confirmed! Order #${orderId} of ₹${totalAmount?.toLocaleString("en-IN") || "2,49,999"} placed successfully.\n` +
    `Items: ${itemNames}\n` +
    `Delivery Agent: ${agent.name} (Phone: ${agent.phone}, Motorbike: ${agent.vehicleNumber})\n` +
    `Delivery Verification OTP: ${otp}\n` +
    `Estimated Delivery Time: ${estimatedMins} Mins (by ${estArrival})\n` +
    `Live GPS Map: http://localhost:5173/orders`;

  const newAck = {
    id: "NOTIF-" + Date.now(),
    orderId: orderId || Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    customerName: customerName || "Customer",
    customerPhone: customerPhone || "+91 98765 00000",
    customerEmail: customerEmail || "",
    shippingAddress: shippingAddress || "Plot 42, Tech Park Avenue, Bengaluru",
    items: items || [],
    totalAmount: totalAmount || 249999,
    paymentMethod,
    otp,
    estimatedMinutes: estimatedMins,
    estimatedArrivalTime: estArrival,
    deliveryAgent: agent,
    smsContent: smsText,
    smsStatus: "Delivered to Registered Phone Number",
    read: false
  };

  const existing = getNotifications();
  const updated = [newAck, ...existing].slice(0, 20); // Keep latest 20 notifications
  saveNotifications(updated);

  return newAck;
};

export const markAllNotificationsRead = () => {
  const list = getNotifications();
  const updated = list.map((n) => ({ ...n, read: true }));
  saveNotifications(updated);
};
