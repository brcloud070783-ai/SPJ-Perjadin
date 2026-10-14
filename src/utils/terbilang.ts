/**
 * Fungsi konversi angka nominal ke huruf terbilang (Bahasa Indonesia)
 * Standar format administrasi keuangan & kuitansi dinas
 */

const satuanAngka = [
  '',
  'Satu',
  'Dua',
  'Tiga',
  'Empat',
  'Lima',
  'Enam',
  'Tujuh',
  'Delapan',
  'Sembilan',
  'Sepuluh',
  'Sebelas'
];

export function konversiTerbilang(nilai: number): string {
  const angka = Math.floor(Math.abs(nilai));
  if (angka === 0) return 'Nol Rupiah';

  function bilangan(n: number): string {
    if (n < 12) {
      return satuanAngka[n];
    } else if (n < 20) {
      return bilangan(n - 10) + ' Belas';
    } else if (n < 100) {
      return bilangan(Math.floor(n / 10)) + ' Puluh ' + bilangan(n % 10);
    } else if (n < 200) {
      return 'Seratus ' + bilangan(n - 100);
    } else if (n < 1000) {
      return bilangan(Math.floor(n / 100)) + ' Ratus ' + bilangan(n % 100);
    } else if (n < 2000) {
      return 'Seribu ' + bilangan(n - 1000);
    } else if (n < 1000000) {
      return bilangan(Math.floor(n / 1000)) + ' Ribu ' + bilangan(n % 1000);
    } else if (n < 1000000000) {
      return bilangan(Math.floor(n / 1000000)) + ' Juta ' + bilangan(n % 1000000);
    } else if (n < 1000000000000) {
      return bilangan(Math.floor(n / 1000000000)) + ' Miliar ' + bilangan(n % 1000000000);
    } else if (n < 1000000000000000) {
      return bilangan(Math.floor(n / 1000000000000)) + ' Triliun ' + bilangan(n % 1000000000000);
    }
    return '';
  }

  const hasil = bilangan(angka).trim().replace(/\s+/g, ' ');
  return hasil ? `${hasil} Rupiah` : 'Nol Rupiah';
}

export function formatRupiah(nominal: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(nominal || 0);
}

export function formatTanggalIndo(tanggalStr: string): string {
  if (!tanggalStr) return '-';
  try {
    const date = new Date(tanggalStr);
    if (isNaN(date.getTime())) return tanggalStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return tanggalStr;
  }
}
