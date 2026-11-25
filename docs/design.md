# PustakaKu — Design Brief

## Tujuan

Buat PustakaKu sebagai aplikasi katalog dan pengelolaan buku yang terasa seperti perpustakaan modern: hangat, rapi, mudah dijelajahi, dan tetap praktis untuk tugas sehari-hari. Pengunjung harus langsung memahami fungsi aplikasi dari halaman beranda, dapat menuju daftar buku dengan satu tindakan yang jelas, membuka detail buku berdasarkan ID, dan menambahkan buku melalui formulir yang mudah digunakan.

Gunakan brief ini sebagai panduan visual dan pengalaman pengguna untuk seluruh halaman. Prioritaskan antarmuka yang konsisten, konten berbahasa Indonesia, hierarki informasi yang jelas, dan tampilan responsif.

## Identitas visual

- **Karakter:** editorial, tenang, ramah, dan kontemporer—terinspirasi dari ruang baca yang nyaman, bukan dashboard korporat.
- **Palet:** latar krem gading `#F7F5EF`, permukaan putih `#FFFFFF`, teks utama arang `#252923`, teks sekunder abu zaitun `#70766B`, aksen hijau hutan `#315C45`, dan aksen hangat terracotta `#C97855` untuk detail kecil atau sorotan.
- **Penggunaan warna:** hijau hutan untuk CTA utama, tautan aktif, dan indikator navigasi; terracotta secukupnya sebagai aksen, bukan warna tombol utama. Pastikan kontras teks tetap mudah dibaca.
- **Tipografi:** gunakan sans-serif yang bersih untuk antarmuka dan teks isi. Judul besar dapat memakai serif editorial yang elegan bila tersedia tanpa menambah dependensi berat. Batasi variasi font dan bobot.
- **Bentuk dan tekstur:** sudut kartu sedikit membulat, garis pembatas halus, bayangan sangat ringan, ruang kosong yang lega, serta aksen garis atau pola halus yang mengingatkan pada halaman buku. Hindari efek kaca, gradien mencolok, dan ornamen berlebihan.
- **Ikon:** gunakan ikon sederhana dengan gaya garis yang konsisten. Sertakan label teks pada navigasi utama; jangan mengandalkan ikon saja.

## Struktur aplikasi dan navigasi

Gunakan struktur rute berikut:

| Halaman | Rute | Tujuan |
| --- | --- | --- |
| Beranda | `/` | Menjelaskan PustakaKu dan mengarahkan pengguna ke katalog. |
| Daftar buku | `/buku` | Menjelajahi, mencari, dan memfilter koleksi buku. |
| Detail buku | `/buku/[id]` | Menampilkan informasi lengkap buku berdasarkan ID pada URL. |
| Buku baru | `/buku/baru` | Menambahkan buku melalui formulir. |

Semua halaman menggunakan **shell/layout bersama** dengan sidebar yang konsisten. Sidebar memuat identitas PustakaKu dan tautan:

1. **Beranda** → `/`
2. **Daftar Buku** → `/buku`
3. **Tambah Buku** → `/buku/baru`

Tampilkan halaman aktif secara jelas melalui latar lembut, teks lebih tegas, dan indikator aksen di sisi item. Sediakan hover, focus, dan active state. Logo/identitas PustakaKu dapat diklik untuk kembali ke beranda.

- **Desktop:** sidebar tetap terlihat di sisi kiri, dengan lebar yang nyaman dan pemisah visual tipis. Area konten mengambil sisa ruang dan memiliki lebar maksimum agar baris teks tidak terlalu panjang.
- **Tablet dan ponsel:** ubah sidebar menjadi drawer yang dibuka melalui tombol menu. Drawer dapat ditutup dengan tombol tutup, Escape, atau setelah pengguna memilih tautan. Pastikan fokus keyboard tidak hilang di belakang drawer.
- Gunakan header konten untuk judul halaman, breadcrumb bila membantu, dan aksi kontekstual seperti tombol “Tambah Buku”.
- Sidebar harus tersedia pada semua rute, termasuk halaman detail, formulir, serta keadaan data kosong atau ID tidak ditemukan.

## Rancangan halaman

### 1. Beranda — `/`

Beranda adalah landing page produk, bukan dashboard kosong. Dalam satu layar pertama, jawab tiga hal: apa itu PustakaKu, siapa yang terbantu, dan ke mana pengguna harus melanjutkan.

1. **Hero**
   - Label kecil seperti “Katalog buku pribadi”.
   - Judul kuat: **“Semua bacaanmu, tertata dalam satu tempat.”**
   - Deskripsi singkat bahwa PustakaKu membantu mencatat, menemukan, dan mengelola koleksi buku dengan mudah.
   - CTA utama **“Jelajahi Daftar Buku”** menuju `/buku`.
   - CTA sekunder **“Tambah Buku”** menuju `/buku/baru`.
   - Visual pendamping berupa ilustrasi rak, tumpukan buku, atau komposisi sampul buku. Pilih visual yang ringan dan konsisten; jangan biarkan gambar eksternal yang gagal memuat merusak layout.
