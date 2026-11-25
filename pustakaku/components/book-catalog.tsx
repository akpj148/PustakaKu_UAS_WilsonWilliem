"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useBookStore } from "./book-store";
import StockBadge from "./stock-badge";

export default function BookCatalog() {
  const { books, ready } = useBookStore();
  const [query, setQuery] = useState("");

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id");
    if (!normalizedQuery) return books;

    return books.filter((book) =>
      [book.title, book.author, book.category].some((value) =>
        value.toLocaleLowerCase("id").includes(normalizedQuery),
      ),
    );
  }, [books, query]);

  return (
    <div className="catalog-page">
      <div className="page-heading-row">
        <div>
          <div className="section-kicker"><span /> KOLEKSI PERSONAL</div>
          <h1 className="page-title">Daftar Buku</h1>
          <p className="page-description">
            Semua cerita dan pengetahuan yang kamu simpan, tertata rapi di sini.
          </p>
        </div>
        <Link className="button button-primary add-book-button" href="/buku/baru">
          <span aria-hidden="true">＋</span>
          Tambah Buku
        </Link>
      </div>

      <section className="catalog-panel" aria-labelledby="catalog-heading">
        <div className="catalog-toolbar">
          <div>
            <h2 id="catalog-heading">Koleksi kamu</h2>
            <p>
              {ready
                ? `${books.length} buku tersimpan`
                : "Menyiapkan koleksi buku…"}
            </p>
          </div>
          <div className="search-field">
            <span className="search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.5 4.5" />
              </svg>
            </span>
            <label className="sr-only" htmlFor="book-search">Cari buku</label>
            <input
              id="book-search"
              type="search"
              placeholder="Cari judul, penulis, kategori…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                className="clear-search"
                type="button"
                aria-label="Hapus pencarian"
                onClick={() => setQuery("")}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {!ready ? (
          <div className="table-loading" role="status">
            <span className="loading-spinner" />
            Memuat koleksi buku…
          </div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <h3>Rak bukumu masih kosong</h3>
            <p>Mulai kumpulkan bacaan favoritmu dengan menambahkan buku pertama.</p>
            <Link className="button button-primary" href="/buku/baru">
              Tambah Buku Pertama
            </Link>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="empty-state search-empty">
            <div className="empty-search-icon" aria-hidden="true">⌕</div>
            <h3>Buku belum ditemukan</h3>
            <p>
              Tidak ada hasil untuk “{query}”. Coba kata kunci lain atau hapus pencarian.
            </p>
            <button className="button button-secondary" type="button" onClick={() => setQuery("")}>
              Hapus pencarian
            </button>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="book-table">
              <thead>
                <tr>
                  <th scope="col" className="number-column">No.</th>
                  <th scope="col">Judul</th>
                  <th scope="col">Penulis</th>
                  <th scope="col">Kategori</th>
                  <th scope="col">Stok</th>
                  <th scope="col" className="action-column">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, index) => (
                  <tr key={book.id}>
                    <td className="row-number">{String(index + 1).padStart(2, "0")}</td>
                    <td>
                      <Link className="table-book-title" href={`/buku/${book.id}`}>
                        {book.title}
                      </Link>
                      <span className="table-book-year">{book.year}</span>
                    </td>
                    <td className="muted-cell">{book.author}</td>
                    <td>
                      <span className="category-chip">{book.category}</span>
                    </td>
                    <td><StockBadge stock={book.stock} /></td>
                    <td>
                      <Link className="detail-button" href={`/buku/${book.id}`}>
                        Detail
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {ready && books.length > 0 && (
          <div className="catalog-footnote">
            <span className="demo-dot" />
            Koleksi contoh dapat kamu ubah dengan menambahkan buku baru.
          </div>
        )}
      </section>
    </div>
  );
}
