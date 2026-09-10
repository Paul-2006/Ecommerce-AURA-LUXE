import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getNotifications } from "../services/notificationService";
import "../css/Orders.css";

function LiveMapTracker({ orderId, onClose }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);

  const [progress, setProgress] = useState(30);
  const [speed, setSpeed] = useState(34);
  const [eta, setEta] = useState(8);
  const [driverStatus, setDriverStatus] = useState("In transit with your package");
  const [currentCoords, setCurrentCoords] = useState({ lat: 12.9580, lng: 77.6100 });
  const [tileMode, setTileMode] = useState("voyager"); // 'voyager' | 'osm' | 'dark'

  // Retrieve notification metadata if available
  const [notifData] = useState(() => {
    const notifs = getNotifications();
    return notifs && notifs.length > 0 ? notifs[0] : null;
  });

  // Real GPS Waypoints Route (Bangalore Central Hub to Customer Delivery)
  const ROUTE_COORDS = [
    [12.9716, 77.5946], // 1. Central Warehouse Hub (Majestic/MG Road)
    [12.9680, 77.5990], // 2. Richmond Circle
    [12.9645, 77.6045], // 3. Victoria Road
    [12.9580, 77.6100], // 4. Austin Town
    [12.9510, 77.6160], // 5. Viveknagar
    [12.9430, 77.6210], // 6. Koramangala 80ft Road
    [12.9352, 77.6245]  // 7. Customer Delivery Address
  ];

  const origin = ROUTE_COORDS[0];
  const destination = ROUTE_COORDS[ROUTE_COORDS.length - 1];

  // Helper to interpolate position along polyline
  const getInterpolatedPoint = (pct) => {
    const totalSegments = ROUTE_COORDS.length - 1;
    const scaled = (pct / 100) * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaled), totalSegments - 1);
    const segmentPct = scaled - segmentIndex;

    const p1 = ROUTE_COORDS[segmentIndex];
    const p2 = ROUTE_COORDS[segmentIndex + 1];

    const lat = p1[0] + (p2[0] - p1[0]) * segmentPct;
    const lng = p1[1] + (p2[1] - p1[1]) * segmentPct;
    return { lat, lng };
  };

  // Initialize Real Leaflet OpenStreetMap Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [12.9530, 77.6100],
      zoom: 13,
      zoomControl: false
    });
    mapInstanceRef.current = map;

    L.control.zoom({ position: "topright" }).addTo(map);

    const tileUrl =
      tileMode === "osm"
        ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        : tileMode === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>';

    L.tileLayer(tileUrl, { maxZoom: 19, attribution }).addTo(map);

    // 1. Route Polyline
    const polyline = L.polyline(ROUTE_COORDS, {
      color: "#2563eb",
      weight: 6,
      opacity: 0.85,
      dashArray: "8, 8",
      lineCap: "round"
    }).addTo(map);
    routePolylineRef.current = polyline;

    // 2. Origin Hub Pin
    const originIcon = L.divIcon({
      className: "leaflet-origin-pin",
      html: `<div style="background:#1e40af;color:#fff;padding:6px;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(30,64,175,0.6);border:2px solid #fff;font-size:16px;">🏢</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    L.marker(origin, { icon: originIcon })
      .bindPopup("<strong>AURA Luxe Central Fulfillment Hub</strong><br/>Dispatch origin point")
      .addTo(map);

    // 3. Destination Pin
    const destIcon = L.divIcon({
      className: "leaflet-dest-pin",
      html: `<div style="background:#059669;color:#fff;padding:6px;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(5,150,105,0.6);border:2px solid #fff;font-size:16px;">📍</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    L.marker(destination, { icon: destIcon })
      .bindPopup("<strong>Customer Delivery Address</strong><br/>Plot 42, Tech Corridor, Bengaluru")
      .addTo(map);

    // 4. Live Motorbike Rider Marker
    const initialPos = getInterpolatedPoint(progress);
    const riderIcon = L.divIcon({
      className: "leaflet-rider-pin",
      html: `<div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">
              <span style="position:absolute;width:100%;height:100%;border-radius:50%;background:rgba(234,88,12,0.35);animation:pulseMicAura 1.5s infinite;"></span>
              <div style="background:linear-gradient(135deg, #f59e0b, #ea580c);color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(234,88,12,0.6);border:2px solid #ffffff;font-size:18px;">🏍️</div>
            </div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    const riderMarker = L.marker([initialPos.lat, initialPos.lng], { icon: riderIcon })
      .bindPopup(`<strong>${notifData?.deliveryAgent?.name || "Ramesh Kumar"} (Rider)</strong><br/>Vehicle: ${notifData?.deliveryAgent?.vehicleNumber || "KA-01-EA-9988"}`)
      .addTo(map);
    riderMarkerRef.current = riderMarker;

    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [tileMode]);

  // Real-time animation loop along route
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          setDriverStatus("Arrived at your delivery doorstep!");
          setSpeed(0);
          setEta(0);
          return 99;
        }

        const next = prev + 1.4;
        const pt = getInterpolatedPoint(next);
        setCurrentCoords(pt);

        if (riderMarkerRef.current) {
          riderMarkerRef.current.setLatLng([pt.lat, pt.lng]);
        }

        setSpeed(Math.floor(28 + Math.random() * 10));
        setEta(Math.max(1, Math.ceil((100 - next) * 0.12)));

        if (next > 80) {
          setDriverStatus("Approaching destination street (100m away)");
        } else if (next > 50) {
          setDriverStatus("Cruising along Koramangala 80ft Road");
        } else {
          setDriverStatus("Dispatched from Central Warehouse Hub");
        }

        return next;
      });
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  const handleCenterOnRider = () => {
    if (mapInstanceRef.current && riderMarkerRef.current) {
      mapInstanceRef.current.setView(riderMarkerRef.current.getLatLng(), 15, { animate: true });
    }
  };

  const agentName = notifData?.deliveryAgent?.name || "Ramesh Kumar";
  const vehicleNumber = notifData?.deliveryAgent?.vehicleNumber || "KA-01-EA-9988";
  const otpCode = notifData?.otp || "4892";
  const agentPhone = notifData?.deliveryAgent?.phone || "+91 98765 43210";

  return (
    <div className="live-tracking-modal" onClick={onClose}>
      <div
        className="live-tracking-content glass-panel tracker-modal-wide"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "96vw",
          maxWidth: "1100px",
          height: "88vh",
          maxHeight: "750px",
          display: "flex",
          flexDirection: "column",
          padding: "20px 24px",
          gap: "16px",
          overflow: "hidden"
        }}
      >
        {/* Header Bar */}
        <div className="tracking-header" style={{ marginBottom: "0" }}>
          <div className="tracking-title">
            <span className="live-pulse-dot"></span>
            <div>
              <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0, fontSize: "1.25rem" }}>
                Live GPS Delivery Map
                <span className="badge-pill badge-success" style={{ fontSize: "0.72rem" }}>OpenStreetMap API</span>
              </h3>
              <p style={{ margin: "2px 0", fontSize: "0.84rem", color: "var(--text-muted)" }}>
                Order #{orderId || notifData?.orderId || "1049"} • Real-Time Route Navigation
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm close-modal-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* 2-Column Split: MAIN MAP (LEFT) & RIDER DETAILS (RIGHT) */}
        <div className="tracker-split-grid" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 340px", gap: "18px", minHeight: 0 }}>
          {/* =========================================================================
              LEFT: MAIN UNOBSTRUCTED MAP CANVAS (FULL HEIGHT & WIDTH)
              ========================================================================= */}
          <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "380px", borderRadius: "18px", overflow: "hidden", border: "1.5px solid var(--border-medium)" }}>
            {/* Leaflet Map Target */}
            <div ref={mapContainerRef} style={{ width: "100%", height: "100%", zIndex: 1 }} />

            {/* Floating Live Telemetry HUD Overlay (Top-Left) */}
            <div className="map-hud-overlay" style={{ zIndex: 500, top: "12px", left: "12px", right: "auto", display: "flex", gap: "14px", padding: "8px 14px", background: "rgba(15, 23, 42, 0.88)", backdropFilter: "blur(6px)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.18)", color: "#fff" }}>
              <div className="hud-metric">
                <span className="hud-label" style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 800 }}>SPEED</span>
                <span className="hud-val" style={{ fontSize: "0.95rem", fontWeight: 800 }}>{speed} km/h</span>
              </div>
              <div className="hud-metric">
                <span className="hud-label" style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 800 }}>EST. ARRIVAL</span>
                <span className="hud-val" style={{ fontSize: "0.95rem", fontWeight: 800, color: "#38bdf8" }}>{eta > 0 ? `${eta} MINS` : "ARRIVED"}</span>
              </div>
              <div className="hud-metric">
                <span className="hud-label" style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 800 }}>PROGRESS</span>
                <span className="hud-val text-success" style={{ fontSize: "0.95rem", fontWeight: 800, color: "#10b981" }}>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Floating Map Controls (Bottom-Right) */}
            <div style={{ position: "absolute", bottom: "12px", right: "12px", zIndex: 500, display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCenterOnRider}
                style={{ background: "rgba(15, 23, 42, 0.88)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(6px)" }}
              >
                🎯 Center Rider
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setTileMode(tileMode === "voyager" ? "osm" : tileMode === "osm" ? "dark" : "voyager")}
                style={{ background: "rgba(15, 23, 42, 0.88)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(6px)" }}
              >
                🗺️ {tileMode.toUpperCase()}
              </button>
            </div>
          </div>

          {/* =========================================================================
              RIGHT: DRIVER & DELIVERY TELEMETRY SIDEBAR
              ========================================================================= */}
          <div
            className="tracker-sidebar glass-panel"
            style={{
              padding: "18px",
              borderRadius: "18px",
              border: "1.5px solid var(--border-medium)",
              background: "var(--bg-main)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              overflowY: "auto",
              textAlign: "left"
            }}
          >
            {/* Status Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px" }}>
              <div>
                <strong style={{ fontSize: "0.92rem", color: "var(--text-main)", display: "block" }}>Dispatched Rider</strong>
                <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>Express Priority Delivery</span>
              </div>
              <span className="badge-pill badge-success" style={{ fontSize: "0.7rem" }}>LIVE ON ROUTE</span>
            </div>

            {/* Rider Profile Card */}
            <div style={{ padding: "12px", background: "var(--bg-surface)", borderRadius: "12px", border: "1px solid var(--border-medium)", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(40, 116, 240, 0.12)", color: "var(--primary)", fontWeight: 800, fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid var(--border-medium)" }}>
                  RK
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "0.98rem", color: "var(--text-main)" }}>{agentName}</h4>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Verified Delivery Partner</span>
                  <span style={{ display: "block", fontSize: "0.76rem", color: "#f59e0b", fontWeight: 700 }}>4.92 ★ (1,420 Deliveries)</span>
                </div>
              </div>

              <div style={{ paddingTop: "6px", borderTop: "1px dashed var(--border-light)", fontSize: "0.8rem", color: "var(--text-sub)" }}>
                <div>Motorbike: <strong className="plate-badge" style={{ fontSize: "0.78rem" }}>{vehicleNumber}</strong></div>
                <div style={{ marginTop: "2px" }}>Phone: <strong>{agentPhone}</strong></div>
              </div>

              <div style={{ padding: "6px 10px", background: "rgba(40, 116, 240, 0.08)", borderRadius: "8px", border: "1px solid rgba(40, 116, 240, 0.2)", fontSize: "0.76rem", color: "var(--primary)", fontWeight: 600 }}>
                📍 {driverStatus}
              </div>
            </div>

            {/* Customer Verification OTP Box */}
            <div
              style={{
                padding: "12px 14px",
                background: "rgba(239, 68, 68, 0.06)",
                borderRadius: "12px",
                border: "1.5px dashed #ef4444",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "2px"
              }}
            >
              <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#ef4444", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Delivery Verification OTP
              </span>
              <strong style={{ fontFamily: "monospace", fontSize: "1.6rem", letterSpacing: "4px", color: "#ef4444", lineHeight: 1.2 }}>
                {otpCode}
              </strong>
              <small style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Share this 4-digit OTP with the rider upon arrival
              </small>
            </div>

            {/* Route Summary */}
            <div style={{ padding: "10px 12px", background: "var(--bg-surface)", borderRadius: "10px", border: "1px solid var(--border-light)", fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>From Hub:</span>
                <strong>AURA Luxe Central Hub</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Destination:</span>
                <strong>Plot 42, Tech Corridor</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Distance Remaining:</span>
                <strong style={{ color: "var(--primary)" }}>1.6 km</strong>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => alert(`Calling Delivery Agent ${agentName} (${agentPhone})...`)}
                  style={{ width: "100%", fontSize: "0.78rem", padding: "8px 6px" }}
                >
                  📞 Call Rider
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => alert(`Opening in-app encrypted chat with ${agentName}...`)}
                  style={{ width: "100%", fontSize: "0.78rem", padding: "8px 6px" }}
                >
                  💬 Message
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onClose}
                style={{ width: "100%", padding: "9px" }}
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveMapTracker;
