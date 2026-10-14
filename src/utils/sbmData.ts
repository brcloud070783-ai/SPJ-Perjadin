/**
 * Standar Biaya Masukan (SBM) Perjalanan Dinas Dalam Negeri
 * Berdasarkan referensi resmi PMK Kementerian Keuangan RI
 */

export interface SbmRate {
  provinsi: string;
  kotaUtama: string;
  uangHarianLuarKota: number;
  uangHarianDalamKota: number;
  penginapanStandar: number;
}

export const SBM_RATES: SbmRate[] = [
  {
    provinsi: 'Kalimantan Utara',
    kotaUtama: 'Tanjung Selor / Tarakan',
    uangHarianLuarKota: 430000,
    uangHarianDalamKota: 170000,
    penginapanStandar: 600000,
  },
  {
    provinsi: 'DKI Jakarta',
    kotaUtama: 'Jakarta',
    uangHarianLuarKota: 530000,
    uangHarianDalamKota: 210000,
    penginapanStandar: 730000,
  },
  {
    provinsi: 'Kalimantan Timur',
    kotaUtama: 'Samarinda / Balikpapan / IKN',
    uangHarianLuarKota: 430000,
    uangHarianDalamKota: 170000,
    penginapanStandar: 650000,
  },
  {
    provinsi: 'Jawa Timur',
    kotaUtama: 'Surabaya / Malang',
    uangHarianLuarKota: 410000,
    uangHarianDalamKota: 160000,
    penginapanStandar: 660000,
  },
  {
    provinsi: 'Jawa Barat',
    kotaUtama: 'Bandung / Bogor',
    uangHarianLuarKota: 430000,
    uangHarianDalamKota: 170000,
    penginapanStandar: 600000,
  },
  {
    provinsi: 'Sulawesi Selatan',
    kotaUtama: 'Makassar',
    uangHarianLuarKota: 430000,
    uangHarianDalamKota: 170000,
    penginapanStandar: 600000,
  },
  {
    provinsi: 'Bali',
    kotaUtama: 'Denpasar / Badung',
    uangHarianLuarKota: 480000,
    uangHarianDalamKota: 190000,
    penginapanStandar: 700000,
  },
  {
    provinsi: 'DI Yogyakarta',
    kotaUtama: 'Yogyakarta',
    uangHarianLuarKota: 420000,
    uangHarianDalamKota: 170000,
    penginapanStandar: 580000,
  },
  {
    provinsi: 'Sumatera Utara',
    kotaUtama: 'Medan',
    uangHarianLuarKota: 370000,
    uangHarianDalamKota: 150000,
    penginapanStandar: 600000,
  },
  {
    provinsi: 'Papua / Papua Barat',
    kotaUtama: 'Jayapura / Sorong',
    uangHarianLuarKota: 580000,
    uangHarianDalamKota: 230000,
    penginapanStandar: 820000,
  },
];
