import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportElementToPdf(
  elementId: string,
  fileName: string = 'Kuitansi-SPPD-A4.pdf'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Elemen dengan ID #${elementId} tidak ditemukan.`);
  }

  // Save current inline styles that might affect rendering
  const originalTransform = element.style.transform;
  const originalTransformOrigin = element.style.transformOrigin;

  // Temporarily reset scaling transforms for 100% full-resolution capture
  element.style.transform = 'none';

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5, // 2.5x resolution for razor-sharp Tahoma 8.5pt font
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      scrollX: 0,
      scrollY: 0
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const printWidth = pageWidth;
    const printHeight = (canvas.height * printWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, printWidth, Math.min(pageHeight, printHeight), undefined, 'FAST');
    pdf.save(fileName);
  } finally {
    // Restore transform state
    element.style.transform = originalTransform;
    element.style.transformOrigin = originalTransformOrigin;
  }
}
