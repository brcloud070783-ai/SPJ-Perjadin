import { LOGO_KALTARA_SVG } from './logoKaltara';

export interface PresetLogo {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  url: string;
  isDefault?: boolean;
}

export const PRESET_LOGOS: PresetLogo[] = [
  {
    id: 'kaltara-official',
    nama: 'Provinsi Kalimantan Utara',
    kategori: 'Pemerintah Daerah',
    deskripsi: 'Lambang Resmi Provinsi Kalimantan Utara (Kaltara Benuanta)',
    url: LOGO_KALTARA_SVG,
    isDefault: true
  },
  {
    id: 'garuda-emas',
    nama: 'Garuda Pancasila Emas',
    kategori: 'Nasional / RI',
    deskripsi: 'Lambang Negara Republik Indonesia (Format SVG Vektor)',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="46" fill="%23D4AF37" stroke="%238B6508" stroke-width="3"/><path d="M50 15 L58 32 L76 34 L62 47 L66 65 L50 55 L34 65 L38 47 L24 34 L42 32 Z" fill="%23FFF" stroke="%238B6508" stroke-width="1.5"/><text x="50" y="82" font-family="sans-serif" font-weight="bold" font-size="9" text-anchor="middle" fill="%23FFFFFF">BHINNEKA TUNGGAL IKA</text></svg>'
  },
  {
    id: 'kemenag-ri',
    nama: 'Kementerian Agama RI',
    kategori: 'Kementerian / Lembaga',
    deskripsi: 'Logo Kementerian Agama Republik Indonesia (Ikhlas Beramal)',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="45" fill="%2300875A"/><circle cx="50" cy="50" r="38" fill="%23FFFFFF"/><path d="M50 20 L65 35 L60 75 L50 68 L40 75 L35 35 Z" fill="%23D4AF37"/><text x="50" y="88" font-family="sans-serif" font-weight="bold" font-size="8" text-anchor="middle" fill="%2300875A">KEMENAG RI</text></svg>'
  },
  {
    id: 'kemendagri-ri',
    nama: 'Kementerian Dalam Negeri',
    kategori: 'Kementerian / Lembaga',
    deskripsi: 'Logo Kemendagri / Pemerintah Daerah Generik',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect x="10" y="10" width="80" height="80" rx="15" fill="%231E3A8A"/><circle cx="50" cy="45" r="25" fill="%23F59E0B"/><path d="M50 25 L60 40 L40 40 Z" fill="%23FFFFFF"/><text x="50" y="82" font-family="sans-serif" font-weight="bold" font-size="8" text-anchor="middle" fill="%23FFFFFF">KEMENDAGRI</text></svg>'
  },
  {
    id: 'dinas-kesehatan',
    nama: 'Dinas Kesehatan / Kemenkes',
    kategori: 'Dinas Teknis',
    deskripsi: 'Logo Bakti Husada / Kesehatan Masyarakat',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="45" fill="%230284C7"/><path d="M50 15 L50 85 M15 50 L85 50" stroke="%23FFFFFF" stroke-width="14" stroke-linecap="round"/><circle cx="50" cy="50" r="12" fill="%230284C7"/></svg>'
  },
  {
    id: 'dinas-pendidikan',
    nama: 'Dinas Pendidikan / Tut Wuri',
    kategori: 'Dinas Teknis',
    deskripsi: 'Logo Pendidikan Tut Wuri Handayani',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="45" fill="%232563EB"/><path d="M50 22 L75 42 L50 62 L25 42 Z" fill="%23FACC15"/><path d="M50 62 L68 80 L32 80 Z" fill="%23FFFFFF"/><text x="50" y="93" font-family="sans-serif" font-weight="bold" font-size="7" text-anchor="middle" fill="%23FFFFFF">TUT WURI HANDAYANI</text></svg>'
  }
];
