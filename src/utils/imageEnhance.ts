/**
 * Image enhancement utility inspired by CamScanner / Adobe Scan
 * Process receipts to make thermal and faint text razor-sharp for A4 printing
 */

export type FilterMode = 'normal' | 'bw' | 'contrast';

export function applyImageEnhancement(
  imageSrc: string,
  mode: FilterMode
): Promise<string> {
  if (mode === 'normal') {
    return Promise.resolve(imageSrc);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const len = data.length;

      if (mode === 'bw') {
        // High-contrast Black & White document filter (CamScanner B&W)
        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Luminance formula
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;

          // Adaptive threshold with contrast curve
          let v = gray;
          if (gray > 175) {
            // Whiten the background
            v = 255;
          } else if (gray < 90) {
            // Darken ink text
            v = Math.max(0, gray * 0.4);
          } else {
            // High contrast sigmoid
            v = ((gray - 90) / (175 - 90)) * 255;
            v = v > 135 ? 255 : Math.max(0, v * 0.5);
          }

          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
        }
      } else if (mode === 'contrast') {
        // Magic Color contrast enhancement
        const contrastFactor = 1.45; // boost contrast 45%
        for (let i = 0; i < len; i += 4) {
          for (let c = 0; c < 3; c++) {
            let val = data[i + c];
            // Contrast formula
            val = ((val / 255 - 0.5) * contrastFactor + 0.5) * 255;
            // Clean slightly grayish whites
            if (val > 215) val = 255;
            data[i + c] = Math.min(255, Math.max(0, val));
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };

    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
}
