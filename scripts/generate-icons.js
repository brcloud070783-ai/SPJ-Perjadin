import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, getPixel) {
  // getPixel(x, y) returns [r, g, b, a]
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const body = Buffer.concat([typeBuf, data]);
    const crc = crc32(body);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, body, crcBuf]);
  }

  // CRC32 table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  // Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // Bit depth
  ihdr[9] = 6;  // Color type RGBA
  ihdr[10] = 0; // Compression method
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // Interlace method

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Brand color gradient Canva style: Deep Purple / Cyan (#00C4CC to #7D2AE8)
function renderSiDinasIcon(size, isMaskable = false) {
  const margin = isMaskable ? Math.round(size * 0.15) : 0;
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) - margin;

  return createPNG(size, size, (x, y) => {
    // Background gradient
    const t = (x + y) / (size * 2);
    // #00C4CC (0, 196, 204) -> #7D2AE8 (125, 42, 232)
    const bgR = Math.round(0 + (125 - 0) * t);
    const bgG = Math.round(196 + (42 - 196) * t);
    const bgB = Math.round(204 + (232 - 204) * t);

    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (isMaskable) {
      // Full bleed background for maskable
      return drawIconContent(x, y, cx, cy, size, bgR, bgG, bgB);
    } else {
      // Rounded square background for standard icon
      const cornerR = size * 0.22;
      const nx = Math.abs(dx);
      const ny = Math.abs(dy);
      const hw = size / 2 - 4;
      const hh = size / 2 - 4;

      if (nx <= hw - cornerR && ny <= hh) {
        return drawIconContent(x, y, cx, cy, size, bgR, bgG, bgB);
      }
      if (nx <= hw && ny <= hh - cornerR) {
        return drawIconContent(x, y, cx, cy, size, bgR, bgG, bgB);
      }
      const cdx = nx - (hw - cornerR);
      const cdy = ny - (hh - cornerR);
      if (cdx * cdx + cdy * cdy <= cornerR * cornerR) {
        return drawIconContent(x, y, cx, cy, size, bgR, bgG, bgB);
      }
      return [0, 0, 0, 0]; // Transparent outside rounded corner
    }
  });
}

function drawIconContent(x, y, cx, cy, size, bgR, bgG, bgB) {
  // Draw white document icon + "S" symbol in center
  const scale = size / 512;
  const dx = (x - cx) / scale;
  const dy = (y - cy) / scale;

  // Document shape background in center (white rounded box)
  if (dx >= -100 && dx <= 100 && dy >= -130 && dy <= 130) {
    // Folded top right corner
    if (dx >= 40 && dy <= -70) {
      if (dx + (-dy - 70) > 110) {
        // Folded corner accent
        return [220, 235, 252, 255];
      }
    }
    // Main white doc card
    // Draw "S" badge in center (#7D2AE8)
    const isInsideS = (
      (dy >= -50 && dy <= -20 && dx >= -50 && dx <= 50) ||
      (dy >= -20 && dy <= 10 && dx >= -50 && dx <= -10) ||
      (dy >= 10 && dy <= 40 && dx >= -50 && dx <= 50) ||
      (dy >= 40 && dy <= 70 && dx >= 10 && dx <= 50) ||
      (dy >= 70 && dy <= 90 && dx >= -50 && dx <= 50)
    );

    if (isInsideS) {
      return [125, 42, 232, 255];
    }
    return [255, 255, 255, 255];
  }

  // Sparkle stars around doc
  const star1 = Math.sqrt((dx - 140) * (dx - 140) + (dy + 120) * (dy + 120));
  const star2 = Math.sqrt((dx + 140) * (dx + 140) + (dy - 100) * (dy - 100));
  if (star1 < 25 || star2 < 20) {
    return [255, 255, 255, 240];
  }

  return [bgR, bgG, bgB, 255];
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA icons...');
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), renderSiDinasIcon(192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), renderSiDinasIcon(512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), renderSiDinasIcon(512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), renderSiDinasIcon(180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), renderSiDinasIcon(64, false));

// Write clean SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="canvaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00C4CC" />
      <stop offset="100%" stop-color="#7D2AE8" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.25" />
    </filter>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#canvaGrad)" />
  <g filter="url(#shadow)">
    <rect x="156" y="116" width="200" height="280" rx="20" fill="#FFFFFF" />
    <path d="M 316 116 L 356 156 L 316 156 Z" fill="#DCEBFB" />
    <path d="M 206 180 H 306 M 206 210 H 286 M 206 240 H 296" stroke="#7D2AE8" stroke-width="8" stroke-linecap="round" />
    <rect x="206" y="275" width="100" height="70" rx="12" fill="#7D2AE8" />
    <text x="256" y="322" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="36" fill="#FFFFFF" text-anchor="middle">SPD</text>
  </g>
  <path d="M 390 130 Q 400 130 400 120 Q 400 130 410 130 Q 400 130 400 140 Q 400 130 390 130 Z" fill="#FFFFFF" opacity="0.9" />
  <path d="M 110 370 Q 120 370 120 360 Q 120 370 130 370 Q 120 370 120 380 Q 120 370 110 370 Z" fill="#FFFFFF" opacity="0.9" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
console.log('Successfully generated all PWA icons in /public!');
