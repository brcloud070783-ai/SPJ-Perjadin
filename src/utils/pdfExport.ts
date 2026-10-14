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

  // Create temporary container styling if needed to ensure high-definition rendering
  const canvas = await html2canvas(element, {
    scale: 2.5, // 2.5x resolution for razor-sharp Tahoma 8.5pt font
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
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
  const margin = 8; // 8mm margin
  const printWidth = pageWidth - margin * 2; // 194mm
  const printHeight = (canvas.height * printWidth) / canvas.width;

  // Center vertically if it fits on one page
  const yPos = printHeight < pageHeight - margin * 2 ? margin : margin;

  pdf.addImage(imgData, 'PNG', margin, yPos, printWidth, printHeight, undefined, 'FAST');
  pdf.save(fileName);
}
