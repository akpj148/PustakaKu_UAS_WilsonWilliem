# PustakaKu

## Lokasi utama

| Bagian | Lokasi | Isi |
| --- | --- | --- |
| Design | [`../docs/design.md`](../docs/design.md) | Brief visual dan spesifikasi halaman aplikasi. |
| Components | [`components/`](components/) | Shell navigasi, penyimpanan buku, tabel, detail, formulir, dan badge stok. |
| Beranda | [`app/page.tsx`](app/page.tsx) | Landing page dan pintasan ke katalog atau formulir. |
| Daftar buku | [`app/buku/page.tsx`](app/buku/page.tsx) | Pencarian dan tabel koleksi buku. |
| Detail buku | [`app/buku/[id]/page.tsx`](app/buku/[id]/page.tsx) | Detail buku berdasarkan ID pada URL. |
| Buku baru | [`app/buku/baru/page.tsx`](app/buku/baru/page.tsx) | Formulir untuk menambahkan buku. |
| Layout dan gaya | [`app/layout.tsx`](app/layout.tsx), [`app/globals.css`](app/globals.css) | Metadata, shell aplikasi, dan gaya global responsif. |

## Ringkasan (10 kata)

PustakaKu mencatat, menelusuri, menampilkan, dan menyimpan koleksi buku secara lokal.

## Menjalankan aplikasi

```bash
npm run dev
```

Koleksi contoh dan buku yang ditambahkan disimpan di penyimpanan lokal browser.
