// A vector "product render" of the Sennheiser IE 600 in its real colours:
// gunmetal ZR01 zirconium shell, metal nozzle + black mesh, dark ear tip, cable.
export function IE600() {
  return (
    <svg viewBox="0 0 240 220" className="ie600" role="img" aria-label="Sennheiser IE 600 in-ear monitor">
      <defs>
        <linearGradient id="ieBody" x1="0.15" y1="0.1" x2="0.85" y2="0.95">
          <stop offset="0" stopColor="#8b95a3" />
          <stop offset="0.4" stopColor="#4c5460" />
          <stop offset="1" stopColor="#21252c" />
        </linearGradient>
        <linearGradient id="ieNoz" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cdd4de" />
          <stop offset="0.55" stopColor="#8a929e" />
          <stop offset="1" stopColor="#575e6a" />
        </linearGradient>
        <radialGradient id="ieSpec" cx="0.3" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#eef3f9" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#eef3f9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ieShadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000000" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="120" cy="198" rx="72" ry="12" fill="url(#ieShadow)" />

      {/* cable */}
      <path d="M158 60 C 196 96, 196 150, 168 198" fill="none" stroke="#1c2026" strokeWidth="7" strokeLinecap="round" />
      <path d="M158 60 C 196 96, 196 150, 168 198" fill="none" stroke="#39404a" strokeWidth="2.6" strokeLinecap="round" strokeOpacity="0.8" />
      <rect x="150" y="46" width="18" height="26" rx="5" transform="rotate(24 159 59)" fill="#2b3038" stroke="#454c56" strokeWidth="1" />

      {/* nozzle + ear tip */}
      <g transform="rotate(-30 118 96)">
        <rect x="106" y="20" width="24" height="52" rx="11" fill="url(#ieNoz)" stroke="#4a515c" strokeWidth="0.8" />
        <ellipse cx="118" cy="22" rx="10.5" ry="5" fill="#14171b" />
        <ellipse cx="118" cy="22" rx="6.5" ry="3" fill="#0b0d10" />
        <path d="M104 44 q14 -14 28 0 q4 16 -4 26 q-10 8 -20 0 q-8 -10 -4 -26 Z" fill="#33383f" />
      </g>

      {/* shell */}
      <path
        d="M92 66 C 58 66, 40 96, 44 130 C 48 164, 84 186, 120 182 C 158 178, 180 146, 172 112 C 166 84, 140 66, 112 64 C 105 63, 98 64, 92 66 Z"
        fill="url(#ieBody)"
        stroke="#171a1f"
        strokeWidth="1.2"
      />

      {/* faceplate detail */}
      <circle cx="120" cy="128" r="26" fill="none" stroke="#20242b" strokeWidth="1.4" strokeOpacity="0.7" />
      <circle cx="120" cy="128" r="6" fill="#23272e" stroke="#3a4149" strokeWidth="1" />

      {/* specular highlight + blue rim */}
      <ellipse cx="88" cy="104" rx="30" ry="24" fill="url(#ieSpec)" transform="rotate(-20 88 104)" />
      <path d="M44 130 C 48 164, 84 186, 120 182" fill="none" stroke="#6fa8e0" strokeWidth="2.4" strokeOpacity="0.55" strokeLinecap="round" />
    </svg>
  );
}