2. **Manfaat utama**
   - Tampilkan 3 poin ringkas, misalnya koleksi lebih tertata, informasi buku mudah ditemukan, dan penambahan buku cepat.
   - Gunakan ikon kecil atau angka ilustratif hanya bila nilainya nyata; jangan menampilkan statistik koleksi palsu.
3. **Ajakan penutup**
   - Ulangi manfaat menjelajahi koleksi dan CTA menuju `/buku`.

Jaga hero tetap fokus. Hindari terlalu banyak tombol, angka dekoratif yang terlihat seperti data sungguhan, atau teks pemasaran panjang.

### 2. Daftar buku — `/buku`

Halaman katalog harus memudahkan pengguna menemukan buku dan memahami tindakan berikutnya.

- Judul halaman **“Daftar Buku”** dengan deskripsi pendek dan jumlah koleksi bila data jumlah memang tersedia.
- Tombol utama **“+ Tambah Buku”** menuju `/buku/baru`.
- Kolom pencarian dengan label yang dapat diakses, placeholder **“Cari judul, penulis, atau kategori…”**, tombol untuk menghapus pencarian, serta pencarian langsung pada data buku.
- Tampilkan koleksi dalam **tabel responsif** dengan kolom berikut secara berurutan: **Nomor**, **Judul**, **Penulis**, **Kategori**, **Stok**, dan **Aksi**.
- Nomor baris harus berurutan dan mudah dipindai. Judul buku menjadi tautan visual sekunder atau teks utama; tombol pada kolom Aksi berlabel **“Detail”** dan membuka `/buku/[id]`.
- Kolom stok menampilkan jumlah stok bersama indikator status berbentuk badge: **stok tersedia** menggunakan latar hijau lembut dan teks hijau tua; **stok habis (0)** menggunakan latar merah lembut dan teks merah tua. Status harus tetap terbaca tanpa bergantung pada warna saja.
- Tabel harus tetap nyaman pada layar sempit. Bungkus tabel dalam area yang dapat digulir horizontal bila diperlukan, tanpa merusak lebar halaman; jangan menyembunyikan kolom penting.
- Sediakan hover/focus state yang jelas pada tombol Detail, tautan judul, pencarian, dan kontrol tabel.
- Filter kategori atau pengurutan hanya ditambahkan jika benar-benar berfungsi; jangan membuat kontrol dekoratif.

**Keadaan katalog yang perlu dirancang:**

- **Memuat:** skeleton kartu dengan dimensi yang sama seperti konten akhir.
- **Koleksi kosong:** ilustrasi sederhana, pesan ramah, dan CTA **“Tambah Buku Pertama”**.
- **Pencarian tanpa hasil:** jelaskan bahwa buku tidak ditemukan, tawarkan menghapus kata kunci/filter, dan jangan menyamakan keadaan ini dengan koleksi yang benar-benar kosong.
- **Gagal memuat:** pesan yang jelas dan aksi coba lagi jika pemuatan data memang dapat gagal.

### 3. Detail buku — `/buku/[id]`

Tampilkan detail dari ID rute, bukan konten statis yang sama untuk semua ID.

- Sediakan breadcrumb **Daftar Buku / Judul Buku** yang mengarahkan kembali ke `/buku`.
- Gunakan layout dua kolom pada desktop dan satu kolom pada layar kecil. Di sisi kiri tampilkan placeholder gambar sampul berbentuk bidang portrait dengan **shadow lembut** dan teks **“Gambar Buku — ID [id]”**. Jangan menggunakan foto atau gambar sampul sungguhan pada placeholder ini.
- Di sisi informasi tampilkan **judul buku**, **penulis**, **kategori**, **tahun terbit**, **stok**, dan **deskripsi**. Gunakan label yang konsisten dan beri ruang antarbagian.
- Stok pada halaman detail memakai indikator status yang sama seperti katalog: latar hijau lembut dan label stok tersedia bila jumlah lebih dari nol; latar merah lembut dan label stok habis bila jumlahnya nol. Sertakan jumlah stok di teks status.
- Sediakan tombol **“Kembali ke Daftar Buku”**. Aksi edit/hapus hanya ditambahkan bila fitur tersebut memang tersedia; jangan menampilkan affordance palsu.

**ID tidak ditemukan:** tampilkan halaman not-found yang tetap memakai shell dan sidebar, menyatakan buku tidak ditemukan, dan menyediakan tautan kembali ke daftar buku. Jangan menampilkan detail buku contoh seolah-olah ID valid.

### 4. Formulir buku baru — `/buku/baru`

Formulir harus terasa ringan, jelas, dan mudah diselesaikan.

