/**
 * SVG Lambang Resmi Provinsi Kalimantan Utara
 * Dilengkapi perisai, pita Benuanta, bintang, pegunungan, laut, dan mandau
 */
export const LOGO_KALTARA_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="80" height="96">
  <defs>
    <linearGradient id="shieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%230ea5e9"/>
      <stop offset="50%" stop-color="%2338bdf8"/>
      <stop offset="100%" stop-color="%230369a1"/>
    </linearGradient>
  </defs>
  <!-- Outer Shield Border -->
  <path d="M 20 20 L 180 20 C 180 20 185 130 100 225 C 15 130 20 20 20 20 Z" fill="%230284c7" stroke="%23facc15" stroke-width="6"/>
  <path d="M 28 28 L 172 28 C 172 28 176 125 100 215 C 24 125 28 28 28 28 Z" fill="url(%23shieldBg)" stroke="%23ffffff" stroke-width="2"/>
  
  <!-- Red-White Flag arch top -->
  <path d="M 32 32 L 168 32 C 168 32 168 55 100 55 C 32 55 32 32 32 32 Z" fill="%23dc2626"/>
  <path d="M 34 55 L 166 55 C 166 55 166 76 100 76 C 34 76 34 55 34 55 Z" fill="%23ffffff"/>
  
  <!-- Star at top -->
  <polygon points="100,34 103,44 113,44 105,50 108,60 100,54 92,60 95,50 87,44 97,44" fill="%23facc15" stroke="%23b45309" stroke-width="0.8"/>
  
  <!-- Mountain (Gunung Yuvai Semaring) -->
  <polygon points="100,75 55,145 145,145" fill="%23166534" stroke="%2314532d" stroke-width="1.5"/>
  <polygon points="100,75 75,145 125,145" fill="%2322c55e"/>
  
  <!-- Rivers / Waves -->
  <path d="M 45 148 Q 72 142 100 148 T 155 148" fill="none" stroke="%23ffffff" stroke-width="4"/>
  <path d="M 40 158 Q 70 152 100 158 T 160 158" fill="none" stroke="%2338bdf8" stroke-width="3"/>
  <path d="M 45 168 Q 72 162 100 168 T 155 168" fill="none" stroke="%23ffffff" stroke-width="3"/>
  
  <!-- Crossed Mandau / Keris -->
  <line x1="60" y1="95" x2="140" y2="175" stroke="%23facc15" stroke-width="4" stroke-linecap="round"/>
  <line x1="140" y1="95" x2="60" y2="175" stroke="%23facc15" stroke-width="4" stroke-linecap="round"/>
  
  <!-- Bottom Ribbon with text BENUANTA -->
  <path d="M 35 188 Q 100 178 165 188 L 155 208 Q 100 198 45 208 Z" fill="%23ffffff" stroke="%231e293b" stroke-width="1.5"/>
  <text x="100" y="202" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="%230f172a" text-anchor="middle" letter-spacing="1.5">BENUANTA</text>
</svg>`;
