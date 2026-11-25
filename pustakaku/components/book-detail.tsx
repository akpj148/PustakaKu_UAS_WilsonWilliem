"use client";

import Link from "next/link";
import { useBookStore } from "./book-store";
import BookCover from "./book-cover";
import StockBadge from "./stock-badge";

export default function BookDetail({ id }: { id: string }) {
  const { books, ready } = useBookStore();
  const book = books.find((item) => item.id === id);

  if (!ready) {
    return (
      <div className="detail-loading" role="status">
        <span className="loading-spinner" />
        Memuat detail buku…
      </div>
    );
  }

  if (!book) {
    return (
      <div className="not-found-card">
        <span className="not-found-mark" aria-hidden="true">?</span>
        <div className="section-kicker"><span /> BUKU TIDAK DITEMUKAN</div>
        <h1>Buku ini belum ada di rakmu.</h1>
        <p>Periksa kembali alamat atau kembali ke daftar untuk memilih buku lain.</p>
        <Link className="button button-primary" href="/buku">
          Kembali ke Daftar Buku
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/buku">Daftar Buku</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{book.title}</span>
      </nav>
      <div className="detail-layout">
        <div className="detail-cover-column">
          <BookCover id={book.id} />
          <div className="cover-caption">
            <span className="cover-caption-icon" aria-hidden="true">✦</span>
            Sampul buku
          </div>
        </div>
        <article className="detail-information">
          <div className="detail-topline">
            <span className="category-chip">{book.category}</span>
            <span className="detail-id">ID BUKU · {book.id}</span>
          </div>
          <h1 className="detail-title">{book.title}</h1>
          <p className="detail-author">
            ditulis oleh <strong>{book.author}</strong>
          </p>

          <div className="detail-divider" />

          <dl className="book-facts">
            <div>
              <dt>Tahun terbit</dt>
              <dd>{book.year}</dd>
            </div>
            <div>
              <dt>Kategori</dt>
              <dd>{book.category}</dd>
            </div>
            <div className="stock-fact">
              <dt>Ketersediaan</dt>
              <dd><StockBadge stock={book.stock} /></dd>
            </div>
          </dl>

          <section className="description-section">
            <div className="description-heading">
              <span className="description-mark" aria-hidden="true" />
              <h2>Deskripsi</h2>
            </div>
            <p>{book.description || "Belum ada deskripsi untuk buku ini."}</p>
          </section>

          <Link className="back-link" href="/buku">
            <span aria-hidden="true">←</span>
            Kembali ke Daftar Buku
          </Link>
        </article>
      </div>
    </div>
  );
}