- Judul **“Tambah Buku Baru”**, teks pengantar singkat, dan tautan kembali ke `/buku`.
- Letakkan formulir pada panel dengan lebar baca terbatas; gunakan label permanen di atas field (bukan placeholder sebagai satu-satunya label).
- Field formulir: **Judul**, **Penulis**, **Kategori**, **Tahun Terbit**, **Jumlah Stok**, dan **Deskripsi**. Gunakan input teks untuk judul/penulis, pilihan atau input kategori yang dapat digunakan, angka untuk tahun dan stok, serta textarea untuk deskripsi.
- Judul, penulis, kategori, tahun terbit, dan jumlah stok wajib diisi; deskripsi boleh kosong. Tahun harus berupa tahun yang masuk akal dan jumlah stok bilangan bulat minimal 0.
- Tandai field wajib dengan teks yang jelas dan sertakan petunjuk format ketika diperlukan. Tampilkan pesan validasi spesifik di dekat field terkait.
- Tombol aksi utama **“Simpan Buku”** dan aksi sekunder **“Batal”**. Batal kembali ke `/buku` tanpa mengirim form.
- Saat mengirim, tampilkan state loading pada tombol dan cegah pengiriman berulang.
- Validasi field wajib dan format yang relevan. Pesan error harus spesifik, tampil dekat field, dan terhubung secara aksesibel. Jangan menghapus isian yang valid ketika ada error.
- Setelah berhasil, berikan konfirmasi yang jelas dan arahkan ke detail buku yang baru dibuat atau perilaku sukses lain yang konsisten.
- Jika penyimpanan gagal, pertahankan isian dan tampilkan pesan kegagalan yang dapat ditindaklanjuti; jangan mengklaim berhasil.

## Responsif dan aksesibilitas

- Rancang dari layar kecil ke besar. Hindari overflow horizontal; kartu menyesuaikan jumlah kolom berdasarkan ruang, bukan ukuran tetap.
- Gunakan elemen semantik: `nav`, `main`, heading berurutan, form, label, dan tombol/tautan sesuai fungsinya.
- Semua tindakan penting dapat digunakan dengan keyboard. Fokus terlihat jelas dan urutan tab mengikuti urutan visual.
- Gunakan nama aksesibel untuk tombol ikon, teks alternatif yang sesuai untuk sampul/ilustrasi, serta `aria-current` pada tautan navigasi aktif bila tepat.
- Jangan menyampaikan status hanya melalui warna. Error, sukses, loading, dan item aktif harus memiliki petunjuk teks atau bentuk tambahan.
- Hormati preferensi reduced motion; transisi singkat dan tidak mengganggu.
- Pastikan ukuran teks, jarak klik, dan kontras nyaman digunakan pada ponsel maupun desktop.

## Panduan implementasi visual

- Pertahankan sidebar, header konten, skala tipografi, warna, radius, dan jarak sebagai sistem yang konsisten di semua halaman.
- Gunakan komponen bersama untuk shell navigasi, tombol, input, kartu buku, breadcrumb, dan pesan status bila sesuai dengan struktur proyek.
- Gunakan data buku yang tersedia dari aplikasi. Bila backend belum ada, visual tetap harus dirancang untuk koleksi kosong dan data contoh yang secara eksplisit bersifat demo—jangan menyajikan angka demo sebagai statistik nyata.
- Gunakan aturan status stok yang konsisten di seluruh katalog dan detail: nilai stok lebih dari 0 berarti tersedia (indikator hijau), sedangkan nilai 0 berarti habis (indikator merah). Jumlah stok selalu ditampilkan bersama statusnya.
- Hindari tautan `#`, tombol tanpa aksi, form yang tidak menyimpan, atau filter/pencarian dekoratif.
- Jangan menambah dependensi besar hanya untuk ikon atau animasi sederhana.
- Pertahankan bahasa antarmuka dalam Bahasa Indonesia dan gunakan istilah yang konsisten: **Beranda**, **Daftar Buku**, **Tambah Buku**, **Detail Buku**, **Penulis**, **Kategori**, dan **Sinopsis**.

## Kriteria hasil desain

Desain dianggap berhasil bila:

1. Identitas PustakaKu dan fungsi aplikasi dapat dipahami dalam beberapa detik pada landing page.
2. CTA landing page secara jelas mengarahkan pengguna ke `/buku`.
3. Sidebar yang sama memudahkan perpindahan di seluruh halaman dan menandai lokasi pengguna.
4. Pengguna dapat memindai kartu katalog, membuka detail berdasarkan ID, dan memahami keadaan ID yang tidak ditemukan.
5. Formulir buku baru jelas, memiliki validasi dan state sukses/gagal, serta nyaman digunakan di layar kecil.
6. Gaya visual terasa hangat dan editorial namun tetap bersih, konsisten, mudah dibaca, dan aksesibel.