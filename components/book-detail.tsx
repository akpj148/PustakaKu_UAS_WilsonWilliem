"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isBook, type Book } from "./book-store";
import BookCover from "./book-cover";
import StockBadge from "./stock-badge";

type DetailResult = {
  id: string;
  book: Book | null;
  error: string | null;
};

export default function BookDetail({ id }: { id: string }) {
  const [result, setResult] = useState<DetailResult | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBook() {
      try {
        const response = await fetch(`/api/buku/${encodeURIComponent(id)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (response.status === 404) {
          setResult({ id, book: null, error: null });
          return;
        }

        const payload: unknown = await response.json();
        if (!response.ok) {
          throw new Error(
            typeof payload === "object" &&
              payload !== null &&
              "error" in payload &&
              typeof payload.error === "string"
              ? payload.error
              : "Detail buku gagal dimuat.",
          );
        }
        if (!isBook(payload)) {
          throw new Error("Format detail buku dari server tidak valid.");
        }

        setResult({ id, book: payload, error: null });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(`Detail buku ${id} gagal dimuat dari API.`, error);
        setResult({
          id,
          book: null,
          error:
            error instanceof Error
              ? error.message
              : "Detail buku gagal dimuat.",
        });
      }
    }

    void loadBook();
    return () => controller.abort();
  }, [id]);

  const currentResult = result?.id === id ? result : null;

  if (!currentResult) {
    return (
      <div className="detail-loading" role="status">
        <span className="loading-spinner" />
        Memuat detail buku…
      </div>
    );
  }

  if (currentResult.error) {
    return (
      <div className="not-found-card" role="alert">
        <span className="not-found-mark" aria-hidden="true">!</span>
        <div className="section-kicker"><span /> GAGAL MEMUAT BUKU</div>
        <h1>Detail buku belum dapat ditampilkan.</h1>
        <p>{currentResult.error}</p>
        <Link className="button button-primary" href="/buku">
          Kembali ke Daftar Buku
        </Link>
      </div>
    );
  }

  const book = currentResult.book;

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
