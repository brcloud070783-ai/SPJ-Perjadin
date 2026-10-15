# Implement 2x3 Grid Cards Menu on Home Page

Implement a clean, 2x3 grid cards menu with icons and subtitles as the primary quick-access menu in the upper center of the home page (`LandingPage.tsx`), replacing the previous layout while avoiding redundant functions.

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Confirmed Choice 1**: 2x3 Grid Cards with Icons and Subtitles layout.
> - **Confirmed Choice 2**: Positioned at the top center of the home page as the primary quick-access menu.

## 1. Overview & Core Concept

- **What It Does**: Replaces or reorganizes the home page quick access cards into an elegant 2x3 grid featuring clear icons, concise titles, and descriptive subtitles for all primary SPJ modules (Daftar SPJ, Input SPJ, Kuitansi, SPT, Bukti Bayar, Rekapitulasi).
- **Key Value**: Provides intuitive, visually balanced, and non-redundant access to core functions right at the top of the home page.

## 2. User Experience & Visual Design

- **Grid Layout**: 2 rows by 3 columns on desktop (responsive to 1 or 2 columns on mobile/tablet).
- **Card Design**: Clean white background with soft borders, hover elevation (`hover:shadow-md transition-all`), distinct icons with themed color badges, bold titles, and subtle muted subtitles.
- **Visual Harmony**: Adheres to the 60-30-10 color rule, utilizing clean typographic hierarchy and zero pill clutter.

## 3. Key Product Decisions & Trade-Offs

- **Decision 1**: Replacing previous disparate quick links with a unified 2x3 grid.
  - *Chosen Approach*: Direct 6-card grid (`Daftar SPJ`, `Input SPJ`, `Kuitansi`, `SPT`, `Bukti Bayar`, `Rekapitulasi`).
  - *Why*: Directly aligns with user request and prevents function duplication across navigation bars.

## 4. Technical Architecture & Data Strategy

```
[ LandingPage.tsx ]
       │
       ├── Header / Welcome Banner
       │
       ├── [ 2x3 Grid Cards Menu (Primary Quick Access) ]
       │     ├── Card 1: Daftar SPJ
       │     ├── Card 2: Input SPJ
       │     ├── Card 3: Cetak Kuitansi
       │     ├── Card 4: Buat SPT
       │     ├── Card 5: Bukti Bayar
       │     └── Card 6: Rekapitulasi
       │
       └── Recent Activity / Summary Section
```

- **State Management**: Uses existing `activeFilter` and `onStartApp` navigation triggers.
- **Responsive Classes**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`.
