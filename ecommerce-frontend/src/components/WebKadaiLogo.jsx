import "./WebKadaiLogo.css";

function WebKadaiLogo({ size = "normal" }) {
  return (
    <div className={`web-kadai-logo-root size-${size}`}>
      {/* Modernized Gold Diamond Emblem */}
      <div className="aura-diamond-emblem">
        <svg
          viewBox="0 0 100 100"
          className="aura-diamond-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="50%" stopColor="#c5a059" />
              <stop offset="100%" stopColor="#9a7b38" />
            </linearGradient>
            <linearGradient id="innerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c5a059" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Outer Gold Diamond */}
          <polygon
            points="50,6 94,50 50,94 6,50"
            fill="url(#goldGradient)"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Inner Facet Diamond */}
          <polygon
            points="50,20 80,50 50,80 20,50"
            fill="none"
            stroke="url(#innerGlow)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Center Sparkling Star Cross */}
          <line x1="50" y1="28" x2="50" y2="72" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="28" y1="50" x2="72" y2="50" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="5" fill="#0f172a" stroke="#c5a059" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Modernized Serif Typography */}
      <div className="brand-text-wrapper">
        <span className="brand-word-web">AURA</span>
        <span className="brand-luxe-badge">LUXE</span>
      </div>
    </div>
  );
}

export default WebKadaiLogo;
