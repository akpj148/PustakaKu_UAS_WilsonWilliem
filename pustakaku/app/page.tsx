import Link from "next/link";

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <div className="section-kicker"><span /> KATALOG BUKU PRIBADI</div>
          <h1>
            Semua bacaanmu,
            <br />
            tertata dalam <em>satu tempat.</em>
          </h1>
          <p className="hero-description">
            Simpan cerita yang kamu suka, temukan kembali pengetahuan berharga,
            dan kelola koleksi bukumu dengan lebih mudah.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary hero-primary" href="/buku">
              Jelajahi Daftar Buku
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className="button button-text" href="/buku/baru">
              <span className="text-button-plus" aria-hidden="true">＋</span>
              Tambah Buku
            </Link>
          </div>
          <div className="hero-note">
            <span className="hero-note-mark" aria-hidden="true">✦</span>
            <span>Ruang kecil untuk banyak cerita.</span>
          </div>
        </div>

        <div className="hero-art" aria-label="Ilustrasi tumpukan buku" role="img">
          <div className="art-sun" />
          <div className="art-scribble art-scribble-one" />
          <div className="art-scribble art-scribble-two" />
          <div className="floating-note">
            <span className="note-star" aria-hidden="true">✳</span>
            <span>cerita baik<br />selalu tinggal</span>
          </div>
          <div className="book-stack">
            <div className="art-book art-book-back">
              <span className="art-book-spine">CATATAN KECIL</span>
              <span className="art-book-decoration">✳</span>
            </div>
            <div className="art-book art-book-middle">
              <span className="art-book-spine">JEDA SEJENAK</span>
              <span className="art-book-decoration">⌁</span>
            </div>
            <div className="art-book art-book-front">
              <span className="art-book-kicker">KUMPULAN CERITA</span>
              <strong>Yang<br />Kita Simpan</strong>
              <span className="art-book-line" />
              <small>PUSTAKAKU · 2025</small>
              <span className="art-book-flower" aria-hidden="true">✿</span>
            </div>
          </div>
          <div className="art-platform" />
          <span className="art-caption">baca · simpan · temukan</span>
        </div>
      </section>

      <section className="benefits-section" aria-labelledby="benefits-title">
        <div className="benefits-heading">
          <div className="section-kicker"><span /> DIRANCANG UNTUK PEMBACA</div>
          <h2 id="benefits-title">Koleksi rapi, pikiran lebih lapang.</h2>
        </div>
        <div className="benefit-grid">
          <article className="benefit-card">
            <span className="benefit-number">01</span>
            <span className="benefit-icon benefit-icon-green" aria-hidden="true">▤</span>
            <h3>Satu rak untuk semuanya</h3>
            <p>Catat judul, penulis, kategori, dan stok buku dalam satu koleksi yang mudah dirawat.</p>
          </article>
          <article className="benefit-card">
            <span className="benefit-number">02</span>
            <span className="benefit-icon benefit-icon-peach" aria-hidden="true">⌕</span>
            <h3>Temukan tanpa mencari lama</h3>
            <p>Gunakan pencarian untuk menemukan kembali buku berdasarkan judul, penulis, atau kategori.</p>
          </article>
          <article className="benefit-card">
            <span className="benefit-number">03</span>
            <span className="benefit-icon benefit-icon-lime" aria-hidden="true">✳</span>
            <h3>Tambah buku dengan mudah</h3>
            <p>Simpan informasi bacaan baru lewat formulir yang ringkas dan jelas.</p>
          </article>
        </div>
      </section>

      <section className="home-cta">
        <div>
          <div className="section-kicker section-kicker-light"><span /> MULAI DARI SATU BUKU</div>
          <h2>Ruang untuk cerita<br />berikutnya sudah siap.</h2>
        </div>
        <Link className="button button-light" href="/buku">
          Lihat Daftar Buku <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <footer className="home-footer">
        <span>© PustakaKu</span>
        <span>Dibuat untuk merawat cerita.</span>
      </footer>
    </div>
  );
}
