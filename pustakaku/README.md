PUSTAKAKU

LOKASI UTAMA
Design
Lokasi: ../docs/design.md
Isi: Brief visual dan spesifikasi halaman aplikasi.

ERD
Lokasi: ../docs/erd.md
Isi: Relasi kategori dan buku, aturan data, serta daftar API.

Components
Lokasi: components/
Isi: Shell navigasi, pengambilan data API, tabel, detail, formulir, dan badge stok.

Beranda
Lokasi: app/page.tsx
Isi: Landing page dan pintasan ke katalog atau formulir.

Daftar buku
Lokasi: app/buku/page.tsx
Isi: Pencarian dan tabel koleksi buku.

Detail buku
Lokasi: app/buku/[id]/page.tsx
Isi: Detail buku berdasarkan ID pada URL.

Buku baru
Lokasi: app/buku/baru/page.tsx
Isi: Formulir untuk menambahkan buku.

Layout dan gaya
Lokasi: app/layout.tsx, app/globals.css
Isi: Metadata, shell aplikasi, dan gaya global responsif.

API
Lokasi: app/api/buku/route.ts
Isi: GET koleksi dan POST buku baru.

Lokasi: app/api/buku/[id]/route.ts
Isi: GET detail buku berdasarkan ID.

DATABASE
Skema Prisma: prisma/schema.prisma
Migrasi: prisma/migrations/
Pengaturan Prisma: prisma.config.ts
Seed data contoh: prisma/seed.ts
Prisma Client: lib/prisma.ts
Query dan serialisasi buku: lib/books.ts
File SQLite: data/pustakaku.db
URL default database: file:./data/pustakaku.db; dapat diganti melalui DATABASE_URL.
Database dijalankan melalui migrasi Prisma; buku contoh hanya ditambahkan jika koleksi kosong.

RINGKASAN
PustakaKu mencatat, menelusuri, menampilkan, dan menyimpan koleksi buku secara lokal.

MENJALANKAN APLIKASI
Jalankan perintah: npm run dev
Persyaratan Node.js: 20.19+, 22.12+, atau 24+.